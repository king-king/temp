/**
 * Created by 白 on 2015/5/12.
 */

library( function () {
	var css = imports( "css" ),
		ua = imports( "ua" ),
		lastX, lastY, curX, curY;

	// 获取不同设备的点事件时间名
	function eventName( names ) {
		return names[ua.ie ? 2 : ua.touch ? 1 : 0];
	}

	var moveName = eventName( ["mousemove", "touchmove", "MSPointerMove"] ),
		downName = eventName( ["mousedown", "touchstart", "MSPointerDown"] ),
		upName = eventName( ["mouseup", "touchend", "MSPointerUp"] );

	function bind( el, type, listener, inCapturePhase ) {
		el.addEventListener( type, listener, inCapturePhase );

		return {
			remove : function () {
				el.removeEventListener( type, listener, inCapturePhase );
			}
		};
	}

	// 获取事件中的字段,如果有touch,返回touch的,没有返回全局的
	function EventGet( fieldName ) {
		return function ( event ) {
			return event.touches && event.touches[0] ? event.touches[0][fieldName] : event[fieldName];
		};
	}

	var getPageX = EventGet( "pageX" ),
		getPageY = EventGet( "pageY" );

	bind( document, downName, function ( event ) {
		curX = getPageX( event );
		curY = getPageY( event );
	} );

	bind( document, moveName, function ( event ) {
		var newX = getPageX( event ), newY = getPageY( event );
		lastX = curX || newX;
		lastY = curY || newY;
		curX = newX;
		curY = newY;
	}, true );

	function onPointerDown( el, response ) {
		return bind( el, downName, function ( event ) {
			response( {
				x : curX,
				y : curY
			}, event );
		} );
	}

	function onPointerMove( el, response ) {
		return bind( el, moveName, function ( event ) {
			response( {
				x : curX,
				y : curY,
				dX : curX - lastX,
				dY : curY - lastY
			}, event );
		} );
	}

	function onPointerUp( el, response ) {
		return bind( el, upName, function ( event ) {
			response( {
				x : curX,
				y : curY
			}, event );
		} );
	}

	function onMoveUp( arg ) {
		var moveHandle = onPointerMove( document, function ( event ) {
			arg.onMove && arg.onMove( event );
		} );

		var upHandle = onPointerUp( document, function ( event ) {
			moveHandle.remove();
			upHandle.remove();
			arg.onUp && arg.onUp( event );
		} );

		return {
			remove : function () {
				moveHandle.remove();
				upHandle.remove();
			}
		};
	}

	exports.onPointerDown = onPointerDown;
	exports.onPointerUp = onPointerUp;
	exports.onPointerMove = onPointerMove;
	exports.onMoveUp = onMoveUp;
} );