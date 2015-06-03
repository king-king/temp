/**
 * Created by 白 on 2014/12/12.
 */

library( function () {
	var array = imports( "array" );

	// 遍历字符串
	function foreach( string, func ) {
		var i, len;
		for ( i = 0, len = string.length; i !== len; ++i ) {
			func( string.charAt( i ) );
		}
	}

	// 将一个元组转化为字符串
	function tuple( tupleName, list ) {
		return tupleName + "(" + list.join( "," ) + ")";
	}

	// 驼峰连接
	function camelcaseJoin( list ) {
		var result = "";
		array.foreach( list, function ( unit ) {
			result += result === "" ? unit : unit.replace( /(.)/, function () {
				return RegExp.$1.toUpperCase();
			} );
		} );
		return result;
	}

	// 根据format制作字符串
	function format( format, content ) {
		var i = 0, ch, key = null, retVal = "";

		ch = format.charAt( i++ );
		while ( ch ) {
			if ( key === null ) {
				if ( ch === "%" ) {
					key = "";
				}
				else {
					retVal += ch;
				}
			}
			else {
				if ( ch === "%" ) {
					if ( key === "" ) {
						retVal += "%";
					}
					else {
						retVal += content[key] || "";
					}
					key = null;
				}
				else {
					key += ch;
				}
			}
			ch = format.charAt( i++ );
		}

		return retVal;
	}

	exports.foreach = foreach;
	exports.format = format;
	exports.tuple = tuple;
	exports.camelcaseJoin = camelcaseJoin;
} );