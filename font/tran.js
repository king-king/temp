/**
 * Created by WQ on 2016/3/15.
 */
var Fontmin = require( 'fontmin' );

var fontmin = new Fontmin().src( "fz.ttf" )
    .use( Fontmin.ttf2eot() ).dest( "wq.eot" );