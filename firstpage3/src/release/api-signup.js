/**
 * Created by 白 on 2015/6/9.
 */

library( function () {
	var ajax = imports( "ajax" ),
		URL = imports( "url" ),
		object = imports( "object" ),
		array = imports( "array" ),
		href = URL( location.href ),

		userInfo = null,
		SignupSystem = fp.SignupSystem = {},
		token;

	imports( "../platform" );

	var cookie = function () {
		var cookie = JSON.parse( localStorage.getItem( "cookie" ) || "{}" );

		// 根据过期时间,清理cookie
		object.foreach( cookie, function ( key, value ) {
			if ( value.expires < new Date() ) {
				delete cookie[key];
			}
		} );

		// 保存cookie
		function save() {
			localStorage.setItem( "cookie", JSON.stringify( cookie ) );
		}

		save();

		return {
			getItem : function ( key ) {
				return cookie[key] ? cookie[key].value : null;
			},
			setItem : function ( key, value, timeToExpires ) {
				cookie[key] = {
					value : value,
					expires : (new Date()).getTime() + timeToExpires * 1000
				};
				save();
			},
			expires : function ( key, timeToExpires ) {
				if ( cookie[key] ) {
					cookie[key].expires = (new Date()).getTime() + timeToExpires * 1000;
					save();
				}
			},
			remove : function ( key ) {
				delete cookie[key];
				save();
			}
		};
	}();

	// 调用初夜接口
	function invokeApi( op ) {
		return ajax( {
			method : "post",
			url : URL.concatArg( "http://c.cloud7.com.cn" + op.url, token ? {
				_token : token
			} : {} ),
			data : object.is.String( op.data ) ? op.data : URL.encodeObject( op.data ),
			headers : object.extend( {
				"Accept" : "application/json",
				"Content-Type" : "application/x-www-form-urlencoded"
			}, op.headers || {} )
		}, function ( err, xhr ) {
			var data = JSON.parse( xhr.responseText );
			if ( data.code === 302 ) {
				op.on302 && op.on302( data.data );
			}
			else {
				op.success( data.data );
			}
		} );
	}

	if ( !ua.MicroMessenger ) {
		SignupSystem.canNotLogin = function () {
			alert( "请在微信中使用" );
		};

		SignupSystem.isLogIn = function () {
			return false;
		};
	}
	else {
		// 如果参数中有token,说明刚登陆完
		if ( token = href.arg._token ) {
			cookie.setItem( "token", token, 7 * 24 * 60 * 60 );

			// 获取用户信息
			fp.getUserInfo = function ( callback ) {
				if ( userInfo ) {
					callback( userInfo );
				}
				else {
					invokeApi( {
						url : "/api/Wechat/CurrentUser",
						success : function ( data ) {
							callback( userInfo = data );
						}
					} );
				}
			};

			SignupSystem.isLogIn = function () {
				return true;
			};
		}
		// 否则从localStorage中获取值,此值可能过期,用getUserInfo来确保它已登陆上
		else {
			token = cookie.getItem( "token" );

			// 获取用户信息
			fp.getUserInfo = function ( callback ) {
				callback( userInfo );
			};

			SignupSystem.isLogIn = function () {
				return userInfo !== null;
			};

			// 如果有token,立即发起一次获取CurrentUser的请求,以判断是否过期
			if ( token ) {
				var on302 = null,
					onSuccess = null;

				invokeApi( {
					url : "/api/Wechat/CurrentUser",
					on302 : function ( url ) {
						on302 && on302( url );

						fp.logIn = function () {
							invokeApi( {
								url : "/api/Wechat/CurrentUser",
								on302 : jump
							} );
						};
					},
					success : function ( data ) {
						userInfo = data;
						onSuccess && onSuccess();
					}
				} );

				SignupSystem.logIn = function ( arg ) {
					if ( userInfo ) {
						arg.onLogIn();
					}
					else {
						on302 = jump;
						onSuccess = arg.onLogIn;
					}
				};
			}
			// 如果没有token,login就是直接跳转
			else {
				SignupSystem.logIn = function () {
					location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9d492ee399e6a24c&redirect_uri=' +
						encodeURIComponent( 'http://c.cloud7.com.cn/Auth?returnUrl=' +
							encodeURIComponent( location.href ) ) +
						'&response_type=code&scope=snsapi_base&state=#wechat_redirect';
				};
			}
		}
	}

	// 记录页面访问
	fp.track = function ( args ) {
		window.cas && cas.trackEvent( args );
	};

	// 提交表单
	fp.sendForm = function ( callback, data ) {
		ajax( {
			url : virtualPath + "/Integra/SaveData",
			method : "post",
			headers : {
				"Content-Type" : "application/x-www-form-urlencoded"
			},
			data : URL.encodeObject( {
				formid : data.id,
				data : JSON.stringify( data.data )
			} )
		}, callback );
	};
} );