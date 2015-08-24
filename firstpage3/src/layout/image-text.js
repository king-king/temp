/**
 * Created by Zuobai on 2014/10/1.
 * 老图文板式
 */

plugin( function () {
	var string = imports( "string" ),
		func = imports( "function" ),
		array = imports( "array" ),
		object = imports( "object" ),
		enterAnimation = imports( "../enter-animation" );

	function lay( image, info, parent ) {
		return p.layImage( p.transform504, image, info, parent );
	}

	function rgba() {
		return string.tuple( "rgba", Array.prototype.slice.call( arguments, 0 ) );
	}

	// region 单图
	layoutFormats.SingleImage = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ), clientWidth, clientHeight ), layout );
		}
	};
	// endregion

	// region 背景图+透明层+文字板式
	function PureTextLayout( style ) {
		return {
			ignorePureColor : true,
			create : function ( layout, ds ) {
				var yR = clientHeight / 504,
					margin = style.margin,
					lineHeight = style.lineHeight,
					fontSize = style.fontSize,
					text;

				// 背景
				Component( Content.ImageCover( ds.image( 0 ) ), layout );

				// 透明层
				var transparent = Component( Content.Rect( clientWidth, clientHeight, style.background ), layout );
				transparent.zi = 1;

				// 文字
				do {
					text = Component( Content.BlockText( ds.text( 0 ), {
						margin : margin * yR << 0,
						lineHeight : Math.max( lineHeight * yR << 0, 16 ),
						fontSize : Math.max( fontSize * yR << 0, 12 ),
						color : style.color,
						width : Math.min( 280 * Math.max( yR, 1 ) << 0, clientWidth - 40 )
					} ) );
					margin = Math.max( margin - 1, 0 );
					lineHeight = Math.max( lineHeight - 1, 0, fontSize + 2 );
					if ( margin <= 0 || lineHeight <= fontSize + 2 ) {
						break;
					}
				}
				while ( text.height > clientHeight * 0.8 );
				text.appendTo( layout );

				text.x = p.center( text );
				text.y = p.middle( text );
				text.zi = 2;
				text.enter = enterAnimation.Emerge();
				text.applyEnter = "text";
			}
		};
	}

	// 黑色透明层
	layoutFormats.ImageText04 = PureTextLayout( {
		margin : 5,
		lineHeight : 25,
		fontSize : 15,
		color : "#FFFFFF",
		background : rgba( 0, 0, 0, 0.8 )
	} );

	// 白色透明层
	layoutFormats.ImageText07 = PureTextLayout( {
		margin : 5,
		lineHeight : 25,
		fontSize : 14,
		color : "#333333",
		background : rgba( 255, 255, 255, 0.85 )
	} );
	// endregion

	// region 背景图+纯色矩形+三段文字板式
	function RectLayout( pos ) {
		return {
			ignorePureColor : true,
			create : function ( layout, ds ) {
				var color = layout.body.color,
					yR = yRatio / 1008 * 1136,
					fontSize = [27, 16, 10],
					textTop = [22, 57, 88],
					rectHeight = 115 * yR << 0,
					rectTop, imgTop, imgBottom,
					texts = [];

				switch ( pos ) {
					case "top":
						rectTop = 0;
						imgTop = rectHeight;
						imgBottom = clientHeight;
						break;
					case "middle":
						rectTop = clientHeight * 0.6 << 0;
						imgTop = 0;
						imgBottom = clientHeight;
						break;
					case "bottom":
						imgTop = 0;
						rectTop = imgBottom = clientHeight - rectHeight;
						break;
				}

				// 图
				var img = Component( Content.ImageCover( ds.image( 0 ), clientWidth, imgBottom - imgTop ), layout );
				img.y = imgTop;

				// 矩形
				var rect = Component( Content.Rect( clientWidth, rectHeight, color ), layout );
				rect.y = rectTop;

				// 字
				func.loop( 3, function ( i ) {
					if ( ds.text( i ).toString() ) {
						var fs = fontSize[i] * yR << 0,
							text = Component( Content.Label( ds.text( i ), {
								fontSize : fs,
								color : color.toUpperCase() === "#FFFFFF" ? "#000000" : "#FFFFFF"
							} ), rect );

						text.x = p.center( text );
						text.y = textTop[i] * yR << 0;
						text.zi = 2;
						texts.push( text );
					}
				} );

				sequence( array.map( texts, function ( text ) {
					return [text, enterAnimation.Emerge()];
				} ) );
			}
		};
	}

	layoutFormats.ImageText01 = RectLayout( "top" );
	layoutFormats.ImageText02 = RectLayout( "bottom" );
	layoutFormats.ImageText03 = RectLayout( "middle" );
	// endregion

	// 互联网分析沙龙,电商专场
	layoutFormats.ImageText05 = {
		ignorePureColor : true,
		create : function ( layout, ds ) {
			// 背景
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			// 字
			var text = Component( Content.BlockText( ds.text( 0 ), {
				width : 157 * gRatio << 0,
				lineHeight : 30,
				fontSize : 22,
				color : "#FFFFFF",
				breakWord : true
			} ), layout );

			// 透明颜色背景
			var rect = Component( Content.Rect( text.width + 17 * gRatio * 2 << 0,
				Math.max( text.height + 20 * gRatio, 60 * gRatio ) << 0, rgba( 0, 0, 0, 0.85 ) ), layout );
			rect.x = p.rightIn( rect );
			rect.y = p.middle( rect );

			text.x = p.center( text, rect, true );
			text.y = p.middle( text, rect, true );
			text.appendTo( rect );
		}
	};

	// 国际创新峰会,三段文字依次飞入
	layoutFormats.ImageText06 = {
		ignorePureColor : true,
		create : function ( layout, ds ) {
			// 背景
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			// 透明层
			var rect = Component( Content.Rect( 250 * gRatio, 350 * gRatio, rgba( 0, 0, 0, 0.85 ) ), layout );
			rect.x = p.center( rect );
			rect.y = p.middle( rect );

			array.foreach( [35, 132, 229], function ( y, i ) {
				var text = Component( Content.BlockText( ds.text( i ), {
					width : rect.width - 2 * 17 * gRatio,
					lineHeight : 25 * gRatio << 0,
					fontSize : 14 * gRatio << 0,
					color : "#FFFFFF",
					breakWord : true
				} ), rect );
				text.y = y * gRatio << 0;
				text.x = p.center( text, rect, true );
				text.enter = delay( enterAnimation.FlyInto( 1 ), 0.3 * i );
			} );
		}
	};

	// 他们特立独行
	layoutFormats.ImageText08 = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var text = lay( ds.image( 1 ), {
				alignX : 0.5,
				y : 354
			}, layout );
			text.enter = enterAnimation.Emerge();
		}
	};

	// 他们有一个共同的名字
	layoutFormats.ImageText09 = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var text = lay( ds.image( 1 ), {
				alignX : 0.5,
				y : 289
			}, layout );
			text.enter = enterAnimation.Emerge();
		}
	};

	// 有一家咖啡馆
	layoutFormats.ImageText10 = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var text = lay( ds.image( 1 ), {
				x : 25,
				y : 155
			}, layout );
			text.enter = enterAnimation.Emerge();
		}
	};

	// 越极客,越性感
	layoutFormats.ImageText11 = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var text1 = lay( ds.image( 1 ), {
				alignX : 0.5,
				y : 189
			}, layout );

			var text2 = lay( ds.image( 1 ), {
				alignX : 0.5
			}, layout );
			text2.y = p.bottomTo( text2, text1 ) + 15 * gRatio;

			sequence( [[text1, enterAnimation.Emerge()], [text2, enterAnimation.Emerge()]] );
		}
	};

	// 马云
	layoutFormats.ImageText12 = {
		resource : {
			mask : "im12-mask.png",
			mayun : "im12-mayun.jpg"
		},
		create : function ( layout, ds, resource ) {
			// 马云头像和用户头像
			var mayun = Component( Content.ImageCover( resource.mayun, clientWidth / 2, 818 / 2 * yRatio ), layout ),
				userAvatar = Component( Content.ImageCover( ds.image( 0 ), mayun.width, mayun.height ), layout );
			userAvatar.x = clientWidth / 2;

			// 红色遮罩
			var mask = Component( Content.ImageCover( resource.mask, clientWidth, 200 * yRatio ), layout );
			mask.y = p.bottomIn( mask );

			// 文字
			var text = Component( Content.Image( ds.image( 1 ), yRatio ) );
			text.x = p.center( text, mask, true );
			text.y = 75 * yRatio;
			text.enter = enterAnimation.Emerge();
		}
	};

	// 新年大发
	layoutFormats.ImageText13 = {
		ignorePureColor : true,
		create : function ( layout, ds ) {
			// 背景
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			// 矩形
			var rect = Component( Content.Rect( clientWidth, 248 / 2 * yRatio << 0, "#FFFFFF" ), layout );
			rect.y = p.bottomIn( rect );

			// 字
			var text = Component( Content.Image( ds.image( 1 ), yRatio ), rect );
			text.x = p.center( text );
			text.y = ( 766 - ( 1008 - 248 ) ) / 2 * yRatio << 0;
			text.enter = enterAnimation.fadeIn;
		}
	};

	// 黄有维,1965年,湖南岳阳人
	layoutFormats.ImageText14 = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var text = lay( ds.image( 1 ), {
				alignX : 1,
				x : -14,
				y : 78
			}, layout );
			text.enter = enterAnimation.Emerge();
		}
	};

	// 他的作品格调清新,充满阳光和朝气
	layoutFormats.ImageText15 = {
		ignorePureColor : true,
		create : function ( layout, ds ) {
			var paddingY = 40 * gRatio << 0,
				paddingX = 23 * gRatio << 0,
				margin = 15 * gRatio << 0;

			// 背景
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			// 字
			var text1 = lay( ds.image( 1 ), {} ),
				text2 = lay( ds.image( 2 ), {} );

			text1.y = paddingY;
			text2.y = p.bottomTo( text2, text1 ) + margin;

			// 透明层
			var rect = Component( Content.Rect( Math.max( text1.width, text2.width, 246 * gRatio ) + paddingX * 2,
				text2.y + text2.height + paddingY, rgba( 255, 255, 255, 0.9 ) ), layout );
			rect.x = p.center( rect );
			rect.y = p.middle( rect );

			text1.appendTo( rect );
			text1.x = paddingX;

			text2.appendTo( rect );
			text2.x = p.rightIn( text2, rect, true ) - paddingX;

			sequence( [[text1, enterAnimation.Emerge()], [text2, enterAnimation.Emerge()]] );
		}
	};

	// 稻城亚丁
	layoutFormats.ImageText16 = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var text1 = lay( ds.image( 1 ), {
				x : 324 / 2,
				y : 114 / 2
			}, layout );

			var text2 = lay( ds.image( 2 ), {}, layout );
			text2.x = text1.x + 3 * gRatio;
			text2.y = p.bottomTo( text2, text1 ) + 5 * gRatio;

			sequence( [[text1, enterAnimation.fadeIn], [text2, enterAnimation.fadeIn]] );
		}
	};

	// 沙雅
	layoutFormats.ImageText17 = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var text1 = lay( ds.image( 1 ), {
				x : 68 / 2,
				y : 696 / 2
			}, layout );

			var text2 = lay( ds.image( 2 ), {}, layout );
			text2.x = text1.x + 4 * gRatio;
			text2.y = p.bottomTo( text2, text1 ) + 5 * gRatio;

			sequence( [[text1, enterAnimation.fadeIn], [text2, enterAnimation.fadeIn]] );
		}
	};

	function MXZS( y ) {
		return {
			create : function ( layout, ds ) {
				Component( Content.ImageCover( ds.image( 0 ) ), layout );

				var text1 = lay( ds.image( 1 ), {
					alignX : 0.5,
					y : y / 2
				}, layout );

				var text2 = lay( ds.image( 2 ), {
					alignX : 0.5
				}, layout );
				text2.y = p.bottomTo( text2, text1 ) + 57 / 2 * gRatio;

				var text3 = lay( ds.image( 3 ), {
					alignX : 0.5
				}, layout );
				text3.y = p.bottomTo( text3, text2 ) + 12 * gRatio;

				sequence( [[text1, enterAnimation.Emerge()], [text2, enterAnimation.Emerge()], [text3, enterAnimation.Emerge()]] );
			}
		};
	}

	// 莫西子诗
	layoutFormats.ImageText18 = MXZS( 231 );

	// 有那么一些人
	layoutFormats.ImageText19 = MXZS( 612 );

	// 莫西子诗乐队
	layoutFormats.ImageText20 = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var fs1 = 27 * gRatio << 0;
			var text1 = Component( Content.Label( ds.text( 0 ), {
				fontSize : fs1,
				fontWeight : "bold",
				color : "white"
			} ), layout );
			text1.x = p.center( text1 );
			text1.y = p.transformCover( 0, 191 / 2 )[1];

			var text2 = Component( Content.BlockText( ds.text( 1 ), {
				width : clientWidth - 150,
				fontSize : 10 * gRatio << 0,
				lineHeight : 20 * gRatio << 0,
				color : "#d2d2d2"
			} ), layout );
			text2.x = p.center( text2 );
			text2.y = p.bottomTo( text2, text1 ) + 26 * gRatio;

			sequence( [[text1, enterAnimation.Emerge()], [text2, enterAnimation.Emerge()]] );
		}
	};

	// 玛丽莲梦露,妮可基德曼
	layoutFormats.ImageText21 = layoutFormats.ImageText22 = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var text1 = lay( ds.image( 1 ), {
				x : 516 / 2,
				y : 195 / 2
			}, layout );
			text1.enter = enterAnimation.Emerge( 1 );

			var text2 = lay( ds.image( 2 ), {}, layout );
			text2.x = p.rightIn( text2, text1 );
			text2.y = p.bottomTo( text2, text1 ) + 5 * gRatio;
			text2.enter = enterAnimation.Emerge( 3 );
		}
	};

	// 斯嘉丽约翰逊
	layoutFormats.ImageText23 = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var text1 = lay( ds.image( 1 ), {
				x : 60 / 2,
				y : 140 / 2
			}, layout );
			text1.enter = enterAnimation.Emerge( 0 );

			var text2 = lay( ds.image( 2 ), {}, layout );
			text2.x = text1.x + 2 * gRatio;
			text2.y = p.bottomTo( text2, text1 ) + 5 * gRatio;
			text2.enter = enterAnimation.Emerge( 2 );
		}
	};

	// 安娜莫格拉莉丝
	layoutFormats.ImageText24 = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var text1 = lay( ds.image( 1 ), {
				x : 82 / 2,
				y : 720 / 2
			}, layout );
			text1.enter = enterAnimation.Emerge( 0 );

			var text2 = lay( ds.image( 2 ), {}, layout );
			text2.x = text1.x + 2 * gRatio;
			text2.y = p.bottomTo( text2, text1 ) + 5 * gRatio;
			text2.enter = enterAnimation.Emerge( 2 );
		}
	};

	// 愤怒的丘吉尔
	layoutFormats.ImageText25 = {
		ignorePureColor : true,
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var text = lay( ds.image( 1 ), {
				alignX : 0.5
			}, layout );
			text.y = p.bottomIn( text ) - 40 * gRatio;
			text.enter = enterAnimation.Emerge( 0 );
		}
	};

	// 初夜在乎你的感受,所以才用心表达
	layoutFormats.ImageText26 = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var text1 = lay( ds.image( 1 ), {
				alignX : 0,
				y : 588 / 2
			}, layout );

			var text2 = Component( Content.Image( ds.image( 2 ) ), layout );
			text2.x = 144 / 2;
			text2.y = p.bottomTo( text2, text1 );

			sequence( [[text1, enterAnimation.Emerge( 1 )], [text2, enterAnimation.Emerge( 1 )]] );
		}
	};

	// Happy new year 2015
	layoutFormats.ImageText27 = {
		create : function ( layout, ds ) {
			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var text = lay( ds.image( 1 ), {
				alignX : 0.5,
				y : 503 / 2
			}, layout );
			text.enter = enterAnimation.Emerge();
		}
	};
} );