/**
 * Created by WQ on 2015/5/11.
 */

var cp = require( "child_process" );
var os = require( "os" );

console.log( os.uptime() );

console.log( "i am master" );


//cp.fork( "child.js" );

process.on( "exit", function () {
    console.log( "master is died" );
} );