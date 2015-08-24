/**
 * Created by 白 on 2015/5/14.
 */

library( function () {
	var object = imports( "object" );

	module.exports = function ( arg, callback ) {
		var xhr = new XMLHttpRequest();

		xhr.onload = function () {
			callback && callback( null, xhr );
		};

		xhr.onerror = function ( err ) {
			callback && callback( err, xhr );
		};

		xhr.open( arg.method || "get", arg.url, true );

		// 添加headers
		arg.headers && object.foreach( arg.headers, function ( key, value ) {
			xhr.setRequestHeader( key, value );
		} );

		xhr.send( arg.data || null );

		return xhr;
	};
} );