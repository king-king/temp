/**
 * Created by 白 on 2015/6/9.
 */

library( function () {
	var object = imports( "object" ),
		array = imports( "array" ),
		$ = imports( "element" ),
		shareData = {};

	imports( "../platform" );

	// 分享到微信
	function shareWeixin() {
		function shareArg( where, noDesc ) {
			var arg = {
				title : shareData.title,
				link : shareData.url,
				imgUrl : shareData.picture,
				success : function () {
					var xhr = new XMLHttpRequest();
					xhr.open( "post", virtualPath + "/Work/Share", true );
					xhr.send( null );
					fp.track( ["Share", where] );
				}
			};

			return noDesc ? arg : object.extend( arg, {
				desc : shareData.desc
			} );
		}

		if ( window.wx && shareData.title !== undefined ) {
			wx.onMenuShareTimeline( shareArg( "TimeLine", true ) ); // 分享到朋友圈
			wx.onMenuShareAppMessage( shareArg( "AppMessage" ) ); // 分享给朋友
			wx.onMenuShareQQ( shareArg( "QQ" ) ); // 分享到当前目录
			wx.onMenuShareWeibo( shareArg( "Weibo" ) ); // 分享给微博
		}
	}

	// 加载微信脚本
	if ( ua.MicroMessenger && window.wxConfig ) {
		$( "script", {
			src : "http://res.wx.qq.com/open/js/jweixin-1.0.0.js",
			onload : function () {
				wx.ready( function () {
					shareWeixin();
					wx.getNetworkType( {
						success : function ( res ) {
							ua.networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
						}
					} );
				} );

				wx.config( object.extend( window.wxConfig, {
					debug : false,
					jsApiList : ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "getNetworkType"]
				} ) );

				this.onload = null;
			}
		}, document.head )
	}

	// 设置分享数据
	module.exports = function ( data ) {
		shareData = data;
		data.title && ( document.title = data.title );
		shareWeixin();
	};
} );