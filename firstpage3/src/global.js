/**
 * Created by 白 on 2015/6/10.
 * 全局函数
 */

var onPointerDown = function () {
	},
	onPointerMove = function () {
	},
	onPointerUp = function () {
	},
	onSwipe = function () {
	},
	onSwipeStart = function () {
	},
	onLongPress = function () {
	},
	onTap = function () {
	},
	onTapUp = function () {
	},
	Lock = function () {
	},
	alert = function () {
	},

	preventBodyEvent = false,
	preventDrag = false;

library( function () {
	var $ = imports( "element" ),
		object = imports( "object" ),
		pointer = imports( "pointer.js" ),
		onMoveUp = pointer.onMoveUp,
		async = imports( "async" ),
		array = imports( "array" ),
		css = imports( "css" ),

		outRange = 10,
		tapTrig = false,
		longPressDuration = 500,
		inDown = 0,
		removeHandles = [];

	pointer.onPointerDown( document, function ( event ) {
		if ( inDown === 0 ) {
			inDown = 1;
		}
		else if ( inDown === 1 ) {
			inDown = 2;
			event.preventDefault();
		}
		else {
			event.preventDefault();
		}
	}, true );

	pointer.onPointerUp( document, function () {
		array.foreach( removeHandles, function ( removeHandle ) {
			removeHandle.remove();
		} );
		inDown = 0;
		removeHandles = [];
	}, true );

	onPointerDown = function ( el, response ) {
		el.style && css( el, "pointer-events", "auto" );
		return pointer.onPointerDown( el, function ( event ) {
			var removeHandle = $.bind( event.origin.target, "DOMNodeRemovedFromDocument", function () {
				removeHandle.remove();
				inDown = 0;
			} );
			removeHandles.push( removeHandle );

			if ( inDown !== 2 ) {
				response( event );
			}
		} );
	};
	onPointerMove = pointer.onPointerMove;
	onPointerUp = pointer.onPointerUp;

	function PointerTrack() {
		var dX = 0,
			dY = 0,
			info = {
				track : function ( event ) {
					dX += event.dX;
					dY += event.dY;

					var x = Math.abs( dX ) > outRange,
						y = Math.abs( dY ) > outRange;

					info.dX = dX;
					info.dY = dY;
					info.xOut = x;
					info.yOut = y;
					info.out = x || y;
				}
			};

		return info;
	}

	onSwipe = function ( response, hasTimeout ) {
		var pointerTrack = PointerTrack(),
			checkHandle = onMoveUp( {
				onMove : function ( event ) {
					pointerTrack.track( event );
					if ( pointerTrack.out ) {
						checkHandle.remove();
						response && response( {
							xOut : pointerTrack.xOut,
							yOut : pointerTrack.yOut,
							dX : pointerTrack.dX,
							dY : pointerTrack.dY
						} );
					}
				},
				onUp : function () {
					timeout && clearTimeout( timeout );
				}
			} ),
			timeout = hasTimeout ? null : setTimeout( function () {
				inDown = 0;
				checkHandle.remove();
			}, longPressDuration );

		return {
			remove : function () {
				checkHandle.remove();
				timeout && clearTimeout( timeout );
			}
		};
	};

	onSwipeStart = function ( el, response ) {
		return onPointerDown( el, function () {
			onSwipe( response );
		} );
	};

	onPointerUp( document, function () {
		tapTrig = false;
		preventBodyEvent = false;
		preventDrag = false;
	} );

	onTapUp = function ( response ) {
		var pointerTrack = PointerTrack(),

			tapHandle = onPointerUp( document.documentElement, function ( event ) {
				if ( !tapTrig ) {
					response && response( event );
					tapTrig = true;
				}
			} ),

			timeout = setTimeout( function () {
				tapHandle.remove();
				checkHandle.remove();
			}, longPressDuration ),

			checkHandle = onMoveUp( {
				onMove : function ( event ) {
					pointerTrack.track( event );
					if ( pointerTrack.out ) {
						clear();
					}
				},
				onUp : clear
			} );

		function clear() {
			checkHandle.remove();
			clearTimeout( timeout );
			tapHandle.remove();
		}

		return {
			remove : clear
		};
	};

	onTap = function ( el, response ) {
		return onPointerDown( el, function () {
			onTapUp( response );
		} );
	};

	onLongPress = function ( response ) {
		var pointerTrack = PointerTrack(),

			timeout = setTimeout( function () {
				checkHandle.remove();
				response && response();
			}, longPressDuration ),
			checkHandle = onMoveUp( {
				onMove : function ( event ) {
					pointerTrack.track( event );
					if ( pointerTrack.out ) {
						clear();
					}
				},
				onUp : clear
			} );

		function clear() {
			checkHandle.remove();
			clearTimeout( timeout );
		}

		return {
			remove : clear
		};
	};

	// 锁定屏幕,不接受鼠标动作
	Lock = function ( el ) {
		el = el || document.documentElement;
		el.classList.add( "lock" );

		return {
			remove : function () {
				el.classList.remove( "lock" );
			}
		};
	};

	// 弹出消息
	alert = function () {
		var msgBox, msg;

		return function ( text, delay ) {
			// 第一次弹出消息时创建消息框
			if ( !msgBox ) {
				msgBox = $( "div.msg-box", {
					css : {
						bottom : css.px( ua.chuyeList ? 80 : 40 )
					}
				}, document.body );
				msg = $( "div.msg", msgBox );
			}

			msg.innerHTML = text;
			$.classList( msgBox ).remove( "remove" ).add( "show" );

			async.once( function () {
				$.classList( msgBox ).add( "remove" ).remove( "show" );
			}, function ( removeMsg ) {
				return [onPointerDown( document, removeMsg ), async.setTimeout( removeMsg, delay || 2000 )];
			} );
		};
	}();
} );