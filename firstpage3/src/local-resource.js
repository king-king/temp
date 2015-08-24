/**
 * Created by 白 on 2015/6/10.
 * 本地资源加载
 */

library( function () {
	var array = imports( "array" );

	// 本地资源
	module.exports = function () {
		var resource = window.localResource || {};

		// 如果版本不对,清除版本
		if ( resource.version !== window.firstpageVersion ) {
			array.foreach( resource.list || [], function ( key ) {
				localStorage.removeItem( key );
			} );
			resource.version = window.firstpageVersion;
			resource.list = [];
			localStorage.setItem( "resource", JSON.stringify( resource ) );
		}

		return function ( key, dataGetter ) {
			if ( !window.localResource ) {
				return null;
			}
			else if ( dataGetter === undefined ) {
				return localStorage.getItem( key );
			}
			else {
				if ( !array.contains( resource.list, function ( item ) {
						return item === key;
					} ) ) {
					var value = dataGetter();
					if ( value != null ) {
						resource.list.push( key );
						localStorage.setItem( key, dataGetter() );
						localStorage.setItem( "resource", JSON.stringify( resource ) );
					}
				}
			}
		};
	}();
} );