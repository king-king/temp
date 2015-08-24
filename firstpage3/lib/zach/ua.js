/**
 * Created by 白 on 2015/2/25.
 * 浏览器检测
 */

library( function () {
	var ua = navigator.userAgent,
		appVersion = navigator.appVersion,
		platform = navigator.platform;

	module.exports = {
		// win系列
		win32 : platform === "Win32",
		ie : !!window.ActiveXObject || "ActiveXObject" in window,
		ieVersion : Math.floor( (/MSIE ([^;]+)/.exec( ua ) || [0, "0"])[1] ),

		// ios系列
		ios : (/iphone|ipad/gi).test( appVersion ),
		iphone : (/iphone/gi).test( appVersion ),
		ipad : (/ipad/gi).test( appVersion ),
		iosVersion : parseFloat( ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec( ua ) || [0, ''])[1])
			.replace( 'undefined', '3_2' ).replace( '_', '.' ).replace( '_', '' ) ) || false,
		safari : /Version\//gi.test( appVersion ) && /Safari/gi.test( appVersion ),
		uiWebView : /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test( ua ),

		// 安卓系列
		android : (/android/gi).test( appVersion ),
		androidVersion : parseFloat( "" + (/android ([0-9\.]*)/i.exec( ua ) || [0, ''])[1] ),

		// chrome
		chrome : /Chrome/gi.test( ua ),
		chromeVersion : parseInt( ( /Chrome\/([0-9]*)/gi.exec( ua ) || [0, 0] )[1], 10 ),

		// 内核
		webkit : /AppleWebKit/.test( appVersion ),

		// 其他浏览器
		uc : appVersion.indexOf( "UCBrowser" ) !== -1,
		Browser : / Browser/gi.test( appVersion ),
		MiuiBrowser : /MiuiBrowser/gi.test( appVersion ),

		// 微信
		MicroMessenger : ua.toLowerCase().match( /MicroMessenger/i ) == "micromessenger",

		// 触摸
		canTouch : "ontouchstart" in document,
		msPointer : window.navigator.msPointerEnabled
	};
} );