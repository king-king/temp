/**
 * Created by 白 on 2014/10/13.
 * 形状相关的组件
 */

library( function () {
	var $ = imports( "element" ),
		css = imports( "css" ),
		px = css.px;

	// 矩形,如未提供颜色,就是一个空矩形
	Content.Rect = function ( width, height, color ) {
		return {
			width : width,
			height : height,
			element : function () {
				return $( "div", {
					css : {
						background : color || "transparent"
					}
				} );
			},
			draw : function ( gc ) {
				if ( color ) {
					gc.fillStyle = color;
					gc.fillRect( 0, 0, width, height );
				}
			}
		};
	};

	// 圆形
	Content.Circle = function ( r, color ) {
		return {
			width : r * 2,
			height : r * 2,
			element : function () {
				return $( "div", {
					css : {
						"border-radius" : px( r ),
						background : color || "transparent"
					}
				} );
			},
			draw : function ( gc ) {
				if ( color ) {
					gc.save();
					gc.beginPath();
					gc.arc( r, r, r, 0, 2 * Math.PI );
					gc.closePath();
					gc.fillStyle = color;
					gc.fill();
					gc.restore();
				}
			}
		}
	};
} );