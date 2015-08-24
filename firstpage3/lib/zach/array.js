/**
 * Created by 白 on 2014/12/12.
 */

library( function () {
	var func = imports( "function" ),
		loop = func.loop;

	// 生成一个区间
	function range( arg1, arg2 ) {
		return collect( function ( push ) {
			arg2 === undefined ? loop( arg1, push ) : loop( arg1, arg2, push );
		} );
	}

	// 遍历
	function foreach( array, block, start ) {
		var retVal;
		for ( var i = start || 0, len = array.length; i < len; ++i ) {
			if ( ( retVal = block( array[i], i ) ) !== undefined ) {
				return retVal;
			}
		}
	}

	// set或get顶
	function top( array, val ) {
		if ( val === undefined ) {
			return array[array.length - 1];
		}
		else {
			array[array.length - 1] = val;
		}
	}

	// 从数组中移除项,返回新数组
	function remove( arr, predicate ) {
		var retVal = [];
		foreach( arr, function ( item ) {
			!predicate( item ) && retVal.push( item );
		} );
		return retVal;
	}

	// 过滤,remove的逆向操作
	function filter( arr, predicate ) {
		var retVal = [];
		foreach( arr, function ( item,i ) {
			predicate( item ) && retVal.push( item );
		} );
		return retVal;
	}

	// 从原数组中移除项
	function removeOut( arr, predicate ) {
		var removeIndex = [], count = 0;
		foreach( arr, function ( item, i ) {
			predicate( item ) && removeIndex.push( i );
		} );
		foreach( removeIndex, function ( index ) {
			arr.splice( index - count++, 1 );
		} );
	}

	// 映射
	function map( arg, mapping ) {
		var retVal = [];
		foreach( arg, function ( item, i ) {
			retVal.push( mapping( item, i ) );
		} );
		return retVal;
	}

	// 判断是否包含元素
	function contains( arr, predicate ) {
		for ( var i = 0, len = arr.length; i !== len; ++i ) {
			if ( predicate( arr[i] ) ) {
				return true;
			}
		}
		return false;
	}

	// 逆转数组,返回新数组
	function reverse( arr ) {
		var len = arr.length - 1,
			retVal = len === -1 ? [] : new Array( len );

		foreach( arr, function ( item, i ) {
			retVal[len - i] = item;
		} );

		return retVal;
	}

	// 缝合多个数组
	function zip( arr ) {
		var retVal = [];
		loop( arr[0].length, function ( i ) {
			foreach( arr, function ( list ) {
				retVal.push( list[i] );
			} );
		} );
		return retVal;
	}

	// 归约
	function reduce( arr, func ) {
		if ( arr.length === 1 ) {
			return arr[0];
		}

		var retVal = func( arr[0], arr[1] );
		for ( var i = 2, len = arr.length; i < len; ++i ) {
			retVal = func( retVal, arr[i] );
		}
		return retVal;
	}

	// 寻找第一个符合条件的项
	function findFirst( arr, predicate ) {
		return foreach( arr, function ( item ) {
			if ( predicate( item ) ) {
				return item;
			}
		} );
	}

	// 根据遍历,收集一个数组
	function collect( block ) {
		var retVal = [];
		block( function ( val ) {
			retVal.push( val );
		} );
		return retVal;
	}

	// 连接,主要用于处理arguments
	function concat() {
		var retVal = [];
		foreach( arguments, function ( arr ) {
			foreach( arr, function ( item ) {
				retVal.push( item );
			} );
		} );
		return retVal;
	}

	exports.range = range;
	exports.foreach = foreach;
	exports.top = top;
	exports.remove = remove;
	exports.removeOut = removeOut;
	exports.map = map;
	exports.reverse = reverse;
	exports.zip = zip;
	exports.contains = contains;
	exports.reduce = reduce;
	exports.findFirst = findFirst;
	exports.filter = filter;
	exports.collect = collect;
	exports.concat = concat;
} );