/**
 * Created by 白 on 2015/3/9.
 * 框+图的板式
 */

plugin( function () {
	var array = imports( "array" ),
		object = imports( "object" ),
		enterAnimation = imports( "../enter-animation" ),
		oldToNewRatio = 1136 / 1008;

	function layFrameImg( images, frameInfo, parent ) {
		var comps = [];

		// 遍历图片,分配区域,并计算入场动画
		array.foreach( images, function ( image, i ) {
			var info = frameInfo[i],
				content = Content.ImageCover( image, Math.ceil( info.width * xRatio ) + 1,
					Math.ceil( info.height * yRatio ) + 1 ),
				comp = Component( content );

			comp.appendTo( parent );
			comp.x = info.x * xRatio;
			comp.y = info.y * yRatio;
			comps.push( comp );
		} );

		sequence( array.map( comps, function ( comp, i ) {
			return [comp, frameInfo[i].enter];
		} ) );

		return comps;
	}

	layoutFormats.MutipleImage02 = {
		resource : {
			grad : "mi02-grad.svg",
			shadow : "mi02-shadow.png"
		},
		create : function ( layout, ds, resource ) {
			layFrameImg( ds.image(), [
				{
					x : 25,
					y : 16 * oldToNewRatio,
					width : 280,
					height : 157 * oldToNewRatio,
					enter : enterAnimation.FlyInto( 3 )
				},
				{
					x : 25,
					y : 173 * oldToNewRatio,
					width : 280,
					height : 157 * oldToNewRatio,
					enter : enterAnimation.FlyInto( 1 )
				},
				{
					x : 25,
					y : 330 * oldToNewRatio,
					width : 280,
					height : 157 * oldToNewRatio,
					enter : enterAnimation.FlyInto( 3 )
				}
			], layout );

			// 阴影图和渐变图
			Component( Content.Image( resource.shadow, clientWidth, clientHeight ), layout );
			Component( Content.Image( resource.grad, clientWidth, clientHeight ), layout );
		}
	};

	layoutFormats.MutipleImage03 = {
		resource : {
			frame : "mi03-frame.png"
		},
		create : function ( layout, ds, resource ) {
			layFrameImg( ds.image(), [
				{
					x : 15,
					y : 15 * oldToNewRatio,
					width : 290,
					height : 231 * oldToNewRatio,
					enter : enterAnimation.FlyInto( 0 )
				},
				{
					x : 15,
					y : 250 * oldToNewRatio,
					width : 143,
					height : 239 * oldToNewRatio,
					enter : enterAnimation.FlyInto( 3 )
				},
				{
					x : 162,
					y : 250 * oldToNewRatio,
					width : 143,
					height : 239 * oldToNewRatio,
					enter : enterAnimation.FlyInto( 1 )
				}
			], layout );

			// 相框图
			Component( Content.Image( resource.frame, clientWidth, clientHeight ), layout );
		}
	};
} );