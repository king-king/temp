/**
 * Created by 白 on 2014/10/17.
 * 联系我们板式
 */

plugin( function () {
	var array = imports( "array" ),
		history = imports( "../history" );

	layoutFormats.contact = {
		resource : {
			title : "contact/title",
			frame : "contact/frame"
		},
		create : function ( layout, ds, resource ) {
			var yR = yRatio / 1008 * 1136;

			// 底
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			// 遮罩
			Component( Content.Rect( clientWidth, clientHeight, "rgba(255,255,255,0.5)" ), layout );

			// 联系我们+线
			var title = Component( Content.Image( resource.title, yR ), layout );
			title.x = p.center( title );
			title.y = 166 * yR / 2;

			// 制作item
			var frameImg = resource.frame,
				frameWidth = frameImg.halfWidth * yR << 0,
				frameHeight = frameImg.halfHeight * yR << 0,
				items = [];

			array.foreach( [
				{
					caption : "联系电话",
					click : function ( text ) {
						location.href = "tel:" + text;
					}
				},
				{
					caption : "联系邮箱",
					click : function ( text ) {
						location.href = "mailto:" + text;
					}
				},
				{
					caption : "官方网站",
					click : function ( text ) {
						history.jump( text );
					}
				},
				{
					caption : "微信号"
				},
				{
					caption : "微博",
					click : function ( text ) {
						history.jump( "http://weibo.com/n/" + text );
					}
				}
			], function ( info, i ) {
				var paddingX = 14 * yR,
					marginX = 8 * yR,
					text = ds.text( i ),
					fontRatio = Math.max( yR, 1 );

				if ( text.toString() === "" ) {
					return;
				}

				// 框
				var frame = Component( Content.Rect( frameWidth, frameHeight ), layout );
				frame.x = p.center( frame );

				// 框背景
				Component( Content.Image( frameImg, yR ), frame );

				// caption
				var caption = Component( Content.Label( info.caption + "：", {
					fontSize : 14 * fontRatio << 0,
					color : "#FFFFFF"
				} ), frame );
				caption.x = paddingX;
				caption.y = p.middle( caption, frame, true );

				// 内容
				var content = Component( Content.BlockText( text, {
					lineHeight : 16 * fontRatio << 0,
					fontSize : 12 * fontRatio << 0,
					color : "#FFFFFF",
					margin : 0,
					width : frameWidth - 2 * paddingX - marginX - caption.width,
					breakWord : true
				} ), frame );
				content.x = p.rightTo( content, caption ) + marginX;
				content.y = p.middle( content, frame, true );

				// 点击
				onTap( frame.element, function () {
					info.click && info.click( text.toString() );
				} );

				items.push( frame );
			} );

			// 摆放frame
			var startY = 143 * yR,
				totalHeight = 315 * yR,
				frameNumber = items.length,
				margin = ( totalHeight - frameHeight * frameNumber ) / ( frameNumber + 1 ) << 0;

			array.foreach( items, function ( frame, i ) {
				frame.y = startY + margin * ( i + 1 ) + frameHeight * i;
			} );
		}
	};
} );