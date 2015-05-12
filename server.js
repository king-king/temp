/**
 * Created by WQ on 2015/5/11.
 */

var http = require( "http" );

var a = 0;

http.createServer( function ( req, res ) {
    var time = parseInt( req.url.slice( 1 ) );
    a += 10;
    setTimeout( function () {
        res.writeHead( 200, {
            'Content-Type' : 'text/plain',
            "Access-Control-Allow-Origin" : "*"
        } );
        res.end( time + "  a=" + a );
    }, time * 1000 );
} ).listen( 8181, 'localhost' );