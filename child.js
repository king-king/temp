/**
 * Created by WQ on 2015/5/11.
 */

console.log( "i am child" );
process.on( "exit", function () {
    console.log( "child is died" );
} );