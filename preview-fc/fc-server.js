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
            database = db;
            col = db.collection( "effects" );
            // ����http������
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
                        doc.filter = data.filter || "";
                        doc.camera = data.camera || "";
                        doc.name = data.name || "";
                        // ��������
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
                                    result : "���ݿ�������ʧ��"
                                } ) );
                            }
                            res.end();
                        } );
                    } );
                }
            } ).listen( 6024 );
        }
        else {
            console.log( "mongodb����������ʧ�ܣ�http�������Ѿ��ر�" );
            //  �˳������ɸ����̼�����exit�¼�������
            process.exit();
        }
    }
);


process.on( "exit" , function () {
    database && database.close();
} );