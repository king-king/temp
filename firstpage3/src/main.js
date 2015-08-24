/**
 * Created by 白 on 2014/11/24.
 * 初页系统的启动
 */

var clientWidth, clientHeight,
	designWidth = 640, designHeight = 1136,
	idealWidth, idealHeight,
	xRatio, yRatio, gRatio,
	inClickMode = false,
	body;

library( function () {
	imports( "./platform" );

	var array = imports( "array" ),
		string = imports( "string" ),
		object = imports( "object" ),
		$ = imports( "element" ),
		animation = imports( "animation" ),
		random = imports( "random" ),
		URL = imports( "url" ),
		css = imports( "css" ),
		math = imports( "math" ),

		Layout = imports( "./layout" ),
		async = imports( "async" ),

		tips = imports( "./tips" ),
		func = imports( "function" ),

		urlArg = URL( location.href ).arg,

		runEvent = async.Event(),

		platform = imports( "./platform" ),
		history = imports( "./history" ),
		theme = imports( "./theme" ),
		Img = imports( "./img" ),
		localResource = imports( "./local-resource" );

	imports( "./custom" );
	imports( "./content/image" );
	imports( "./content/multi-image" );
	imports( "./content/shape" );
	imports( "./content/text" );

	function resize( parent ) {
		var resizeEvent = async.Event();
		parent = parent || document.documentElement;

		// 测量尺寸
		$.bind( window, "resize", func.recursion( function () {
			var s, d;

			// 背景布局
			p.transformCover = p.LayoutTransform( {
				s : s = {
					width : idealWidth = designWidth / 2,
					height : idealHeight = designHeight / 2
				},
				d : d = {
					width : clientWidth = parent.clientWidth,
					height : clientHeight = parent.clientHeight
				},
				scale : p.cover
			} );

			// Y布局
			p.transformY = p.LayoutTransform( {
				s : s,
				d : d,
				scale : function ( sWidth, sHeight, dWidth, dHeight ) {
					return dHeight / sHeight;
				}
			} );

			// 504背景布局
			p.transform504 = p.LayoutTransform( {
				s : {
					width : 320,
					height : 504
				},
				d : d,
				scale : p.cover
			} );

			xRatio = clientWidth / idealWidth;
			yRatio = clientHeight / idealHeight;
			gRatio = p.transformCover.scale;

			resizeEvent.trig();

			css( document.body, {
				"font-size" : css.px( 12 * yRatio )
			} );
		} ) );

		return resizeEvent.regist;
	}

	// 判断引擎类型
	ua.ios && document.documentElement.classList.add( "ios" );
	ua.win32 && document.documentElement.classList.add( "win32" );

	window.playAudio = function () {
		body && body.playAudio && body.playAudio();
	};

	window.stopAudio = function () {
		body && body.stopAudio && body.stopAudio();
	};

	window.runFirstPage = function () {
		var onResize = resize(),
			runArg = fp.runArg || {}; // 尺寸更改事件

		// 如果有firstpageStyle,样式来自于脚本内部变量
		firstpageStyle && $( "style", firstpageStyle, document.head );

		// 本地缓存脚本
		if ( window.firstpageVersion ) {
			localResource( "script", function () {
				return firstpageScript.toString();
			} );
		}

		// 全局屏蔽默认事件,如果某节点需要默认事件,加类.need-default
		onPointerDown( document, function ( event ) {
			var prevent = true;
			$.bubble( event.origin.target, function ( node ) {
				if ( node.classList.contains( "need-default" ) ) {
					prevent = false;
				}
			} );
			prevent && event.preventDefault();
		} );

		window.runFirstPage = func.recursion( function ( arg ) {
			arg = arg || {};

			var workBody = $( "div", {
					css : css.full( {
						overflow : "hidden",
						background : "#000000",
						"z-index" : 0
					} )
				} ),
				playSchedule = async.Schedule(),
				preloadPageSchedule = async.Schedule(),
				pageError = Img.Icon( "page-error" ),
				audioPlayIntention = true, // 音乐播放意图
				workData, // 作品数据
				loadTasks = [], // 加载任务
				loading = tips.Loading( workBody ), // 加载图标
				curPageIndex = arg.pageIndex || 0, // 当前页码
				curPage; // 当前页

			// 如果不是单独模式,回收先前的body,准备新的body,并启动预加载和播放日程
			if ( !arg.standAlone ) {
				body && body.recycle();
				$.remove( body );
				document.body.appendChild( body = workBody );
				runArg.preload !== false && preloadPageSchedule.start();
				runArg.start !== false && playSchedule.start();
			}

			// 读取作品,解析页面,创建页
			if ( arg.workData ) {
				workData = arg.workData;
			}
			else {
				loadTasks.push( function ( done ) {
					( arg.loadWork || fp.loadWork )( function ( result ) {
						workData = result;
						done();
					}, workBody );
				} );
			}

			// 加载pageError
			loadTasks.push( function ( done ) {
				var loadHandle = $.bind( pageError, "load", function () {
					loadHandle.remove();
					done();
				} );
			} );

			workBody.onLoad = async.Waiter( function ( workLoadDone ) {
				// 加载任务完成后,启动
				async.concurrency( loadTasks, function () {
					var themeData = parseInt( workData.theme ) ? theme.setTheme( workData ) : null, // 主题数据
						mode = workData.mode, // 模式

						rawPageSwitch = workData.pageSwitch, // 页面切换
						sa = switchAnimations,
						switchAnimateList = [sa.classic, sa.push, sa.fade, sa.cube, sa.door, sa["switch"], sa.uncover], // 动画切换数组,用来取随机用

						pagesContext = {}, // 页上下文

						switchAnimateId = ua.chuyeList || mode === "push" || !sa[rawPageSwitch] ? "classic" : rawPageSwitch, // 切换动画id
						music = workData.music, // 音乐
						noLoop = workData.noLoop, // 无循环

						pagesData = workData.pages, // 页信息
						pageNum = pagesData.length, // 页数量

						loginData, // 登录数据
						audio, // 音频
						musicIcon, // 播放图标
						loadingNewPageTips, // 加载新页提示
						cutHandle = null, // 切换句柄
						cutAnimateHandle = null, // 切换动画句柄
						hasArrivedTail = curPageIndex === pageNum - 1;  // 已经到达尾部

					inClickMode = !ua.chuyeList && mode === "click"; // 是否处于点击模式
					workBody.color = workData.color || "#FFFFFF"; // 颜色
					workBody.workData = workData;
					workBody.workInfo = workData.workInfo;

					function getPageIndex( index ) {
						return ( index + pageNum ) % pageNum;
					}

					function preloadPage() {
						var curIndex = curPage.index;

						function load( i, j ) {
							i !== 0 && async.concurrency( array.map( [-j, j], function ( step ) {
								return function ( done ) {
									loadPage( curIndex + step, done );
								}
							} ), function () {
								load( i - 1, j + 1 );
							} )
						}

						load( 2, 1 );
					}

					function loadPage( index, onLoad ) {
						var pageData = pagesData[index],
							pageContext = pagesContext[index] || ( pagesContext[index] = {
									data : {}
								} ),
							waiter = pageContext.waiter;

						if ( !pageData ) {
							onLoad();
						}
						else {
							if ( !waiter ) {
								waiter = pageContext.waiter = async.Waiter( function ( done ) {
									Layout.loadPage( pageData, function ( create ) {
										pageContext.create = function recreate( parent ) {
											var page = create( pageContext.data, workBody ),
												pageString = JSON.stringify( pageData );

											page.recreate = recreate;
											page.index = index; // 页码
											page.hash = function () {
												var result = 0;
												string.foreach( pageString, function ( ch ) {
													result += ch.charCodeAt( 0 );
												} );
												return result;
											}(); // 页面的哈希值,如果数据不改变,哈希值不会改变

											// 设置切换动画
											page.switchAnimate = ( rawPageSwitch === "random" ?
												random.select( switchAnimateList ) : switchAnimations[switchAnimateId] );

											themeData && theme.setPageAnimate( page, themeData ); // 配置主题动画
											page.prepare(); // 页面准备
											parent && parent.appendChild( page ); // 加载到父元素上
											return page;
										};

										done();
									}, pageError );
								} );
							}
							waiter.onComplete( onLoad );
						}
					}

					// 如果有登录数据,切出登录页
					if ( loginData = JSON.parse( history.getSessionData( "login-data" ) || "null" ) ) {
						history.registLoginPage[loginData.name]( loginData, true );
					}

					// 尺寸变化时更新页
					onResize( function () {
						cutAnimateHandle && cutAnimateHandle.fastForward();
						curPage.recycle();
						$.remove( curPage );
						curPage = curPage.recreate( workBody );
						curPage.play();
					} );

					workBody.onPageLoad = async.Waiter( function ( pageLoadDone ) {
						loadPage( curPageIndex, function () {
							var firstTips = tips.CutFirst( workBody );
							curPage = pagesContext[curPageIndex].create( workBody );

							// 准备播放日程和预加载页面日程
							playSchedule.prepare( function () {
								curPage.play();
							} );
							preloadPageSchedule.prepare( preloadPage );

							// 启动,移除加载
							$.remove( loading );

							// 如果有音乐,添加音乐播放
							if ( urlArg.music !== "false" && !/ChuyeNoMusic/gi.test( navigator.userAgent ) && !window.noMusic && music ) {
								musicIcon = tips.Music( workBody ); // 音乐图标
								audio = $( "<audio loop></audio>", workBody ); // audio标签
								audio.onerror = function () {
									audio.onerror = null;
									audio.src = URL.concatArg( music, {
										t : new Date().getTime()
									} );
									musicIcon.classList.contains( "play" ) && audio.play();
								};

								if ( !ua.ios ) {
									$.bind( audio, "loadeddata", function () {
										animation.requestFrames( {
											duration : 3,
											onAnimate : function ( ratio ) {
												audio.volume = ratio;
											}
										} );
									} );
								}

								// 停止播放音乐
								workBody.stopAudio = function () {
									if ( musicIcon.play === true ) {
										workBody.audioPlayIntention = audioPlayIntention = false;
										musicIcon.play = false;
										audio.pause();
									}
								};

								// 播放音乐
								workBody.playAudio = function () {
									if ( !audio.src ) {
										audio.src = music;
									}

									if ( musicIcon.play !== true ) {
										workBody.audioPlayIntention = audioPlayIntention = true;
										musicIcon.play = true;
										audio.play();
									}
								};

								// 点击图标切换播放状态
								onTap( musicIcon, function () {
									musicIcon.play ? workBody.stopAudio() : workBody.playAudio();
								} );

								// 播放音乐
								if ( ua.MicroMessenger ) {
									ua.ios ? window.WeixinJSBridge && WeixinJSBridge.invoke( 'getNetworkType', {}, function () {
										workBody.playAudio();
									} ) : workBody.playAudio();
								}
							}

							// 切换页面
							function cut( step ) {
								// 清理cutHandle和加载新页提示
								cutHandle = null;
								$.remove( loadingNewPageTips );

								// 切换
								func.recursion( function cut() {
									var pageContext = pagesContext[getPageIndex( curPageIndex + step )];

									if ( pageContext && pageContext.create ) {
										var oldPage = curPage;
										oldPage.fastForward(); // 快进当前页
										oldPage.recycle(); // 回收当前页

										$.classList( workBody ).remove( "last-page" ).remove( "show-copyright" );

										curPage = pageContext.create();
										curPageIndex = curPage.index;

										preloadPage();

										// 切换动画
										var lock = Lock();
										platform.cutPage( function () {
											cutAnimateHandle = ( step > 0 ? curPage.specialSwitchAnimate || oldPage.specialSwitchAnimate || curPage.switchAnimate
												: sa.back )( oldPage, curPage, function () {
												cutAnimateHandle = null;
												$.remove( oldPage );
												workBody.appendChild( curPage );
												curPage.play();

												if ( curPageIndex === pageNum - 1 ) {
													hasArrivedTail = true;
													workBody.classList.add( "last-page" );
												}

												lock.remove();
											} );
										} );
									}
									else {
										loadingNewPageTips = tips.LoadingNewPage();
										cutHandle = cut;
										loadPage( getPageIndex( curPageIndex + step ), function () {
											$.remove( loadingNewPageTips );
											if ( cutHandle === cut ) {
												cut();
											}
										} );
									}
								} );
							}

							// 手势切换
							func.callWith( function ( cut ) {
								inClickMode ? onTap( workBody, function () {
									cut( 1 );
								} ) : onSwipeStart( workBody, function ( event ) {
									if ( event.yOut ) {
										var toDown = event.dY < 0;
										// 在第一页并且没有到达过最后一页时,向上滑时无效
										if ( !( !toDown && curPageIndex === 0 && !hasArrivedTail ) ) {
											cut( toDown ? 1 : -1 );
										}
									}
								} );
							}, function ( step ) {
								if ( preventBodyEvent || preventDrag ) {
									return;
								}

								// 如果不能循环,并且在最后一页,不能上滑
								if ( noLoop && curPageIndex === pageNum - 1 && step === 1 ) {
									return;
								}

								// 如果还是第一个提示,换成普通提示
								if ( firstTips ) {
									$.remove( firstTips );
									firstTips = null;
									tips.Cut( workBody );

									// 如果有音乐播放意图,播放音乐
									if ( audioPlayIntention ) {
										workBody.playAudio && workBody.playAudio();
									}
								}

								cut( step );
							} );

							// 页码接口
							Object.defineProperty( workBody, "curPageIndex", {
								get : function () {
									return curPageIndex;
								},
								set : function ( targetPageIndex ) {
									if ( !document.documentElement.classList.contains( "lock" ) ) {
										targetPageIndex = getPageIndex( targetPageIndex );
										if ( targetPageIndex !== curPageIndex ) {
											cut( targetPageIndex - curPageIndex );
										}
									}
								}
							} );

							Object.defineProperty( workBody, "curPageData", {
								get : function () {
									return workData.pages[curPageIndex];
								}
							} );

							pageLoadDone();
						} );
					} ).onComplete;

					workLoadDone();
				} );
			} ).onComplete;

			return object.insert( workBody, {
				recycle : function () {
					curPage && curPage.recycle();
				},
				play : playSchedule.start,
				preloadPage : preloadPageSchedule.start
			} );
		}, JSON.parse( history.getSessionData( location.href, "{}" ) ) );

		runEvent.trig();
	};

	Object.defineProperty( window, "curPageIndex", {
		set : function ( index ) {
			body && ( body.curPageIndex = index );
		},
		get : function () {
			return body ? body.curPageIndex : undefined;
		}
	} );

	Object.defineProperty( window, "curPageData", {
		get : function () {
			return body ? body.curPageData : undefined;
		}
	} );

	exports.resize = resize;
	exports.onRun = async.Waiter( function ( done ) {
		runEvent.regist( done );
	} ).onComplete;
} );