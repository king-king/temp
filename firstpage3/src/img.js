/**
 * Created by 白 on 2015/6/10.
 * 封装图片
 */

library( function () {
	var css = imports( "css" ),
		async = imports( "async" ),
		URL = imports( "URL" ),
		imageUtil = imports( "image-util" ),
		$ = imports( "element" ),

		localResource = imports( "./local-resource" ),
		p = imports( "./position" ),

		imageNotFoundLoader = async.Loader( function ( done ) {
			var imageNotFound = Img.imageNotFound = Icon( "image-not-found" ),
				loadHandle = $.bind( imageNotFound, "load", function () {
					loadHandle.remove();
					done();
				} );
		} ),

		testImg = new Image();

	imports( "./platform" );

	function setSize( img ) {
		var width = img.fullWidth = img.naturalWidth || img.width,
			height = img.fullHeight = img.naturalHeight || img.height;

		img.ps = {
			width : img.halfWidth = Math.round( width / 2 ),
			height : img.halfHeight = Math.round( height / 2 )
		};
	}

	// 静态图片地址
	function staticSrc( src ) {
		return window.contentPath + "image/" + src;
	}

	// 加载图片
	function load( img, src, arg ) {
		arg = arg || {};
		var tryCache = false,
			crossOrigin = !!arg.crossOrigin;

		function fail( isFatal ) {
			img.fail = isFatal ? "fatal" : true;
			imageNotFoundLoader.load( function () {
				arg.onError && arg.onError();
			} );
		}

		if ( !src ) {
			fail( true );
			return img;
		}

		if ( /^#/.test( src ) || /^rgba/gi.test( src ) ) {
			img.color = src;
			setTimeout( function () {
				arg.onLoad && arg.onLoad();
			}, 0 );
			return img;
		}

		src = src.replace( /!([^!]*)$/, "" );

		function tryAgain() {
			if ( !tryCache ) {
				img.src = "";
				img.src = URL.concatArg( src, {
					t : ( new Date() ).getTime()
				} );
				tryCache = true;
			}
			else {
				fail();
			}
		}

		// 如果src是音乐,直接失败
		if ( /\.([^.]*)$/.test( URL( src ).pathname.replace( /!([^!]*)$/, "" ) ) && !( RegExp.$1 in {
				"jpeg" : true,
				"jpg" : true,
				"svg" : true,
				"png" : true,
				"gif" : true,
				"bmp" : true
			} ) ) {
			setTimeout( fail, 0 );
			return img;
		}

		crossOrigin && ( img.crossOrigin = "*" );
		img.src = src;

		img.onerror = tryAgain;

		img.onload = function () {
			if ( crossOrigin && testImg.crossOrigin !== undefined ) {
				try {
					var canvas = document.createElement( "canvas" ),
						gc = canvas.getContext( "2d" );
					canvas.width = 1;
					canvas.height = 1;
					gc.drawImage( img, 0, 0 );
					canvas.toDataURL();
				}
				catch ( e ) {
					tryAgain();
					return;
				}
			}
			setSize( img );
			img.onerror = null;
			img.onload = null;
			arg.onLoad && arg.onLoad( img );
		};

		return img;
	}

	function Img( src, arg ) {
		return load( new Image(), src, arg );
	}

	var Icon = window.Icon || ( testImg.crossOrigin === undefined ? function ( src ) {
			var ps = iconMap[src],
				img = new Image(),
				width = Math.round( ps.w / 2 ),
				height = Math.round( ps.h / 2 );

			load( img, staticSrc( "icon/" + src + ".png" ) );

			return $( img, {
				css : {
					width : css.px( width ),
					height : css.px( height )
				},
				ps : {
					width : width,
					height : height
				}
			} );
		} : (function () {
			var icons = {};

			function loadIcon( src, onLoad ) {
				var srcParts = src.split( "/" ),
					groupName = ["icon"].concat( srcParts.slice( 0, srcParts.length - 1 ) ).join( "-" ),
					img = icons[groupName] = icons[groupName] || new Image();

				if ( !img.waiter ) {
					img.waiter = async.Waiter( function ( done ) {
						var iconSrc = staticSrc( groupName + ".png" ),
							dataUrl = localResource( iconSrc );

						load( img, dataUrl || iconSrc, {
							crossOrigin : dataUrl == null,
							onLoad : function () {
								done();
								localResource( iconSrc, function () {
									return imageUtil.toDataURL( img );
								} );
							}
						} );
					} );
				}

				img.waiter.onComplete( function () {
					onLoad( img );
				} );
			}

			return function ( src ) {
				var ps = iconMap[src],
					canvas = document.createElement( "canvas" ),
					gc = canvas.getContext( "2d" ),
					unit = new Image(),
					width = Math.round( ps.w / 2 ),
					height = Math.round( ps.h / 2 );

				canvas.width = ps.w;
				canvas.height = ps.h;

				css( unit, "visibility", "hidden" );
				loadIcon( src, function ( icon ) {
					gc.drawImage( icon, ps.x, ps.y, ps.w, ps.h, 0, 0, ps.w, ps.h );
					unit.onload = function () {
						setSize( unit );
						unit.onload = null;
						css( unit, "visibility", "visible" );
					};
					unit.src = canvas.toDataURL( "image/png" );
				} );

				return $( unit, {
					css : {
						width : css.px( width ),
						height : css.px( height )
					},
					ps : {
						width : width,
						height : height
					}
				} );
			};
		})() );

	Icon.center = function ( src ) {
		var icon = Icon( src ),
			ps = icon.ps;

		css( icon, p.cssCenter( ps.width, ps.height ) );
		return icon;
	};


	// 画布
	function Canvas( width, height, dpr ) {
		var canvas = document.createElement( "canvas" ),
			gc = canvas.context = canvas.getContext( "2d" );

		dpr = canvas.dpr = dpr || ( window.devicePixelRatio || 1 ) / ( gc.webkitBackingStorePixelRatio || gc.mozBackingStorePixelRatio ||
			gc.msBackingStorePixelRatio || gc.oBackingStorePixelRatio || gc.backingStorePixelRatio || 1 );

		canvas.width = width * dpr;
		canvas.height = height * dpr;

		css( canvas, {
			display : "block",
			width : css.px( canvas.logicalWidth = width ),
			height : css.px( canvas.logicalHeight = height )
		} );

		gc.scale( dpr, dpr );

		return canvas;
	}

	module.exports = Img;
	Img.load = load;
	Img.Canvas = Canvas;
	Img.Icon = Icon;
	Img.staticSrc = staticSrc;
} );
