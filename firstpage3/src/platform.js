/**
 * Created by 白 on 2014/9/10.
 */

var p, ua, fp = {};
library( function () {
	var history = imports( "./history" ),
		object = imports( "object" ),
		URL = imports( "url" ),
		func = imports( "function" ),

		systemName;

	p = imports( "./position" );
	imports( "./global" );

	// 添加ua
	object.insert( ua = imports( "ua" ), {
		iphone4 : ua.iphone && screen.height === 480,
		iphone5 : ua.iphone && screen.height === 568,
		iphone6 : ua.iphone && screen.height > 568,
		mi4 : /Mi 4LTE/gi.test( navigator.userAgent )
	} );

	// 判断是否在chuye中
	if ( ua.chuye = window.inChuyeList || /chuye/gi.test( navigator.userAgent ) ) {
		ua.chuyeVersion = /chuye\/([\d.]*)/gi.test( navigator.userAgent ) ? parseFloat( RegExp.$1 ) : 1;
		ua.chuyeList = !!( window.inChuyeList || ( /chuyeFlow/gi.test( navigator.userAgent ) ) || URL( location.href ).arg.list );
	}

	// 系统名
	if ( ua.iphone ) {
		systemName = "iphone";
	}
	else if ( ua.ipad ) {
		systemName = "ipad";
	}
	else if ( ua.ios ) {
		systemName = "ios-other"
	}
	else if ( ua.android ) {
		systemName = "android";
	}
	else {
		systemName = "other";
	}

	// 下载初页
	function downloadFirstPage( trackName ) {
		if ( ua.chuye ) {
			alert( "您正在使用初页" );
		}
		else {
			fp.track( [trackName || "Download", "Click", systemName] );

			if ( ua.android ) {
				location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.cloud7.firstpage";
			}
			else if ( ua.ios ) {
				location.href = ua.MicroMessenger ? "http://a.app.qq.com/o/simple.jsp?pkgname=com.cloud7.firstpage"
					: "https://itunes.apple.com/cn/app/chu-ye/id910560238?mt=8";
			}
			else {
				history.jump( "http://www.cloud7.com.cn/chuye" );
			}
		}
	}

	function cutPage( cut ) {
		func.callWith( function ( cut ) {
			ua.chuye && ua.mi4 ? setTimeout( cut, 30 ) : cut();
		}, cut );
	}

	exports.systemName = systemName;
	exports.downloadFirstPage = downloadFirstPage;
	exports.cutPage = cutPage;
} );