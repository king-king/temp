library(function(){

	var Z2D = imports("2d");
	var matrix = Z2D.matrix;

	var exMatrices = [
		matrix.translate(0,0),
		matrix.scale(-1,1),
		matrix.rotate(Math.PI),
		matrix.scale(1,-1),
		Z2D.combine(matrix.scale(-1,1),matrix.rotate(Math.PI/2)),
		matrix.rotate(Math.PI/2),
		Z2D.combine(matrix.scale(1,-1),matrix.rotate(Math.PI/2)),
		matrix.rotate(-Math.PI/2)
	];

	function exifTransform(id){
		return id>0&&id<=exMatrices.length? exMatrices[id-1]:null;
	}

	exports.exifTransform = exifTransform;

});