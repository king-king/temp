/**
 * Created by 白 on 2015/3/17.
 * 复杂效果
 */

plugin( function () {
	var func = imports( "function" ),
		$ = imports( "element" ),
		csa = imports( "css-animation" ),
		css = imports( "css" ),
		array = imports( "array" ),
		Img = imports( "../Img" ),
		px = css.px;

	function Fragment( targetCanvas, x, y, width, height, zi, parent ) {
		parent = parent || body;
		var canvas = Img.Canvas( width, height ),
			gc = canvas.context,
			dpr = canvas.dpr;

		gc.drawImage( targetCanvas, x * dpr, y * dpr, width * dpr, height * dpr, 0, 0, width, height );
		css( canvas, {
			"backface-visibility" : "hidden",
			position : "absolute",
			left : parent === body ? px( x ) : 0,
			top : parent === body ? px( y ) : 0,
			"z-index" : zi || 0
		} );
		parent.appendChild( canvas );
		return canvas;
	}

	switchAnimations.tease = function ( curPage, newPage, callback ) {
		var curCanvas = curPage.toCanvas(),
			partHeight = clientHeight / 8 << 0,
			animates = [];

		$.remove( curPage );
		body.appendChild( newPage );

		func.loop( 8, function ( i ) {
			var thisHeight = i === 7 ? clientHeight - partHeight * 7 : partHeight,
				thisTop = i === 7 ? clientHeight - thisHeight : thisHeight * i,
				j = 7 - i;

			animates.push( [
				Fragment( curCanvas, 0, thisTop, clientWidth, thisHeight, 1 ),
				j % 2 === 0 ? {
					100 : {
						transform : "translate3d(-100%, 0, 0)"
					}
				} : {
					100 : {
						transform : "translate3d(100%, 0, 0)"
					}
				}, 0.3, j * 0.1, "linear"
			] );
		} );

		return csa.runAnimation( animates, function () {
			array.foreach( animates, function ( animate ) {
				$.remove( animate[0] );
			} );
			callback && callback();
		} );
	};

	// 棋盘
	switchAnimations.chessboard = function ( curPage, newPage, callback ) {
		var curCanvas = curPage.toCanvas(),
			newCanvas = newPage.toCanvas(),
			cssHandle = css( body, {
				perspective : 1000,
				background : "#FFFFFF"
			} ),

			numX = ua.ios ? 4 : 2, numY = ua.ios ? 5 : 3, t,
			animates = [],
			left = 0;

		$.remove( curPage );

		if ( clientWidth > clientHeight ) {
			t = numX;
			numX = numY;
			numY = t;
		}

		// 制作碎片
		func.loop( numX, function ( i ) {
			var right = ( i + 1 ) / numX * clientWidth << 0,
				top = 0;

			func.loop( numY, function ( j ) {
				var bottom = ( j + 1 ) / numY * clientHeight << 0,
					width = right - left,
					height = bottom - top,
					delay = 0.8 / numX * i + Math.random() * 0.4;

				func.loop( 2, function ( n ) {
					animates.push( [
						Fragment( n === 0 ? curCanvas : newCanvas, left, top, width, height, 2 - n ),
						n === 0 ? {
							0 : {
								"z-index" : 2
							},
							100 : {
								transform : "rotateY(180deg)",
								"z-index" : 0
							}
						} : {
							0 : {
								transform : "rotateY(180deg)",
								"z-index" : 0
							},
							100 : {
								transform : "rotateY(360deg)",
								"z-index" : 1
							}
						},
						0.8, delay, "linear"
					] );
				} );

				top = bottom;
			} );

			left = right;
		} );

		return csa.runAnimation( animates, function () {
			cssHandle.remove();
			array.foreach( animates, function ( animate ) {
				$.remove( animate[0] );
			} );
			callback && callback();
		} );
	};

	// 门
	switchAnimations.door = function ( curPage, newPage, callback ) {
		var curCanvas = curPage.toCanvas(),
			cssHandle = css( body, {
				perspective : 1000,
				background : "#FFFFFF"
			} ),
			doors = [];

		$.remove( curPage );
		body.appendChild( newPage );
		array.foreach( [0, 0.5], function ( rx ) {
			doors.push( Fragment( curCanvas, rx * clientWidth, 0, clientWidth / 2, clientHeight, 1 ) );
		} );

		return csa.runAnimation( [
			[doors[0], {
				100 : {
					transform : "translate3d(-100%, 0, 0)",
					opacity : 0.4
				}
			}, 0.8, 0],
			[doors[1], {
				100 : {
					transform : "translate3d(100%, 0, 0)",
					opacity : 0.4
				}
			}, 0.8, 0],
			[newPage, {
				0 : {
					transform : "translate3d(0, 0, -1400px)"
				}
			}, 0.8, 0]
		], function () {
			cssHandle.remove();
			array.foreach( doors, function ( door ) {
				$.remove( door );
			} );
			callback && callback();
		} );
	};

	// 翻页
	switchAnimations.flipOver = function ( curPage, newPage, callback ) {
		var curCanvas = curPage.toCanvas(),
			newCanvas = newPage.toCanvas(),
			cssHandle = css( body, {
				perspective : 1000,
				background : "#FFFFFF"
			} ),
			curTop = Fragment( curCanvas, 0, 0, clientWidth, clientHeight / 2, 1 ),
			curBottom = Fragment( curCanvas, 0, clientHeight / 2, clientWidth, clientHeight / 2, 1 ),
			newTop = Fragment( newCanvas, 0, 0, clientWidth, clientHeight / 2, 2 ),
			newBottom = Fragment( newCanvas, 0, clientHeight / 2, clientWidth, clientHeight / 2, 0 );

		$.remove( curPage );

		return csa.runAnimation( [
			[curBottom, {
				0 : {
					"transform-origin" : "50% 0",
					"z-index" : 3
				},
				100 : {
					"transform-origin" : "50% 0",
					transform : "rotateX(180deg)",
					"z-index" : 1
				}
			}, 0.8, 0],
			[newTop, {
				0 : {
					"transform-origin" : "50% 100%",
					transform : "rotateX(-180deg)",
					"z-index" : 1
				},
				100 : {
					"transform-origin" : "50% 100%",
					transform : "rotateX(0deg)",
					"z-index" : 2
				}
			}, 0.8, 0]
		], function () {
			cssHandle.remove();
			array.foreach( [curTop, curBottom, newTop, newBottom], function ( fragment ) {
				$.remove( fragment );
			} );
			callback && callback();
		} );
	};
} );
