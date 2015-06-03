/**
 * Created by 白 on 2015/5/13.
 */

library( function () {
	var array = imports( "array" );

	// 顺序
	function sequence( requests, callback ) {
		function run( i ) {
			var request = requests[i];
			if ( !request ) {
				callback && callback();
			}
			else {
				request( function () {
					run( i + 1 );
				} );
			}
		}

		run( 0 );
	}

	// 并发
	function concurrent( requests, callback ) {
		var count = 0; // 记录有多少请求完成了
		array.foreach( requests, function ( request ) {
			request( function () {
				if ( ++count === requests.length ) {
					callback && callback();
				}
			} );
		} );
	}

	exports.sequence = sequence;
	exports.concurrent = concurrent;
} );