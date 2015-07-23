/**
 * Created by WQ on 2015/7/23.
 */

var MongoClient = require( 'mongodb' ).MongoClient;

var url = 'mongodb://localhost:27017/cinema';


MongoClient.connect( url, function ( err, db ) {
    if ( err ) {
        console.log( err );
    }
    else {
        //insertIntoImgCollection( db, {name : "plugin-redpoint", hash : "twe23fdf34rdsf46t"}, function ( err, i ) {
        //    process.exit();
        //} );
        checkExist( db, "twe23fdf34rdsf46t", function ( err, isExist ) {
            console.log( isExist );
            process.exit();
        } );
    }
} );


process.on( "exit", function () {
    console.log( "结束" );
} );


function insertIntoImgCollection( db, data, callback ) {
    var collection = db.collection( "customplugin" );
    collection.insertOne( {name : data.name, hash : data.hash}, callback );
}

function checkExist( db, hash, callback ) {
    var collection = db.collection( "customplugin" );
    collection.find( {hash : hash} ).toArray( function ( err, docs ) {
        console.log( docs );
        callback( err, docs.length != 0, docs[0] ? docs[0].name : null );
    } );
}


