/**
 * Created by 白 on 2015/2/5.
 * 为不支持gesture事件的手机提供类似于ios的gesture事件
 */

library( function () {
	var async = imports( "async" ),
		Event = async.Event,

		array = imports( "array" ),
		math = imports( "math" ),

		$ = imports( "element" ),
		bind = $.bind;

	// 通过event对象获取线段
	function getLine( event ) {
		return array.map( event.touches, function ( touch ) {
			return {
				x : touch.pageX,
				y : touch.pageY
			};
		} );
	}

	// region 线段
	var Line = function () {
		// 通过线段对象获取向量
		function vector( line ) {
			return [line[0].x - line[1].x, line[0].y - line[1].y];
		}

		// 计算线段的长度
		function distance( line ) {
			return math.distance( line[0].x - line[1].x, line[0].y - line[1].y );
		}

		// 计算两个线段的锐旋转角
		function rotation( line1, line2 ) {
			// 计算和y轴夹角
			function yAngle( line ) {
				var v = vector( line );
				return 180 - ( Math.atan2( v[0], v[1] ) / Math.PI * 180 + 180 ) % 180
			}

			var angle = ( yAngle( line2 ) - yAngle( line1 ) + 180 ) % 180;
			return angle >= 90 ? angle - 180 : angle;
		}

		function midpoint( line ) {
			return [( line[0].x + line[1].x ) / 2, ( line[0].y + line[1].y ) / 2];
		}

		return {
			distance : distance,
			rotation : rotation,
			midpoint : midpoint
		};
	}();
	// endregion

	if ( !window.GestureEvent ) {
		(function () {
			var touchNum = 0,
				startLine = null,
				lastLine = null,
				rotation = 0,
				startEvent = Event(),
				changeEvent = Event(),
				endEvent = Event();

			bind( document, "touchstart", function ( event ) {
				touchNum = event.touches.length;
				if ( touchNum >= 2 && startLine === null ) {
					startLine = lastLine = getLine( event );
					var midPoint = Line.midpoint( startLine );
					startEvent.trig( {
						pageX : midPoint[0],
						pageY : midPoint[1]
					} );
				}
			} );

			bind( document, "touchmove", function ( event ) {
				var line = getLine( event );

				if ( startLine ) {
					changeEvent.trig( {
						scale : Line.distance( line ) / Line.distance( startLine ),
						rotation : rotation += Line.rotation( lastLine, line )
					} );
					lastLine = line;
				}
			} );

			bind( document, "touchend", function () {
				if ( touchNum === 2 ) {
					startLine = null;
					endEvent.trig();
				}

				touchNum = Math.max( touchNum - 1, 0 );
			} );

			exports.onStart = startEvent.regist;
			exports.onChange = changeEvent.regist;
			exports.onEnd = endEvent.regist;
		})();
	}
	else {
		function Bind( eventName ) {
			return function ( task ) {
				return bind( document, eventName, task );
			};
		}

		exports.onStart = Bind( "gesturestart" );
		exports.onChange = Bind( "gesturechange" );
		exports.onEnd = Bind( "gestureend" );
	}
} );