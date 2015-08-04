/**
 * Created by WQ on 2015/7/23.
 */

var http = require( "http" ),
    multiparty = require( 'multiparty' ),
    fs = require( 'fs' ),
    util = require( 'util' ),
    MongoClient = require( 'mongodb' ).MongoClient,
    dburl = 'mongodb://localhost:27017/cinema',
    crypto = require( "crypto" ),
    url = require( "url" );

MongoClient.connect( dburl, function ( err, db ) {
    if ( err ) {
        console.log( err );
    }
    else {
        // 数据库连接，启动http服务器
        http.createServer( function ( req, res ) {
            // 上传组件
            if ( req.url == "/upload" ) {
                doUploadPlugin();
            }
            // 得到组件列表
            else if ( req.url == "/get-plugin-list" ) {
                doGetPluginList();
            }
            // 保存动画数据
            else if ( req.url == "/save-cinema-data" ) {
                doSavePluginCinema();
            }
            // 检查动画名字是否被占用
            else if ( (/check-cinema-name\?name=.*/).test( req.url ) ) {
                checkCinemaName();
            }
            // 创建动画
            else if ( (/create-cinema\?name=.*/).test( decodeURIComponent( req.url ) ) ) {
                createCinema();
            }

            function doUploadPlugin() {
                (new multiparty.Form()).parse( req, function ( err, fields, files ) {
                        res.writeHead( 200, {'Content-Type' : 'text/plain', "Access-Control-Allow-Origin" : "*"} );
                        console.log( fields.alias[0] );
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
                                                insertIntoPluginCollection( db, {
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

            function doGetPluginList() {
                getPluginList( db, function ( err, data ) {
                    res.writeHead( 200, {'Content-Type' : 'text/plain', "Access-Control-Allow-Origin" : "*"} );
                    if ( err ) {
                        res.end( JSON.stringify( {
                            code : 700,
                            message : "查询失败"
                        } ) );
                    }
                    else {
                        res.end( JSON.stringify( {
                            code : 200,
                            message : data
                        } ) );
                    }
                } );
            }

            function doSavePluginCinema() {
                res.writeHead( 200, {'Content-Type' : 'text/plain', "Access-Control-Allow-Origin" : "*"} );

                var postdata = "";

                req.on( "data", function ( data ) {
                    postdata += data;
                } );
                req.on( "end", function () {
                    postdata = postdata.replace( "------WebKitFormBoundary", "" );
                    var data = postdata.substring( postdata.indexOf( "name=\"data\"" ) + 11, postdata.indexOf( "------WebKitFormBoundary" ) );
                    postdata = postdata.replace( "------WebKitFormBoundary", "" );
                    var name = postdata.substring( postdata.indexOf( "name=\"name\"" ) + 11, postdata.indexOf( "------WebKitFormBoundary" ) ).trim();

                    saveCinema( db, name, data, function ( err ) {
                        if ( err ) {
                            res.end( JSON.stringify( {
                                code : 1001,
                                message : "数据库故障"
                            } ) );
                        }
                        else {
                            res.end( JSON.stringify( {
                                code : 200,
                                message : "ok"
                            } ) );
                        }
                    } );

                } );


            }

            function checkCinemaName() {
                res.writeHead( 200, {'Content-Type' : 'text/plain', "Access-Control-Allow-Origin" : "*"} );
                var query = url.parse( decodeURI( req.url ) ).query,
                    name = query.slice( query.indexOf( "=" ) + 1 );

                checkTheCinemaNameIsUsed( db, name, function ( err, isUsed ) {
                    if ( err ) {
                        res.end( JSON.stringify( {
                            code : 801,
                            message : "数据库查询故障"
                        } ) );
                    }
                    else {
                        res.end( JSON.stringify( {
                            code : 200,
                            message : isUsed
                        } ) );
                    }
                } );
            }

            function createCinema() {
                var query = url.parse( decodeURI( req.url ) ).query,
                    name = query.slice( query.indexOf( "=" ) + 1 );
                res.writeHead( 200, {'Content-Type' : 'text/plain', "Access-Control-Allow-Origin" : "*"} );
                createOneCinema( db, name, function ( err, r ) {
                    if ( err ) {
                        res.end( JSON.stringify( {
                            code : 901,
                            message : "数据库故障"
                        } ) );
                    }
                    else {
                        res.end( JSON.stringify( {
                            code : 200,
                            message : "ok"
                        } ) );
                    }
                } );
            }


        } ).listen( 7474, '127.0.0.1' );
    }
} );

var customPluginCollection = null;

function insertIntoPluginCollection( db, data, callback ) {
    !customPluginCollection && (customPluginCollection = db.collection( "customplugin" ));
    customPluginCollection.insertOne( {name : data.name, hash : data.hash}, callback );
}

function getPluginList( db, callback ) {
    !customPluginCollection && (customPluginCollection = db.collection( "customplugin" ));

    customPluginCollection.find( {} ).toArray( callback );
}

function checkExist( db, hash, callback ) {
    !customPluginCollection && (customPluginCollection = db.collection( "customplugin" ));
    customPluginCollection.find( {hash : hash} ).toArray( function ( err, docs ) {
        callback( err, docs.length != 0, docs[0] ? docs[0].name : null );
    } );
}

var cinemaCollection = null;

// 实际上是根据名字update动画数据
function saveCinema( db, name, animate, callback ) {
    !cinemaCollection && (cinemaCollection = db.collection( "cinemadata" ));
    cinemaCollection.findOneAndUpdate( {name : name}, {
        $set : {animate : animate}
    }, callback )
}

// 每次创建一个新的动画时候，都要起名字，这个会创建一个doc，name就是传进来的参数
function createOneCinema( db, name, callback ) {
    !cinemaCollection && (cinemaCollection = db.collection( "cinemadata" ));
    cinemaCollection.insertOne( {name : name}, callback );
}

// 每次创建名字之前都需要检验一下名字有没有被占用，name不能重复
function checkTheCinemaNameIsUsed( db, name, callback ) {
    !cinemaCollection && (cinemaCollection = db.collection( "cinemadata" ));
    cinemaCollection.findOne( {name : name}, function ( err, docs ) {
        callback( err, !!docs && docs.length != 0 );
    } );
}