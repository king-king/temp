/**
 * Created by WQ on 2015/7/15.
 *
 * 此滤镜算法比较适合风景图。调用后会改变imgdata，谨慎之。
 *
 */

library( function () {

    function dull( imgdata ) {
        var len = imgdata.data.length;
        for ( var i = 0; i < len; i += 4 ) {
            imgdata.data[i + 3] = (imgdata.data[i - 4] + imgdata.data[i - 3] + imgdata.data[i - 2] ) / 3 << 0;
        }
        return imgdata;
    }

    module.exports = dull;

} );