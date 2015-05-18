/**
 * Created by WQ on 2015/5/11.
 */

var http = require( "http" );
var lookMime = require( "mime" ).look,
    url = require( "url" ),
    fs = require( "fs" ),
    pt = require( "path" );

http.createServer( function ( req, res ) {
    var path = url.parse( req.url ).pathname;
    var extName = pt.extname( path );
    var mimeType = lookMime( extName );
    path = path.substring( 1, path.length );
    if ( extName ) {
        //  按照文件处理
        fs.exists( path, function ( is ) {
            if ( is ) {
                res.writeHead( 200, {
                    'Content-Type' : mimeType
                } );
                var rs = fs.createReadStream( path );
                rs.pipe( res );
                rs.on( "end", function () {
                    res.end();
                } );
            }
            else {
                res.writeHead( 404 );
                res.end();
            }
        } );
    }
    else {
        res.writeHead( 200 );
        res.end();
    }
} ).listen( 8585 );