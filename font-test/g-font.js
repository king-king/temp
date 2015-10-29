var Fontmin = require( 'fontmin' );

var fontmin = new Fontmin().src( 'hycyj.ttf' ).dest( 'font' ).use( Fontmin.glyph( {
    text : "Thankyou3QAreyouokHello哈喽Thankyou3QThankyouverymuch3Q为麻吃Hello哈喽Thankyou3QThankyouverymuch3Q为麻吃HeHeHello哈喽Thankyou3QThankyouverymuch3Q为麻吃HeHeHello哈喽Thankyou3QThankyouverymuch3Q为麻吃Howareyouindianmifans印度的米粉你们好吗Doyoulikemi4i你们喜欢小米4i吗OkindianmifansOk印度的米粉们Doyoulikemiband你们喜欢小米手带吗Wewillgiveeveryone我们要给每个人Afreemiband一条免费的小米手带Andme还有我(脸红)Mifans米粉们Doyoulikeme你们喜欢(我)吗I'mveryhappyto我十分高兴Tobea(an)indian能成为一个印度人I'mveryhappyto我十分高兴Tobeagift能成为一个礼物I'mafreegift我是一个免费的礼物Forevery-everyone送给每个人Doyoulikeme你们宣我嘛（脸红）Thankyouverymuch3Q为麻吃Ohindianmifans印度米粉们AreyouokAreyouokOheveryoneAreyouokAreyouokIIIIIIIMeanAreyouokAreyouokI'mveryok俺很好！" , // 要保留的文字
    hinting : false
} ) );
fontmin.run( function ( err , files ) {
    if ( err ) {
        console.log( "err:" + err );
    }
} );