var zip = require( "zach-zip" );

var s = (new Date()).getTime();

zip.add( {
    output : "deploy.zip",
    input : "firstpage3"
}, function ( err, str ) {
    console.log( (new Date()).getTime() - s )
} );


