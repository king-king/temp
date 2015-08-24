/**
 * Created by 白 on 2014/12/26.
 */

library( function () {
	var object = imports( "object" ),
		defaultValue = object.defaultValue,

		css = imports( "css" ),

		z2d = imports( "2d" ),
		m2d = z2d.matrix;

	// 尺寸相关
	function cover( sWidth, sHeight, dWidth, dHeight ) {
		return dWidth / dHeight < sWidth / sHeight ? dHeight / sHeight : dWidth / sWidth;
	}

	function contain( sWidth, sHeight, dWidth, dHeight ) {
		return dWidth / dHeight < sWidth / sHeight ? dWidth / sWidth : dHeight / sHeight;
	}

	// 转换
	function LayoutTransform( arg ) {
		var s = arg.s, d = arg.d,
			sWidth = s.width, sHeight = s.height,
			dWidth = d.width, dHeight = d.height,
			scale = arg.scale( sWidth, sHeight, dWidth, dHeight ),
			x = ( dWidth - sWidth * scale ) * ( arg.x || 0.5 ),
			y = ( dHeight - sHeight * scale ) * ( arg.y || 0.5 ),
			matrix = z2d.combine( m2d.translate( x, y ), m2d.scale( scale, scale ) );

		return object.insert( function ( x, y ) {
			return z2d.transform( matrix, [x, y, 1] );
		}, {
			scale : scale
		} );
	}

	function Relative( sizeName, posName ) {
		return function ( d, dAlign, s, sAlign, isIn ) {
			s = s || {};
			return defaultValue( s[sizeName], ( sizeName === "width" ? clientWidth : clientHeight ) ) * defaultValue( sAlign, dAlign ) - d[sizeName] * dAlign +
				( isIn ? 0 : ( s[posName] || 0 ) );
		};
	}

	var relativeX = Relative( "width", "x" ), relativeY = Relative( "height", "y" );

	function RelativeX( dAlign, sAlign ) {
		return function ( d, s, isIn ) {
			return relativeX( d, dAlign, s, sAlign, isIn );
		}
	}

	function RelativeY( dAlign, sAlign ) {
		return function ( d, s, isIn ) {
			return relativeY( d, dAlign, s, sAlign, isIn );
		}
	}

	function setPosition( transform, comp, info ) {
		var point = transform( info.x || 0, info.y || 0 );
		comp.x = info.alignX == null ? point[0] : p.relativeX( comp, info.alignX ) + ( info.x || 0 );
		comp.y = info.alignY == null ? point[1] : p.relativeY( comp, info.alignY ) + ( info.y || 0 );
		return comp;
	}

	function layImage( transform, img, info, parent ) {
		var scale = transform.scale,
			width = ( info.width || img.halfWidth ) * scale,
			height = img.halfHeight == null ? info.height : width / img.halfWidth * img.halfHeight << 0;

		return setPosition( transform, Component( Content.Custom( img, width, height ), parent ), info );
	}

	module.exports = {
		relativeX : relativeX,
		relativeY : relativeY,
		LayoutTransform : LayoutTransform,
		cover : cover,
		contain : contain,
		leftIn : RelativeX( 0, 0 ),
		leftTo : RelativeX( 1, 0 ),
		rightIn : RelativeX( 1, 1 ),
		rightTo : RelativeX( 0, 1 ),
		center : RelativeX( 0.5, 0.5 ),
		topIn : RelativeY( 0, 0 ),
		topTo : RelativeY( 1, 0 ),
		bottomIn : RelativeY( 1, 1 ),
		bottomTo : RelativeY( 0, 1 ),
		middle : RelativeY( 0.5, 0.5 ),
		right : function ( ps ) {
			return ps.x + ps.width;
		},
		bottom : function ( ps ) {
			return ps.y + ps.height;
		},

		cssCenter : function ( width, height ) {
			return {
				position : "absolute",
				left : "50%",
				top : "50%",
				width : css.px( width ),
				height : css.px( height ),
				"margin-left" : css.px( -width / 2 ),
				"margin-top" : css.px( -height / 2 )
			};
		},

		setPosition : setPosition,
		layImage : layImage
	};
} );