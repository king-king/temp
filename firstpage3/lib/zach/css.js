/**
 * Created by Zuobai on 2015/3/15.
 * 封装经典css操作
 */

library( function () {
	var object = imports( "object" ),
		is = object.is,

		string = imports( "string" ),
		tuple = string.tuple,

		array = imports( "array" ),

		LinkedList = imports( "linked-list" );

	// region css
	// 测试某个样式是否有效
	var test = function () {
		if ( window.CSS && CSS.supports ) {
			return function ( styleName, styleValue ) {
				return CSS.supports( styleName, styleValue );
			};
		}
		else {
			var testElement = document.createElement( "div" );

			return function ( styleName, styleValue ) {
				testElement.removeAttribute( "style" );
				testElement.style.setProperty( styleName, styleValue, "" );
				return testElement.hasAttribute( "style" );
			};
		}
	}();

	function testPrefix( styleName, styleValue ) {
		return array.findFirst( ["", "-webkit-", "-ms-", "-moz-", "-o-"], function ( prefix ) {
			return test( prefix + styleName, styleValue );
		} );
	}

	// 测试某个样式的样式名(找前缀)
	var testStyleName = function () {
		var prefix = "";

		return function ( styleName, styleValue ) {
			return ( prefix ? test( prefix + styleName, styleValue ) ? prefix : "" : ( prefix = testPrefix( styleName, styleValue ) ) ) + styleName;
		};
	}();

	// 设置样式
	function css( el, arg1, arg2 ) {
		function setStyle( styleName, styleValue ) {
			if ( styleValue == null ) {
				remove( el, styleName );
			}
			else {
				if ( is.Number( styleValue ) ) {
					styleValue = n( styleValue );
				}
				el.style.setProperty( testStyleName( styleName, styleValue ), styleValue, "" );
			}
		}

		is.String( arg1 ) ? setStyle( arg1, arg2 ) : object.foreach( arg1, setStyle );

		return {
			element : el,
			remove : function () {
				remove( el, arg1 );
			}
		};
	}

	// 生成CSS样式字符串
	function ruleString( cssStyles ) {
		var ruleText = "";
		object.foreach( cssStyles, function ( styleName, styleValue ) {
			ruleText += testStyleName( styleName, styleValue.toString().replace( "!important", "" ) ) + ":" + styleValue + ";";
		} );
		return ruleText;
	}

	// 移除CSS值,可以移除一条,或者移除一组
	function remove( el, arg ) {
		function removeStyle( styleName ) {
			array.foreach( ["", "-webkit-", "-ms-", "-moz-", "-o-"], function ( prefix ) {
				el.style.removeProperty( prefix + styleName );
			} );
		}

		is.String( arg ) ? removeStyle( arg ) : is.Object( arg ) ? object.foreach( arg, removeStyle ) : object.foreach( arg, removeStyle );
		return el;
	}

	// 添加CSS规则
	var insertCSSRule = function () {
		var userSheet = LinkedList(), systemSheet = LinkedList();
		return function ( ruleText, isSystem ) {
			var styleSheet = isSystem ? systemSheet : userSheet; // 选择样式链表

			// 如果节点尚未创建,创建节点,系统样式表在所有样式表的最前,用户样式表在所有样式表的最后
			if ( styleSheet.el === undefined ) {
				styleSheet.el = document.head.insertBefore( document.createElement( "style" ), isSystem ? document.head.firstChild : null );
			}

			// 创建新规则,位置上最后规则+1
			var lastRule = styleSheet.tail(),
				newRule = LinkedList.push( styleSheet, lastRule === null ? 0 : lastRule.value + 1 );

			styleSheet.el.sheet.insertRule( ruleText, newRule.value );

			return {
				remove : function () {
					// 后面所有元素的位置-1
					var pos = newRule.value;
					for ( var curNode = newRule.next; curNode !== null; curNode = curNode.next ) {
						curNode.value = pos++;
					}

					// 移除节点并删除规则
					styleSheet.remove( newRule );
					styleSheet.el.sheet.deleteRule( pos );
				}
			};
		}
	}();

	// 添加一组css规则
	function insertCSSRules( arg1, arg2, arg3 ) {
		function insertRules( selector, styles, isSystem ) {
			var cssText = is.String( styles ) ? styles : ruleString( styles );
			return insertCSSRule( selector + " {" + cssText + "}", isSystem );
		}

		if ( is.String( arg1 ) ) {
			return insertRules( arg1, arg2, arg3 );
		}
		else {
			var list = [];
			object.foreach( arg1, function ( selector, styles ) {
				list.push( insertRules( selector, styles, arg2 ) );
			} );

			return {
				remove : function () {
					array.foreach( list, function ( handle ) {
						handle.remove();
					} );
				}
			};
		}
	}

	// 值,防止值太小时,转换成字符串使用指数表示法
	function n( n ) {
		return Math.round( n * 100000 ) / 100000;
	}

	function px( value ) {
		return value === 0 ? 0 : ( n( value ) << 0 ) + "px";
	}

	function deg( value ) {
		return value === 0 ? 0 : n( value ) + "deg";
	}

	function Rotate( name ) {
		return function ( val ) {
			return tuple( name, [deg( val )] );
		};
	}

	css.ruleString = ruleString;
	css.test = test;
	css.testPrefix = testPrefix;
	css.testStyleName = testStyleName;
	css.remove = remove;
	css.insertRule = insertCSSRule;
	css.insertRules = insertCSSRules;

	css.px = px;
	css.deg = deg;

	css.full = function ( style ) {
		return object.extend( {
			position : "absolute",
			left : 0,
			right : 0,
			top : 0,
			bottom : 0
		}, style || {} );
	};

	css.size = function ( el, width, height ) {
		css( el, {
			width : px( width ),
			height : px( height )
		} );
	};

	css.transform = function () {
		var style = [];
		array.foreach( arguments, function ( transform, i ) {
			i !== 0 && style.push( transform );
		} );
		css( arguments[0], "transform", style.join( " " ) );
	};

	css.matrix = function ( m ) {
		return tuple( "matrix", array.map( m, n ) );
	};

	css.matrix3d = function ( m ) {
		return tuple( "matrix3d", array.map( m, n ) );
	};

	css.translate = function ( x, y, z ) {
		return tuple( "translate3d", array.map( [x, y, z], function ( value ) {
			return css.px( value );
		} ) );
	};

	css.rotateX = Rotate( "rotateX" );
	css.rotateY = Rotate( "rotateY" );
	css.rotateZ = Rotate( "rotateZ" );

	css.scale = function () {
		return "scale(" + Array.prototype.join.call( arguments, "," ) + ")";
	};

	css.s = function ( value ) {
		return n( value ) + "s";
	};

	css.url = function ( url ) {
		return tuple( "url", [url] );
	};

	css.bezier = function ( arg ) {
		return tuple( "cubic-bezier", arg );
	};

	module.exports = css;
	// endregion
} );
