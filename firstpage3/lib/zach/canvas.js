/**
 * Created by Zuobai on 2014/7/12.
 * zachCanvas 2d GUI系统
 */

library( function () {
	// 引入
	var object = imports( "object" ),
		insert = object.insert,
		z2d = imports( "2d" ),
		matrix = z2d.matrix,
		combine = z2d.combine;

	// 强化版gc
	function Context2D( gc ) {
		var prepare = [1, 0, 0, 1, 0, 0],
			cur = [1, 0, 0, 1, 0, 0],
			transformStack = [];

		// 设置矩阵
		function s() {
			var r = combine( prepare, cur );
			gc.setTransform( r[0], r[1], r[2], r[3], r[4], r[5] );
		}

		// 在当前基础上进行转换
		function t( m ) {
			cur = combine( cur, m );
			s();
		}

		// 几个经典转换
		function ClassicTransform( genFunc ) {
			return function () {
				t( genFunc.apply( null, arguments ) );
			}
		}

		return insert( gc, {
			// 该方法用于设置一个预矩阵,解决dpr变换
			setPrepareTransform : function ( m ) {
				prepare = m;
				s();
			},
			transform : function () {
				t( arguments );
			},
			getTransform : function () {
				return [cur[0], cur[1], cur[2], cur[3], cur[4], cur[5]];
			},
			save : function () {
				CanvasRenderingContext2D.prototype.save.call( gc );
				transformStack.push( cur );
			},
			restore : function () {
				CanvasRenderingContext2D.prototype.restore.call( gc );
				cur = transformStack.pop();
				s();
			},
			translate : ClassicTransform( matrix.translate ),
			rotate : ClassicTransform( matrix.rotate ),
			scale : ClassicTransform( matrix.scale )
		} );
	}

	function Canvas() {
		var canvas = document.createElement( "canvas" ),
			gc = canvas.gc = Context2D( canvas.getContext( "2d" ) ),
			dpr = 1;

		canvas.style.setProperty( "display", "block", "" );

		// dpr属性
		object.defineAutoProperty( canvas, "dpr", {
			value : ( window.devicePixelRatio || 1 ) / ( gc.webkitBackingStorePixelRatio || gc.mozBackingStorePixelRatio ||
			gc.msBackingStorePixelRatio || gc.oBackingStorePixelRatio || gc.backingStorePixelRatio || 1 ),
			set : function ( val ) {
				gc.dpr = dpr = val;
				gc.setPrepareTransform( matrix.scale( val, val ) );
			}
		} );

		return insert( canvas, {
			// 调整大小
			resize : function ( width, height ) {
				canvas.width = width * canvas.dpr;
				canvas.height = height * canvas.dpr;
				canvas.style.setProperty( "width", ( canvas.logicalWidth = width ) + "px", "" );
				canvas.style.setProperty( "height", ( canvas.logicalHeight = height ) + "px", "" );
				canvas.dpr = dpr;
			}
		} );
	}

	module.exports = Canvas;
} );