/**
 * Created by WQ on 2015/6/2.
 *
 *图像混合，说明文档：http://king-king.github.io/document/1/blendApi.html
 *
 */
(function () {
    function blend( imgData1, imgData2, model ) {
        var imgData = document.createElement( "canvas" ).getContext( "2d" ).createImageData( imgData1 );

        function loopArray( arr, step, func ) {
            for ( var i = 0; i < arr.length; i += step ) {
                func( i );
            }
        }

        switch ( model ) {
            case "exclude": // 排除
                loopArray( imgData1.data, 4, function ( i ) {
                    imgData.data[i] = (imgData1.data[i] + imgData2.data[i] - 2 * imgData1.data[i] * imgData2.data[i] / 255) << 0;
                    imgData.data[i + 1] = (imgData1.data[i + 1] + imgData2.data[i + 1] - 2 * imgData1.data[i + 1] * imgData2.data[i + 1] / 255) << 0;
                    imgData.data[i + 2] = (imgData1.data[i + 2] + imgData2.data[i + 2] - 2 * imgData1.data[i + 2] * imgData2.data[i + 2] / 255) << 0;
                    imgData.data[i + 3] = 255;
                } );
                break;
            case "D-value":// 差值
                loopArray( imgData1.data, 4, function ( i ) {
                    imgData.data[i] = Math.abs( imgData1.data[i] - imgData2.data[i] );
                    imgData.data[i + 1] = Math.abs( imgData1.data[i + 1] - imgData2.data[i + 1] );
                    imgData.data[i + 2] = Math.abs( imgData1.data[i + 2] - imgData2.data[i + 2] );
                    imgData.data[i + 3] = 255;
                } );
                break;
            case "Hard-Mix":// 实色混合
                loopArray( imgData1.data, 4, function ( i ) {
                    imgData.data[i] = (imgData1.data[i] < 128 ?
                        (imgData1.data[i] == 0 ? 2 * imgData1.data[i] : Math.max( 0, (255 - ((255 - imgData2.data[i]) << 8 ) / (2 * imgData1.data[i])) )) :
                        ((2 * (imgData1.data[i] - 128)) == 255 ? (2 * (imgData1.data[i] - 128)) : Math.min( 255, ((imgData2.data[i] << 8 ) / (255 - (2 * (imgData1.data[i] - 128)) )) ))) < 128 ?
                        0 : 255;
                    imgData.data[i + 1] = (imgData1.data[i + 1] < 128 ?
                        (imgData1.data[i + 1] == 0 ? 2 * imgData1.data[i + 1] : Math.max( 0, (255 - ((255 - imgData2.data[i + 1]) << 8 ) / (2 * imgData1.data[i + 1])) )) :
                        ((2 * (imgData1.data[i + 1] - 128)) == 255 ? (2 * (imgData1.data[i + 1] - 128)) : Math.min( 255, ((imgData2.data[i + 1] << 8 ) / (255 - (2 * (imgData1.data[i + 1] - 128)) )) ))) < 128 ?
                        0 : 255;
                    imgData.data[i + 2] = (imgData1.data[i + 2] < 128 ?
                        (imgData1.data[i + 2] == 0 ? 2 * imgData1.data[i + 2] : Math.max( 0, (255 - ((255 - imgData2.data[i + 2]) << 8 ) / (2 * imgData1.data[i + 2])) )) :
                        ((2 * (imgData1.data[i + 2] - 128)) == 255 ? (2 * (imgData1.data[i + 2] - 128)) : Math.min( 255, ((imgData2.data[i + 2] << 8 ) / (255 - (2 * (imgData1.data[i + 2] - 128)) )) ))) < 128 ?
                        0 : 255;
                    imgData.data[i + 3] = 255;
                } );
                break;
            case "Pin-Light":// 点光
                loopArray( imgData1.data, 4, function ( i ) {
                    imgData.data[i] = Math.max( 0, Math.max( 2 * imgData2.data[i] - 255, Math.min( imgData2.data[i], 2 * imgData1.data[i] ) ) );
                    imgData.data[i + 1] = Math.max( 0, Math.max( 2 * imgData2.data[i + 1] - 255, Math.min( imgData2.data[i + 1], 2 * imgData1.data[i + 1] ) ) );
                    imgData.data[i + 2] = Math.max( 0, Math.max( 2 * imgData2.data[i + 2] - 255, Math.min( imgData2.data[i + 2], 2 * imgData1.data[i + 2] ) ) );
                    imgData.data[i + 3] = 255;
                } );
                break;
            case "Linear-Light":// 线性光
                loopArray( imgData1.data, 4, function ( i ) {
                    imgData.data[i] = Math.min( 255, Math.max( 0, (imgData2.data[i] + 2 * imgData1.data[i]) - 1 ) );
                    imgData.data[i + 1] = Math.min( 255, Math.max( 0, (imgData2.data[i + 1] + 2 * imgData1.data[i + 1]) - 1 ) );
                    imgData.data[i + 2] = Math.min( 255, Math.max( 0, (imgData2.data[i + 2] + 2 * imgData1.data[i + 2]) - 1 ) );
                    imgData.data[i + 3] = 255;
                } );
                break;
            case "Hard-Light":// 强光
                loopArray( imgData1.data, 4, function ( i ) {
                    imgData.data[i] = ( (imgData1.data[i] < 128) ? (2 * imgData1.data[i] * imgData2.data[i] / 255) : (255 - 2 * (255 - imgData1.data[i]) * (255 - imgData2.data[i]) / 255)) << 0;
                    imgData.data[i + 1] = ( (imgData1.data[i + 1] < 128) ? (2 * imgData1.data[i + 1] * imgData2.data[i + 1] / 255) : (255 - 2 * (255 - imgData1.data[i + 1]) * (255 - imgData2.data[i + 1]) / 255)) << 0;
                    imgData.data[i + 2] = ( (imgData1.data[i + 2] < 128) ? (2 * imgData1.data[i + 2] * imgData2.data[i + 2] / 255) : (255 - 2 * (255 - imgData1.data[i + 2]) * (255 - imgData2.data[i + 2]) / 255)) << 0;
                    imgData.data[i + 3] = 255;
                } );
                break;
            case "Soft-Light":// 柔光
                loopArray( imgData1.data, 4, function ( i ) {
                    imgData.data[i] = (imgData2.data[i] < 128 ?
                        (2 * (( imgData1.data[i] >> 1) + 64)) * (imgData2.data[i] / 255)
                            :
                            (255 - ( 2 * (255 - ( (imgData1.data[i] >> 1) + 64 ) ) * ( 255 - imgData2.data[i] ) / 255 ))) << 0;
                    imgData.data[i + 1] = (imgData2.data[i + 1] < 128 ?
                        (2 * (( imgData1.data[i + 1] >> 1) + 64)) * (imgData2.data[i + 1] / 255)
                            :
                            (255 - ( 2 * (255 - ( (imgData1.data[i + 1] >> 1) + 64 ) ) * ( 255 - imgData2.data[i + 1] ) / 255 ))) << 0;
                    imgData.data[i + 2] = (imgData2.data[i + 2] < 128 ?
                        (2 * (( imgData1.data[i + 2] >> 1) + 64)) * (imgData2.data[i + 2] / 255)
                            :
                            (255 - ( 2 * (255 - ( (imgData1.data[i + 2] >> 1) + 64 ) ) * ( 255 - imgData2.data[i + 2] ) / 255 ))) << 0;
                    imgData.data[i + 3] = 255;
                } );
                break;
            case "overlap":// 叠加
                loopArray( imgData1.data, 4, function ( i ) {
                    imgData.data[i] = ( (imgData2.data[i] < 128) ? (2 * imgData1.data[i] * imgData2.data[i] / 255) : (255 - 2 * (255 - imgData1.data[i]) * (255 - imgData2.data[i]) / 255)) << 0;
                    imgData.data[i + 1] = ( (imgData2.data[i + 1] < 128) ? (2 * imgData1.data[i + 1] * imgData2.data[i + 1] / 255) : (255 - 2 * (255 - imgData1.data[i + 1]) * (255 - imgData2.data[i + 1]) / 255) ) << 0;
                    imgData.data[i + 2] = ( (imgData2.data[i + 2] < 128) ? (2 * imgData1.data[i + 2] * imgData2.data[i + 2] / 255) : (255 - 2 * (255 - imgData1.data[i + 2]) * (255 - imgData2.data[i + 2]) / 255)   ) << 0;
                    imgData.data[i + 3] = 255;
                } );
                break;
            default:
                //Color-Dodqe 滤色
                loopArray( imgData1.data, 4, function ( i ) {
                    imgData.data[i] = 255 - (((255 - imgData1.data[i]) * (255 - imgData2.data[i])) >> 8);
                    imgData.data[i + 1] = 255 - (((255 - imgData1.data[i + 1]) * (255 - imgData2.data[i + 1])) >> 8);
                    imgData.data[i + 2] = 255 - (((255 - imgData1.data[i + 2]) * (255 - imgData2.data[i + 2])) >> 8);
                    imgData.data[i + 3] = 255;
                } );
        }
        return imgData;
    }

    window.blend = blend;
})();