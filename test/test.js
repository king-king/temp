var http = require( 'http' );
var os = require( "os" );


http.createServer( function ( req, res ) {
    res.writeHead( 200, {'Content-Type' : 'text/plain'} );
    res.header( "Access-Control-Allow-Origin", "*" );
    res.end( JSON.stringify( os.networkInterfaces().WLAN ) );
} ).listen( 1338, '127.0.0.1' );

