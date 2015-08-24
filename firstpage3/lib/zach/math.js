/**
 * Created by 白 on 2014/11/28.
 */

library( function () {
	// 符号函数
	function sign( x ) {
		return x >= 0 ? 1 : -1;
	}

	// 判断一个点是否在一个矩形之内
	function inRect( tx, ty, x, y, width, height ) {
		tx -= x;
		ty -= y;
		return tx >= 0 && tx < width && ty >= 0 && ty < height;
	}

	// 如果x>b,取b,x小于a,取啊
	function range( x, a, b ) {
		if ( a <= b ) {
			return x < a ? a : x > b ? b : x;
		}
		else {
			return range( x, b, a );
		}
	}

	// 判断是否在区间
	function inRange( x, a, b ) {
		if ( a <= b ) {
			return x >= a && x < b;
		}
		else {
			return inRange( x, b, a );
		}
	}

	// 计算(x,y)到(0,0)的距离
	function distance( x, y ) {
		return Math.sqrt( x * x + y * y );
	}

	// 求两个边的正弦
	function sin2( x, y ) {
		return x / distance( x, y );
	}

	// 生成贝塞尔曲线函数
	function Bezier( x1, y1, x2, y2, func ) {
		var xTolerance = 0.0001,
			retVal = func || function ( xTarget ) {
					function bezier( t, p1, p2 ) {
						var ct = 1 - t, ct2 = ct * ct,
							t2 = t * t, t3 = t2 * t,
							tct2 = t * ct2, t2ct = t2 * ct;
						return 3 * p1 * tct2 + 3 * p2 * t2ct + t3;
					}

					function bezierD( t, p1, p2 ) {
						return ( 9 * p1 - 9 * p2 + 3 ) * t * t + ( 6 * p2 - 12 * p1 ) * t + 3 * p1;
					}

					var t = 0.5;
					while ( Math.abs( xTarget - bezier( t, x1, x2 ) ) > xTolerance ) {
						t = t - ( bezier( t, x1, x2 ) - xTarget ) / bezierD( t, x1, x2 );
					}

					return bezier( t, y1, y2 );
				};

		retVal.arg = [x1, y1, x2, y2];
		return retVal;
	}

	exports.sign = sign;
	exports.inRect = inRect;
	exports.range = range;
	exports.inRange = inRange;
	exports.distance = distance;
	exports.sin2 = sin2;
	exports.Bezier = Bezier;
} );