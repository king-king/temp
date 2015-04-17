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
    input : ["result.png", "result2.png"],// ����һ��·�����飬����ļ������ڣ��򲻻����ɺϲ��ļ�
    align : 1// Ĭ����2
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