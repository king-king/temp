/**
 * Created by 白 on 2015/6/9.
 */

library( function () {
	var URL = imports( "url" ),
		array = imports( "array" ),
		async = imports( "async" ),
		$ = imports( "element" ),
		tips = imports( "../tips" ),
		func = imports( "function" ),
		css = imports( "css" ),
		csa = imports( "css-animation" ),
		pointer = imports( "pointer" ),
		object = imports( "object" ),

		LoadWork = imports( "./load-work" ),
		main = imports( "../main" ),
		Img = imports( "../img" ),
		platform = imports( "../platform" ),

		href = URL( location.href ),
		arg = href.arg,
		loadingStart = new Date();

	// 处理从客户端获取的列表
	function ClientList( list ) {
		return list === undefined || object.is.Array( list ) ? list : JSON.parse( list );
	}

	// 通过动画移除元素
	function removeByAnimation( animation ) {
		csa.runAnimation( animation, function () {
			$.remove( animation[0] );
		} );
	}

	if ( ua.chuyeList ) {
		var lock = Lock();
		fp.runArg = {
			preload : false
		};

		async.polling( function () {
			return !!window.firstpage;
		}, function () {
			var workList = firstpage.workList || JSON.parse( firstpage.getWorkList() ),
				originalWorkId = window.workId || array.top( href.pathname.split( "/" ) ),
				listIndex = findIndexById( originalWorkId ),
				bodyCache = {},

				workPlayCache = {},
				setTitleHandle = null, loadNextHandle = null,

				screenMask = $( "div", {
					css : css.full( {
						"z-index" : 100000
					} )
				}, document.body ),
				maskTapper = $( "div", {
					css : css.full( {
						left : 0,
						right : 0,
						top : css.px( 90 ),
						bottom : css.px( 90 )
					} )
				}, screenMask );

			firstpage.updateWorkList = null;

			function flag( name ) {
				return firstpage[name] == null ? false : object.is.Boolean( firstpage[name] ) ? firstpage[name] : firstpage[name]();
			}

			// 根据id制作body
			function WorkBody( id ) {
				return runFirstPage( {
					standAlone : true,
					loadWork : LoadWork( workDetailUrl.replace( originalWorkId + "", id ) ),
					pageIndex : workPlayCache[id]
				} );
			}

			// 预加载作品
			function preloadWork() {
				array.foreach( [-1, 1], function ( sign ) {
					var workId = workList[listIndex + sign];
					bodyCache[sign] = workId ? WorkBody( workId ) : null;
				} );
			}

			// 设置标题
			function setTitle( workBody, listIndex ) {
				if ( listIndex !== undefined ) {
					history.replaceState( null, "", href.toString().replace( originalWorkId + "", workBody.workId ) );
					if ( workBody.loadError ) {
						document.title = "抱歉,您访问的页面已失踪";
					}
					else {
						window.cas && cas.trackPageview && cas.trackPageview();
						document.title = "作品加载中";
					}
				}

				setTitleHandle = workBody.onLoad( function () {
					var title = workBody.workTitle;
					document.title = title;
					setTitleHandle = null;
				} );
			}

			// 显示新的body
			function showBody( newBody ) {
				// 移除旧的body
				body.recycle();
				$.remove( body );

				// 记录当前播放的页码
				workPlayCache[body.workId] = body.curPageIndex;

				// 设置新的body
				body = newBody;

				body.play(); // 播放body
				preloadWork(); // 预加载作品
				setTitle( body, listIndex ); // 设置标题
			}

			// 寻找id对应的index
			function findIndexById( targetId ) {
				return array.foreach( workList, function ( id, i ) {
					if ( parseInt( id ) === parseInt( targetId ) ) {
						return i;
					}
				} );
			}

			// 如果是ios手动制作对应方法
			if ( ua.ios && !firstpage.switchFirst ) {
				array.foreach( ["open", "enterFullScreen", "leaveFullScreen", "switchWorkStart", "switchWorkEnd",
					"switchFirst", "switchLast"], function ( name ) {
					firstpage[name] = function () {
						document.location = "chuyeapp:" + name + ":" + Array.prototype.slice.call( arguments, 0 ).join( "$" );
					};
				} );
			}

			// 进入全屏
			onTap( maskTapper, firstpage.enterFullScreenA = function () {
				if ( !body.loadError ) {
					// 恢复音乐播放
					if ( body.audioNeedResume ) {
						body.audioNeedResume = false;
						body.playAudio();
					}

					// 回复提示
					document.documentElement.classList.remove( "hide-tips-fade" );

					// 通知客户端
					firstpage.enterFullScreen();

					// 移除屏幕遮罩
					screenMask.classList.add( "hidden" );

					// 预加载页面
					body.preloadPage();
				}
			} );

			// 退出全屏
			onTap( document.documentElement, firstpage.leaveFullScreenA = function () {
				if ( !preventBodyEvent && screenMask.classList.contains( "hidden" ) ) {
					// 移除提示
					document.documentElement.classList.add( "hide-tips-fade" );

					// 停止播放音乐并记录是否需要恢复
					body.audioNeedResume = body.audioPlayIntention;
					body.stopAudio && body.stopAudio();

					// 通知客户端
					firstpage.leaveFullScreen();

					// 回复屏幕遮罩
					screenMask.classList.remove( "hidden" );
				}
			} );

			// 跳转到某作品
			firstpage.jump = function ( index ) {
				if ( parseInt( body.workId ) !== parseInt( workList[index] ) ) {
					showBody( document.body.appendChild( WorkBody( workList[listIndex = index] ) ) );
				}
			};

			// 手动更新作品列表
			firstpage.updateWorkListA = function ( list ) {
				workList = ClientList( list );
				if ( ( listIndex = findIndexById( body.workId ) ) === undefined ) {
					firstpage.jump( 0 );
				}
			};

			main.onRun( function () {
				if ( arg.full || flag( "full" ) ) {
					setTimeout( function () {
						firstpage.enterFullScreenA();
						lock.remove();
					}, Math.max( 0, 1500 - ( new Date() - loadingStart ) ) );
				}
				else {
					lock.remove();
					document.documentElement.classList.add( "hide-tips-fade" );
				}

				// 第一页加载完成后,预加载其他作品
				body.onLoad( function () {
					body.onPageLoad( preloadWork );
				} );
				body.onLoadError = preloadWork;

				// 设置页面标题
				setTitle( body );

				onSwipeStart( screenMask, function ( event ) {
					event.yOut && func.callWith( function ( cut ) {
						cut( event.dY > 0 ? -1 : 1 );
					}, function ( sign ) {
						var newBody = bodyCache[sign];

						// 切换作品
						function cutBody( cut, endIndex ) {
							var lock = Lock();
							firstpage.switchWorkStart();
							platform.cutPage( function () {
								cut( body, newBody, function () {
									listIndex = endIndex;
									showBody( newBody ); // 显示新body
									firstpage.switchWorkEnd( endIndex ); // 切换结束
									lock.remove(); // 解锁
								}, document.body, 0.4 );
							} );
						}

						if ( !newBody ) {
							if ( arg["no-refresh"] || flag( "noRefresh" ) ) {
								alert( sign === 1 ? "没有下一个作品了" : "没有上一个作品了" );
							}
							else {
								if ( firstpage.updateWorkList === null ) {
									// 加载更多
									if ( sign === 1 ) {
										// 加载图标
										var loadMoreWrapper = $( "div", {
											css : {
												position : "absolute",
												left : "50%",
												bottom : css.px( 80 ),
												"z-index" : 100,
												opacity : 0,
												transition : "0.2s"
											}
										}, document.body );

										$( tips.LoadingChrysanthemum( loadMoreWrapper ), {
											css : {
												"z-index" : 0
											}
										} );

										setTimeout( function () {
											css( loadMoreWrapper, "opacity", 1 );
										}, 0 );

										// 加载下一页句柄
										loadNextHandle = function () {
											var newId = workList[listIndex + 1];
											if ( newId ) {
												newBody = WorkBody( newId );
												cutBody( switchAnimations.push, listIndex + 1 );
											}
											else {
												alert( "没有下一个作品了" );
											}
										};

										firstpage.updateWorkList = function ( newList ) {
											newList = ClientList( newList );

											// 移除加载图标
											removeByAnimation( [loadMoreWrapper, {
												100 : {
													opacity : 0
												}
											}, 0.3] );

											if ( JSON.stringify( newList ) === JSON.stringify( workList ) ) {
												alert( "没有下一个作品了" );
												loadNextHandle = null;
											}
											else {
												workList = newList;
												listIndex = findIndexById( body.workId );
												loadNextHandle && loadNextHandle();
											}
											firstpage.updateWorkList = null;
										};

										firstpage.switchLast();
									}
									// 刷新作品
									else {
										var refreshArrow = $( Img.Icon( "refresh-arrow" ), {
												css : {
													position : "absolute",
													left : 0,
													top : 0,
													"z-index" : 1,
													transition : "0.3s"
												}
											} ),
											refreshArrowSize = refreshArrow.ps.width,
											refreshWrapper = $( "div", {
												css : {
													position : "absolute",
													left : "50%",
													"margin-left" : css.px( -refreshArrowSize / 2 ),
													width : css.px( refreshArrowSize ),
													height : css.px( refreshArrowSize ),
													top : css.px( -refreshArrowSize ),
													"z-index" : 100
												},
												children : [refreshArrow]
											}, document.body ),
											refreshLoading = $( tips.Loading( refreshWrapper ), {
												css : {
													"z-index" : 0,
													transition : "0.3s",
													transform : "scale(0.88)",
													opacity : 0
												}
											} ),
											refreshY = 0,
											releaseRefresh = false;

										pointer.onMoveUp( {
											onMove : function ( event ) {
												css.transform( refreshWrapper, css.translate( 0, Math.atan( ( refreshY += event.dY ) / 100 ) * 60 ) );
												releaseRefresh = refreshY > 100;
												css.transform( refreshArrow, css.rotateZ( releaseRefresh ? 180 : 0 ) );
											},
											onUp : function () {
												function removeTips() {
													removeByAnimation( [refreshWrapper, {
														100 : {
															transform : "translate3d(0,0,0)"
														}
													}, 0.3] );
												}

												if ( releaseRefresh ) {
													css( refreshArrow, "opacity", 0 );
													css( refreshLoading, "opacity", 1 );

													firstpage.updateWorkList = function ( newList ) {
														newList = ClientList( newList );
														if ( newList === undefined ||
															parseInt( ( workList = newList )[listIndex] ) === parseInt( body.workId ) ) {
															var msgBox = $( "div.msg-box", {
																	css : {
																		top : css.px( Math.atan( ( refreshY += event.dY ) / 100 ) * 60 + 3 ),
																		visibility : "visible"
																	}
																}, document.body ),
																msg = $( "div.msg", {
																	css : {
																		opacity : 1,
																		"border-radius" : "25px",
																		"line-height" : "25px",
																		padding : "0 12px"
																	},
																	innerHTML : "没有新的作品了"
																}, msgBox );

															async.once( function () {
																removeByAnimation( [msgBox, {
																	100 : {
																		opacity : 0
																	}
																}, 0.3] );
															}, function ( remove ) {
																return [async.setTimeout( remove, 2000 ), onPointerDown( document, remove )];
															} );

															preloadWork();
														}
														else {
															newBody = WorkBody( newList[0] );
															cutBody( switchAnimations.fade, 0 );
														}
														firstpage.updateWorkList = null;
														removeTips();
													};
													firstpage.switchFirst();
												}
												else {
													removeTips();
												}
											}
										} );
									}
								}
								else {
									alert( "加载中,请稍候" );
								}
							}
						}
						else {
							// 清理标题设置句柄
							if ( setTitleHandle ) {
								setTitleHandle.remove();
								setTitleHandle = null;
							}
							// 清理加载新页句柄
							loadNextHandle = null;
							cutBody( sign === 1 ? switchAnimations.push : switchAnimations.back, listIndex + sign );
						}
					} );
				} );
			} );
		} );
	}
} );