var fs = require( 'fs' ),
	Bin = require( './zach_binPacking' ).Bin,
	util = require( './zach_spriteUtil' ).util,
	path = require( "path" ),
	cry = require( "crypto" ),
	images = require( "images" );


exports.sprite = function ( obj, callback ) {
	var err = {};
	var result = {
		images : []
	};
	var resource = obj.input;
	// 验证文件是否存在
	for ( var i = 0; i < resource.length; i++ ) {
		try {
			fs.statSync( resource[i] );
		}
		catch ( e ) {
			err.text = resource[i] + ":不存在该文件，不会生成合成文件";
			callback( err );
			return;
		}
		if ( path.extname( resource[i] ) != ".png" ) {
			err.text = "文件格式有误，只能处理png文件，不会生成合成文件";
			callback( err );
			return;
		}
	}
	var returnInfo = {
		sprite : {},
		element : {}
	};
	var align = obj.align || 2;// 默认是2倍
	obj.baseName = obj.baseName || "cloud7-";
	var pngs = [];// 存放每张png的数据,每个元素都是个对象，包含数据数组，尺寸
	util.loopArray( resource, function ( src ) {
		var img = images( src );
		var rawWidth = img.width();
		var rawHeight = img.height();
		var width = rawWidth + (2 * obj.padding || 0);
		var height = rawHeight + (2 * obj.padding || 0);
		width = ((width % align == 0) ? width : width + align - width % align);
		height = ( (height % align == 0) ? height : height + align - height % align);
		pngs.push( {
			name : src,
			rawWidth : rawWidth,
			rawHeight : rawHeight,
			width : width,
			height : height,
			data : img
		} );
	} );
	generate();

	function generate() {
		// bin-packing算法
		var info = Bin( pngs );
		util.loopArray( pngs, function ( img, i ) {
			result.images.push( {
				path : img.name,
				x : info.pos[i].x,
				y : info.pos[i].y,
				width : img.rawWidth,
				height : img.rawHeight
			} );
		} );
		result.width = (info.width % align) == 0 ? info.width : info.width + align - info.width % align;
		result.height = (info.height % align) == 0 ? info.height : info.height + align - info.height % align;
		var png = images( result.width, result.height );
		// 按顺序将数据写入png.data
		util.loopArray( pngs, function ( img, i ) {
			png.draw( img.data, info.pos[i].x, info.pos[i].y );
		} );
		result.data = png.encode( "png" );
		callback( null, result );
	}
};

exports.compress = util.compress;
