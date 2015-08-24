/**
 * Created by Zuobai on 2014/11/22.
 * 封装经典的2d变换
 */

library( function () {
	var array = imports( "array" ),
		matrix = {
			eye : function () {
				return [1, 0, 0, 1, 0, 0];
			},
			translate : function ( x, y ) {
				return [1, 0, 0, 1, x, y];
			},
			scale : function ( sx, sy ) {
				return [sx, 0, 0, sy, 0, 0];
			},
			rotate : function ( a ) {
				var sin = Math.sin( a ), cos = Math.cos( a );
				return [cos, sin, -sin, cos, 0, 0];
			}
		};

	function isTransformEqual( lhs, rhs ) {
		return lhs[0] === rhs[0] && lhs[1] === rhs[1] && lhs[2] === rhs[2] &&
			lhs[3] === rhs[3] && lhs[4] === rhs[4] && lhs[5] === rhs[5];
	}

	function inverse( m ) {
		var det = m[0] * m[3] - m[1] * m[2];
		return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det];
	}

	function transform( m, p ) {
		return [m[0] * p[0] + m[2] * p[1] + m[4] * p[2], m[1] * p[0] + m[3] * p[1] + m[5] * p[2], p[2]];
	}

	function mul( m, n ) {
		return [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
	}

	function combine() {
		return array.reduce( arguments, mul );
	}

	function origin( transformation, x, y ) {
		return combine( matrix.translate( x, y ), transformation, matrix.translate( -x, -y ) );
	}

	exports.matrix = matrix;
	exports.isTransformEqual = isTransformEqual;
	exports.inverse = inverse;
	exports.transform = transform;
	exports.combine = combine;
	exports.origin = origin;
} );