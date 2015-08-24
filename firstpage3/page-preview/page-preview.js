/**
 * Created by 白 on 2015/7/6.
 */

library( function () {
	var Layout = imports( "../src/layout" ),
		theme = imports( "../src/theme" ),
		main = imports( "../src/main" ),
		custom = imports( "../src/custom" ),
		Img = imports( "../src/Img" ),
		enterAnimation = imports( "../src/enter-animation" ),
		animationTable = enterAnimation.table,

		csa = imports( "css-animation" ),
		pointer = imports( "pointer" ),
		async = imports( "async" ),
		object = imports( "object" ),
		css = imports( "css" ),
		$ = imports( "element" ),
		ua = imports( "ua" ),
		func = imports( "function" ),
		math = imports( "math" ),

		onResize = main.resize(),

		curPageData = null,
		animationMap = {
			"飞入上" : "fly-into-top",
			"飞入右" : "fly-into-right",
			"飞入下" : "fly-into-bottom",
			"飞入左" : "fly-into-left",
			"果冻" : "rubber-band",
			"得瑟" : "tada",
			"钟摆" : "wobble",
			"抖动" : "shake",
			"落下抖动" : "fall-down-and-shake",
			"弹性" : "bounce-in",
			"弹入上" : "bounce-in-up",
			"弹入右" : "bounce-in-right",
			"弹入下" : "bounce-in-down",
			"弹入左" : "bounce-in-left",
			"挂摆" : "swing",
			"闪烁" : "flash",
			"回旋" : "circle-round",
			"远近翻转" : "round-from-far-and-near",
			"淡入" : "fade-in",
			"浮现上" : "emerge-top",
			"浮现右" : "emerge-right",
			"浮现下" : "emerge-bottom",
			"浮现左" : "emerge-left",
			"缩小" : "shrink",
			"从小到大" : "scale",
			"翻转" : "overturn",
			"硬币" : "coin",
			"空翻" : "flip",
			"缓冲横" : "flip-in-x",
			"缓冲竖" : "flip-in-y",
			"刹车上" : "light-speed-in-top",
			"刹车右" : "light-speed-in-right",
			"刹车下" : "light-speed-in-bottom",
			"刹车左" : "light-speed-in-left",
			"雨刷左上" : "rotate-in-left-top",
			"雨刷右上" : "rotate-in-right-top",
			"雨刷左下" : "rotate-in-left-bottom",
			"雨刷右下" : "rotate-in-right-bottom",
			"冲入上" : "zoom-in-top",
			"冲入左" : "zoom-in-left",
			"冲入右" : "zoom-in-right",
			"冲入下" : "zoom-in-bottom",
			"波浪左" : "wave-left",
			"波浪右" : "wave-right",
			"爬行上" : "creep-top",
			"爬行下" : "creep-bottom"
		};

	ua.win32 && css.insertRules( "::-webkit-scrollbar", {
		width : 0
	}, true );

	onResize( function () {
		previewPage( curPageData );
	} );

	function Select( arg ) {
		var curSelected = null;

		return {
			Option : function ( element ) {
				var selectEvent = async.Event();
				css( element, arg.unselected );

				return object.insert( element, {
					select : function () {
						if ( curSelected !== element ) {
							curSelected && css( curSelected, arg.unselected );
							css( curSelected = element, arg.selected );
							selectEvent.trig();
						}
					},
					onSelect : selectEvent.regist
				} );
			}
		};
	}

	function previewPage( pageData ) {
		var imagesData = pageData.image,
			speed = theme.getSpeed( pageData.theme );

		// 清屏
		document.body.innerHTML = "";

		// 记录当前数据
		curPageData = pageData;

		// 加载页面
		Layout.loadPage( pageData, function ( create ) {
			var curPage = document.body.appendChild( create( {}, document.body ) ), // 当前页
				layout = curPage.wrapper, // 板式
				elementSelect = Select( {
					selected : {
						"box-shadow" : "0 0 0 3px red"
					},
					unselected : {
						"box-shadow" : null
					}
				} ),
				componentSelect = Select( {
					selected : {
						background : "rgba(255,0,255,0.4)"
					},
					unselected : {
						background : "rgba(0,0,0,0.4)"
					}
				} ), // 组件选择器
				componentBar = document.body.appendChild( $( "div", {
					css : {
						position : "absolute",
						left : 0,
						bottom : 0,
						"z-index" : 10000
					}
				} ) ), // 组件栏
				animationBar = $( "div.need-default", {
					css : {
						position : "absolute",
						"max-height" : "100%",
						bottom : 0,
						right : 0,
						width : css.px( 80 ),
						"overflow-y" : ua.win32 ? "auto" : "scroll",
						"overflow-scrolling" : "touch",
						"z-index" : 10000
					}
				}, document.body ), // 动画栏
				componentOptions = [],
				componentHeight = 70;

			function setY( div, y ) {
				css.transform( div, css.translate( 0, div.zy = y, 0 ) );
			}

			Layout.loopComponent( layout, function ( component ) {
				var applyEnter = component.applyEnter;

				if ( applyEnter ) {
					var element = elementSelect.Option( component.element ),
						dataIndex = applyEnter.index,
						imageInfo = imagesData[dataIndex].imageinfo,
						componentOptionWrapper = $( "div", {
							css : {
								position : "absolute",
								left : 0,
								top : 0,
								transition : "0.2s"
							}
						} ),
						componentOption = componentSelect.Option( $( "div", {
							css : {
								position : "absolute",
								padding : "10px",
								cursor : "pointer",
								left : 0,
								top : 0
							}
						}, componentOptionWrapper ) ),
						dWidth = 50,
						dHeight = 50,
						canvas = componentOption.appendChild( Img.Canvas( dWidth, dHeight ) ),
						gc = canvas.getContext( "2d" ),
						nWidth = component.width,
						nHeight = component.height,
						scale = dWidth / dHeight < nWidth / nHeight ? dWidth / nWidth : dHeight / nHeight,
						x = ( dWidth - nWidth * scale ) * 0.5,
						y = ( dHeight - nHeight * scale ) * 0.5,

						listIndex = componentOptions.length; // 列表中的y

					componentOptionWrapper.dataIndex = dataIndex;

					gc.translate( x, y );
					gc.scale( scale, scale );
					Layout.drawComponent( component, gc );

					componentBar.appendChild( componentOptionWrapper );
					setY( componentOptionWrapper, listIndex * componentHeight );

					componentOption.onSelect( function () {
						var animationOptions = {},
							animationSelect = Select( {
								selected : {
									color : "red"
								},
								unselected : {
									color : "white"
								}
							} );

						function AnimationOption( key, innerHTML ) {
							return animationOptions[key] = animationSelect.Option( $( "div", {
								css : {
									padding : "10px",
									cursor : "pointer",
									"font-size" : css.px( 12 ),
									"line-height" : css.px( 14 ),
									overflow : "hidden",
									background : "rgba(0,0,0,0.4)"
								},
								innerHTML : innerHTML
							}, animationBar ) );
						}

						element.select();
						animationBar.innerHTML = "";

						var noAnimation = AnimationOption( "", "无动画" );
						noAnimation.onSelect( function () {
							imageInfo.animation = null;
						} );
						onTap( noAnimation, noAnimation.select );

						object.foreach( animationMap, function ( displayName ) {
							var animationName = animationMap[displayName],
								option = AnimationOption( animationName, displayName ),
								enter = animationTable[animationName];

							option.onSelect( function () {
								imageInfo.animation = animationName;
							} );

							onTap( option, function () {
								// 做动画
								css.remove( element, "animation" );
								setTimeout( function () {
									css( element, "animation", Layout.EnterAnimation( component, enter, speed[4], 0 ) );
								}, 0 );
								option.select();
							} );
						} );

						animationOptions[imageInfo.animation || ""].select();
					} );

					// 点击元素,组中对应的组件选项
					onTap( element, componentOption.select );

					// 组件选项的选中和拖动
					onPointerDown( componentOption, function ( event ) {
						event.preventDefault();
						componentOption.select();

						onSwipe( function ( event ) {
							if ( event.yOut ) {
								document.body.appendChild( componentOption );
								css( componentOption, "top", css.px( componentBar.offsetTop ) );
								setY( componentOption, componentOptionWrapper.zy );

								pointer.onMoveUp( {
									onMove : function ( event ) {
										setY( componentOption, math.range( componentOption.zy + event.dY, 0,
											( componentOptions.length - 1 ) * componentHeight ) );

										// 交换位置
										func.recursion( function switchPosition( curDiv ) {
											var middle = componentOption.zy + componentHeight / 2,
												previous = curDiv.previousElementSibling,
												next = curDiv.nextElementSibling;

											if ( middle > curDiv.zy + componentHeight ) {
												componentBar.insertBefore( next, componentOptionWrapper );
												switchPosition( next );
											}
											else if ( middle < curDiv.zy ) {
												componentBar.insertBefore( componentOptionWrapper, previous );
												switchPosition( previous );
											}
										}, componentOptionWrapper );

										// 重新设置y
										setTimeout( function () {
											var curElement = componentBar.firstElementChild, i = 0;
											while ( curElement !== null ) {
												setY( curElement, i++ * componentHeight );
												curElement = curElement.nextElementSibling;
											}
										}, 0 );
									},

									onUp : function () {
										var lock = Lock();
										csa.runAnimation( [componentOption, {
											100 : {
												transform : css.translate( 0, componentOptionWrapper.zy, 0 )
											}
										}, 0.2, "both"], function () {
											componentOptionWrapper.appendChild( componentOption );
											css( componentOption, "top", 0 );
											setY( componentOption, 0 );
											lock.remove();
										} );
									}
								} );
							}
						} );
					} );

					componentOptions.push( componentOption );
				}
			} );

			componentOptions[0] && componentOptions[0].select();
			css( componentBar, "height", css.px( componentOptions.length * componentHeight ) );

			var playButton = $( "div", {
				innerHTML : "播放",
				css : {
					position : "absolute",
					display : "inline-block",
					padding : "14px",
					"font-size" : "15px",
					left : "50%",
					color : "white",
					transform : "translate3d(-50%,0,0)",
					bottom : 0,
					"z-index" : 10000,
					background : "rgba(0,0,0,0.4)"
				}
			}, document.body );

			onTap( playButton, function () {
				var curNode = componentBar.firstElementChild, i = 0;
				while ( curNode ) {
					imagesData[curNode.dataIndex].imageinfo.animationIndex = i++;
					curNode = curNode.nextElementSibling;
				}

				pageData.custom.customAnimation = true;
				Layout.loadPage( pageData, function ( create ) {
					document.body.innerHTML = "";

					var pagePreview = document.body.appendChild( create( {}, document.body ) ),
						layout = pagePreview.wrapper;

					theme.setPageAnimate( pagePreview, {
						speed : speed
					} );

					layout.onEnterEnd( function () {
						setTimeout( function () {
							previewPage( pageData );
						}, 500 );
					} );

					pagePreview.prepare();
					pagePreview.play();
				} );
			} );
		} );
	}

	module.exports = previewPage;
} );