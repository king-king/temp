/**
 * Created by WQ on 2015/7/23.
 */

var http = require( "http" ),
    multiparty = require( 'multiparty' ),
    fs = require( 'fs' ),
    util = require( 'util' ),
    MongoClient = require( 'mongodb' ).MongoClient,
    dburl = 'mongodb://localhost:27017/cinema',
    crypto = require( "crypto" );

MongoClient.connect( dburl, function ( err, db ) {
    if ( err ) {
        console.log( err );
    }
    else {
        // 数据库连接，启动http服务器
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
                                // 到数据库中查找，如果查找不到，才进行文件的创建
                                checkExist( db, hex, function ( err, isExist, name ) {
                                    if ( err ) {
                                        res.end( JSON.stringify( {
                                            code : 604,
                                            message : "校验失败"
                                        } ) );
                                    }
                                    else if ( isExist ) {
                                        // 如果已经存在，则返回
                                        res.end( JSON.stringify( {
                                            code : 602,
                                            message : "此文件已经上传过，和" + name + "是一样的"
                                        } ) );
                                    }
                                    else {
                                        fs.writeFile( "out/" + files["wq-file"][0].originalFilename, buffer, function ( err ) {
                                            if ( !err ) {
                                                // 将记录写入到数据库中
                                                insertIntoImgCollection( db, {
                                                    name : files["wq-file"][0].originalFilename.slice( 0, files["wq-file"][0].originalFilename.indexOf( "." ) ),
                                                    hash : hex
                                                }, function ( err ) {
                                                    if ( err ) {
                                                        res.end( JSON.stringify( {
                                                            code : 603,
                                                            message : "写入数据库失败"
                                                        } ) );
                                                    }
                                                    else {
                                                        res.end( JSON.stringify( {
                                                            code : 200,
                                                            message : "成功"
                                                        } ) );
                                                    }
                                                } );
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
                        } );
                    }
                );
            }


        } ).listen( 7474, '127.0.0.1' );
    }
} );

function insertIntoImgCollection( db, data, callback ) {
    var collection = db.collection( "customplugin" );
    collection.insertOne( {name : data.name, hash : data.hash}, callback );
}

function checkExist( db, hash, callback ) {
    var collection = db.collection( "customplugin" );
    collection.find( {hash : hash} ).toArray( function ( err, docs ) {
        callback( err, docs.length != 0, docs[0] ? docs[0].name : null );
    } );
}
