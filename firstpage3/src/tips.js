/**
 * Created by 白 on 2015/3/12.
 */

library( function () {
	var $ = imports( "element" ),
		css = imports( "css" ),
		pointer = imports( "pointer" ),
		csa = imports( "css-animation" ),
		object = imports( "object" ),
		Img = imports( "./img" ),

		spin = {
			100 : {
				transform : "rotateZ(360deg)"
			}
		};

	// 加载
	function Loading( parent ) {
		return $( "div", {
			css : {
				"position" : "absolute",
				"left" : "50%",
				"top" : "50%",
				"width" : "34px",
				"height" : "34px",
				"margin-left" : "-17px",
				"margin-top" : "-17px",
				"z-index" : "1000"
			},
			children : [
				$( Img.Icon( "loading-o" ), {
					css : {
						position : "absolute",
						left : 0,
						top : 0
					}
				} ),
				$( Img.Icon( "loading-c" ), {
					css : {
						position : "absolute",
						left : 0,
						top : 0,
						animation : csa.animation( [spin, 1.1, "linear", "infinite"] )
					}
				} )
			]
		}, parent || body );
	}

	// 音乐图标
	function Music( parent ) {
		var el = $( "div", {
				classList : "tips",
				css : {
					position : "absolute",
					top : 0,
					right : 0,
					width : "40px",
					height : "40px",
					"z-index" : 1000
				},
				children : [
					$( "div", {
						css : {
							position : "absolute",
							left : "-20px",
							top : 0,
							right : 0,
							bottom : "-20px"
						}
					} )
				]
			}, parent ),
			icon = $( Img.Icon.center( "music" ), {
				css : {
					"border-radius" : "20px",
					border : "2px solid rgba(130, 170, 118, 0.6)"
				}
			}, el );

		object.defineAutoProperty( el, "play", {
			value : false,
			set : function ( val ) {
				if ( val ) {
					csa.runAnimation( [icon, spin, 2.3, "linear", "infinite"] );
				}
				else {
					css.remove( icon, "animation" );
				}
			}
		} );

		return el;
	}

	// 菊花加载
	function LoadingChrysanthemum( parent ) {
		return $( Img.Icon( "loading-new-page" ), {
			css : {
				display : "inline-block",
				"vertical-align" : "top",
				animation : csa.animation( [spin, 1.3, "linear", "infinite"] )
			}
		}, parent );
	}

	// 加载新页提示
	function LoadingNewPage() {
		return $( "div", {
			classList : "tips",
			css : {
				"position" : "absolute",
				"left" : "0",
				"right" : "0",
				"bottom" : "8px",
				"height" : "20px",
				"z-index" : "10",
				"line-height" : "20px",
				"text-align" : "center",
				"pointer-events" : "none"
			},
			children : [
				LoadingChrysanthemum(),
				$( "div", {
					css : {
						"display" : "inline-block",
						"vertical-align" : "top",
						"margin-left" : "12px",
						"color" : "#888888",
						"font-size" : "14px"
					},
					innerHTML : "加载新页中"
				} )
			]
		}, body );
	}

	// 第一次的推提示
	function CutFirst( parent ) {
		return inClickMode ? $( "div", {
			classList : ["tips", "switch"],
			css : {
				"position" : "absolute",
				"left" : "50%",
				"bottom" : "100px",
				"z-index" : "100",
				"pointer-events" : "none"
			},
			children : [
				$( "div", {
					innerHTML : "点击页面",
					css : {
						"position" : "absolute",
						"top" : "-30px",
						"font-size" : "12px",
						"color" : "white",
						"width" : "100px",
						"text-align" : "center",
						"margin-left" : "-50px"
					}
				} ),
				$( "div", {
					css : {
						height : "32px",
						width : "32px",
						"border-radius" : "32px",
						background : "#4c4236",
						position : "absolute",
						top : "0",
						left : "50%",
						"margin-left" : "-16px",
						animation : csa.animation( [{
							0 : {
								transform : "scale(.9)",
								"opacity" : 1
							},
							100 : {
								transform : "scale(1.3)",
								"opacity" : 0
							}
						}, 1.7, "infinite"] )
					}
				} ),
				$( "div", {
					css : {
						height : "18px",
						width : "18px",
						"border-radius" : "18px",
						background : "#d75b41",
						position : "absolute",
						top : "7px",
						left : "50%",
						"margin-left" : "-9px",
						"z-index" : 3,
						animation : csa.animation( [{
							50 : {
								transform : "scale(0.7)"
							}
						}, 1.7, "infinite"] )
					}
				} ),
				$( Img.Icon( "tips-click-first" ), {
					css : {
						"position" : "absolute",
						"left" : "50%",
						"top" : "16px",
						"z-index" : "4"
					}
				} )
			]
		}, parent ) : $( Img.Icon( "tips-push-first" ), {
			classList : ["tips", "switch"],
			css : {
				position : "absolute",
				"margin-left" : "-32px",
				left : "50%",
				bottom : 0,
				"z-index" : 10,
				"pointer-events" : "none",
				animation : csa.animation( [{
					0 : {
						opacity : 0,
						transform : "translate3d(0, 60px, 0)"
					},
					80 : {
						opacity : 0.5
					}
				}, 2.5, "infinite"] )
			}
		}, parent );
	}

	// 推提示
	function Cut( parent ) {
		return inClickMode ? $( "div" ) : $( Img.Icon( "tips-push" ), {
			classList : ["tips", "switch"],
			css : {
				position : "absolute",
				bottom : "45px",
				left : "50%",
				"margin-left" : "-8px",
				"z-index" : 10,
				"pointer-events" : "none",
				animation : csa.animation( [{
					0 : {
						transform : "translate3d(0, 42px, 0)",
						opacity : 0
					},
					60 : {
						transform : "translate3d(0, 12px, 0)",
						opacity : 1
					},
					100 : {
						opacity : 0
					}
				}, 1.5, "infinite"] )
			}
		}, parent );
	}

	// 版权提示
	function PoweredBy() {
		var icon = $( Img.Icon( "powered-by" ), {
				css : {
					position : "absolute",
					bottom : 0,
					left : 0
				}
			} ),
			ps = icon.ps;

		return $( "div.powered-by", {
			css : {
				position : "absolute",
				width : css.px( ps.width ),
				height : "44px",
				left : "50%",
				"margin-left" : css.px( -ps.width / 2 ),
				bottom : 0,
				"z-index" : 10000
			},
			children : [icon]
		}, body );
	}

	// 涂抹提示
	function Scratch( parent ) {
		return $( Img.Icon( "tips-scratch" ), {
			css : {
				position : "absolute",
				"margin-left" : "-65px",
				left : "50%",
				bottom : "50px",
				"z-index" : 10,
				"pointer-events" : "none",
				animation : csa.animation( [{
					0 : {
						opacity : 0
					}
				}, 1.4] )
			}
		}, parent || document.body );
	}

	// 隐藏提示
	function hide() {
		body.classList.add( "hide-tips" );

		return {
			remove : function () {
				body.classList.remove( "hide-tips" );
			}
		};
	}

	exports.Loading = Loading;
	exports.LoadingChrysanthemum = LoadingChrysanthemum;
	exports.Music = Music;
	exports.LoadingNewPage = LoadingNewPage;
	exports.CutFirst = CutFirst;
	exports.Cut = Cut;
	exports.PoweredBy = PoweredBy;
	exports.Scratch = Scratch;
	exports.hide = hide;
} );