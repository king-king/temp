/**
 * Created by Zuobai on 2015/3/15.
 * 对象有关的函数
 */

library( function () {
	var array = imports( "array" ),
		func = imports( "function" );

	// 遍历对象
	function foreach( obj, block ) {
		var retVal;
		for ( var key in obj ) {
			if ( ( retVal = block( key, obj[key] ) !== undefined ) ) {
				return retVal;
			}
		}
	}

	// 收集
	function collect( func ) {
		var obj = {};
		func( function ( key, value ) {
			obj[key] = value;
		} );
		return obj;
	}

	// 默认值
	function defaultValue( val, defaultValue ) {
		return val === undefined ? defaultValue : val;
	}

	// 将多个对象的字段加入到第一个字段中,并返回第一个对象
	function merge( outObj, inObjList ) {
		array.foreach( inObjList, function ( obj ) {
			foreach( obj, function ( key, value ) {
				value !== undefined && ( outObj[key] = value );
			} );
		} );
		return outObj;
	}

	// 将若干个对象合并到第一个对象中,并返回第一个对象
	function insert( obj ) {
		return merge( obj, Array.prototype.slice.call( arguments, 1 ) );
	}

	// 将若干个对象合并,返回合并后的新对象
	function extend() {
		var retVal = {};
		return merge( retVal, arguments );
	}

	// 从obj中取出defaultObj中的字段,如果obj中没有这个字段,使用defaultObj的值
	function extract( obj, defaultObj ) {
		var retVal = {};
		array.foreach( defaultObj, function ( key, val ) {
			retVal[key] = defaultValue( obj[key], val );
		} );
		return retVal;
	}

	// 集合,根据一个数组构建一个集合,用来判断一个key是否属于集合
	function collection( arr ) {
		var dict = {};
		array.foreach( arr, function ( item ) {
			dict[item] = true;
		} );

		return {
			contains : function ( key ) {
				return dict[key] === true;
			}
		};
	}

	// 返回一个字典的key数组
	function keys( obj ) {
		var retVal = [];
		foreach( obj, function ( key ) {
			retVal.push( key );
		} );
		return retVal;
	}

	// 从obj中移除字段,返回移除后的新对象
	function exclude( obj, fieldList ) {
		var fieldSet = collection( fieldList ),
			retVal = {};

		foreach( obj, function ( key, value ) {
			!fieldSet.contains( key ) && ( retVal[key] = value );
		} );

		return retVal;
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

	// 定义getter
	function defineGetter( obj, arg1, arg2 ) {
		func.callWith( function ( def ) {
			is.String( arg1 ) ? def( arg1, arg2 ) : foreach( arg1, def );
		}, function ( name, func ) {
			Object.defineProperty( obj, name, {
				enumerable : true,
				get : func
			} );
		} );
		return obj;
	}

	// 定义自动对象
	function defineAutoProperty( obj, arg1, arg2 ) {
		func.callWith( function ( def ) {
			is.String( arg1 ) ? def( arg1, arg2 ) : foreach( arg1, def );
		}, function ( name, arg ) {
			arg = arg || {};
			var val = arg.value, write = arg.set;
			val !== undefined && write( val );

			Object.defineProperty( obj, name, {
				enumerable : true,
				get : function () {
					return val;
				},
				set : function ( tVal ) {
					val = write ? defaultValue( write( tVal ), tVal ) : tVal;
				}
			} );
		} );
	}

	exports.foreach = foreach;
	exports.collect = collect;

	exports.defaultValue = defaultValue;
	exports.insert = insert;
	exports.extend = extend;
	exports.extract = extract;
	exports.exclude = exclude;

	exports.collection = collection;
	exports.keys = keys;

	exports.is = is;

	exports.defineGetter = defineGetter;
	exports.defineAutoProperty = defineAutoProperty;
} );
