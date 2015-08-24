/**
 * Created by WQ on 2015/5/22.
 * 缩放元素使它可以全部显示
 */

library( function () {
	var math = imports( "math" ),
		array = imports( "array" ),
		Layout = imports( "./layout" ),
		z2d = imports( "2d" );

	function inRange( n, num1, num2 ) {
		return n >= Math.min( num1, num2 ) && n <= Math.max( num1, num2 );
	}

	// 缩放一个元素
	function process( comp ) {
		var w = comp.width, h = comp.height, matrix = Layout.getPageMatrix( comp ), // 宽高和矩阵
			pc = z2d.transform( matrix, [w / 2, h / 2, 1] ), xc = pc[0], yc = pc[1], // 重新坐标
			r = Math.sqrt( w * w + h * h ) / 2, // 半径
			scales = []; // 缩放数组

		if ( !inRange( xc, 0, clientWidth ) || !inRange( yc, 0, clientHeight ) ) {
			return 1;
		}

		array.foreach( [[0, 0], [w, 0], [w, h], [0, h]], function ( p ) {
			p = z2d.transform( matrix, p.concat( 1 ) );
			var xp = p[0], yp = p[1];

			array.foreach( [[0, 0, 1, 0], [0, 0, 0, 1], [1, 1, 0, 1], [1, 1, 1, 0]], function ( info ) {
				var x1 = info[0] * clientWidth, y1 = info[1] * clientHeight, x2 = info[2] * clientWidth, y2 = info[3] * clientHeight,
					denominator = ( yp - yc ) * ( x2 - x1 ) - ( xc - xp ) * ( y1 - y2 ),
					x = ( ( xp - xc ) * ( x2 - x1 ) * ( y1 - yc ) + ( yp - yc ) * ( x2 - x1 ) * xc - ( y2 - y1 ) * ( xp - xc ) * x1 ) / denominator,
					y = -( ( yp - yc ) * ( y2 - y1 ) * ( x1 - xc ) + ( xp - xc ) * ( y2 - y1 ) * yc - ( x2 - x1 ) * ( yp - yc ) * y1 ) / denominator;

				if ( denominator !== 0 && inRange( x, xp, xc ) && inRange( x, x1, x2 ) && inRange( y, yp, yc ) && inRange( y, y1, y2 ) ) {
					scales.push( math.distance( x - xc, y - yc ) / r );
					return true;
				}
			} );
		} );

		return scales.length === 0 ? 1 : Math.min.apply( this, scales );
	}

	module.exports = process;
} );