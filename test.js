var compressor = require( 'yuicompressor' );

compressor.compress( "test2.js" , {
    //Compressor Options:
    charset : 'utf8' ,
    type : 'js'
} , function ( err , data , extra ) {
    console.log( data );
    //err   If compressor encounters an error, it's stderr will be here
    //data  The compressed string, you write it out where you want it
    //extra The stderr (warnings are printed here in case you want to echo them
} );

clearTimeout()