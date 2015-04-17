var fs = require( "fs" );
var sprite = require( "zach_sprite" ).sprite;
var images = require( "images" );


try {
    var out = images( 3000, 3300 );
}
catch ( e ) {
    console.log( e );
}

console.log( "ok" );

for ( var i = 0; i < 101; i++ ) {
    out.draw( images( "img/out/" + i + ".png" ), i % 10 * 300, (i / 10 << 0) * 300 );
    i == 100 && console.log( i % 10 * 300, (i / 10 << 0) * 300 );
}

out.save( "result.png" );


