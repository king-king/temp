/**
 * Created by 白 on 2015/5/4.
 */

library( function () {
	function callWith( func1, func2 ) {
		return func1( func2 );
	}

	exports.callWith = callWith;
} );