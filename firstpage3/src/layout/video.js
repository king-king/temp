/**
 * Created by 白 on 2014/10/17.
 * 视频板式
 */

plugin( function () {
	var $ = imports( "element" ),
		css = imports( "css" ),
		pointer = imports( "pointer" ),
		tips = imports( "../tips" ),
		csa = imports( "css-animation" ),
		Img = imports( "../img" ),
		history = imports( "../history" );

	layoutFormats.video = {
		resource : {
			play : "video/play"
		},
		create : function ( layout, ds, resource ) {
			var yR = yRatio / 1008 * 1136,
				src = ds.video( 0 );

			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var icon = Component( Content.Image( resource.play, gRatio ), layout );
			var circle = Component( Content.Circle( icon.width / 2, "#FFFFFF" ), layout );
			circle.x = icon.x = p.center( icon );
			circle.y = icon.y = icon.y = 436 / 2 * yR;
			circle.visible = false;
			icon.zi = 1;

			layout.onShow( function () {
				circle.visible = true;
				csa.runAnimation( [circle.element, {
					0 : {
						opacity : 0.8
					},
					100 : {
						transform : css.scale( 2 ),
						opacity : 0
					}
				}, 2.5, "infinite"] );
			} );

			layout.onRemove( function () {
				circle.visible = false;
			} );

			onTap( icon.element, function () {
				// 构建视频页,尝试识别iframe
				var slidePage, iframe;

				// 如果识别出了iframe,创建滑页
				if ( iframe = $( "div", src ).querySelector( "iframe" ) ) {
					slidePage = $( history.SlidePage(), {
						css : {
							background : "black"
						}
					} );

					// 滑入滑出时关闭音乐
					slidePage.onSlideIn( window.stopAudio );
					slidePage.onSlideOut( window.playAudio );

					iframe.width = clientWidth;
					iframe.height = clientWidth / 16 * 9 << 0;

					css( iframe, {
						position : "absolute",
						left : 0,
						top : css.px( ( clientHeight - iframe.height ) / 2 << 0 )
					} );

					var loading = tips.Loading( slidePage );
					iframe.onload = function () {
						$.remove( loading );
						iframe.onload = null;
					};
					slidePage.appendChild( iframe );
					onTap( $( "div", {
						css : {
							"position" : "absolute",
							"right" : "0",
							"top" : "0",
							"width" : "60px",
							"height" : "60px"
						},
						children : [Img.Icon.center( "video/close" )]
					}, slidePage ), history.back );
				}

				if ( slidePage ) {
					slidePage.slideIn();
				}
				else if ( /(^http:\/\/)|(^https:\/\/)/.test( src ) ) {
					history.jump( src );
				}
				else {
					alert( "未识别的视频地址" );
				}
			} );
		}
	};
} );