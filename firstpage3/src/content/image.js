/**
 * Created by 白 on 2014/12/2.
 * 图片相关的组件
 */

library( function () {
	var $ = imports( "element" ),
		css = imports( "css" ),
		px = css.px,

		layout = imports( "../layout" ),
		Img = imports( "../Img" ),
		imageViewer = imports( "image-viewer" ),

		z2d = imports( "2d" ),
		m2d = z2d.matrix;

	// 计算图片cover指定宽高的style
	function cover( el, sWidth, sHeight, dWidth, dHeight ) {
		var scale = dWidth / dHeight < sWidth / sHeight ? dHeight / sHeight : dWidth / sWidth,
			x = ( dWidth - sWidth * scale ) * 0.5,
			y = ( dHeight - sHeight * scale ) * 0.5;

		if ( ua.android ) {
			if ( dWidth / dHeight < sWidth / sHeight ) {
				css( el, {
					height : css.px( dHeight ),
					"margin-left" : x + "px"
				} );
			}
			else {
				css( el, {
					width : css.px( dWidth ),
					"margin-top" : y + "px"
				} );
			}
		}
		else {
			css( el, "transform-origin", "0 0" );
			css.transform( el, css.matrix( z2d.combine( m2d.translate( x, y ), m2d.scale( scale, scale ) ) ) );
		}

		return el;
	}

	// 图片
	Content.Image = Content( function ( img, arg1, arg2 ) {
		var width, height;

		if ( img.fail === "fatal" ) {
			throw new Error();
		}

		if ( arg2 === undefined ) {
			width = img.halfWidth;
			height = img.halfHeight;
		}
		else {
			width = arg1;
			height = arg2;
		}

		if ( arg1 !== undefined && arg2 === undefined ) {
			width = width * arg1 << 0;
			height = height * arg1 << 0;
		}

		if ( img.fail ) {
			css( img, "visibility", "hidden" );
		}

		return {
			width : width,
			height : height,
			element : function () {
				return img.cloneNode( true );
			},
			draw : function ( gc ) {
				!img.fail && gc.drawImage( img, 0, 0, width, height );
			}
		};
	} );

	Content.Canvas = function ( canvas ) {
		return {
			width : canvas.logicalWidth,
			height : canvas.logicalHeight,
			element : function () {
				return canvas;
			},
			draw : function ( gc ) {
				gc.drawImage( canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.logicalWidth, canvas.logicalHeight )
			}
		};
	};

	function ImageCoverFail( width, height ) {
		var imageNotFound = Img.imageNotFound,
			layout = imageViewer.layImageByFrame( imageNotFound, {
				width : width,
				height : height,
				size : function () {
					return Math.min( 0.5, width / imageNotFound.ps.width * 0.3, height / imageNotFound.ps.height * 0.3 );
				},
				align : [0.5, 0.5]
			} );

		return {
			width : width,
			height : height,
			draw : function ( gc ) {
				gc.fillStyle = "#EFEFEF";
				gc.fillRect( 0, 0, width, height );
				imageViewer.drawImageLayout( gc, layout );
			}
		};
	}

	// 图片覆盖
	Content.ImageCover = Content( function ( img, width, height ) {
		width = width || clientWidth;
		height = height || clientHeight;

		if ( img.fail ) {
			if ( img.fail === "fatal" ) {
				throw new Error();
			}

			return ImageCoverFail( width, height );
		}

		var layout = imageViewer.layImageByFrame( img, {
			width : width,
			height : height,
			size : imageViewer.Size.cover,
			align : [0.5, 0.5]
		} );

		return {
			width : width,
			height : height,
			element : function () {
				return $( "div", {
					css : {
						overflow : "hidden"
					},
					children : cover( img.cloneNode( false ), img.fullWidth, img.fullHeight, width, height )
				} );
			},
			draw : function ( gc ) {
				imageViewer.drawImageLayout( gc, layout );
			}
		};
	} );

	// 自定义
	Content.Custom = Content( function ( img, width, height ) {
		if ( !img || img.color ) {
			return Content.Rect( width, height, img ? img.color : null );
		}
		else {
			return Content.Image( img, width, height );
		}
	} );

	// 边框
	Content.Border = function ( content, borderStyle ) {
		var borderWidth = borderStyle.width || 0,
			borderColor = borderStyle.color || "transparent",
			borderRadius = borderStyle.radius || 0,
			width = content.width,
			height = content.height;

		return {
			dataSource : content.dataSource,
			width : width + borderWidth,
			height : height + borderWidth,
			element : function () {
				var inner = $( layout.contentToElement( content ), {
						css : {
							overflow : "hidden",
							"box-sizing" : "border-box",
							border : ["solid", px( borderWidth ), borderColor].join( " " ),
							"border-radius" : px( borderRadius )
						}
					} ),
					outer = inner;

				// 处理安卓的圆角bug
				if ( ua.android && inner.querySelector( "img" ) ) {
					outer = $( "div", [inner] );
					css.size( inner, width + borderWidth, height + borderWidth );
				}

				return outer;
			},
			draw : function ( gc ) {
				gc.save();
				if ( borderRadius ) {
					gc.beginPath();
					gc.moveTo( borderRadius, 0 );
					gc.lineTo( width - borderRadius, 0 );
					gc.arcTo( width, 0, width, borderRadius, borderRadius );
					gc.lineTo( width, height - borderRadius );
					gc.arcTo( width, height, width - borderRadius, height, borderRadius );
					gc.lineTo( borderRadius, height );
					gc.arcTo( 0, height, 0, height - borderRadius, borderRadius );
					gc.lineTo( 0, borderRadius );
					gc.arcTo( 0, 0, borderRadius, 0, borderRadius );
					gc.clip();
				}

				gc.save();
				gc.translate( borderWidth, borderWidth );
				content.draw( gc );
				gc.restore();

				if ( borderWidth ) {
					gc.fillStyle = borderColor;
					gc.fillRect( 0, 0, width, borderWidth );
					gc.fillRect( 0, 0, borderWidth, height );
					gc.fillRect( width, 0, borderWidth, height + borderWidth );
					gc.fillRect( 0, height, width + borderWidth, borderWidth );
				}
				gc.restore();
			}
		};
	};

	Content.Mask = function ( content, mask ) {
		var width = content.width,
			height = content.height;

		return {
			dataSource : content.dataSource,
			width : width,
			height : height,
			element : function () {
				var inner = $( layout.contentToElement( content ), {
						css : {
							overflow : "hidden",
							"box-sizing" : "border-box",
							"mask-image" : css.url( mask.src ),
							"mask-size" : "100% 100%"
						}
					} ),
					outer = inner;

				// 处理安卓的mask bug
				if ( ua.android ) {
					outer = $( "div.mask", [inner] );
					css.size( inner, width, height );
				}

				return outer;
			},
			draw : function ( gc ) {
				var maskCanvas = Img.Canvas( width, height ),
					maskGc = maskCanvas.context;
				maskGc.fillRect( 0, 0, width, height );
				maskGc.globalCompositeOperation = "destination-out";
				maskGc.drawImage( mask, 0, 0, width, height );

				var contentCanvas = Img.Canvas( width, height ),
					contentGc = contentCanvas.context;
				content.draw( contentGc );
				contentGc.globalCompositeOperation = "destination-out";
				contentGc.drawImage( maskCanvas, 0, 0, width, height );

				gc.save();
				gc.drawImage( contentCanvas, 0, 0, width, height );
				gc.restore();
			}
		};
	};
} );