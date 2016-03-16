/**
 * Created by WQ on 2016/3/15.
 */

var Fontmin = require( 'fontmin' );


var fontmin = new Fontmin().src( 'fz.ttf' ).dest( 'f' ).use( Fontmin.glyph( {
    text : "关于我们北京七厘米科技有限公司位于北京中关村大街，是由一群梦想打造『科技与艺术结合的世界级产品』的产品狂热分子创立。是全球首款面向个人用户的H5内容发布工具与社区软件。我们为何而生？打造让用户迷恋的产品让每个人的生活都可以更有诗意我们的价值取向专注体验、独一无二、不可替代、与众不同、开放、激活创造力、团队力量；不作恶也能成功；be great，not just good极致简单，用户利益至上。" ,
    hinting : false
} ) );
fontmin.run( function ( err , files ) {
    if ( err ) {
        console.log( "err:" + err );
    }
} )