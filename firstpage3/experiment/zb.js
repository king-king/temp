/**
 * Created by 白 on 2015/6/10.
 */

plugin( function () {
	var func = imports( "function" ),
		$ = imports( "element" ),
		csa = imports( "css-animation" ),
		css = imports( "css" ),
		array = imports( "array" ),
		Img = imports( "../Img" ),
		px = css.px;

	function Fragment( targetCanvas, x, y, width, height, zi, parent ) {
		parent = parent || body;
		var canvas = Img.Canvas( width, height ),
			gc = canvas.context,
			dpr = canvas.dpr;

		gc.drawImage( targetCanvas, x * dpr, y * dpr, width * dpr, height * dpr, 0, 0, width, height );
		css( canvas, {
			"backface-visibility" : "hidden",
			position : "absolute",
			left : parent === body ? px( x ) : 0,
			top : parent === body ? px( y ) : 0,
			"z-index" : zi || 0
		} );
		parent.appendChild( canvas );
		return canvas;
	}

	// 百叶窗
	switchAnimations.louvre = function ( curPage, newPage, callback ) {
		var curCanvas = curPage.toCanvas(),
			newCanvas = newPage.toCanvas(),
			cssHandle = css( body, {
				background : "#FFFFFF"
			} ),
			fragmentHeight = clientHeight / 7 << 0,
			animationList = [];

		func.loop( 7, function ( i ) {
			var top = fragmentHeight * i,
				height = i === 6 ? clientHeight - top : fragmentHeight,
				origin = ["50%", "50%", -height * Math.sqrt( 3 ) / 6 + "px"].join( " " ),
				delay = Math.max( Math.abs( i - 3 ) * 0.15 + Math.random() * 0.1 - 0.1, 0 ),
				line = $( "div", {
					css : {
						position : "absolute",
						left : 0,
						top : css.px( top ),
						width : css.px( clientWidth ),
						height : css.px( height ),
						perspective : 3000
					}
				}, body );

			function Line( target, zi, progress ) {
				animationList.push( [
					css( Fragment( target, 0, top, clientWidth, height, zi, line ), "transform-origin", origin ).element,
					progress, 0.4, delay, "linear"
				] );
			}

			Line( curCanvas, 1, {
				0 : {
					"z-index" : "2"
				},
				100 : {
					transform : css.rotateX( 120 ),
					"z-index" : "0"
				}
			} );

			Line( newCanvas, 1, {
				0 : {
					transform : css.rotateX( -120 ),
					"z-index" : "0"
				},
				100 : {
					transform : css.rotateX( 0 ),
					"z-index" : "1"
				}
			} );
		} );

		$.remove( curPage );

		return csa.runAnimation( animationList, function () {
			cssHandle.remove();
			array.foreach( animationList, function ( frame ) {
				$.remove( frame[0] );
			} );
			callback && callback();
		} );
	};
} );