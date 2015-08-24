/**
 * Created by WQ on 2015/4/20.
 */

plugin( function () {
	var array = imports( "array" ),
		$ = imports( "element" ),
		func = imports( "function" ),
		delaunay = imports( "delaunay" ),
		css = imports( "css" ),
		csa = imports( "css-animation" ),
		ua = imports( "ua" ),
		Img = imports( "../Img" );

	function getOneTriangle( img, p1, p2, p3 ) {
		// 先得到bounds
		var x = Math.min( p1[0], p2[0], p3[0] );
		var y = Math.min( p1[1], p2[1], p3[1] );
		var w = Math.max( p1[0], p2[0], p3[0] ) - x;
		var h = Math.max( p1[1], p2[1], p3[1] ) - y;

		var layer = Img.Canvas( w, h );
		var gc = layer.context;
		gc.drawImage( img, x * layer.dpr, y * layer.dpr, w * layer.dpr, h * layer.dpr, 0, 0, w, h );
		gc.globalCompositeOperation = "destination-in";
		gc.beginPath();
		gc.fillStyle = "red";
		gc.moveTo( p1[0] - x, p1[1] - y );
		gc.lineTo( p2[0] - x, p2[1] - y );
		gc.lineTo( p3[0] - x, p3[1] - y );
		gc.lineTo( p1[0] - x, p1[1] - y );
		gc.fill();
		css( layer, {
			position : "absolute",
			left : x + "px",
			top : y + "px",
			"z-index" : 1
		} );
		body.appendChild( layer );
		return layer;
	}

	function getOneRect( img, x, y, w, h ) {
		var layer = Img.Canvas( w, h );
		var gc = layer.context;
		gc.drawImage( img, x * layer.dpr, y * layer.dpr, w * layer.dpr, h * layer.dpr, 0, 0, w, h );
		css( layer, {
			"backface-visibility" : "hidden",
			position : "absolute",
			left : x + "px",
			top : y + "px",
			"z-index" : 3
		} );
		body.appendChild( layer );
		return layer;
	}

	// 生成一个不规则形状
	function getOneIrregularShape( img, bound, points ) {
		var layer = Img.Canvas( bound.w, bound.h );
		var gc = layer.context;
		gc.drawImage( img, bound.x * layer.dpr, bound.y * layer.dpr, bound.w * layer.dpr, bound.h * layer.dpr, 0, 0, bound.w, bound.h );
		gc.globalCompositeOperation = "destination-in";
		gc.beginPath();
		gc.moveTo( points[0][0] - bound.x, points[0][1] - bound.y );
		func.loop( points.length - 1, function ( i ) {
			gc.lineTo( points[i + 1][0] - bound.x, points[i + 1][1] - bound.y );
		} );
		gc.lineTo( points[0][0] - bound.x, points[0][1] - bound.y );
		gc.fillStyle = "green";
		gc.fill();
		css( layer, {
			position : "absolute",
			left : bound.x + "px",
			top : bound.y + "px",
			"z-index" : 3
		} );
		body.appendChild( layer );
		return layer;
	}

	// 碎玻璃效果
	switchAnimations.cullet = function ( curPage, newPage, callback ) {
		var curCanvas = curPage.toCanvas(),
			animates = [];

		$.remove( curPage );
		body.appendChild( newPage );

		var points = [];
		func.loop( 20, function () {
			points.push( [
				Math.random() * clientWidth << 0,
				Math.random() * clientHeight << 0
			] );
		} );
		points.push( [0, 0] );
		points.push( [0, clientHeight] );
		points.push( [clientWidth, 0] );
		points.push( [clientWidth, clientHeight] );
		var tran = delaunay.triangulate( points );
		for ( var i = 0; i < tran.length; i += 3 ) {
			var layer = getOneTriangle( curCanvas, points[tran[i]], points[tran[i + 1]], points[tran[i + 2]] );
			animates.push( [layer, {
				0 : {
					opacity : 1
				}, 100 : {
					opacity : 0,
					transform : "translate3d(0," + clientHeight + "px,0) rotateZ(" + (90 * (Math.random() - 0.5)) + "deg)"
				}
			}, 1, i < 3 ? 0 : Math.random() * 2, "ease-out"] );
		}

		return csa.runAnimation( animates, function () {
			array.foreach( animates, function ( animate ) {
				$.remove( animate[0] );
			} );
			callback && callback();
		} );
	};

	// 流水线效果
	switchAnimations.streamLine = function ( curPage, newPage, callback ) {
		var newCanvas = newPage.toCanvas(),
			count = 5,
			animates = [],
			dw = clientWidth / count << 0,
			dh = clientHeight / count << 0;

		func.loop( count, function ( y ) {
			func.loop( count, function ( x ) {
				var w = x == count - 1 ? clientWidth - x * dw : dw;
				var h = y == count - 1 ? clientHeight - y * dh : dh;
				var layer = getOneRect( newCanvas, y % 2 == 0 ? x * dw : (count - 1 - x) * dw, y * dh, w, h );
				css( layer, {
					"transform-origin" : y % 2 == 0 ? "0 0" : "100% 0",
					"perspective" : "400px",
					transform : "rotateY(90deg)"
				} );
				animates.push( [layer, {
					0 : {
						transform : y % 2 == 0 ? "rotateY(90deg)" : "rotateY(-90deg)"
					}, 100 : {
						transform : "rotateY(0deg)"
					}
				}, 0.05, (y * count + x) * 0.05, "cubic-bezier(.97,.09,0,.94)"] );
			} );
		} );

		return csa.runAnimation( animates, function () {
			$.remove( curPage );
			array.foreach( animates, function ( animate ) {
				$.remove( animate[0] );
			} );
			callback && callback();
		} );
	};

	// 剥落
	switchAnimations.drop = function ( curPage, newPage, callback ) {
		var curCanvas = curPage.toCanvas(),
			animates = [],
			count = 5,
			dw = clientWidth / count << 0,
			dh = clientHeight / count << 0;

		$.remove( curPage );
		body.appendChild( newPage );

		func.loop( 2 * count - 1, function ( y ) {
			func.loop( y + 1, function ( n ) {
				var w = n == count - 1 ? clientWidth - n * dw : dw;
				var h = (y - n) == count - 1 ? clientHeight - (y - n) * dh : dh;

				if ( 0 + n < count && y - n < count ) {
					var layer = getOneRect( curCanvas, n * dw, (y - n) * dh, w, h );
					animates.push( [layer,
						{
							0 : {
								opacity : 1
							}, 100 : {
							opacity : 0,
							transform : "translate3d(0," + clientHeight + "px,0) rotateZ(" + (90 * (Math.random() - 0.5)) + "deg)"
						}
						},
						2,
						(count - y) * 0.2 * Math.random(),
						"cubic-bezier(.17,.67,.63,1.59)"
					] );
				}
			} );
		} );

		return csa.runAnimation( animates, function () {
			array.foreach( animates, function ( animate ) {
				$.remove( animate[0] );
			} );
			callback && callback();
		} );
	};

	// 剥落2
	switchAnimations.drop2 = function ( curPage, newPage, callback ) {
		var curCanvas = curPage.toCanvas(),
			animates = [],
			count = 7,
			dh = clientHeight / count << 0;
		$.remove( curPage );
		body.appendChild( newPage );
		func.loop( count, function ( i ) {
			animates.push( [getOneRect( curCanvas, 0, dh * i, clientWidth, i == count - 1 ? clientHeight - i * dh : dh ),
				{
					0 : {
						"transform-origin" : i % 2 == 0 ? "0 0" : "100% 0"
					},
					100 : {
						"transform-origin" : i % 2 == 0 ? "0 0" : "100% 0",
						"transform" : "translate3d(0," + clientHeight + "px,0) rotateZ(" + (i % 2 == 0 ? 90 : -90) + "deg)"
					}
				}, 1, (count - i) * 0.3, "cubic-bezier(.86,.1,.88,.43)"
			] )
		} );

		return csa.runAnimation( animates, function () {
			array.foreach( animates, function ( animate ) {
				$.remove( animate[0] );
			} );
			callback && callback();
		} );
	};

	// 油滴
	switchAnimations.oilDroplet = function ( curPage, newPage, callback ) {
		var newCanvas = newPage.toCanvas(),
			count = 5,
			animates = [],
			dw = clientWidth / count << 0,
			dh = clientHeight / count << 0;
		func.loop( count, function ( y ) {
			func.loop( count, function ( x ) {
				var w = x == count - 1 ? clientWidth - (count - 1) * dw : dw;
				var h = y == count - 1 ? clientHeight - (count - 1) * dh : dh;
				animates.push( [getOneRect( newCanvas, x * dw, y * dh, w, h ),
					{
						0 : {
							transform : "scale(0)",
							"border-radius" : "100%"
						},
						70 : {
							transform : "scale(1)",
							"border-radius" : "100%"
						},
						85 : {
							transform : "scale(0.8)",
							"border-radius" : "100%"
						},
						100 : {
							transform : "scale(1)",
							"border-radius" : "0"
						}
					},
					1,
					Math.random(),
					"cubic-bezier(.97,.09,0,.89)"] );
			} );
		} );

		return csa.runAnimation( animates, function () {
			$.remove( curPage );
			array.foreach( animates, function ( animate ) {
				$.remove( animate[0] );
			} );
			callback && callback();
		} );
	};

	// 制作魔方
	function makeRubik( curPage, newPage, callback, doCut ) {
		$.remove( curPage );
		var curCanvas = curPage.toCanvas(),
			newCanvas = newPage.toCanvas(),
			cssHandle = css( body, {
				perspective : 1000,
				background : "#aaa"
			} ),
			count = 4,
			animates = [];

		func.loop( count, function ( i ) {
			animates.push( doCut( newCanvas, i, count, true ) );
			animates.push( doCut( curCanvas, i, count, false ) );
		} );

		return csa.runAnimation( animates, function () {
			cssHandle.remove();
			array.foreach( animates, function ( animate ) {
				$.remove( animate[0] );
			} );
			callback && callback();
		} );
	}

	// 魔方2
	switchAnimations.rubik = function ( curPage, newPage, callback ) {
		makeRubik( curPage, newPage, callback, function ( canvas, i, count, isNew ) {
			var dw = clientWidth / count << 0;
			return [getOneRect( canvas, i * dw, 0, i == count - 1 ? clientWidth - i * dw : dw, clientHeight ),
				isNew ? {
					0 : {
						"transform-origin" : "50% 0%",
						"transform" : "translate3d(0, 100%, 0) rotateX(-90deg)",
						"z-index" : 0
					},
					100 : {
						"transform-origin" : "50% 0%",
						"z-index" : 1
					}
				} : {
					0 : {
						"transform-origin" : "50% 100%",
						"z-index" : 2
					},

					100 : {
						"transform-origin" : "50% 100%",
						transform : "translate3d(0, -100%, 0) rotateX(90deg)",
						"z-index" : 0
					}
				}, 1, i * 0.1, "linear"
			];
		} );
	};

	// 魔方3
	switchAnimations.rubik2 = function ( curPage, newPage, callback ) {
		makeRubik( curPage, newPage, callback, function ( canvas, i, count, isNew ) {
			var dh = clientHeight / count << 0;
			return [getOneRect( canvas, 0, i * dh, clientWidth, i == count - 1 ? clientHeight - i * dh : dh ),
				isNew ? {
					0 : {
						"transform-origin" : "0% 50%",
						"transform" : "translate3d(100%, 0, 0) rotateY(90deg)",
						"z-index" : 0
					},
					100 : {
						"transform-origin" : "0% 50%",
						"z-index" : 1
					}
				} : {
					0 : {
						"transform-origin" : "100% 50%",
						"z-index" : 2
					},

					100 : {
						"transform-origin" : "100% 50%",
						"transform" : "translate3d(-100%, 0, 0) rotateY(-90deg)",
						"z-index" : 0
					}
				}, 1, (count - i - 1) * 0.2, "linear"
			];
		} );
	};

	// 吸入
	switchAnimations.absorb = function ( curPage, newPage, callback ) {
		var curCanvas = curPage.toCanvas(),
			animates = [];
		var x0 = clientWidth / 2 << 0,
			y0 = clientHeight / 2 << 0,
			shapes = [
				[[x0, y0], [x0, clientHeight], [0, clientHeight], [0, y0 + x0]],
				[[x0, y0], [0, x0 + y0], [0, y0]],
				[[x0, y0], [0, y0], [0, y0 - x0]],
				[[x0, y0], [0, y0 - x0], [0, 0], [x0, 0]],
				[[x0, y0], [x0, 0], [clientWidth, 0], [clientWidth, y0 - x0]],
				[[x0, y0], [clientWidth, y0 - x0], [clientWidth, y0]],
				[[x0, y0], [clientWidth, y0], [clientWidth, y0 + x0]],
				[[x0, y0], [clientWidth, y0 + x0], [clientWidth, clientHeight], [x0, clientHeight]]
			],
			bounds = [
				{x : 0, y : y0, w : x0, h : y0},
				{x : 0, y : y0, w : x0, h : x0},
				{x : 0, y : y0 - x0, w : x0, h : x0},
				{x : 0, y : 0, w : x0, h : y0},
				{x : clientWidth - x0, y : 0, w : clientWidth - x0, h : y0},
				{x : clientWidth - x0, y : y0 - x0, w : clientWidth - x0, h : x0},
				{x : clientWidth - x0, y : y0, w : clientWidth - x0, h : x0},
				{x : clientWidth - x0, y : y0, w : clientWidth - x0, h : clientHeight - y0}
			];
		$.remove( curPage );
		body.appendChild( newPage );
		func.loop( shapes.length, function ( i ) {
			var origin = (i < 4 ? "100%" : "0") + (i > 1 && i < 6 ? "  100%" : "  0");
			animates.push( [css( getOneIrregularShape( curCanvas, bounds[i], shapes[i] ), "transform-origin", origin ).element,
				{
					0 : {
						opacity : 1,
						transform : "rotateZ(0deg)"
					},
					30 : {
						opacity : 1,
						transform : "rotateZ(1deg)"
					},
					100 : {
						opacity : 0,
						transform : "scale(0.2) rotateZ(-600deg)"
					}
				}, 1.2, 0.1 * i, "ease-in"
			] );
		} );
		return csa.runAnimation( animates, function () {
			array.foreach( animates, function ( animate ) {
				$.remove( animate[0] );
			} );
			callback && callback();
		} );
	};

	// 展翅
	switchAnimations.windmill = function ( curPage, newPage, callback ) {
		var animates = [];
		var x0 = clientWidth / 2 << 0,
			y0 = clientHeight / 2 << 0,
			shapes = [
				[[x0, y0], [x0, clientHeight], [0, clientHeight], [0, y0 + x0]],
				[[x0, y0], [0, x0 + y0], [0, y0]],
				[[x0, y0], [0, y0], [0, y0 - x0]],
				[[x0, y0], [0, y0 - x0], [0, 0], [x0, 0]],
				[[x0, y0], [x0, 0], [clientWidth, 0], [clientWidth, y0 - x0]],
				[[x0, y0], [clientWidth, y0 - x0], [clientWidth, y0]],
				[[x0, y0], [clientWidth, y0], [clientWidth, y0 + x0]],
				[[x0, y0], [clientWidth, y0 + x0], [clientWidth, clientHeight], [x0, clientHeight]]
			],
			bounds = [
				{x : 0, y : y0, w : x0, h : y0},
				{x : 0, y : y0, w : x0, h : x0},
				{x : 0, y : y0 - x0, w : x0, h : x0},
				{x : 0, y : 0, w : x0, h : y0},
				{x : clientWidth - x0, y : 0, w : clientWidth - x0, h : y0},
				{x : clientWidth - x0, y : y0 - x0, w : clientWidth - x0, h : x0},
				{x : clientWidth - x0, y : y0, w : clientWidth - x0, h : x0},
				{x : clientWidth - x0, y : y0, w : clientWidth - x0, h : clientHeight - y0}
			];
		var newCanvas = newPage.toCanvas();
		func.loop( shapes.length / 2, function ( i ) {
			var origin = (i < 4 ? "100%" : "0") + (i > 1 && i < 6 ? "  100%" : "  0");
			animates.push( [css( getOneIrregularShape( newCanvas, bounds[i], shapes[i] ), "transform-origin", origin ).element,
				{
					0 : {
						opacity : 0,
						transform : "scale(1) rotateZ(-" + 45 * i + "deg)"
					},
					100 : {
						opacity : 1,
						transform : "scale(1) rotateZ(0deg)"
					}
				}, 1, 0.1 * i, "ease-in"] );

			var origin2 = ((shapes.length - i - 1) < 4 ? "100%" : "0") + ((shapes.length - i - 1) > 1 && (shapes.length - i - 1) < 6 ? "  100%" : "  0");
			animates.push( [css( getOneIrregularShape( newCanvas, bounds[shapes.length - i - 1], shapes[shapes.length - i - 1] ), "transform-origin", origin2 ).element,
				{
					0 : {
						opacity : 0,
						transform : "scale(1) rotateZ(" + 45 * i + "deg)"
					},
					100 : {
						opacity : 1,
						transform : "scale(1) rotateZ(0deg)"
					}
				}, 1, 0.1 * i, "ease-in"] );
		} );
		return csa.runAnimation( animates, function () {
			array.foreach( animates, function ( animate ) {
				$.remove( animate[0] );
			} );
			callback && callback();
		} );
	};

	// 飞出
	switchAnimations.flyOut = function ( curPage, newPage, callback ) {
		body.appendChild( newPage );
		var cssHandle = css( body, {
			perspective : 1000,
			background : "#aaa"
		} );
		return csa.runAnimation( [
				[curPage, {
					0 : {
						opacity : 1
					},
					50 : {
						transform : "scale(0.4) translate3d(0,-50%,0)  rotateZ(0deg)"
					},
					100 : {
						opacity : 0,
						transform : "scale(0) translate3d(0,-50%,0) rotateZ(1800deg)"
					}
				}, 1, 0, "linear"],
				[newPage, {
					0 : {
						"transform-origin" : "50% 0%",
						transform : "translate3d(0, 100%, 0) rotateX(-90deg)",
						"z-index" : 0
					},

					100 : {
						"transform - origin" : "50% 0%",
						"z-index" : 1
					}
				}, 1, 0, "linear"]
			],
			function () {
				cssHandle.remove();
				callback && callback();
			}
		);
	};

	// 滚动
	switchAnimations.roll = function ( curPage, newPage, callback ) {
		body.appendChild( newPage );
		var cssHandle = css( body, {
			perspective : 1000,
			background : "#aaa"
		} );
		return csa.runAnimation( [
			[curPage, {
				0 : {
					"transform-origin" : "100% 100%",
					transform : "rotateZ(0deg)"
				},
				100 : {
					"transform-origin" : "100% 100%",
					transform : "rotateZ(90deg)"
				}
			}, 1, 0, "cubic-bezier(.11,.82,.48,.97)"],
			[newPage, {
				0 : {
					"transform-origin" : "0 100%",
					transform : "rotateZ(-90deg)"
				},
				100 : {
					"transform-origin" : "0 100%",
					transform : "rotateZ(0deg)"
				}
			}, 1, 0, "cubic-bezier(.65,.2,.85,.65)"]
		], function () {
			cssHandle.remove();
			callback && callback();
		} );
	};

	// 推倒
	switchAnimations.pushDown = function ( curPage, newPage, callback ) {
		body.appendChild( newPage );
		var cssHandle = css( body, {
			perspective : 1000,
			background : "#aaa"
		} );
		return csa.runAnimation( [
			[curPage, {
				0 : {
					"transform-origin" : "100% 100%",
					transform : "rotateX(0deg)"
				},
				100 : {
					"transform-origin" : "100% 100%",
					transform : "rotateX(90deg)",
					opacity : 0
				}
			}, 0.5, 0, "cubic-bezier(.11,.82,.48,.97)"],
			[newPage, {
				0 : {
					opacity : 0
				},
				100 : {
					opacity : 1
				}
			}, 1, 0.4, "ease-in"]
		], function () {
			cssHandle.remove();
			callback && callback();
		} );
	};

	// 拉幕
	switchAnimations.openTent = function ( curPage, newPage, callback ) {
		var curCanvas = curPage.toCanvas();
		$.remove( curPage );
		body.appendChild( newPage );
		var animates = [];
		var count = 25;
		var dh = clientHeight / count << 0;
		var dw = clientWidth / 2 << 0;

		func.loop( count, function ( i ) {
			animates.push( [getOneRect( curCanvas, 0, dh * i, dw, i == count - 1 ? clientHeight - i * dh : dh ),
				{
					0 : {
						opacity : 1
					},
					50 : {
						opacity : 1
					},
					100 : {
						opacity : 0,
						"transform" : "  translate3d(" + ( -5 * i) + "%,0,0)"
					}
				},
				1,
				0.1 * (count - i),
				"ease-out"
			] );
			animates.push( [getOneRect( curCanvas, dw, dh * i, clientWidth - dw, i == count - 1 ? clientHeight - i * dh : dh ),
				{
					0 : {
						opacity : 1
					},
					80 : {
						opacity : 1
					},
					100 : {
						opacity : 0,
						"transform" : " translate3d(" + ( 5 * i) + "%,0,0)"
					}
				},
				1,
				0.1 * (count - i),
				"ease-out"
			] );
		} );
		return csa.runAnimation( animates, function () {
			array.foreach( animates, function ( animate ) {
				$.remove( animate[0] );
			} );
			callback && callback();
		} );
	};

	//开裂
	switchAnimations.breaking = function ( curPage, newPage, callback ) {
		$.remove( curPage );
		body.appendChild( newPage );
		var curCanvas = curPage.toCanvas(),
			animates = [],
			halfW = clientWidth / 2 << 0,
			leftPoints = [
				[0, 0], [halfW, 0], [halfW, clientHeight / 20 << 0], [halfW / 3 * 2 << 0, clientHeight / 3 << 0],
				[halfW * 1.3 << 0, clientHeight * 0.5 << 0], [halfW * 0.9 << 0, clientHeight * 0.7 << 0],
				[halfW, clientHeight * 0.75 << 0], [halfW, clientHeight * 0.8 << 0], [halfW * 1.3 << 0, clientHeight * 0.88 << 0],
				[halfW * 0.9 << 0, clientHeight], [0, clientHeight]
			],
			leftBound = {x : 0, y : 0, w : halfW * 1.3 << 0, h : clientHeight},
			rightPoints = [
				[clientWidth, 0], [clientWidth - halfW, 0], [clientWidth - halfW, clientHeight / 20 << 0], [halfW / 3 * 2 << 0, clientHeight / 3 << 0],
				[halfW * 1.3 << 0, clientHeight * 0.5 << 0], [halfW * 0.9 << 0, clientHeight * 0.7 << 0],
				[halfW, clientHeight * 0.75 << 0], [halfW, clientHeight * 0.8 << 0], [halfW * 1.3 << 0, clientHeight * 0.88 << 0],
				[halfW * 0.9 << 0, clientHeight], [clientWidth, clientHeight]
			],
			rightBound = {x : halfW / 3 * 2 << 0, y : 0, w : clientWidth - (halfW / 3 * 2 << 0), h : clientHeight};

		animates.push( [getOneIrregularShape( curCanvas, leftBound, leftPoints ),
			{
				35 : {
					"transform" : " translate3d(-1%,0,0)"
				},
				60 : {
					"transform" : " translate3d(0,0,0)"
				},
				100 : {
					"transform" : " translate3d(-100%,0,0)"
				}
			},
			1.3,
			0,
			"ease-out"
		] );
		animates.push( [getOneIrregularShape( curCanvas, rightBound, rightPoints ),
			{
				35 : {
					"transform" : " translate3d(1%,0,0)"
				},
				60 : {
					"transform" : " translate3d(0,0,0)"
				},
				100 : {
					"transform" : " translate3d(100%,0,0)"
				}
			},
			1.3,
			0,
			"ease-out"
		] );
		return csa.runAnimation( animates, function () {
			array.foreach( animates, function ( animate ) {
				$.remove( animate[0] );
			} );
			callback && callback();
		} );
	};
} );