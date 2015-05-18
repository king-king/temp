/**
 * Created by WQ on 2015/5/11.
 */

var http = require( "http" );


http.createServer( function ( req, res ) {
    console.log( "ok" );
    res.writeHead( 200, {
        'Content-Type' : 'text/plain',
        "Access-Control-Allow-Origin" : "*"
    } );
    res.write( "yes" );
    res.end();
} ).listen( 8585 );