/**
 * Created by WQ on 2015/7/23.
 */

var http = require( "http" ),
    multiparty = require( "multiparty" ),
    fs = require( "fs" ),
    util = require( "util" ),
    crypto = require( "crypto" );

http.createServer( function ( req, res ) {

    // 上传组件
    if ( req.url == "/upload" ) {
        doUpload();
    }


    function doUpload() {
        (new multiparty.Form()).parse( req, function ( err, fields, files ) {
                res.writeHead( 200, {'Content-Type' : 'text/plain', "Access-Control-Allow-Origin" : "*"} );
                // 读取到文件的内容
                fs.readFile( files["wq-file"][0].path, null, function ( err, buffer ) {
                    if ( err ) {
                        res.end( JSON.stringify( {
                            code : 600,
                            message : "临时文件生成失败"
                        } ) );
                    }
                    else {
                        // 先进行hash验证，不能重复上传
                        var hash = crypto.createHash( 'md5' );
                        hash.update( buffer );
                        var hex = hash.digest( "hex" );
                        console.log( hex );
                        // 到数据库中查找，如果查找不到，才进行文件的创建
                        fs.writeFile( "out/" + files["wq-file"][0].originalFilename, buffer, function ( err ) {
                            if ( !err ) {
                                res.end( JSON.stringify( {
                                    code : 200,
                                    message : "成功"
                                } ) );
                            }
                            else {
                                res.end( JSON.stringify( {
                                    code : 601,
                                    message : "服务器端在创建文件过程中失败"
                                } ) );
                            }
                        } );
                    }
                } );
            }
        );
    }


} ).
    listen( 7474, '127.0.0.1' );