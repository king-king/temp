/**
 * Created by 白 on 2015/5/11.
 */

plugin( function () {
	var func = imports( "function" ),
		css = imports( "css" ),
		$ = imports( "element" ),
		Img = imports( "../img" );

	function Y( designY, designHeight, designParentHeight, parentHeight, currentHeight ) {
		return parentHeight * ( designY + designHeight / 2 ) / designParentHeight - currentHeight / 2;
	}

	layoutFormats.qrcode = {
		crossOrigin : true,
		resource : {
			fingerprint : "qrcode-fingerprint.png",
			frame : "qrcode-frame.png"
		},
		create : function ( layout, ds, resource, context ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			// 框
			var frame = Component( Content.Rect( 554 / 2, 606 / 2 ), layout );
			frame.x = p.center( frame );
			frame.y = Y( 192 / 2, frame.height, 568, clientHeight, frame.height );

			Component( Content.Image( resource.frame, frame.width, frame.height ), frame );
			var title = Component( Content.Image( ds.image( 1 ) ), frame );
			title.x = p.center( title, frame, true );
			title.y = Y( 32.5, 104 / 2, frame.height, frame.height, title.height );

			var canvas = Img.Canvas( 486 / 2, 277 / 2 ),
				gc = canvas.context;

			gc.drawImage( ds.image( 2 ), 0, 0, 275 / 2, 275 / 2 );
			gc.drawImage( resource.fingerprint, 166, 1, 155 / 2, 275 / 2 );

			var qrContent = Component( Content.Canvas( canvas ), frame );
			qrContent.x = 19;
			qrContent.y = 127;

			layout.onShow( function () {
				var img = context.img;
				func.callWith( function ( append ) {
					if ( img ) {
						append();
					}
					else {
						img = $( "img", {
							classList : ua.android ? "need-default" : [],
							css : {
								position : "absolute",
								"z-index" : 1000,
								left : css.px( qrContent.x ),
								top : css.px( qrContent.y ),
								width : css.px( qrContent.width ),
								"padding-bottom" : ua.android ? "0" : "64px"
							}
						} );
						img.onload = function () {
							context.img = img;
							img.onload = null;
							append();
						};
						img.src = canvas.toDataURL();
						css.transform( img, "translateZ(100000px)" );
						css( img, "pointer-events", "auto" )
					}
				}, function () {
					css( qrContent.element, "visibility", "hidden" );
					frame.element.appendChild( img );
				} );
			} );
		}
	};
} );