/**
 * Created by WQ on 2015/10/14.
 */


var MongoClient = require( 'mongodb' ).MongoClient ,
    http = require( "http" ) ,
    url = require( "url" ) ,
    fs = require( "fs" ) ,
    pt = require( "path" );


var dbUrl = 'mongodb://localhost:27017/effect' ,
    database = null ,
    col = null;


MongoClient.connect( dbUrl , function ( err , db ) {
        if ( !err ) {
            console.log( "数据库启动" );
            database = db;
            col = db.collection( "effects" );
            // 开启http服务器
            console.log( "服务器启动" );
            http.createServer( function ( req , res ) {
                if ( req.url == "/insertOne" ) {
                    res.writeHead( 200 , {
                        'Content-Type' : 'application/json; charset=utf-8' ,
                        "Access-Control-Allow-Origin" : "*"
                    } );
                    var doc = {};
                    doc.date = new Date();
                    var data = "";
                    req.on( "data" , function ( s ) {
                        data += s;
                    } );
                    req.on( "end" , function () {
                        data = JSON.parse( data );
                        doc.filter = data.filter || "{}";
                        doc.camera = data.camera || "{}";
                        doc.name = data.name || "";
                        doc.duration = data.duration;
                        doc.display = 1;
                        // 插入数据
                        //搞一个自增id
                        col.count( function ( err , count ) {
                            if ( err ) {
                                res.write( JSON.stringify( {
                                    code : 400 ,
                                    result : "数据库自增id查询操作失败"
                                } ) );
                                res.end();
                            } else {
                                doc.index = count;
                                col.insertOne( doc , function ( err , result ) {
                                    if ( !err ) {
                                        res.write( JSON.stringify( {
                                            code : 200 ,
                                            result : ""
                                        } ) );
                                    }
                                    else {
                                        res.write( JSON.stringify( {
                                            code : 400 ,
                                            result : "数据库插入操作失败"
                                        } ) );
                                    }
                                    res.end();
                                } );
                            }

                        } );
                    } );
                }
                else if ( req.url == "/getAll" ) {
                    res.writeHead( 200 , {
                        'Content-Type' : 'application/json; charset=utf-8' ,
                        "Access-Control-Allow-Origin" : "*"
                    } );
                    col.find( { display : 1 } ).toArray( function ( err , docs ) {
                        if ( err ) {
                            res.write( JSON.stringify( {
                                code : 400 ,
                                data : "操作失败"
                            } ) );
                        } else {
                            res.write( JSON.stringify( {
                                code : 200 ,
                                data : docs
                            } ) );
                        }
                        res.end();
                    } );
                }
                else if ( req.url == "/deleteOne" ) {
                    res.writeHead( 200 , {
                        'Content-Type' : 'application/json; charset=utf-8' ,
                        "Access-Control-Allow-Origin" : "*"
                    } );
                    var ddata = "";
                    req.on( "data" , function ( s ) {
                        ddata += s;
                    } );
                    req.on( "end" , function () {
                        ddata = JSON.parse( ddata );
                        col.updateOne( { id : ddata.id } , { $set : { display : 0 } } , function ( err ) {
                            if ( err ) {
                                res.write( JSON.stringify( {
                                    code : 400 ,
                                    result : "err"
                                } ) );
                            } else {
                                res.write( JSON.stringify( {
                                    code : 200 ,
                                    result : ""
                                } ) );
                            }
                            res.end();
                        } );


                    } );
                }
                else {
                    // bad request
                    res.writeHead( 400 , {
                        'Content-Type' : 'application/json; charset=utf-8' ,
                        "Access-Control-Allow-Origin" : "*"
                    } );
                    res.end();
                }
            } ).listen( 6024 );
        }
        else {
            console.log( "mongodb服务器链接失败，http服务器已经关闭" );
            //  退出程序，由父进程监听到exit事件后重启
            process.exit();
        }
    }
);


process.on( "exit" , function () {
    console.log( "服务器重启" );
    database && database.close();
} );