/**
 * Created by WQ on 2015/6/30.
 */

var fs = require( "fs" );

fs.watch( "test", function ( e, filename ) {
    console.log( e );
    console.log( filename );
    console.log( "\n\n\n" );
} );


setTimeout( function () {
    console.log( "end" );
    process.exit();
}, 3000 );