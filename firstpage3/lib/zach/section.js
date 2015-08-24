/**
 * Created by Zuobai on 2015/3/15.
 * 区间算法
 * 区间指这样一种数组[0,3,6,10],0-3,3-6,6-10各视为一个区间
 */

library( function () {
	// 遍历区间,提供一个序列输入value的函数
	function foreach( value, block ) {
		var previous = null;
		value( function ( value ) {
			previous && block( previous, value );
			previous = value;
		} );
		block( previous, null );
	}

	exports.foreach = foreach;
} );
