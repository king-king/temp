/**
 * Created by 白 on 2014/11/5.
 */

plugin( function () {
	var URL = imports( "url" ),
		LoadWork = imports( "./release/load-work" );

	imports( "./release/api-signup" );
	imports( "./release/chuye-list" );

	// 记录页面访问
	fp.track = function ( args ) {
		window.cas ? cas.trackEvent( args ) : console.log( args.join( " " ) );
	};

	// 首个作品加载
	fp.loadWork = LoadWork( window.workDetailUrl ? URL.concatArg( workDetailUrl, {
		isPreview : ( ua.chuye && !ua.chuyeList ) ? true : undefined
	} ) : "" );
} );