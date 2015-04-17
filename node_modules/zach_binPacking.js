/**
 * Created by Json on 2014/12/5.
 */
util = require( './zach_spriteUtil' ).util;
var sort = function ( arr, mark ) {
	var temp = 0;
	for ( var i = 0; i < arr.length; i++ ) {
		for ( var j = 0; j < arr.length - i - 1; j++ ) {
			var pre = mark ? arr[j][mark] : arr[j];
			var aft = mark ? arr[j + 1][mark] : arr[j + 1];
			if ( pre < aft ) {
				temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
			}
		}
	}
	return arr;
};
var Bin = function ( rawblocks ) {
	var blocks = sort( rawblocks, "width" );
	// blocks是按照宽度从小到大排列
	var pixs = [];// 容器映射
	var width = blocks[0].width;

	function grow( height ) {
		// 容器增加高度
		// blocks是按照宽度从小到大排列
		//  console.log( height );
		var offsety = pixs.length;
		util.loop( height, function ( y ) {
			pixs[y + offsety] = [];
			util.loop( width, function ( x ) {
				pixs[y + offsety][x] = 0;
			} );
		} )
	}

	function dirty( x, y, w, h ) {
		//  console.log( "  x:" + x + "  y:" + y + "  w0:" + w + "  h0:" + h + "  width:" + pixs[0].length + "  height:" + pixs.length );
		util.loop( h, function ( y0 ) {
			util.loop( w, function ( x0 ) {
				pixs[y + y0][x + x0] = 1;
			} )
		} )
	}

	var positions = [{
		x : 0,
		y : 0
	}];

	// 初始化
	util.loop( blocks[0].height, function ( y ) {
		pixs[y] = [];
		util.loop( blocks[0].width, function ( x ) {
			pixs[y][x] = 1;
		} );
	} );
	if ( blocks.length > 1 ) {
		util.loopArray( blocks.slice( 1, blocks.length ), function ( block, i ) {
			// 对每块block布局
			if ( i == 0 ) {
				grow( block.height );
				dirty( 0, blocks[0].height, block.width, block.height );
				positions.push( {
					x : 0,
					y : blocks[0].height
				} )
			}
			else {
				var regions = {
					len : 0
				};
				var offsety = pixs.length;
				for ( var line = 0; line < pixs.length; line++ ) {
					for ( var c = 0; c < pixs[line].length; c++ ) {
						if ( (c == 0 && pixs[line][c] == 0) || (c != pixs[line].length - 1 && pixs[line][c] != pixs[line][c + 1] ) || ( pixs[line][c] == 0 && c == pixs[line].length - 1) ) {
							if ( regions[line] == undefined ) {
								regions[line] = [];
							}
							if ( c == 0 && pixs[line][c] == 0 ) {
								regions[line].push( c );
							}
							else if ( c != pixs[line].length - 1 && pixs[line][c] == 1 ) {
								regions[line].push( c + 1 );
							}
							else {
								regions[line].push( c );
							}
							regions.len++;
							offsety = line;
						}
					}
				}
				if ( regions.len == 0 ) {
					positions.push( {
						x : 0,
						y : pixs.length
					} );
					grow( block.height );
					dirty( 0, pixs.length - block.height, block.width, block.height );
					regions = null;
				}
				else {
					// 查找能够插入的区间
					var isFit = false;
					var ismeetDirty = false;
					for ( var line0 in regions ) {
						for ( c = 0; c < regions[line0].length; ) {
							if ( regions[line0][c + 1] - regions[line0][c] + 1 >= block.width ) {
								var y = 0;
								offsety = parseInt( line0 );
								ismeetDirty = false;
								for ( ; y < pixs.length - offsety; y++ ) {
									if ( pixs[y + offsety][regions[line0][c]] == 1 || pixs[y + offsety][regions[line0][c + 1]] == 1 ) {
										ismeetDirty = true;
										break;
									}
									else if ( y >= block.height ) {
										//  已经可以容纳了
										isFit = true;
										dirty( regions[line0][c], offsety, block.width, block.height );
										positions.push( {
											x : regions[line0][c],
											y : offsety
										} );
										break;
									}
								}
								if ( !isFit && ismeetDirty == false ) {
									// 不能直接容纳，拓容量
									grow( block.height - y );
									dirty( regions[line0][c], offsety, block.width, block.height );
									positions.push( {
										x : regions[line0][c],
										y : offsety
									} );
									isFit = true;
									break;
								}
							}
							c = c + 2;
						}
						if ( isFit ) {
							break;
						}
					}
					if ( isFit == false ) {
						grow( block.height );
						dirty( 0, pixs.length - block.height, block.width, block.height );
						positions.push( {
							x : 0,
							y : pixs.length - block.height
						} );
					}
				}
			}
		} )
	}

	return {
		width : pixs[0].length,
		height : pixs.length,
		pos : positions
	};

};

exports.Bin = Bin;