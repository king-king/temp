/**
 * Created by 白 on 2014/8/4.
 * 封装点交互
 */

library( function () {
	// region 引入
	var array = imports( "array" ),
		object = imports( "object" ),
		ua = imports( "ua" ),
		$ = imports( "element" ),
		bind = $.bind,

		getPageX = EventCoordinateGetter( "pageX" ),
		getPageY = EventCoordinateGetter( "pageY" ),
		moveName = eventName( ["touchmove", "MSPointerMove", "mousemove"] ),
		downName = eventName( ["touchstart", "MSPointerDown", "mousedown"] ),
		upName = eventName( ["touchend", "MSPointerUp", "mouseup"] ),

		lastX, lastY, curX, curY;
	// endregion

	// 根据不同的浏览器,给出事件名
	function eventName( name ) {
		return name[ua.canTouch ? 0 : ua.msPointer ? 1 : 2];
	}

	// 事件坐标获取器
	function EventCoordinateGetter( coordinateName ) {
		return function ( event ) {
			return "touches" in event && event.touches[0] !== undefined ? event.touches[0][coordinateName] : event[coordinateName];
		}
	}

	bind( document, downName, function ( event ) {
		curX = getPageX( event );
		curY = getPageY( event );
	}, true );

	bind( document, moveName, function ( event ) {
		var x = getPageX( event ), y = getPageY( event );
		lastX = object.defaultValue( curX, x );
		lastY = object.defaultValue( curY, y );
		curX = x;
		curY = y;
	}, true );

	function Event( event, obj ) {
		return object.insert( obj, {
			preventDefault : function () {
				event.preventDefault();
			},
			stopPropagation : function () {
				event.stopPropagation();
			},
			origin : event
		} );
	}

	function onPointerMove( element, response, isCapture ) {
		return bind( element, moveName, function ( event ) {
			response( Event( event, {
				x : curX,
				y : curY,
				dX : curX - lastX,
				dY : curY - lastY
			} ) );
		}, isCapture );
	}

	function PointerBinder( names ) {
		return function ( element, response, isCapture ) {
			return bind( element, names, function ( event ) {
				response( Event( event, {
					x : object.defaultValue( curX, getPageX( event ) ),
					y : object.defaultValue( curY, getPageY( event ) )
				} ) );
			}, isCapture );
		};
	}

	var onPointerUp = PointerBinder( upName );

	function onMoveUp( arg ) {
		var moveHandle = onPointerMove( document, function ( event ) {
				arg.onMove && arg.onMove( event );
			} ),
			upHandle = onPointerUp( document, function ( event ) {
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

	exports.onPointerMove = onPointerMove;
	exports.onPointerDown = PointerBinder( downName );
	exports.onPointerUp = onPointerUp;
	exports.onMoveUp = onMoveUp;
} );