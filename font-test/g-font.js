var Fontmin = require( 'fontmin' );

var fontmin = new Fontmin().src( 'zw.ttf' ).dest( 'font' ).use( Fontmin.glyph( {
    text : '白日依山尽，黄河入海流' , // 要保留的文字
    hinting : false
} ) );
fontmin.run( function ( err , files ) {
    if ( err ) {
        console.log( err );
    }
} );