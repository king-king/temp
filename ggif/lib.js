/**
 * Created by WQ on 2015/12/28.
 */
function concurrentTask( tasks , callback ) {
    var len = tasks.length , count = 0;
    tasks.forEach( function ( task ) {
        task( function () {
            count++;
            count == len && callback();
        } );
    } );
}
function map( array , func ) {
    var mapArray = [];
    array.forEach( function ( item , i ) {
        mapArray.push( func( item , i ) );
    } );
    return mapArray;
}

function foreach( arr , func ) {
    var len = arr.length;
    for ( var i = 0; i < len; i++ ) {
        func( arr[ i ] , i );
    }
}

var gif = new GIF( {
    repeat : 0 ,
    workers : 10 ,
    quality : 10 ,
    workerScript : '../lib/gif.worker.js'
} );