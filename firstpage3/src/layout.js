/**
 * Created by 白 on 2015/3/3.
 */

var Component = function () {
	},
	Content = function () {
	},
	delay = function () {
	},
	durationDelay = function () {
	},
	sequence = function () {
	},
	applyEnter = function () {
	},

	layoutFormats = {},
	switchAnimations = {};

library( function () {
	var object = imports( "object" ),
		insert = object.insert,
		func = imports( "function" ),
		css = imports( "css" ),
		async = imports( "async" ),
		z2d = imports( "2d" ),
		m2d = z2d.matrix,
		z3d = imports( "3d-css" ),
		m3d = z3d.matrix,
		array = imports( "array" ),
		$ = imports( "element" ),
		imageUtil = imports( "image-util" ),
		pointer = imports( "pointer" ),
		LinkedList = imports( "linked-list" ),
		csa = imports( "css-animation" ),
		string = imports( "string" ),

		Img = imports( "./img" ),
		localResource = imports( "./local-resource" );

	css.insertRules( {
		".animation-prepare *" : {
			"animation-play-state" : "paused !important"
		}
	} );

	durationDelay = function ( animation, duration, delay ) {
		return object.extend( animation, {
			duration : duration,
			delay : delay
		} );
	};

	delay = function ( animation, s ) {
		return durationDelay( animation, undefined, s );
	};

	sequence = function ( enterList ) {
		var curDelay = 0;
		array.foreach( enterList, function ( pair ) {
			var enter = object.extend( pair[1] );
			enter.duration = pair[2] || enter.duration || 1;
			enter.delay = object.defaultValue( pair[3], ( curDelay + ( enter.delay || 0 ) ) );
			pair[0].enter = enter;
			curDelay = enter.delay + enter.duration;
		} );
	};

	applyEnter = function ( enterMap ) {
		object.foreach( enterMap, function ( type, list ) {
			array.foreach( list, function ( enter ) {
				enter.applyEnter = {
					type : type
				};
			} );
		} );
	};

	// 贝塞尔
	function bezier( timing ) {
		return timing ? css.bezier( timing.arg ) : "ease";
	}

	// 判断动画是否是强调动画
	function isEmphasize( enter ) {
		return !enter.progress["0"] || enter.emphasize;
	}

	// 获取一个组件的原点矩阵
	function getMatrix( wrapper ) {
		return z2d.origin( z2d.combine(
			m2d.translate( wrapper.x, wrapper.y ),
			m2d.scale( wrapper.scale, wrapper.scale ),
			m2d.rotate( wrapper.rotate / 180 * Math.PI )
		), wrapper.width / 2, wrapper.height / 2 );
	}

	// 获取一个组件相对于页面的矩阵
	function getPageMatrix( wrapper ) {
		var matrix = m2d.eye();
		while ( wrapper.parent ) {
			matrix = z2d.combine( getMatrix( wrapper ), matrix );
			wrapper = wrapper.parent;
		}
		return matrix;
	}

	// 设置一个组件的css样式
	function setStyle( wrapper ) {
		var matrix = z3d.combine( m3d.scale( wrapper.scale, wrapper.scale, 1 ), m3d.rotateZ( wrapper.rotate / 180 * Math.PI ) );
		wrapper.opacity = wrapper.opacity + 0;
		if ( wrapper.left === undefined ) {
			css( wrapper.element, {
				left : css.px( wrapper.x ),
				top : css.px( wrapper.y )
			} );
		}
		else {
			matrix = z3d.combine( m3d.translate( wrapper.x - wrapper.left, wrapper.y - wrapper.top, 0 ), matrix );
		}
		css.transform( wrapper.element, css.matrix3d( matrix ) );
		css.remove( wrapper.element, "transform-origin" );
	}

	// 将一个内容转化为元素
	function contentToElement( content ) {
		if ( content.element ) {
			return content.element();
		}
		else {
			var canvas = Img.Canvas( content.width, content.height );
			content.draw( canvas.context );
			return ua.android ? $( "div", [canvas] ) : canvas;
		}
	}

	// 内容
	Content = function ( func ) {
		return function ( ds ) {
			return object.insert( func.apply( null, arguments ), {
				dataSource : ds ? ds.dataSource : null
			} );
		};
	};

	// 组件
	Component = function ( content, parentWrapper ) {
		var el = contentToElement( content ),
			elWrapper = ua.ios && !ua.win32 ? $( "div", {
				css : {
					position : "absolute",
					left : 0,
					top : 0,
					transform : "translateZ(10000px)"
				},
				children : [el]
			} ) : el,
			wrapper = el.wrapper = {
				fixed : true // 是否取整
			},
			attr = {};

		css( el, {
			position : "absolute",
			display : "block",
			left : 0,
			top : 0,
			width : css.px( wrapper.width = content.width ),
			height : css.px( wrapper.height = content.height ),
			"z-index" : 0
		} );

		function defineAttr( name, defaultValue, setter, handler ) {
			attr[name] = defaultValue;
			Object.defineProperty( wrapper, name, {
				get : function () {
					return attr[name];
				},
				set : function ( val ) {
					attr[name] = handler ? handler( val ) : val;
					setter && setter( val );
				}
			} );
		}

		// 透明度
		defineAttr( "opacity", 1, function ( val ) {
			css( el, "opacity", val );
		} );

		// z-index
		defineAttr( "zi", 0, function ( val ) {
			css( elWrapper, "z-index", val );
		} );

		// visible
		defineAttr( "visible", true, function ( val ) {
			css( el, "visibility", val ? "visible" : "hidden" );
		} );

		object.defineAutoProperty( wrapper, "dataSource", {
			value : content.dataSource,
			set : function ( value ) {
				el.classList.add( "layout-component-from-data" );
				el.dataSource = value;
			}
		} );

		// transform属性
		// x和y要取整
		object.foreach( {
			x : 0,
			y : 0
		}, function ( name, defaultValue ) {
			defineAttr( name, defaultValue, function () {
				setStyle( wrapper );
			}, function ( val ) {
				return wrapper.fixed ? val << 0 : val;
			} );
		} );

		// 原点
		Object.defineProperty( wrapper, "origin", {
			get : function () {
				return [wrapper.x, wrapper.y];
			},
			set : function ( point ) {
				wrapper.x = point[0];
				wrapper.y = point[1];
			}
		} );

		// 不取整
		object.foreach( {
			rotate : 0,
			scale : 1
		}, function ( name, defaultValue ) {
			defineAttr( name, defaultValue, function () {
				setStyle( wrapper );
			} );
		} );

		object.insert( wrapper, {
			element : el,
			appendTo : function ( parentWrapper ) {
				if ( !parentWrapper.children ) {
					parentWrapper.children = [];
				}
				parentWrapper.children.push( wrapper );
				parentWrapper.element.appendChild( elWrapper );
				wrapper.parent = parentWrapper;
				return wrapper;
			},
			draw : function ( gc ) {
				// 绘制自己
				content.draw( gc );
			}
		} );

		if ( parentWrapper ) {
			wrapper.appendTo( parentWrapper );
		}

		return wrapper;
	};

	function drawComponent( component, gc, isShow ) {
		func.recursion( function draw( component ) {
			if ( component.visible && isShow ? isShow( component ) : true ) {
				component.draw && component.draw( gc );
				component.children && array.foreach( component.children.sort( function ( lhs, rhs ) {
					return lhs.zi - rhs.zi;
				} ), function ( component ) {
					gc.save();
					// 变换
					gc.transform.apply( gc, getMatrix( component ) );
					draw( component );
					gc.restore();
				} );
			}
		}, component );
	}

	function loopComponent( root, block ) {
		func.recursion( function loop( wrapper ) {
			wrapper.children && array.foreach( wrapper.children, loop );
			root !== wrapper && block( wrapper );
		}, root );
	}

	// 返回入场动画的keyframes
	function Keyframes( component, enter, isTransition ) {
		var cssProgress = {},
			width = component.width,
			height = component.height,
			progress = enter.progress;

		function percent( val, total ) {
			return object.is.String( val ) ? parseInt( val.replace( "%", "" ) ) / 100 * total : val;
		}

		function nu( v ) {
			return v !== undefined;
		}

		array.foreach( array.collect( function ( push ) {
			object.foreach( progress, function ( ratio, value ) {
				array.foreach( ratio.split( " " ), function ( ratio ) {
					push( {
						ratio : parseInt( ratio ) / 100,
						value : value
					} );
				} );
			} );
		} ).sort( function ( a, b ) {
			return a.ratio - b.ratio;
		} ), function ( frame ) {
			var style = frame.value,
				transform = [],
				rotate = style.rotate || 0,
				scale = object.defaultValue( style.scale, 1 ),
				origin = enter.origin ? [enter.origin[0] * width - 0.5 * width, enter.origin[1] * height - 0.5 * height] : null,
				computedStyle = object.extend( {
					opacity : 1,
					x : 0,
					y : 0,
					z : 0,
					rotateX : 0,
					rotateY : 0,
					rotateZ : rotate,
					scaleX : scale,
					scaleY : scale,
					skewX : 0,
					skewY : 0,
					perspective : 0
				}, style ),
				matrix = z2d.combine(
					m2d.scale( component.scale, component.scale ),
					m2d.rotate( component.rotate / 180 * Math.PI )
				);

			function pushTransform( transformName, value, unit ) {
				transform.push( string.tuple( transformName, [unit( value )] ) );
			}

			delete computedStyle.rotate;
			delete computedStyle.scale;

			computedStyle = object.extend( computedStyle, {
				x : percent( computedStyle.x, width ),
				y : percent( computedStyle.y, height )
			} );

			origin && transform.push( css.translate( origin[0], origin[1], 0 ) );
			nu( style.perspective ) && pushTransform( "perspective", computedStyle.perspective, css.px );
			( nu( style.x ) || nu( style.y ) || nu( style.z ) ) && transform.push( css.translate( computedStyle.x, computedStyle.y, computedStyle.z ) );
			isTransition !== true && transform.push( css.matrix( origin ? z2d.origin( matrix, width / 2 - enter.origin[0] * width, height / 2 - enter.origin[1] * height ) : matrix ) );
			( nu( style.scaleX ) || nu( style.scaleY ) || nu( style.scale ) ) && transform.push( css.scale( computedStyle.scaleX, computedStyle.scaleY ) );
			nu( style.rotateX ) && pushTransform( "rotateX", computedStyle.rotateX, css.deg );
			nu( style.rotateY ) && pushTransform( "rotateY", computedStyle.rotateY, css.deg );
			( nu( style.rotateZ ) || nu( style.rotate ) ) && pushTransform( "rotateZ", computedStyle.rotateZ, css.deg );
			( nu( style.skewX ) ) && pushTransform( "skewX", computedStyle.skewX, css.deg );
			nu( style.skewY ) && pushTransform( "skewY", computedStyle.skewY, css.deg );
			origin && transform.push( css.translate( -origin[0], -origin[1], 0 ) );

			cssProgress[frame.ratio * 100] = object.extend( {
				opacity : computedStyle.opacity * component.opacity,
				transform : transform.join( " " )
			}, {
				"animation-timing" : computedStyle.timing ? css.bezier( computedStyle.timing.arg ) : undefined
			} );
		} );

		return csa.Keyframes( cssProgress ).id;
	}

	function EnterAnimation( component, enter, duration, delay ) {
		return [Keyframes( component, enter ), css.s( duration ), css.s( delay ), bezier( enter.timing ), "both"].join( " " );
	}

	function transition( component, info ) {
		var element = component.element;
		css( element, "transition", [css.s( info.duration ), css.s( info.delay || 0 ), bezier( info.timing )].join( " " ) );

		object.foreach( info.end, function ( k, v ) {
			component[k] = v;
		} );

		function end() {
			info.onEnd && info.onEnd();
			css.remove( element, "transition" );
			endHandle.remove();
		}

		var endHandle = $.bind( element, "webkitTransitionEnd", end );

		return {
			fastForward : end
		};
	}

	function LayoutPage( workBody ) {
		var page = $( "div.layout", {
				css : css.full( {
					"z-index" : 0,
					"backface-visibility" : "hidden",
					overflow : "hidden"
				} )
			} ),
			wrapper = {
				body : workBody
			},
			showEvent = async.Event(),
			enterEndEvent = async.Event(),
			removeEvent = async.Event();

		object.defineAutoProperty( wrapper, "background", {
			value : "black",
			set : function ( value ) {
				css( page, "background", value );
			}
		} );

		return insert( page, {
			draw : function ( gc ) {
				gc.fillStyle = wrapper.background;
				gc.fillRect( 0, 0, clientWidth, clientHeight );
				drawComponent( wrapper, gc, function ( wrapper ) {
					return page.contains( wrapper.element ) &&
						( !page.classList.contains( "animation-prepare" ) || wrapper.enter == null || isEmphasize( wrapper.enter ) );
				} );
			},
			recycle : function () {
				removeEvent.trig();
				page.prepare = function () {
					return page;
				}
			},
			prepare : function () {
				var last = null, enterComponents = LinkedList(), start;

				page.classList.add( "animation-prepare" );

				loopComponent( wrapper, function ( component ) {
					var enter = component.enter; // 入场动画
					if ( enter ) {
						var delay = enter.delay || ( enter.delay = 0 ), // 延迟
							duration = enter.duration || ( enter.duration = 1 ), // 持续时间
							end = delay + duration,
							node = LinkedList.push( enterComponents, component );

						// 加动画
						css( component.element, "animation", EnterAnimation( component, enter, duration, delay ) );

						// 更新进入
						if ( !last || last.end < end ) {
							last = component;
							last.end = end;
						}

						// 动画结束后移除动画属性,总可见,触发enter的onEnd回调
						csa.onAnimationEndAdvanced( component.element, function () {
							enterComponents.remove( node );
							css.remove( component.element, "animation" );
							enter.onEnd && enter.onEnd();
						}, end, function () {
							return start;
						} );
					}
				} );

				return insert( page, {
					recycle : function () {
						removeEvent.trig();
						page.play = function () {
							return page;
						};
					},
					fastForward : function () {
					},
					play : function () {
						page.classList.remove( "animation-prepare" );

						loopComponent( wrapper, function ( wrapper ) {
							wrapper.left = wrapper.x;
							wrapper.top = wrapper.y;
						} );

						start = new Date();
						if ( last ) {
							csa.onAnimationEndAdvanced( last.element, function () {
								enterEndEvent.trig();
							}, last.end, function () {
								return start;
							} );
						}
						else {
							enterEndEvent.trig();
						}

						showEvent.trig();

						return insert( page, {
							recycle : removeEvent.trig,
							fastForward : function () {
								LinkedList.foreach( enterComponents, function ( component ) {
									var enter = component.enter;
									css.remove( component.element, "animation" );
									enter.onEnd && enter.onEnd();
								} );

								enterEndEvent.trig();
							}
						} );
					}
				} );
			},
			wrapper : insert( wrapper, {
				visible : true,
				element : page,
				onShow : showEvent.regist,
				onEnterEnd : enterEndEvent.regist,
				onRemove : removeEvent.regist
			} ),
			toCanvas : function () {
				var canvas = Img.Canvas( clientWidth, clientHeight );
				page.draw( canvas.context );
				return canvas;
			}
		} );
	}

	function loadPage( pageData, onLoad, pageError ) {
		pageData = pageData || {};

		function getFormat( pageData ) {
			var label = pageData.name in {qrcode : true, screen : true} ? pageData.name : pageData.label;
			return pageData.format || layoutFormats[label] || layoutFormats.SingleImage;
		}

		var format = getFormat( pageData ),
			images = [],
			resource = {};

		func.callWith( function ( parse ) {
			format.load ? format.load( pageData, parse ) : parse( pageData );
		}, function ( pageData ) {
			var loadTask = [];
			format = getFormat( pageData ); // 更新format

			// 加载图片
			array.foreach( pageData.image || [], function ( src, i ) {
				loadTask.push( function ( done ) {
					src = object.is.String( src ) ? src : src.url;
					var img = Img( src, {
						crossOrigin : format.crossOrigin,
						onError : function () {
							images[i] = img;
							done();
						},
						onLoad : function () {
							images[i] = img;
							done();
						}
					} );
				} );
			} );

			// 加载资源
			object.foreach( format.resource, function ( name, src ) {
				loadTask.push( function ( done ) {
					var dataUrl, img, loadHandle;

					function loadDone() {
						resource[name] = img;
						done();
					}

					// 如果有点,视为图片
					if ( /\./.test( src ) ) {
						src = Img.staticSrc( src );
						dataUrl = localResource( src );
						img = Img( dataUrl || src, {
							crossOrigin : dataUrl == null,
							onError : loadDone,
							onLoad : function () {
								loadDone();
								localResource( src, function () {
									return imageUtil.toDataURL( img );
								} );
							}
						} );
					}
					// 否则视为图标
					else {
						img = Img.Icon( src );
						loadHandle = $.bind( img, "load", function () {
							setTimeout( loadDone, 0 );
							loadHandle.remove();
						} );
					}
				} );
			} );

			// 加载自定义图片
			array.foreach( pageData.componentImages || [], function ( img ) {
				loadTask.push( function ( done ) {
					Img.load( img, img.targetSrc, {
						crossOrigin : format.crossOrigin,
						onError : done,
						onLoad : done
					} );
				} );
			} );

			// 完成后启动
			async.concurrency( loadTask, function () {
				onLoad && onLoad( function ( context, workBody ) {
					var page = LayoutPage( workBody );

					if ( format.ignorePureColor ) {
						images = array.remove( images, function ( img ) {
							return !!img.color;
						} );
					}

					function Field( array, defaultValue ) {
						return function ( i ) {
							return i === undefined ? array : array ? array[i] : defaultValue;
						};
					}

					try {
						if ( pageData.fail ) {
							throw new Error();
						}

						format.create( page.wrapper, object.extend( pageData, {
							data : function () {
								return pageData.data;
							},
							image : function image( i ) {
								if ( i === undefined ) {
									return array.map( images, function ( img, i ) {
										return image( i );
									} );
								}

								var img = images[i] || $( "img", {
										fail : true
									} );
								img.dataSource = {
									from : "image",
									index : i
								};
								return img;
							},
							text : function ( i ) {
								var text = pageData.text[i] || "";
								return {
									dataSource : {
										from : "text",
										index : i
									},
									toString : function () {
										return text;
									}
								};
							},
							component : Field( pageData.components, {} ),
							imageinfo : Field( pageData.imageinfo, {} ),
							location : Field( pageData.location, {} ),
							video : Field( pageData.video, "" ),
							actionlinks : Field( pageData.actionlinks, "" ),
							position : Field( pageData.position, "" )
						} ), resource, context );
					}
					catch ( e ) {
						page = LayoutPage();
						var layout = page.wrapper,
							ps = pageError.ps,
							errorImage = Component( Content.Image( pageError, ps.width, ps.height ), layout );

						layout.background = "white";
						errorImage.x = p.center( errorImage );
						errorImage.y = p.middle( errorImage );
					}

					return page;
				} );
			} );
		} );
	}

	exports.EnterAnimation = EnterAnimation;
	exports.drawComponent = drawComponent;
	exports.loopComponent = loopComponent;
	exports.contentToElement = contentToElement;
	exports.getPageMatrix = getPageMatrix;
	exports.loadPage = loadPage;
	exports.isEmphasize = isEmphasize;
	exports.transition = transition;
} );