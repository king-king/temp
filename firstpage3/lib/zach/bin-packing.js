/**
 * Created by 白 on 2015/7/6.
 */

library( function () {
	var func = imports( "function" ),
		array = imports( "array" );

	function binPacking( rawBlocks ) {
		var blocks = rawBlocks.sort( function ( lhs, rhs ) {
				return rhs.width - lhs.width;
			} ), // blocks是按照宽度从小到大排列
			pixels = [], // 容器映射
			width = blocks[0].width;

		function grow( height ) {
			// 容器增加高度
			var offsetY = pixels.length;
			func.loop( height, function ( y ) {
				pixels[y + offsetY] = [];
				func.loop( width, function ( x ) {
					pixels[y + offsetY][x] = 0;
				} );
			} )
		}

		function dirty( x, y, w, h ) {
			func.loop( h, function ( y0 ) {
				func.loop( w, function ( x0 ) {
					pixels[y + y0][x + x0] = 1;
				} )
			} )
		}

		var positions = [{
			x : 0,
			y : 0
		}];

		// 初始化
		func.loop( blocks[0].height, function ( y ) {
			pixels[y] = [];
			func.loop( blocks[0].width, function ( x ) {
				pixels[y][x] = 1;
			} );
		} );

		if ( blocks.length > 1 ) {
			array.foreach( blocks.slice( 1, blocks.length ), function ( block, i ) {
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
						},
						offsetY = pixels.length;

					for ( var line = 0; line < pixels.length; line++ ) {
						for ( var c = 0; c < pixels[line].length; c++ ) {
							if ( (c == 0 && pixels[line][c] == 0) || (c != pixels[line].length - 1 && pixels[line][c] != pixels[line][c + 1] ) || ( pixels[line][c] == 0 && c == pixels[line].length - 1) ) {
								if ( regions[line] == undefined ) {
									regions[line] = [];
								}
								if ( c == 0 && pixels[line][c] == 0 ) {
									regions[line].push( c );
								}
								else if ( c != pixels[line].length - 1 && pixels[line][c] == 1 ) {
									regions[line].push( c + 1 );
								}
								else {
									regions[line].push( c );
								}
								regions.len++;
								offsetY = line;
							}
						}
					}

					if ( regions.len == 0 ) {
						positions.push( {
							x : 0,
							y : pixels.length
						} );
						grow( block.height );
						dirty( 0, pixels.length - block.height, block.width, block.height );
						regions = null;
					}
					else {
						// 查找能够插入的区间
						var isFit = false;
						var isMeetDirty = false;
						for ( var line0 in regions ) {
							for ( c = 0; c < regions[line0].length; ) {
								if ( regions[line0][c + 1] - regions[line0][c] + 1 >= block.width ) {
									var y = 0;
									offsetY = parseInt( line0 );
									isMeetDirty = false;
									for ( ; y < pixels.length - offsetY; y++ ) {
										if ( pixels[y + offsetY][regions[line0][c]] == 1 || pixels[y + offsetY][regions[line0][c + 1]] == 1 ) {
											isMeetDirty = true;
											break;
										}
										else if ( y >= block.height ) {
											//  已经可以容纳了
											isFit = true;
											dirty( regions[line0][c], offsetY, block.width, block.height );
											positions.push( {
												x : regions[line0][c],
												y : offsetY
											} );
											break;
										}
									}

									if ( !isFit && isMeetDirty == false ) {
										// 不能直接容纳，拓容量
										grow( block.height - y );
										dirty( regions[line0][c], offsetY, block.width, block.height );
										positions.push( {
											x : regions[line0][c],
											y : offsetY
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
							dirty( 0, pixels.length - block.height, block.width, block.height );
							positions.push( {
								x : 0,
								y : pixels.length - block.height
							} );
						}
					}
				}
			} );
		}

		return {
			width : pixels[0].length,
			height : pixels.length,
			pos : positions
		};
	}

	module.exports = binPacking;
} );