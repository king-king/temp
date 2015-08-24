/**
 * Created by Json on 2015/4/14.
 */

plugin( function () {
	var array = imports( "array" );
	var $ = imports( "element" );
	var random = imports( "random" );
	var func = imports( "function" );
	var animation = imports( "animation" );

	// 多图：气泡+碰撞
	layoutFormats.MutipleImage07 = {
		create : function ( layout, ds, resource, context ) {
			var bubbleShapes = {
				1 : [
					// 1个
					{
						x : 0.4,
						y : 0.4,
						r : 0.2
					}],
				2 : [
					// 2个
					{
						x : 0.1,
						y : 0.2,
						r : 0.2
					},
					{
						x : 0.6,
						y : 0.4,
						r : 0.2
					}],
				3 : [
					// 3个
					{
						x : 0.1,
						y : 0.1,
						r : 0.2
					},
					{
						x : 0.5,
						y : 0.3,
						r : 0.2
					},
					{
						x : 0.2,
						y : 0.6,
						r : 0.15
					}],
				4 : [
					// 4个
					{
						x : 0.1,
						y : 0.1,
						r : 0.15
					},
					{
						x : 0.6,
						y : 0.2,
						r : 0.2
					},
					{
						x : 0.5,
						y : 0.5,
						r : 0.2
					},
					{
						x : 0.2,
						y : 0.7,
						r : 0.2
					}
				],
				5 : [
					// 5个
					{
						x : 0.1,
						y : 0.1,
						r : 0.15
					},
					{
						x : 0.6,
						y : 0.2,
						r : 0.2
					},
					{
						x : 0.5,
						y : 0.5,
						r : 0.2
					},
					{
						x : 0.2,
						y : 0.7,
						r : 0.2
					},
					{
						x : 0.7,
						y : 0.4,
						r : 0.1
					}
				],
				6 : [
					// 6个
					{
						x : 0.1,
						y : 0.1,
						r : 0.15
					},
					{
						x : 0.6,
						y : 0.2,
						r : 0.2
					},
					{
						x : 0.5,
						y : 0.5,
						r : 0.2
					},
					{
						x : 0.2,
						y : 0.7,
						r : 0.2
					},
					{
						x : 0.7,
						y : 0.4,
						r : 0.1
					},
					{
						x : 0.7,
						y : 0.7,
						r : 0.1
					}
				],
				7 : [
					// 7个
					{
						x : 0.1,
						y : 0.1,
						r : 0.15
					},
					{
						x : 0.6,
						y : 0.2,
						r : 0.2
					},
					{
						x : 0.5,
						y : 0.5,
						r : 0.2
					},
					{
						x : 0.2,
						y : 0.7,
						r : 0.2
					},
					{
						x : 0.7,
						y : 0.4,
						r : 0.1
					},
					{
						x : 0.7,
						y : 0.7,
						r : 0.1
					},
					{
						x : 0.5,
						y : 0.8,
						r : 0.1
					}
				]
			};
			layout.background = "#e1dad4";
			var images = [];
			var w = clientWidth;
			var h = clientHeight;
			if ( ds.image().length == 0 ) {
				return;
			}
			var is07ok = false;
			var imgs = ds.image().slice( 0, 7 );
			if ( !context.shapes ) {
				context.shapes = bubbleShapes[imgs.length];
				while ( !is07ok ) {
					var count = 0;
					func.loop( context.shapes.length, function ( n ) {
						if ( context.shapes[n].x * w + 2 * context.shapes[n].r * w > w || context.shapes[n].y * h + 2 * context.shapes[n].r * w > h ) {
							context.shapes[n].r *= 0.9;
							count += 1;
						}
						else {
							func.loop( context.shapes.length, function ( m ) {
								if ( m != n ) {
									if ( Math.pow( context.shapes[m].x * w + context.shapes[m].r * w - context.shapes[n].x * w - context.shapes[n].r * w, 2 ) + Math.pow( context.shapes[m].y * h + context.shapes[m].r * w - context.shapes[n].y * h - context.shapes[n].r * w, 2 ) < Math.pow( context.shapes[n].r * w + context.shapes[m].r * w, 2 ) ) {
										context.shapes[n].r *= 0.9;
										count += 1;
									}
								}
							} );
						}
					} );
					is07ok = count == 0;
				}
			}

			var shapes = context.shapes;

			array.foreach( imgs, function ( img, i ) {
				var image = Component( Content.Border( Content.ImageCover( img, 2 * shapes[i].r * w, 2 * shapes[i].r * w ), {
					width : 2,
					color : "white",
					radius : shapes[i].r * w + 2
				} ), layout );
				image.fixed = false; // 不采用取整
				images.push( image );
				image.wr = shapes[i].r * w;
				image.wxv = (Math.random() - 0.5) * 0.2;
				image.wyv = (Math.random() - 0.5) * 0.002;
				image.x = shapes[i].x * w;
				image.y = shapes[i].y * h;
			} );

			var g = 0.0001;
			var gy = g;
			var gx = 0;
			var orientationHandle = $.bind( window, "deviceorientation", function ( e ) {
				if ( e.gamma < -45 || e.gamma > 45 ) {
					g = 0.002;
				}
				else {
					g = 0.0001;
				}
				gy = g * Math.cos( Math.PI / 180 * e.gamma );
				gx = g * Math.sin( Math.PI / 180 * e.gamma );
				if ( e.beta < 0 ) {
					g = 0.002;
					gy = -g * Math.cos( Math.PI / 180 * e.beta );
					gx = g * Math.sin( Math.PI / 180 * e.beta );
				}
			} );

			var animateFrame = function () {
				array.foreach( images, function ( circlen, n ) {
					// 检测第n个球和其他球之间是否碰撞
					array.foreach( images, function ( circlem, m ) {
						if ( m != n ) {
							// 圓心之間的距離
							var d2 = Math.pow( circlem.x + circlem.wr - circlen.x - circlen.wr, 2 ) + Math.pow( circlem.y + circlem.wr - circlen.y - circlen.wr, 2 );
							var d = Math.sqrt( d2 );
							if ( d <= circlem.wr + circlen.wr ) {
								// 如果碰撞上了，简单粗暴的直接改变速度方向并添加衰减
								circlen.wxv = -circlen.wxv * 0.8;
								circlen.wyv = -circlen.wyv * 0.8;
								// 复杂之处在于也许等到分辨出碰撞时候已经嵌进去了，所以要分开
								var s = circlem.wr + circlen.wr;
								circlen.x = s * (circlen.x - circlem.x) / d + circlem.x;
								circlen.y = s * (circlen.y - circlem.y) / d + circlem.y;
							}
							if ( circlen.x < 0 || circlen.x + 2 * circlen.wr > w ) {
								// 如果撞到左右边界
								circlen.x = circlen.x < 0 ? 0 : w - 2 * circlen.wr;
								circlen.wxv = -circlen.wxv * 0.8;
							}
							if ( circlen.y < 0 || circlen.y + 2 * circlen.wr > h ) {
								// 如果撞到上下边界
								circlen.y = circlen.y < 0 ? 0 : h - 2 * circlen.wr;
								circlen.wyv = -circlen.wyv * 0.8;
							}
							circlen.wyv += gy;
							circlen.wxv += gx;
							circlen.x += circlen.wxv;
							circlen.y += circlen.wyv;
						}
					} )
				} )
			};

			var animate;

			layout.onRemove( function () {
				animate && animate.remove();
				orientationHandle.remove();
			} );

			layout.onEnterEnd( function () {
				animate = animation.requestFrame( animateFrame );
			} );

			array.foreach( random.arrange( images ), function ( img, i ) {
				img.enter = {
					duration : 0.3,
					delay : i * 0.1,
					progress : {
						"0" : {
							scale : 0
						},
						"100" : {
							scale : 1
						}
					}
				}
			} );
		}
	};
} );