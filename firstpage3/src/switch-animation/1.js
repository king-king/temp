/**
 * Created by 白 on 2015/3/12.
 */

plugin( function () {
	var css = imports( "css" ),
		csa = imports( "css-animation" );

	switchAnimations.fade = function ( curPage, newPage, callback, parent, duration ) {
		duration = duration || 0.8;
		parent = parent || body;
		parent.appendChild( newPage );

		return csa.runAnimation( [
			[curPage, {
				100 : {
					opacity : 0
				}
			}, duration, 0, "linear"],
			[newPage, {
				0 : {
					opacity : 0
				}
			}, duration, 0, "linear"]
		], callback );
	};

	switchAnimations.classic = function ( curPage, newPage, callback ) {
		body.appendChild( newPage );

		return csa.runAnimation( [
			[curPage, {
				100 : {
					transform : "translate3d(0, -30%, 0) scale(0.5)"
				}
			}, 0.8, 0],
			[newPage, {
				0 : {
					transform : "translate3d(0, 100%, 0)"
				}
			}, 0.8, 0]
		], callback );
	};

	switchAnimations.push = function ( curPage, newPage, callback, parent, duration ) {
		duration = duration || 0.8;
		parent = parent || body;
		parent.appendChild( newPage );

		return csa.runAnimation( [
			[curPage, {
				100 : {
					transform : "translate3d(0, -100%, 0)"
				}
			}, duration, "ease-in-out", 0],
			[newPage, {
				0 : {
					transform : "translate3d(0, 100%, 0)"
				}
			}, duration, "ease-in-out", 0]
		], callback );
	};

	switchAnimations.back = function ( curPage, newPage, callback, parent, duration ) {
		duration = duration || 0.5;
		parent = parent || body;
		parent.appendChild( newPage );

		return csa.runAnimation( [
			[curPage, {
				100 : {
					transform : "translate3d(0, 100%, 0)"
				}
			}, duration, "ease-in-out", 0],
			[newPage, {
				0 : {
					transform : "translate3d(0, -100%, 0)"
				}
			}, duration, "ease-in-out", 0]
		], callback );
	};

	switchAnimations.uncover = function ( curPage, newPage, callback ) {
		css( curPage, "z-index", 100 );
		body.appendChild( newPage );

		return csa.runAnimation( [
			[curPage, {
				100 : {
					transform : "translate3d(0, -100%, 0)"
				}
			}, 0.8, 0]
		], callback );
	};

	switchAnimations.cube = function ( curPage, newPage, callback ) {
		body.appendChild( newPage );

		var cssHandle = css( body, {
			perspective : 1000,
			background : "#FFFFFF"
		} );

		return csa.runAnimation( [
			[curPage, {
				0 : {
					"transform-origin" : "50% 100%",
					"z-index" : 2
				},
				100 : {
					"transform-origin" : "50% 100%",
					transform : "translate3d(0, -100%, 0) rotateX(90deg)",
					"z-index" : 0
				}
			}, 1, 0, "linear"],
			[newPage, {
				0 : {
					"transform-origin" : "50% 0%",
					transform : "translate3d(0, 100%, 0) rotateX(-90deg)",
					"z-index" : 0
				},
				100 : {
					"transform-origin" : "50% 0%",
					"z-index" : 1
				}
			}, 1, 0, "linear"]
		], function () {
			cssHandle.remove();
			callback && callback();
		} );
	};

	switchAnimations.overturn = function ( curPage, newPage, callback ) {
		body.appendChild( newPage );

		var cssHandle = css( body, {
			perspective : 1000,
			background : "#FFFFFF"
		} );

		return csa.runAnimation( [
			[curPage, {
				0 : {
					"transform-origin" : "0 50%",
					"z-index" : 2
				},
				50 : {
					"transform-origin" : "0 50%",
					transform : "translate3d(50%, 0, 100px) rotateY(90deg)",
					"z-index" : 1
				},
				100 : {
					"transform-origin" : "0 50%",
					transform : "translate3d(100%, 0, 0) rotateY(180deg)",
					"z-index" : 0
				}
			}, 1, 0, "linear"],
			[newPage, {
				0 : {
					"transform-origin" : "100% 50%",
					transform : "translate3d(-100%, 0, 0) rotateY(180deg)",
					"z-index" : 0
				},
				50 : {
					"transform-origin" : "100% 50%",
					transform : "translate3d(-50%, 0, 100px) rotateY(270deg)",
					"z-index" : 0.5
				},
				100 : {
					"transform-origin" : "100% 50%",
					transform : "translate3d(0, 0, 0) rotateY(360deg)",
					"z-index" : 1
				}
			}, 1, 0, "linear"]
		], function () {
			cssHandle.remove();
			callback && callback();
		} );
	};

	switchAnimations["switch"] = function ( curPage, newPage, callback ) {
		body.appendChild( newPage );

		var cssHandle = css( body, {
			perspective : 1000,
			background : "#FFFFFF"
		} );

		return csa.runAnimation( [
			[curPage, {
				0 : {
					"transform-origin" : "100% 50%",
					"z-index" : 2
				},
				50 : {
					"transform-origin" : "100% 50%",
					transform : "translate3d(50%, 0, 0) rotateY(-30deg)",
					"z-index" : 1
				},
				100 : {
					"transform-origin" : "100% 50%",
					transform : "translate3d(0, 0, -130px)",
					"z-index" : 0
				}
			}, 1, 0, "linear"],
			[newPage, {
				0 : {
					"transform-origin" : "0 50%",
					transform : "translate3d(0, 0, -130px)",
					"z-index" : 0
				},
				50 : {
					"transform-origin" : "0 50%",
					transform : "translate3d(-50%, 0, 0) rotateY(30deg)",
					"z-index" : 0.5
				},
				100 : {
					"transform-origin" : "0 50%",
					"z-index" : 1
				}
			}, 1, 0, "linear"]
		], function () {
			cssHandle.remove();
			callback && callback();
		} );
	};
} );
