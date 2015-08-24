/**
 * Created by 白 on 2015/5/12.
 */

library( function () {
	var pointer = imports( "pointer" ),
		array = imports( "array" ),
		object = imports( "object" );

	function onDrag( arg ) {
		arg = arg || {};

		function Track() {
			var track = [], direction, speed;

			return {
				track : function ( duration, length ) {
					var curDirection = length === 0 ? direction : length > 0;

					if ( duration > 200 || curDirection !== direction ) {
						track = [];
					}

					track.push( {
						duration : duration,
						length : length
					} );

					var totalDuration = 0, totalLength = 0;
					array.foreach( track, function ( offset ) {
						totalDuration += offset.duration;
						totalLength += offset.length;
					} );

					var exclude;
					while ( totalDuration > 200 ) {
						exclude = track.shift();
						totalDuration -= exclude.duration;
						totalLength -= exclude.length;
					}

					speed = totalDuration === 0 ? 0 : totalLength / totalDuration;

					direction = curDirection;
				},
				speed : function () {
					return speed;
				}
			};
		}

		var trackX = Track(), trackY = Track(),
			last = new Date();

		function update( callback, event ) {
			var now = new Date(),
				duration = now - last;

			last = now;

			trackX.track( duration, event.dX || 0 );
			trackY.track( duration, event.dY || 0 );

			callback && callback( object.insert( event, {
				speedX : trackX.speed(),
				speedY : trackY.speed()
			} ) );
		}

		return pointer.onMoveUp( {
			onMove : function ( event ) {
				update( arg.onMove, event );
			},
			onUp : function ( event ) {
				update( arg.onUp, event );
			}
		} );
	}

	module.exports = onDrag;
} );