var http = require( 'http' );

var httpServer = http.createServer( function ( req, res ) {
    res.writeHead( 200, {
        'Content-Type' : 'application/json; charset=utf-8',
        "Access-Control-Allow-Origin" : "*"
    } );
    res.write( JSON.stringify( {
        code : 200,
        result : "ok"
    } ) );
    res.end();
} );
httpServer.listen( 62622 );