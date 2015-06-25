/**
 * Created by WQ on 2015/6/25.
 */
Package( function ( exports, module ) {
    module.exports.ajax = function ( url, callback ) {
        setTimeout( function () {
            callback( url );
        }, Math.random() * 2000 + 1000 );
    }
} );