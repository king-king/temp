/**
 * Created by 白 on 2014/8/4.
 */

library( function () {
	var array = imports( "array" ),
		ua = imports( "ua" );

	function w( img ) {
		return img.naturalWidth || img.width || img.clientWidth;
	}

	function h( img ) {
		return img.naturalHeight || img.height || img.clientHeight;
	}

	function cover( img, dWidth, dHeight ) {
		var nWidth = w( img ), nHeight = h( img );
		return dWidth / dHeight < nWidth / nHeight ? dHeight / nHeight : dWidth / nWidth;
	}

	function contain( img, dWidth, dHeight ) {
		var nWidth = w( img ), nHeight = h( img );
		return dWidth / dHeight < nWidth / nHeight ? dWidth / nWidth : dHeight / nHeight;
	}

	function layImageByFrame( img, arg ) {
		var dW = arg.width, dH = arg.height, align = arg.align,
			ratio = arg.size( img, arg.width, arg.height );

		ratio = arg.noStretch ? Math.min( ratio, 1 ) : ratio; // 如果不能拉伸,那么比例最大是1

		function clip( dSize, size, align ) {
			var offset = ( dSize - size * ratio ) * align;
			return offset > 0 ? [0, size, offset, size * ratio] : [-offset / ratio, dSize / ratio, 0, dSize];
		}

		var retVal = [img].concat( array.zip( [clip( dW, w( img ), align[0] ), clip( dH, h( img ), align[1] )] ) );
		retVal.ratio = ratio;

		return retVal;
	}

	function drawImageLayout( gc, l ) {
		var image = l[0],
			tRatio = l.ratio,
			nW = image.naturalWidth, nH = image.naturalHeight,
			sX = l[1], sY = l[2],
			sW = l[3], sH = l[4],
			tX = l[5], tY = l[6],
			tW = l[7], tH = l[8];

		if ( ua.ios ) {
			gc.save();
			gc.translate( tX, tY );
			gc.beginPath();
			gc.rect( 0, 0, tW, tH );
			gc.clip();
			gc.drawImage( image, -sX / sW * tW, -sY / sH * tH, nW * tRatio, nH * tRatio );
			gc.restore();
		}
		else {
			gc.drawImage.apply( gc, l );
		}
	}

	exports.width = w;
	exports.height = h;
	exports.drawImageLayout = drawImageLayout;
	exports.layImageByFrame = layImageByFrame;
	exports.Size = {
		contain : contain,
		cover : cover
	};
} );