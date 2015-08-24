/**
 * Created by 白 on 2015/3/13.
 */

library( function () {
	var array = imports( "array" ),
		object = imports( "object" ),
		scaleComponent = imports( "./component-scale" ),
		Img = imports( "./img" ),
		enterAnimation = imports( "./enter-animation" ),
		animationTable = enterAnimation.table; // 动画表

	function dealWidth( value, func ) {
		if ( value != null ) {
			return func( value );
		}
	}

	function defaultValue( val, defaultValue ) {
		return val == null ? defaultValue : val;
	}

	function layCustom( layout, ds, type ) {
		var components = ds.component(),
			custom = ds.custom,
			isScreen = type === "screen" || custom.layoutType === "screen",
			isOld = !isScreen && custom.label === "custom",
			transform = isOld ? p.transform504 : custom.type === "cover" ? p.transformCover : p.transformY,
			scale = transform.scale,
			curDelay = 0;

		function Custom( img, info, componentInfo ) {
			var width = ( ( info.width || img.halfWidth ) - ( info.borderWidth || 0 ) ) * scale << 0,
				height = img.halfHeight == null ? info.height * scale : width / img.halfWidth * img.halfHeight << 0,
				content = Content.Custom( img, width, height );

			return componentInfo && componentInfo.mask ? Content.Mask( content, componentInfo.mask ) : content;
		}

		layout.applyEnter = {
			first : custom.animationFirst,
			custom : custom.customAnimation
		};

		array.foreach( components, function ( img, index ) {
			var info = img.info,
				component = null;

			// 处理图片
			function dealImage( img, componentInfo, parent ) {
				var imageInfo = componentInfo.info;

				// 边框图
				if ( componentInfo.frame != null ) {
					return dealWidth( componentInfo.frame, function ( frameImg ) {
						var frameInfo = frameImg.info,
							frame = Component( Custom( frameImg, frameInfo ) ),
							content = Component( Custom( img, imageInfo, info ) ),
							wrapper = Component( Content.Rect( frame.width, frame.height ), parent );

						wrapper.origin = transform( frameInfo.x, frameInfo.y );
						content.origin = [( imageInfo.x - frameInfo.x ) * scale, ( imageInfo.y - frameInfo.y ) * scale];
						frame.appendTo( wrapper );
						content.appendTo( wrapper );
						wrapper.info = frameInfo;

						return wrapper;
					} );
				}

				// 边框
				if ( imageInfo.maskRadius || imageInfo.borderWidth || imageInfo.borderColor ) {
					return Component( Content.Border( Custom( img, imageInfo ), {
						radius : imageInfo.maskRadius * scale << 0,
						width : imageInfo.borderWidth * scale << 0,
						color : imageInfo.borderColor
					} ), parent );
				}

				return Component( Custom( img, imageInfo, componentInfo ), parent );
			}

			// 背景图
			if ( info == null ) {
				if ( img.color ) {
					layout.background = img.color;
				}
				else {
					// 背景覆盖
					if ( isOld || custom.type === "cover" || isScreen ) {
						Component( Content.ImageCover( img, clientWidth, clientHeight ), layout );
					}
					// 背景撑满y
					else {
						component = Component( Content.Image( img, clientHeight / img.halfHeight ), layout );
						component.x = p.center( component );
					}
				}
			}
			// 屏幕图
			else if ( info.type === "screen" ) {
				Component( Content.Image( img, clientWidth, clientHeight ), layout );
			}
			// 一般组件
			else {
				if ( isScreen ) {
					!function () {
						var x = info.x * xRatio << 0, y = info.y * yRatio << 0,
							width = Math.round( info.width * xRatio ),
							height = Math.round( ( info.type === "text" ? info.width / img.halfWidth * img.halfHeight : info.height ) * yRatio );

						// 遮罩
						if ( img.mask != null ) {
							component = Component( Content.Mask( Content.ImageCover( img, width, height ), img.mask ), layout );
						}
						else if ( info.type === "text" ) {
							var scale = Math.min( width / img.halfWidth, height / img.halfHeight );
							x += width - img.halfWidth * scale;
							y += height - img.halfHeight * scale;
							component = Component( Content.Image( img, scale ), layout );
						}
						else {
							component = Component( Content.ImageCover( img, width, height ), layout );
						}

						component.origin = [x, y];
					}();
				}
				else {
					if ( img.multiImage ) {
						// 多图
						dealWidth( img.multiImage, function ( images ) {
							component = Component( Custom( {
								color : "transparent"
							}, info ), layout );

							Component.MultiImageArea( {
								layout : layout,
								parent : component,
								images : component.images = array.map( images, function ( contentImg ) {
									return dealImage( contentImg, img );
								} ),
								delay : 3,
								sign : -1,
								animation : false,
								arrow : img.arrow
							} );
						} );
					}
					else {
						component = dealImage( img, img, layout );
					}

					p.setPosition( transform, component, component.info || info );
					delete component.info;
				}

				component.rotate = ( info.rotate || 0 ) * 180 / Math.PI;
				component.opacity = defaultValue( info.opacity, 1 );
				component.zi = info && info.type === "text" ? 100 + index : index;

				// 缩放文字使全部显示
				if ( info.type === "text" ) {
					component.scale *= Math.max( scaleComponent( component ), 0.5 );
				}

				// 处理动画
				if ( isOld ) {
					var enter = object.extend( animationTable[info.animation] || enterAnimation.Emerge(), {
							duration : info["animation-duration"]
						} ),
						delay = info["animation-delay"];

					enter.delay = delay === undefined || delay === null ? curDelay : delay;
					curDelay = enter.delay + ( enter.duration || 1 );
					component.enter = enter;
				}
				else {
					component.applyEnter = info.type == null ? undefined : {
						type : info.type,
						enterTiming : info.enterTiming,
						animationIndex : info.animationIndex,
						animation : info.animation,
						index : index
					};
				}
			}
		} );
	}

	layoutFormats.components = {
		create : layCustom
	};

	layoutFormats.screen = {
		create : function ( layout, ds ) {
			layCustom( layout, ds, "screen" );
		}
	};

	layoutFormats.custom = {
		create : function ( layout, ds ) {
		}
	};

	layoutFormats["custom-2"] = {
		create : function ( layout, ds ) {
		}
	};

	// 多图
	layoutFormats.MutipleImage01 = {
		create : function ( layout, ds ) {
			var height = clientHeight * 0.82 << 0,
				frame = Component( Content.Rect( height / 410 * 244 << 0, height ), layout ); // 多图框

			frame.x = p.center( frame );
			frame.y = p.middle( frame );

			// 多图组件
			Component.MultiImageArea( {
				layout : layout,
				parent : frame,
				images : array.map( ds.component( 0 ).multiImage, function ( img ) {
					return Component( Content.Border( Content.ImageCover( img, frame.width, frame.height ), {
						width : 3,
						color : "#FFFFFF"
					} ) );
				} ),
				sign : -1,
				arrow : Img.Icon( "arrow/mi01" )
			} );
		}
	};

	// 三行字+多图
	layoutFormats.MutipleImage04 = {
		resource : {
			background : "mi04-background.jpg"
		},
		create : function ( layout, ds, resource ) {
			// 背景图
			Component( Content.Image( resource.background, clientWidth, clientHeight ), layout );

			// 元素
			var text1 = Component( Content.Image( ds.component( 0 ), yRatio ), layout ),
				text2 = Component( Content.Image( ds.component( 1 ), yRatio ), layout ),
				text3 = Component( Content.Image( ds.component( 2 ), yRatio ), layout ),
				frame = Component( Content.Rect( 356 / 2 * yRatio, 518 / 2 * yRatio ), layout );

			text2.y = p.bottomTo( text2, text1 ) + 11 * yRatio;
			text3.y = p.bottomTo( text3, text2 ) + 19 * yRatio;
			frame.y = p.bottomTo( frame, text3 ) + 39 * yRatio;

			// 垂直居中
			var padding = ( clientHeight - p.bottom( frame ) ) / 2 << 0;
			array.foreach( [text1, text2, text3, frame], function ( comp ) {
				comp.y += padding;
				comp.x = p.center( comp );
			} );

			// 入场动画
			text1.enter = enterAnimation.Emerge();
			text2.enter = delay( enterAnimation.Emerge(), 1 );
			text3.enter = delay( enterAnimation.Emerge(), 2 );

			// 多图组件
			Component.MultiImageArea( {
				layout : layout,
				parent : frame,
				images : array.map( ( ds.component( 3 ) ).multiImage, function ( img ) {
					return Component( Content.Border( Content.ImageCover( img, frame.width, frame.height ), {
						width : 1,
						color : "#FFFFFF"
					} ) );
				} ),
				delay : 3,
				sign : -1,
				arrow : Img.Icon( "arrow/mi04" )
			} );
		}
	};

	// 处理自定义板式的数据
	array.foreach( ["screen", "custom", "custom-2", "MutipleImage01", "MutipleImage04"], function ( label ) {
		layoutFormats[label].load = function ( pageData, callback ) {
			var newLabel = "components", components = [], componentImages = [], fail = false;

			// 计算新的label
			switch ( label ) {
				case "MutipleImage01":
				case "MutipleImage04":
				case "screen":
					newLabel = label;
					break;
			}

			function ComponentImage( data ) {
				var url = data.url, img;
				if ( url ) {
					img = new Image();
					img.targetSrc = url;
					componentImages.push( img );
				}
				else {
					img = {};
				}

				img.info = data.imageinfo;
				return img;
			}

			array.foreach( pageData.image, function ( data ) {
				if ( data.url == null && data.images == null ) {
					if ( data.imageinfo == null ) {
						fail = true;
					}
					return;
				}

				data = JSON.parse( JSON.stringify( data ) );
				var component = ComponentImage( data ),
					mask, frame, multiImage;

				components.push( component );

				if ( mask = data.mask ) {
					component.mask = ComponentImage( mask );
				}

				if ( frame = data.frame ) {
					component.frame = ComponentImage( frame )
				}

				if ( multiImage = data.images ) {
					component.multiImage = array.map( array.remove( multiImage, function ( src ) {
						return src == null;
					} ), function ( src ) {
						return ComponentImage( {
							url : src
						} );
					} );

					component.arrow = ComponentImage( {
						url : data.arrow || "http://cloud7dev.b0.upaiyun.com/a7802fd8f506dffd01df67d06308ecf9mi01-arrow.png"
					} );
				}
			} );

			callback( {
				label : newLabel,
				fail : fail,
				custom : object.extend( pageData.custom || {}, {
					label : pageData.label
				} ),
				componentImages : componentImages,
				components : components
			} );
		};
	} );

	exports.layCustom = layCustom;
} );