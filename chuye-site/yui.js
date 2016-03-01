/**
 * Created by WQ on 2016/3/1.
 */
var compressor = require( 'yuicompressor' );
var fs = require( "fs" );
compressor.compress( "main.js" , {
    //Compressor Options:
    charset : 'utf8' ,
    type : 'js' ,
    'line-break' : 80
} , function ( err , data , extra ) {
    if ( !err ) {
        fs.writeFile( "chuye-site.min.js" , data , function () {
            console.log( "over" )
        } )
    }
    //err   If compressor encounters an error, it's stderr will be here
    //data  The compressed string, you write it out where you want it
    //extra The stderr (warnings are printed here in case you want to echo them
} );