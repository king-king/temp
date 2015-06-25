/**
 * Created by WQ on 2015/6/25.
 */

main( function () {
    var ajax = imports( "com/ajax.js" );

    ajax( "http://www.wangqun.com", function ( url ) {
        console.log( url );
    } )

} );