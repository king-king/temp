/**
 * Created by 白 on 2014/9/11.
 */

library( function () {
	var object = imports( "object" ),
		animation = imports( "animation" ),
		enterAnimation = {};

	function Direction( direction ) {
		switch ( direction ) {
			case 3:
				return [-1, 0];
			case 1:
				return [1, 0];
			case 0:
				return [0, -1];
			case 2:
				return [0, 1];
		}
	}

	function percent( value ) {
		return value + "%";
	}

	// 飞入
	enterAnimation.FlyInto = function ( direction ) {
		var xy = Direction( direction );

		return {
			direction : direction,
			progress : {
				"0" : object.defineGetter( {}, {
					x : function () {
						return xy[0] * Math.max( clientWidth, clientWidth ) * 2;
					},
					y : function () {
						return xy[1] * Math.max( clientWidth, clientWidth ) * 2;
					}
				} )
			}
		};
	};

	// 果冻
	enterAnimation.rubberBand = {
		scale : true,
		progress : {
			"30" : {
				scaleX : 1.25,
				scaleY : 0.75
			},
			"40" : {
				scaleX : 0.75,
				scaleY : 1.25
			},
			"50" : {
				scaleX : 1.15,
				scaleY : 0.85
			},
			"65" : {
				scaleX : 0.95,
				scaleY : 1.05
			},
			"75" : {
				scaleX : 1.05,
				scaleY : 0.95
			}
		}
	};

	// 得瑟
	enterAnimation.tada = {
		scale : true,
		timing : animation.Timing.linear,
		progress : {
			"10 20" : {
				scale : 0.9,
				rotate : -3
			},
			"30 50 70 90" : {
				scale : 1.1,
				rotate : 3
			},
			"40 60 80" : {
				scale : 1.1,
				rotate : -3
			}
		}
	};

	// 钟摆
	enterAnimation.wobble = {
		duration : 0.8,
		progress : {
			"15" : {
				x : "-25%",
				rotate : -5
			},
			"30" : {
				x : "20%",
				rotate : 3
			},
			"45" : {
				x : "-15%",
				rotate : -3
			},
			"60" : {
				x : "10%",
				rotate : 2
			},
			"75" : {
				x : "-5%",
				rotate : -1
			}
		}
	};

	// 抖动
	enterAnimation.shake = {
		timing : animation.Timing.linear,
		duration : 1,
		progress : {
			"10 30 50 70 90" : {
				x : -10
			},
			"20 40 60 80" : {
				x : 10
			}
		}
	};

	// 落下抖动
	enterAnimation.fallDownAndShake = {
		duration : 0.7,
		timing : animation.Timing.easeOut,
		progress : {
			"0" : object.defineGetter( {
				rotate : -15
			}, {
				y : function () {
					return -clientHeight * 1.2;
				}
			} ),
			"40" : {
				rotate : -15
			},
			"45" : {
				rotate : 13
			},
			"52" : {
				rotate : -8
			},
			"62" : {
				rotate : 5
			},
			"74" : {
				rotate : -3
			},
			"87" : {
				rotate : 1
			}
		}
	};

	// 弹性
	enterAnimation.bounceIn = {
		duration : 0.75,
		timing : animation.Bezier( 0.215, 0.610, 0.355, 1.000 ),
		scale : true,
		progress : {
			"0" : {
				opacity : 0,
				scale : 0.3
			},
			"20" : {
				scale : 1.1
			},
			"40" : {
				scale : 0.9
			},
			"60" : {
				scale : 1.03
			},
			"80" : {
				scale : 0.97
			}
		}
	};

	// 弹入
	enterAnimation.BounceFlying = function ( dir ) {
		var x = 0, y = 0;

		switch ( dir ) {
			case 3:
				x = 1;
				break;
			case 1:
				x = -1;
				break;
			case 0:
				y = 1;
				break;
			case 2:
				y = -1;
				break;
		}

		return {
			timing : animation.Bezier( 0.215, 0.610, 0.355, 1.000 ),
			duration : 0.75,
			progress : {
				"0" : {
					x : -3000 * x,
					y : -3000 * y
				},
				"60" : {
					x : 25 * x,
					y : 25 * y
				},
				"75" : {
					x : -10 * x,
					y : -10 * y
				},
				"90" : {
					x : 5 * x,
					y : 5 * y
				}
			}
		};
	};

	// 挂摆
	enterAnimation.swing = {
		emphasize : true,
		origin : [0.5, 0],
		progress : {
			"0 100" : {
				rotate : 0
			},
			20 : {
				rotate : 15
			},
			40 : {
				rotate : -10
			},
			60 : {
				rotate : 5
			},
			80 : {
				rotate : -5
			}
		}
	};

	// 闪烁
	enterAnimation.flash = {
		timing : animation.Timing.linear,
		progress : {
			"0 66" : {
				opacity : 0
			},
			"33" : {
				opacity : 1
			}
		}
	};

	// 回旋
	enterAnimation.circleRound = {
		scale : true,
		duration : 0.6,
		progress : {
			0 : {
				scale : 0.001,
				opacity : 0,
				rotate : 180 * 2.5
			},
			100 : {
				scale : 1,
				rotate : 0
			}
		}
	};

	// 远近翻转
	enterAnimation.roundFromFarAndNear = {
		scale : true,
		timing : animation.Timing.linear,
		durationCorrect : -0.2,
		progress : {
			"0" : {
				scale : 0.3,
				opacity : 0,
				rotate : 180 * 0.45
			}
		}
	};

	// 淡入
	enterAnimation.fadeIn = {
		progress : {
			"0" : {
				opacity : 0
			}
		}
	};

	// 浮现
	enterAnimation.Emerge = function ( direction ) {
		var xy = Direction( direction || 2 );

		return {
			direction : direction,
			progress : {
				"0" : {
					x : xy[0] * 20,
					y : xy[1] * 20,
					opacity : 0
				}
			}
		}
	};

	// 缩小
	enterAnimation.shrink = {
		duration : 0.6,
		timing : animation.Bezier( .52, .21, .8, .51 ),
		progress : {
			"0" : {
				scale : 5,
				opacity : 0
			}
		}
	};

	// 从小变大
	enterAnimation.scale = {
		scale : true,
		progress : {
			"0" : {
				scale : 0.001
			}
		}
	};

	// 翻转
	enterAnimation.overturn = {
		progress : {
			"0" : {
				perspective : 400,
				opacity : -0.3,
				rotateY : 180
			},
			100 : {
				perspective : 400
			}
		}
	};

	// 硬币
	enterAnimation.coin = {
		performance : "high",
		progress : {
			"0" : {
				rotateY : -720,
				perspective : 400,
				opacity : 0
			},
			"85" : {
				rotateY : 30,
				perspective : 400
			},
			100 : {
				rotateY : 0,
				perspective : 400
			}
		}
	};

	// 新
	enterAnimation.flip = {
		emphasize : true,
		performance : "high",
		progress : {
			"0" : {
				perspective : 400,
				rotateY : -360,
				timing : animation.Timing.easeOut
			},
			"40" : {
				perspective : 400,
				z : 150,
				rotateY : -190,
				timing : animation.Timing.easeOut
			},
			"50" : {
				perspective : 400,
				z : 150,
				rotateY : -170,
				timing : animation.Timing.easeIn
			},
			"80" : {
				perspective : 400,
				scale : 0.95,
				timing : animation.Timing.easeIn
			},
			"100" : {
				perspective : 400
			}
		}
	};

	enterAnimation.FlipIn = function ( direction ) {
		var signX = 0, signY = 0;
		if ( direction === "x" ) {
			signX = 1;
		}
		else {
			signY = 1;
		}

		return {
			duration : 0.8,
			performance : "high",
			progress : {
				"0" : {
					opacity : 0,
					perspective : 400,
					rotateX : 90 * signX,
					rotateY : 90 * signY,
					timing : animation.Timing.easeIn
				},
				"40" : {
					perspective : 400,
					rotateX : -20 * signX,
					rotateY : -20 * signY,
					timing : animation.Timing.easeIn
				},
				"60" : {
					perspective : 400,
					rotateX : 10 * signX,
					rotateY : 10 * signY,
					timing : animation.Timing.easeIn
				},
				"80" : {
					perspective : 400,
					rotateX : -5 * signX,
					rotateY : -5 * signY,
					timing : animation.Timing.easeIn
				},
				"100" : {
					perspective : 400
				}
			}
		};
	};

	// 刹车
	enterAnimation.LightSpeedIn = function ( direction ) {
		var xy = Direction( direction ),
			x = xy[0], y = xy[1];

		return {
			direction : direction,
			progress : {
				"0" : {
					opacity : 0,
					x : x * 100 + "%",
					y : y * 100 + "%",
					skewX : x * -30,
					skewY : y * -30
				},
				"40" : {
					skewX : x * 20,
					skewY : y * 20
				},
				"60" : {
					skewX : x * -5,
					skewY : y * -5
				}
			}
		}
	};

	enterAnimation.RotateIn = function ( direction ) {
		var x = 0, y = 0;

		switch ( direction ) {
			case 3:
				x = -1;
				y = -1;
				break;
			case 2:
				x = 1;
				y = -1;
				break;
			case 0:
				y = 1;
				x = -1;
				break;
			case 1:
				x = 1;
				y = 1;
				break;
		}

		return {
			durationCorrect : -0.2,
			origin : [0.5 + x * 0.5, 0.5 + y * 0.5],
			progress : {
				0 : {
					opacity : 0,
					rotate : x * y * 45
				},
				100 : {
					rotate : 0
				}
			}
		};
	};

	enterAnimation.ZoomIn = function ( direction ) {
		var xy = Direction( direction ),
			x = xy[0], y = xy[1];

		return {
			scale : true,
			direction : direction,
			progress : {
				"0" : {
					opacity : 0,
					scale : 0.1,
					x : x * 300,
					y : y * 300,
					timing : animation.Bezier( 0.550, 0.055, 0.675, 0.190 )
				},
				"60" : {
					scale : 0.475,
					x : x * -1 * 10,
					y : y * -1 * 10,
					timing : animation.Bezier( 0.175, 0.885, 0.320, 1 )
				}
			}
		};
	};

	enterAnimation.Wave = function ( direction ) {
		var xy = Direction( direction ), x = xy[0];
		return {
			duration : 2,
			timing : animation.Timing.easeInOut,
			progress : {
				"0" : {
					x : percent( x * 200 ),
					y : "-60%",
					opacity : 0
				},
				10 : {
					x : percent( x * 150 ),
					y : "50%"
				},
				20 : {
					x : percent( x * 100 ),
					y : "-50%"
				},
				30 : {
					x : percent( x * 50 ),
					y : "30%"
				},
				40 : {
					x : percent( x * 30 ),
					y : "-20%"
				},
				50 : {
					x : percent( x * 20 ),
					y : "10%"
				},
				60 : {
					x : percent( x * 10 ),
					y : "-10%"
				},
				70 : {
					x : percent( x * 8 ),
					y : "5%"
				},
				80 : {
					x : percent( x * 6 ),
					y : "-3%"
				},
				90 : {
					x : percent( x * 3 ),
					y : "1%"
				}
			}
		};
	};

	// 爬行
	enterAnimation.Creep = function ( direction ) {
		var xy = Direction( direction ), y = xy[1];

		return {
			duration : 2,
			timing : animation.Timing.easeInOut,
			progress : {
				0 : {
					y : percent( y * 100 ),
					opacity : 0
				},
				25 : {
					y : percent( y * 75 ),
					rotateX : 180,
					opacity : 0.5
				},
				50 : {
					y : percent( y * 50 ),
					rotateX : 360
				},
				75 : {
					y : percent( y * 25 ),
					rotateX : 540
				},
				100 : {
					y : 0,
					rotateX : 720,
					opacity : 1
				}
			}
		};
	};

	// 回旋镖
	enterAnimation.boomerang = {
		duration : 1,
		timing : animation.Timing.easeIn,
		progress : {
			0 : {
				x : "-200%",
				y : "-100%",
				rotate : 0,
				scale : 0.2,
				opacity : 0
			},
			16 : {
				x : "-150%",
				y : "-75%",
				rotate : 180,
				scale : 0.4
			},
			32 : {
				x : "-100%",
				y : "-50%",
				rotate : 360,
				scale : 0.6
			},
			48 : {
				x : "-50%",
				y : "-25%",
				rotate : 540,
				scale : 0.8
			},
			64 : {
				x : 0,
				y : 0,
				rotate : 720,
				scale : 1
			},
			80 : {
				x : "20%",
				y : "10%",
				rotate : 900,
				scale : 1.4
			},
			100 : {
				x : 0,
				y : 0,
				rotate : 1080,
				scale : 1
			}
		}
	};

	enterAnimation.table = {
		"fly-into-left" : enterAnimation.FlyInto( 3 ),
		"fly-into-top" : enterAnimation.FlyInto( 0 ),
		"fly-into-right" : enterAnimation.FlyInto( 1 ),
		"fly-into-bottom" : enterAnimation.FlyInto( 2 ),
		"emerge-left" : enterAnimation.Emerge( 3 ),
		"emerge-top" : enterAnimation.Emerge( 0 ),
		"emerge-right" : enterAnimation.Emerge( 1 ),
		"emerge-bottom" : enterAnimation.Emerge( 2 ),
		scale : enterAnimation.scale,
		"fade-in" : enterAnimation.fadeIn,
		"circle-round" : enterAnimation.circleRound,
		"round-from-far-and-near" : enterAnimation.roundFromFarAndNear,
		"curve-up" : enterAnimation.roundFromFarAndNear,
		"fall-down-and-shake" : enterAnimation.fallDownAndShake,
		shrink : enterAnimation.shrink,
		flash : enterAnimation.flash,
		shake : enterAnimation.shake,
		wobble : enterAnimation.wobble,
		tada : enterAnimation.tada,
		"bounce-in" : enterAnimation.bounceIn,
		"bounce-in-down" : enterAnimation.BounceFlying( 2 ),
		"bounce-in-up" : enterAnimation.BounceFlying( 0 ),
		"bounce-in-left" : enterAnimation.BounceFlying( 3 ),
		"bounce-in-right" : enterAnimation.BounceFlying( 1 ),
		swing : enterAnimation.swing,
		"rubber-band" : enterAnimation.rubberBand,
		overturn : enterAnimation.overturn,
		coin : enterAnimation.coin,
		flip : enterAnimation.flip,
		"flip-in-x" : enterAnimation.FlipIn( "x" ),
		"flip-in-y" : enterAnimation.FlipIn( "y" ),
		"light-speed-in-top" : enterAnimation.LightSpeedIn( 0 ),
		"light-speed-in-right" : enterAnimation.LightSpeedIn( 1 ),
		"light-speed-in-bottom" : enterAnimation.LightSpeedIn( 2 ),
		"light-speed-in-left" : enterAnimation.LightSpeedIn( 3 ),
		"rotate-in-left-top" : enterAnimation.RotateIn( 0 ),
		"rotate-in-right-top" : enterAnimation.RotateIn( 1 ),
		"rotate-in-left-bottom" : enterAnimation.RotateIn( 3 ),
		"rotate-in-right-bottom" : enterAnimation.RotateIn( 2 ),
		"zoom-in-left" : enterAnimation.ZoomIn( 3 ),
		"zoom-in-right" : enterAnimation.ZoomIn( 1 ),
		"zoom-in-top" : enterAnimation.ZoomIn( 0 ),
		"zoom-in-bottom" : enterAnimation.ZoomIn( 2 ),
		"wave-left" : enterAnimation.Wave( 3 ),
		"wave-right" : enterAnimation.Wave( 1 ),
		"creep-top" : enterAnimation.Creep( 0 ),
		"creep-bottom" : enterAnimation.Creep( 2 )
	};

	module.exports = enterAnimation;
} );