/**
 * Created by WQ on 2015/6/25.
 */

Package( function ( exports ) {
    function loopArray( arr, func ) {
        for ( var i = 0; i < arr.length; i++ ) {
            func( arr[i], i );
        }
    }

    function loop( count, func ) {
        for ( var i = 0; i < count; i++ ) {
            func( i );
        }
    }

    exports.loop = loop;
    exports.loopArray = loopArray;
} );