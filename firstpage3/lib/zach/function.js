/**
 * Created by Zuobai on 2015/3/15.
 * 函数有关的函数
 */

library( function () {
	// 循环
	function loop( arg1, arg2, arg3 ) {
		var start, end, block;
		if ( arg3 ) {
			block = arg3;
			start = arg1;
			end = arg2;
		}
		else {
			block = arg2;
			start = 0;
			end = arg1;
		}

		for ( ; start !== end; ++start ) {
			block( start );
		}
	}

	// 根据函数字符串调用函数
	function call( funcStr ) {
		return new Function( "return " + funcStr )().apply( null, Array.prototype.slice.call( arguments, 1 ) );
	}

	// 函数版with
	function callWith( call, func ) {
		return call( func );
	}

	// 递归
	function recursion( func ) {
		func.apply( null, Array.prototype.slice.call( arguments, 1 ) );
		return func;
	}

	exports.loop = loop;
	exports.call = call;
	exports.callWith = callWith;
	exports.recursion = recursion;
} );
