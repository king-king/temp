/**
 * Created by WQ on 2015/10/8.
 */



var http = require( "http" );
var options = require( "url" ).parse( "http://chuye.cloud7.com.cn/dataflow/hot?device=iOS&version=2.6.2&nettp=WIFI" );
options.method = "GET";

options.auth = "_token dbefe69e8248a9dacc8b575f941ad2cf";
http.get( options, function ( response ) {
    var responseString = '';
    var resultObject;
    response.on( 'data', function ( data ) {
        responseString += data;
    } );
    response.on( 'end', function () {
        resultObject = JSON.stringify( responseString );
        console.log( resultObject );
    } );
} ).on( 'error', function ( e ) {
    console.error( e );
} );


//var https = require( 'https' );
//
//https.get( 'https://www.baidu.com/', function ( res ) {
//
//    res.on( 'data', function ( d ) {
//        process.stdout.write( d );
//    } );
//
//} ).on( 'error', function ( e ) {
//    console.error( e );
//} );