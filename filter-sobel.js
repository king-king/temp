/**
 * Created by WQ on 2015/7/14.
 *
 * sobel算法，实现线条取样
 *
 */

(function () {
    function Sobel( imageData, isReverse ) {
        var w = imageData.width,
            h = imageData.height,
            kernelX = [
                [-1, 0, 1],
                [-2, 0, 2],
                [-1, 0, 1]
            ],
            kernelY = [
                [-1, -2, -1],
                [0, 0, 0],
                [1, 2, 1]
            ],
            SobelData = [],
            grayScaleData = [];

        function bindPixelAt( data ) {
            return function ( x, y, i ) {
                i = i || 0;
                return data[((w * y) + x) * 4 + i];
            };
        }

        var data = imageData.data,
            pixelAt = bindPixelAt( data ),
            x,
            y;

        for ( y = 0; y < h; y++ ) {
            for ( x = 0; x < w; x++ ) {
                var r = pixelAt( x, y, 0 );
                var g = pixelAt( x, y, 1 );
                var b = pixelAt( x, y, 2 );

                var avg = (r + g + b) / 3;
                grayScaleData.push( avg, avg, avg, 255 );
            }
        }
        pixelAt = bindPixelAt( grayScaleData );

        for ( y = 0; y < h; y++ ) {
            for ( x = 0; x < w; x++ ) {
                var pixelX = (
                (kernelX[0][0] * pixelAt( x - 1, y - 1 )) +
                (kernelX[0][1] * pixelAt( x, y - 1 )) +
                (kernelX[0][2] * pixelAt( x + 1, y - 1 )) +
                (kernelX[1][0] * pixelAt( x - 1, y )) +
                (kernelX[1][1] * pixelAt( x, y )) +
                (kernelX[1][2] * pixelAt( x + 1, y )) +
                (kernelX[2][0] * pixelAt( x - 1, y + 1 )) +
                (kernelX[2][1] * pixelAt( x, y + 1 )) +
                (kernelX[2][2] * pixelAt( x + 1, y + 1 ))
                );

                var pixelY = (
                (kernelY[0][0] * pixelAt( x - 1, y - 1 )) +
                (kernelY[0][1] * pixelAt( x, y - 1 )) +
                (kernelY[0][2] * pixelAt( x + 1, y - 1 )) +
                (kernelY[1][0] * pixelAt( x - 1, y )) +
                (kernelY[1][1] * pixelAt( x, y )) +
                (kernelY[1][2] * pixelAt( x + 1, y )) +
                (kernelY[2][0] * pixelAt( x - 1, y + 1 )) +
                (kernelY[2][1] * pixelAt( x, y + 1 )) +
                (kernelY[2][2] * pixelAt( x + 1, y + 1 ))
                );

                var magnitude = Math.sqrt( (pixelX * pixelX) + (pixelY * pixelY) ) >> 0;

                isReverse && (magnitude = magnitude > 125 ? 0 : 255);

                SobelData.push( magnitude, magnitude, magnitude, 255 );
            }
        }

        return new ImageData( new Uint8ClampedArray( SobelData ), w, h );
    }

    window.Sobel = Sobel;
})();