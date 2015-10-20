var Fontmin = require( 'fontmin' );

var fontmin = new Fontmin().src( 'zw.ttf' ).dest( 'font' ).use( Fontmin.glyph( {
    text : '天地玄黄 宇宙洪荒' ,
    hinting : false         // keep ttf hint info (fpgm, prep, cvt). default = true
} ) );

fontmin.run( function ( err , files ) {
    if ( err ) {
        console.log( err );
    }
} );