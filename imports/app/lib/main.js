/**
 * Created by WQ on 2015/6/25.
 */

main( function () {
    var util = imports( "basic/util.js" );
    var task = imports( "basic/task.js" );
    var ajax = imports( "com/ajax.js" );

    var urls = [
        "http://www.baidu.com",
        "http://www.sina.com",
        "http://www.sohu.com",
        "http://www.qq.com",
        "http://www.google.com"
    ];

    task.serialTask( util.map( urls, function ( url ) {
        return function ( done ) {
            ajax( url, function ( text ) {
                console.log( text );
                done();
            } );
        }
    } ), function () {
        console.log( "end" );
    } );

} );