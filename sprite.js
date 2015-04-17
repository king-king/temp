/**
 * Created by WQ on 2015/4/17.
 */
var fs = require( "fs" );
var sprite = require( "zach_sprite" ).sprite;

var pics = [];
for ( var i = 10; i < 20; i++ ) {
    pics.push( "img/out/" + i + ".png" );
}

sprite( {
    input : ["result.png", "result2.png"],// 给出一个路径数组，如果文件不存在，则不会生成合并文件
    align : 1// 默认是2
}, function ( err, result ) {
    if ( !err ) {
        fs.writeFile( "result3.png", result.data, function ( e ) {
            console.log( e )
        } );
    }
    else {
        console.log( err )
    }
} );