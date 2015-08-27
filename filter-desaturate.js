/**
 * Created by WQ on 2015/6/2.
 *
 * 颜色去饱和，使之变为灰色图像（或者说是黑白图）
 *
 */

(function () {
    function desaturate( imgData ) {
        var imgDataResult = document.createElement( "canvas" ).getContext( "2d" ).createImageData( imgData ),
            av;
        for ( var i = 0; i < imgData.data.length; i += 4 ) {
            av = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
            imgDataResult.data[i] = imgDataResult.data[i + 1] = imgDataResult.data[i + 2] = av;
            imgDataResult.data[i + 3] = imgData.data[i + 3];
        }
        return imgDataResult;
    }

    window.desaturate = desaturate;
})();