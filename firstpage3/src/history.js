/**
 * Created by 白 on 2015/6/10.
 */

library( function () {
	var css = imports( "css" ),
		csa = imports( "css-animation" ),
		async = imports( "async" ),
		object = imports( "object" ),
		array = imports( "array" ),
		func = imports( "function" ),
		URL = imports( "url" ),
		$ = imports( "element" ),
		inLogin = false;

	// 保存浏览上下文
	function saveViewContext() {
		sessionStorage.setItem( location.href, JSON.stringify( {
			pageIndex : body.curPageIndex,
			workData : body.workData
		} ) );
	}

	// 跳转到链接,记录当前页码
	function jump( href, notSave ) {
		if ( window.firstpage && firstpage.open ) {
			firstpage.open( URL.toAbsolute( href ) );
		}
		else {
			!notSave && saveViewContext();
			location.href = href;
		}
	}

	// 历史
	var history = function () {
		var actionList = [],
			hasPush = false;

		func.callWith( function ( bindPopstate ) {
			document.readyState === "complete" ? bindPopstate() : async.once( bindPopstate, function ( task ) {
				return $.bind( window, "load", task );
			} );
		}, function () {
			setTimeout( function () {
				$.bind( window, "popstate", function () {
					if ( actionList.length !== 0 ) {
						var oldTop = array.top( actionList );
						actionList.pop();
						oldTop.onPop( oldTop.actionEnd );

						if ( actionList.length > 1 ) {
							window.history.pushState( null, "", location.href );
						}
						else {
							hasPush = false;
						}
					}
				} );
			}, 0 );
		} );

		return {
			pushAction : function ( onPop ) {
				var actionEndEvent = async.Event();
				actionList.push( {
					onPop : onPop,
					actionEnd : actionEndEvent.trig
				} );

				if ( !hasPush ) {
					hasPush = true;
					window.history.pushState( null, "", location.href );
				}

				return actionEndEvent.regist;
			},
			back : function () {
				window.history.back();
			}
		};
	}();

	// 获取session数据,并清除它
	function getSessionData( key, defaultValue ) {
		var retVal = sessionStorage.getItem( key );
		sessionStorage.removeItem( key );
		return retVal === null ? defaultValue : retVal;
	}

	// 滑页
	function SlidePage() {
		var page = $( "div", {
				css : css.full( {
					overflow : "hidden",
					"z-index" : 1000
				} )
			} ),
			slideInEvent = async.Event(),
			slideOutEvent = async.Event();

		onPointerDown( page, function () {
			preventBodyEvent = true;
		} );

		return object.insert( page, {
			onSlideIn : slideInEvent.regist,
			onSlideOut : slideOutEvent.regist,
			slideIn : function ( noTransition ) {
				page.isIn = true;
				if ( !noTransition ) {
					var lock = Lock();
					css( page, "visibility", "hidden" );
					setTimeout( function () {
						css( page, "visibility", "visible" );
						csa.runAnimation( [page, {
							0 : {
								transform : "translate3d(100%, 0, 0)"
							}
						}, 0.4], function () {
							slideInEvent.trig();
							lock.remove();
						} );
					}, 0 );
				}

				history.pushAction( function () {
					var lock = Lock();
					slideOutEvent.trig();
					csa.runAnimation( [page, {
						100 : {
							transform : "translate3d(100%, 0, 0)"
						}
					}, 0.4], function () {
						lock.remove();
						$.remove( page );
					} );
					page.isIn = false;
				} );

				body.appendChild( page );
			}
		} );
	}

	// 注册一个登录页
	function registLoginPage( name, loginSystem, make ) {
		return registLoginPage[name] = function ( arg, noAnimate, debug ) {
			if ( inLogin ) {
				return;
			}

			arg = arg || {};

			// 滑入页面
			function slidePageIn() {
				var page = SlidePage();
				make( page, arg.data );
				page.slideIn( noAnimate );
			}

			if ( debug ) {
				slidePageIn();
			}
			else if ( !loginSystem ) {
				alert( "当前环境不支持该操作" );
			}
			else if ( !arg.force && ( arg.noLog || loginSystem.isLogIn() ) ) {
				arg.onLogin ? arg.onLogin( slidePageIn ) : slidePageIn();
			}
			else {
				if ( !loginSystem.canNotLogin ) {
					saveViewContext();
					sessionStorage.setItem( "login-data", JSON.stringify( {
						name : name,
						data : arg.data
					} ) );
					inLogin = true;
					loginSystem.logIn( {
						returnUrl : location.href,
						onLogIn : function () {
							inLogin = false;
							slidePageIn();
						}
					} );
					if ( inLogin ) {
						alert( "登录中,请稍候" );
					}
				}
				else {
					loginSystem.canNotLogin();
				}
			}
		};
	}

	exports.jump = jump;
	exports.back = history.back;
	exports.registLoginPage = registLoginPage;
	exports.getSessionData = getSessionData;
	exports.SlidePage = SlidePage;
} );