/**
 * Created by 白 on 2015/4/16.
 */

library( function () {
	var func = imports( "function" ),
		array = imports( "array" ),
		object = imports( "object" ),

		table = [24, 14, 108, 51, 101, 49, 48, 85, 81, 41,
			70, 99, 106, 88, 50, 102, 43, 64, 47, 7,
			26, 90, 31, 39, 19, 2, 89, 0, 3, 1,
			36, 67, 13, 73, 97, 23, 65, 86, 95, 37,
			80, 11, 59, 107, 29, 96, 60, 6, 66, 9,
			42, 93, 46, 5, 45, 78, 103, 54, 77, 40,
			68, 74, 35, 53, 18, 94, 16, 21, 28, 72,
			61, 87, 17, 38, 56, 58, 82, 79, 83, 57,
			27, 63, 92, 8, 30, 10, 33, 55, 44, 98,
			22, 71, 52, 75, 25, 32, 62, 15, 84, 34,
			20, 104, 12, 100, 109, 76, 4, 69, 105, 91],
		length = table.length;

	function Random( seed ) {
		var random = seed === undefined ? function () {
			return Math.random();
		} : function () {
			var count = seed % length;
			return function () {
				var result = table[( ++count % length )] / length;
				return result;
			};
		}();

		return object.insert( random, {
			select : function ( array ) {
				return array[random() * array.length << 0];
			},
			arrange : function ( array ) {
				var result = [],
					len = array.length;

				// 复制一个副本
				array = array.map( function ( t ) {
					return t;
				} );

				func.loop( len, function ( i ) {
					i = len - i - 1;
					var select = random() * i << 0;
					result.push( array[select] );
					array[select] = array[i];
				} );

				return result;

			}
		} );
	}

	module.exports = object.insert( Random(), {
		Random : Random
	} );
} );