/**
 * Created by WQ on 2015/4/17.
 */

var images = require( "images" );
var p = images( "img/yuan.png" );
var fs = require( "fs" );
var sprite = require( "zach_sprite" ).sprite;


function loop( count, func ) {
    for ( var i = 0; i < count; i++ ) {
        func( i );
    }
}

var points = [];
loop( 100, function ( i ) {
    var r = (Math.random() - 0.5) * 10;
    points.push( {
        x : Math.random() * 300 << 0,
        y : Math.random() * 300 << 0,
        r : r < 0 ? 0 : r
    } );
} );

var pics = [];

loop( 100, function ( i ) {
    var out = images( 300, 300 );
    // 画点
    loop( 20, function ( m ) {
        var r = points[m].r + i;
        if ( r != 0 ) {
            try {
                p.resize( 2 * r );
            }
            catch ( e ) {
                console.log( e );
            }
            out.draw( p, points[m].x - r, points[m].y - r );
        }
    } );
    out.save( "img/out/" + i + ".png" );
    pics.push( "img/out/" + i + ".png" );
} );

p.resize( 300 );
images( 300, 300 ).fill( 0xc4, 0xd0, 0xd5, 1 ).save( "img/out/100.png" );
pics.push( "img/out/100.png" );

sprite( {
    input : pics,// 给出一个路径数组，如果文件不存在，则不会生成合并文件
    align : 1// 默认是2
}, function ( err, result ) {
    if ( !err ) {
        fs.writeFile( "result.png", result.data, function ( e ) {
            console.log( e )
        } );
    }
    else {
        console.log( err )
    }
} );