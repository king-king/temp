var http = require( 'http' );

var httpServer = http.createServer( function ( req, res ) {
    switch ( req.url ) {
        case "/log":
            var data = "";
            req.on( "data", function ( str ) {
                data += str;
            } );
            req.on( "end", function () {
                console.log( "data:" + data );
                res.writeHead( 200, {
                    'Content-Type' : 'text/plain',
                    "Access-Control-Allow-Origin" : "*"
                } );
                res.end();
            } );
            break;
        default :
            res.writeHead( 400, {
                'Content-Type' : 'text/plain',
                "Access-Control-Allow-Origin" : "*"
            } );
            res.end();
    }
} );
httpServer.listen( 8989 );