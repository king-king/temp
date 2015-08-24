/**
 * Created by WQ on 2015/5/7.
 */
library( function () {
	var r, g, b, nr, nb, ng, index;

	function doOld( imageData ) {
		var w = imageData.width,
			h = imageData.height,
			data = imageData.data;
		for ( var y = 0; y < h; y++ ) {
			for ( var x = 0; x < w; x++ ) {
				index = (y * w + x) * 4;
				r = data[index];
				g = data[index + 1];
				b = data[index + 2];
				nr = (r * 0.393 + g * 0.769 + b * 0.189) << 0;
				ng = (r * 0.349 + g * 0.686 + b * 0.168) << 0;
				nb = (r * 0.272 + g * 0.534 + b * 0.131) << 0;
				data[index] = blendColor( noise(), nr, r );
				data[index + 1] = blendColor( noise(), ng, g );
				data[index + 2] = blendColor( noise(), nb, b );
			}
		}
		imageData.data = data;
		return imageData;
	}

	function blendColor( noise, dest, src ) {
		return (noise * dest + (1 - noise) * src) << 0;
	}

	function noise() {
		return Math.random() / 2 + 0.5;
	}

	module.exports = doOld;
} );