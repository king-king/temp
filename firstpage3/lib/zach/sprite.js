/**
 * Created by 白 on 2015/7/6.
 */

require( './node' );
var Images = require( "images" ),
	array = require( "./array" ),
	binPacking = require( "./bin-packing" );

function sprite( arg, callback ) {
	var images = [],
		align = arg.align || 2,
		padding = arg.padding || 0,
		imageInfo = [];// 存放每张png的数据,每个元素都是个对象，包含数据数组，尺寸

	function alignSize( size ) {
		return ( ( size % align == 0 ) ? size : size + align - size % align );
	}

	array.foreach( arg.contentList, function ( content ) {
		var img = Images( content.data ),
			rawWidth = img.width(),
			rawHeight = img.height();

		imageInfo.push( {
			path : content.path,
			rawWidth : rawWidth,
			rawHeight : rawHeight,
			width : alignSize( rawWidth + 2 * padding ),
			height : alignSize( rawHeight + 2 * padding ),
			data : img
		} );
	} );

	// bin-packing算法
	var packing = binPacking( imageInfo ),
		packingPos = packing.pos;
	array.foreach( imageInfo, function ( img, i ) {
		images.push( {
			path : img.path,
			x : packingPos[i].x,
			y : packingPos[i].y,
			width : img.rawWidth,
			height : img.rawHeight
		} );
	} );


	var width = alignSize( packing.width ),
		height = alignSize( packing.height ),
		png = Images( width, height );

	// 按顺序将数据写入png
	array.foreach( imageInfo, function ( img, i ) {
		png.draw( img.data, packingPos[i].x, packingPos[i].y );
	} );

	callback( null, {
		data : png.encode( "png" ),
		images : images,
		width : width,
		height : height
	} );
}

module.exports = sprite;
