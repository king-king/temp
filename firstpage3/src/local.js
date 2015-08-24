/**
 * Created by 白 on 2014/10/29.
 */

plugin( function () {
	var array = imports( "array" ),
		object = imports( "object" ),
		URL = imports( "url" ),
		href = URL( location.href ),

		me = function () {
			var uid = href.arg.uid;
			return uid ? parseInt( uid, 10 ) : null;
		}(),

		users = window.avatarList;

	fp.track = function () {
	};

	// 请求
	function Request( requestFunc, delay ) {
		return function ( callback ) {
			var arg = arguments;
			setTimeout( function () {
				callback( requestFunc.apply( null, arg ) );
			}, delay || 500 );
		};
	}

	// 获取用户信息
	fp.getUserInfo = Request( function () {
		var user = users[me];

		return {
			City : "朝阳",
			Country : "中国",
			HeadPhoto : user.avatar,
			NickName : user.name,
			Province : "北京",
			Sex : 1
		};
	}, 50 );

	// 发送表单数据
	fp.sendForm = Request( function ( callback, data ) {
		console.log( URL.encodeObject( {
			formid : "123",
			data : JSON.stringify( data )
		} ) );
	} );

	fp.SignupSystem = {
		// 判断是否登录
		isLogIn : function () {
			return me !== null;
		},

		// 如果当前处于未登录状态,弹出提示框,选择用户
		logIn : function ( arg ) {
			if ( me ) {
				arg.onLogIn();
			}
			else {
				location.href = URL.concatArg( "/login.html", {
					returnUrl : location.href
				} );
			}
		}
	};
	// endregion
} );