/**
 * Created by WQ on 2015/5/11.
 */

library( function () {
	var blur = imports( "filter-blur-stack" ),
		func = imports( "function" ),
		Img = imports( "../img" );

	exports.blurRectGradient = function ( imgGc, blurRadius, blurSize, blurX, blurY, blurWidth, blurHeight ) {
		var blurCanvas = Img.Canvas( blurWidth, blurHeight );
		var gc = blurCanvas.context;
		gc.putImageData( blur( imgGc.getImageData( blurX, blurY, blurWidth, blurHeight ), blurRadius ), 0, 0 );
		var r = blurSize << 0;
		var Gradient;
		// 设置模糊
		var blurRects = [
				[0, 0, 0, r],
				[blurWidth, 0, blurWidth - r, 0],
				[0, blurHeight, 0, blurHeight - r],
				[0, 0, r, 0]
			],
			gradientColor = ["rgba(255,0,0,1)", "rgba(255,0,0,0)"],
			bound = [
				[0, 0, blurWidth, r],
				[blurWidth - r, 0, r, blurHeight],
				[0, blurHeight - r, blurWidth, r],
				[0, 0, r, blurHeight]
			];
		gc.globalCompositeOperation = "destination-out";

		func.loop( 4, function ( i ) {
			gc.beginPath();
			Gradient = gc.createLinearGradient( blurRects[i][0], blurRects[i][1], blurRects[i][2], blurRects[i][3] );
			Gradient.addColorStop( 0, gradientColor[0] );
			Gradient.addColorStop( 1, gradientColor[1] );
			gc.fillStyle = Gradient;
			gc.fillRect( bound[i][0], bound[i][1], bound[i][2], bound[i][3] );
		} );
		return blurCanvas;
	}
} );