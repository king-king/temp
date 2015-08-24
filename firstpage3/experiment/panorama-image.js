/**
 * Created by WQ on 2015/5/13.
 * 全景图
 */

plugin( function () {
	var array = imports( "array" );
	var onDrag = imports( "pointer-drag" );
	var animation = imports( "animation" );
	var math = imports( "math" );
	var tips = imports( "../tips" );
	imports( "../platform.js" );

	// 全景图1
	layoutFormats.Panorama01 = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ), clientWidth, clientHeight ), layout );
			var imgHeight = clientHeight * 150 / 1136 << 0,
				imgWidth = clientHeight * 600 / 1136 << 0;
			var image = Component( Content.Border( Content.ImageCover( ds.image( 1 ), imgWidth - 4, imgHeight - 4 ), {
				width : 2,
				color : "white"
			} ), layout );
			image.x = (clientWidth - imgWidth) / 2 - 2;
			image.y = clientHeight * 454 / 1136 - 2;

			var textHeight = clientHeight * 76 / 1136 << 0,
				textWidth = textHeight / ds.image( 2 ).halfHeight * ds.image( 2 ).halfWidth << 0,
				left = (clientWidth - clientHeight * 320 / 1136) / 2 << 0;

			var text = Component( Content.Image( ds.image( 2 ), textWidth, textHeight ), layout );

			text.x = clientWidth - textWidth - left;
			text.rotate = 12;
			text.y = (clientHeight * 750 / 1136 - textHeight * 0.2079 / 2) << 0;

			var w = clientHeight * ds.image( 1 ).halfWidth / ds.image( 1 ).halfHeight << 0;
			var fullImage = Component( Content.Image( ds.image( 1 ), w, clientHeight ), layout );
			fullImage.visible = false;
			// 不管w是不是比clientWidth大，都可以用这个公式算出fullImage的x坐标
			fullImage.x = (clientWidth - w) / 2 << 0;

			var hideTips;
			onTap( image.element, function () {
				//　将全景图弹出来
				hideTips = tips.hide(); // 隐藏换页提示
				fullImage.x = (clientWidth - w) / 2 << 0;
				fullImage.visible = true;
			} );
			onTap( fullImage.element, function () {
				//　将全景图收起
				hideTips && hideTips.remove();
				fullImage.visible = false;
			} );
			fullImage.fixed = false; // 不采用取整
			var slideAnimate;

			w > clientWidth && onPointerDown( fullImage.element, function () {
				preventBodyEvent = true;
				slideAnimate && slideAnimate.remove();
				onDrag( {
					onMove : function ( event ) {
						fullImage.x = math.range( fullImage.x + event.dX, 0, clientWidth - w )
					},
					onUp : function ( event ) {
						if ( fullImage.visible == true ) {
							// 做滑动的动画
							var speed = event.speedX * 20;
							slideAnimate = animation.requestFrame( function () {
								speed *= 0.95;
								fullImage.x += speed;
								if ( Math.abs( speed ) < 0.3 || !math.inRange( fullImage.x, clientWidth - w, 0 ) ) {
									slideAnimate.remove();
								}
								fullImage.x = math.range( fullImage.x + speed, clientWidth - w, 0 );
							} );
						}
					}
				} )
			} );
		}
	}
} );