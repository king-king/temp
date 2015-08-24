/**
 * Created by 白 on 2015/6/4.
 * 球
 */

library( function () {
	function lat( p ) {
		return Math.acos( p[1] ) - Math.PI / 2;
	}

	function lng( p ) {
		return p[2] >= 0 ? Math.atan2( p[0], p[2] ) : Math.atan2( p[0], p[2] ) + Math.PI;
	}

	exports.lat = lat;
	exports.lng = lng;
} );