/**
 * Created by 白 on 2015/2/28.
 * 封装经典ip计算
 */

library( function () {
	var util = imports( "util" ),
		array = imports( "array" );

	function isValid( ip ) {
		return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test( ip );
	}

	// 进制转换,将一个整数转化为位数组
	function convert( val, base ) {
		var parts = [];
		while ( val ) {
			parts.push( val % base );
			val = Math.floor( val / base );
		}

		return array.reverse( parts );
	}

	// 计算位数组对应的数
	function sum( arr, base ) {
		var sum = 0;
		util.loopArray( arr, function ( part ) {
			sum = sum * base + parseInt( part );
		} );
		return sum;
	}

	function toInt( ip ) {
		if ( !isValid( ip ) ) {
			throw new Error( "invalid ip" );
		}

		return sum( ip.split( "." ), 256 );
	}

	function fromInt( val ) {
		if ( val !== Math.floor( val ) || val < 0 || val > 256 * 256 * 256 * 256 - 1 ) {
			throw new Error( "invalid ip" );
		}

		return convert( val, 256 ).join( "." );
	}

	function and( ip, mask ) {
		var base = 256 * 256;
		ip = convert( toInt( ip ), base );
		mask = convert( toInt( mask ), base );
		return fromInt( sum( [ip[0] & mask[0], ip[1] & mask[1]], base ) );
	}

	function inSameSubnet( ip, mask, gateway ) {
		return and( ip, mask ) === and( gateway, mask );
	}

	exports.isValid = isValid;
	exports.toInt = toInt;
	exports.fromInt = fromInt;
	exports.and = and;
	exports.inSameSubnet = inSameSubnet;
} );
