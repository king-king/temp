/**
 * Created by Zuobai on 2015/3/15.
 * 封装元素
 */

library( function () {
	var object = imports( "object" ),
		is = object.is,
		array = imports( "array" ),
		css = imports( "css" );

	// 创建一个元素
	function element( arg1, arg2, arg3 ) {
		var el, elementArg = {}, parent = arg3;

		// 如果是<div></div>这种形式,直接制作成元素
		if ( is.String( arg1 ) ) {
			if ( arg1.charAt( 0 ) === "<" ) {
				el = document.createElement( "div" );
				el.innerHTML = arg1;
				el = el.firstElementChild;
			}
			// 否则是div.class1.class2#id这种形式
			else {
				var classIdReg = /([.#][^.#]*)/g, classId;
				el = document.createElement( arg1.split( /[#.]/ )[0] );
				while ( classId = classIdReg.exec( arg1 ) ) {
					classId = classId[0];
					classId.charAt( 0 ) === "#" ? el.id = classId.substring( 1 ) : el.classList.add( classId.substring( 1 ) );
				}
			}
		}
		else {
			el = arg1;
		}

		// 参数2是字符串,作为innerHTML
		if ( is.String( arg2 ) ) {
			el.innerHTML = arg2;
		}
		// 是对象的话,每个字段处理
		else if ( is.Object( arg2 ) ) {
			elementArg = arg2;
		}
		// 如果是数组,视为子元素
		else if ( is.Array( arg2 ) ) {
			elementArg.children = arg2;
		}
		// 否则视为父元素
		else {
			parent = arg2;
		}

		elementArg && object.foreach( elementArg, function ( key, value ) {
			if ( value !== undefined ) {
				switch ( key ) {
					case "classList":
						if ( is.String( value ) ) {
							el.classList.add( value );
						}
						else if ( is.Array( value ) ) {
							array.foreach( value, function ( className ) {
								el.classList.add( className );
							} );
						}
						break;
					case "css":
						css( el, value );
						break;
					case "children":
						if ( is.Array( value ) ) {
							array.foreach( value, function ( node ) {
								el.appendChild( node );
							} );
						}
						else {
							el.appendChild( value );
						}
						break;
					default:
						if ( key.substring( 0, 5 ) === "data-" ) {
							el.setAttribute( key, value );
						}
						else {
							el[key] = value;
						}
						break;
				}
			}
		} );

		parent && parent.appendChild( el );
		return el;
	}

	// 绑定事件
	function bind( el, eventType, response, isCapture ) {
		var remove;

		if ( el.addEventListener ) {
			el.addEventListener( eventType, response, isCapture || false );
			remove = function () {
				el.removeEventListener( eventType, response, isCapture || false );
			};
		}
		else {
			el.attachEvent( "on" + eventType, response );
			remove = function () {
				el.detachEvent( "on" + eventType, response );
			};
		}

		return {
			func : response,
			remove : remove
		};
	}

	// 从文档中移除元素
	function remove( node ) {
		node && node.parentNode && node.parentNode.removeChild( node );
	}

	// 链式操作class
	function classList( el ) {
		return {
			add : function ( className ) {
				el.classList.add( className );
				return classList( el );
			},
			remove : function ( className ) {
				el.classList.remove( className );
				return classList( el );
			}
		};
	}

	// 沿着一个元素向上冒泡,直到root/document,回调每个节点
	function bubble( el, func, root ) {
		var val;
		while ( el !== null && el !== document && el !== root ) {
			if ( val = func( el ) ) {
				return val;
			}
			el = el.parentNode;
		}
	}

	// 当一个事件冒泡到document时,回调冒泡中的每个节点
	function onBubble( eventName, response ) {
		document.addEventListener( eventName, function ( event ) {
			bubble( event.target, function ( node ) {
				response( node, event.target );
			}, document.documentElement );
		}, false );
	}

	// 寻找祖先节点
	function findAncestor( el, func ) {
		return bubble( el, function ( el ) {
			if ( func( el ) ) {
				return el;
			}
		} );
	}

	// 当元素插入到文档时回调
	function onInsert( el, response ) {
		if ( document.documentElement.contains( el ) ) {
			response && response();
		}
		else {
			if ( ua.ie && window.MutationObserver ) {
				var observer = new MutationObserver( function ( mutations ) {
					array.foreach( mutations, function ( mutation ) {
						return array.foreach( mutation.addedNodes || [], function ( node ) {
							if ( node === el ) {
								observer.disconnect();
								response && response( el );
								return true;
							}
						} );
					} );
				} );

				//noinspection JSCheckFunctionSignatures
				observer.observe( document.documentElement, {
					childList : true,
					subtree : true
				} );
			}
			else {
				var insertEvent = bind( el, "DOMNodeInsertedIntoDocument", function () {
					response && response( el );
					insertEvent.remove();
				} );
			}
		}
	}

	module.exports = element;
	element.bind = bind;
	element.remove = remove;
	element.classList = classList;
	element.bubble = bubble;
	element.onBubble = onBubble;
	element.findAncestor = findAncestor;
	element.onInsert = onInsert;
} );
