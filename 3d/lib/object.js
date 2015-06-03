/**
 * Created by 白 on 2015/5/4.
 */

library( function () {
	var array = imports( "array" );

	function foreach( obj, func ) {
		for ( var i in obj ) {
			func( i, obj[i] );
		}
	}

	// 对象的类型判断
	var is = (function () {
		var is = {};
		array.foreach( ["Array", "Boolean", "Date", "Function", "Number", "Object", "RegExp", "String", "Window", "HTMLDocument"], function ( typeName ) {
			is[typeName] = function ( obj ) {
				return Object.prototype.toString.call( obj ) == "[object " + typeName + "]";
			};
		} );
		return is;
	})();


	exports.foreach = foreach;
	exports.is = is;
} );