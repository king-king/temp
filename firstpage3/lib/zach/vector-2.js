/**
 * Created by 白 on 2015/6/4.
 * 二维向量
 */

library( function () {
	// 垂直向量
	function vertical( vector ) {
		var x1 = vector[0], y1 = vector[1],
			y2 = x1 === 0 ? 0 : Math.sqrt( 1 / ( 1 + y1 * y1 / x1 * x1 ) ),
			x2 = x1 === 0 ? x1 > 0 ? 1 : -1 : -y1 * y2 / x1;

		return [x2, y2];
	}

	function cross( v1, v2 ) {
		return ( v1[0] * v2[1] - v2[0] * v1[1] ) > 0 ? 1 : -1;
	}

	// 求向量的模
	function norm( vector ) {
		var x = vector[0], y = vector[1];
		return Math.sqrt( x * x + y * y );
	}

	// 计算两个线段的锐旋转角
	function rotation( v1, v2 ) {
		// 计算和y轴夹角
		function yAngle( v ) {
			return 180 - ( Math.atan2( v[0], v[1] ) / Math.PI * 180 + 180 ) % 180
		}

		var angle = ( yAngle( v2 ) - yAngle( v1 ) + 180 ) % 180;
		return angle >= 90 ? angle - 180 : angle;
	}

	// 点乘
	function dot( v1, v2 ) {
		return v1[0] * v2[0] + v1[1] * v2[1];
	}

	// 夹角
	function includedAngle( v1, v2 ) {
		return Math.acos( dot( v1, v2 ) / ( norm( v1 ) * norm( v2 ) ) );
	}

	exports.vertical = vertical;
	exports.cross = cross;
	exports.norm = norm;
	exports.rotation = rotation;
	exports.dot = dot;
	exports.includedAngle = includedAngle;
} );