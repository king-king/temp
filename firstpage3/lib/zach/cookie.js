/**
 * Created by 白 on 2015/6/15.
 */

library( function () {
	var array = imports( "array" ),
		map = {};

	array.foreach( document.cookie.split( ";" ), function ( searchPair ) {
		var keyValue = searchPair.split( "=" );
		map[keyValue[0].trim( " " )] = keyValue[1];
	} );

	exports.get = function ( key ) {
		return map[key];
	};
} );