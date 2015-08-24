/**
 * Created by 白 on 2015/5/22.
 */

library( function () {
	imports( "../src/main" );
	var Layout = imports( "../src/layout" ),
		array = imports( "array" ),
		applyGroup = imports( "../src/animation-group" ),
		random = imports( "random" ),
		animation = imports( "animation" ),
		css = imports( "css" ),
		previewRandom = random.Random( 0 ),
		imageInfo = [
			[103, 71],
			[54, 152],
			[92, 328, -8],
			[263, 450],
			[82, 620, 4]
		],
		enterEndHandle = null,
		timeout = null,
		fadeOutHandle = null;

	css( document.body, "background", "#525355" );

	// 速度
	function setAnimate( components, inOrder, imageDuration, imageDelay, textDuration, textDelay, noOrderDuration, noOrderDelay ) {
		var layoutApply = {
			first : "image",
			random : previewRandom
		};

		[function () {
			return applyGroup.inOrder( components, {
				image : {
					duration : imageDuration,
					delay : imageDelay
				},
				text : {
					duration : textDuration,
					delay : textDelay
				}
			}, layoutApply );
		}, function () {
			return applyGroup.noOrder( components, {
				duration : noOrderDuration,
				delay : noOrderDelay
			}, layoutApply );
		}][inOrder ? 0 : 1]();
	}

	fp.resize();

	function theme( themeNumber, onLoad, startFadeDuration, fadeDuration, againDuration ) {
		var ea = enterAnimation,
			animateInfo = {
				1 : [[ea.BounceFlying( 0 ), ea.BounceFlying( 1 ), ea.rubberBand, ea.rubberBand, ea.rubberBand],
					[false, 0.8, 0.1, 0.8, 0.1, 0.8, 0.1]],
				2 : [[ea.wave, ea.wave, ea.wave, ea.wave, ea.wave],
					[false, 0.6, 0.1, 0.6, 0.1, 0.6, 0.1]],
				3 : [[ea.FlyInto( 0 ), ea.FlyInto( 1 ), ea.FlyInto( 3 ), ea.FlyInto( 1 ), ea.FlyInto( 3 )],
					[true, 1.2, 0.3, 1.2, 0.1, 1.2, 0.3]],
				4 : [[ea.FlipIn( "y" ), ea.FlipIn( "y" ), ea.FlipIn( "y" ), ea.FlipIn( "y" ), ea.FlipIn( "y" )],
					[true, 1.4, 0.3, 1.4, 0.1, 1.4, 0.3]],
				5 : [[ea.ZoomIn( 0 ), ea.ZoomIn( 1 ), ea.shrink, ea.shrink, ea.shrink],
					[true, 0.8, 0.3, 0.8, 0.1, 0.8, 0.3]],
				6 : [[ea.roundFromFarAndNear, ea.roundFromFarAndNear, ea.RotateIn( 3 ), ea.RotateIn( 1 ), ea.RotateIn( 3 )],
					[true, 1.6, 0.7, 1.4, 0.1, 1.2, 0.3]],
				7 : [[ea.Emerge( 3 ), ea.Emerge( 1 ), ea.scale, ea.scale, ea.scale],
					[true, 1.6, 0.5, 1.4, 0.3, 1.6, 0.1]],
				8 : [[ea.Emerge( 0 ), ea.Emerge( 1 ), ea.Emerge( 3 ), ea.Emerge( 1 ), ea.Emerge( 3 )],
					[true, 1.6, 0.3, 1.6, 0.1, 1.6, 0.1]]
			}[themeNumber];

		Layout.setAnimationEngine( ua.ios ? LayoutAnimationEngine.js : LayoutAnimationEngine.css );
		fadeOutHandle && fadeOutHandle.remove();
		enterEndHandle && enterEndHandle.remove();
		clearTimeout( timeout );

		Layout.loadPage( {
			format : {
				create : function ( layout, ds ) {
					layout.background = "#525355";

					var components = array.map( ds.image(), function ( image, i ) {
						var info = imageInfo[i],
							comp = p.layImage( p.transformY, image, {
								x : info[0] / 2,
								y : info[1] / 2
							}, layout );

						comp.rotate = info[2] || 0;
						comp.applyEnter = {
							type : i < 2 ? "text" : "image"
						};
						comp.enter = animateInfo[0][i];
						comp.zi = i;

						return comp;
					} );

					setAnimate.apply( null, [components].concat( animateInfo[1] ) );
				}
			},
			image : array.map( [themeNumber + ".png", "text-2.png", "image-1.png", "image-2.png", "image-3.png"], function ( src ) {
				if ( imageData ) {
					return imageData[src];
				}
				else {
					return "/theme-preview/content/" + src;
				}
			} )
		}, function ( createPage ) {
			var body = document.body,
				page = createPage(),
				layout = page.wrapper;

			body.innerHTML = "";
			body.appendChild( page );

			page.prepare();
			page.play();
			enterEndHandle = layout.onEnterEnd( function () {
				timeout = setTimeout( function () {
					fadeOutHandle = animation.requestFrames( {
						duration : fadeDuration || 1,
						onAnimate : function ( ratio ) {
							array.foreach( page.querySelectorAll( "img" ), function ( img ) {
								css( img, "opacity", 1 - ratio );
							} );
						},
						onEnd : function () {
							timeout = setTimeout( function () {
								theme( themeNumber, onLoad, startFadeDuration, fadeDuration, againDuration );
							}, againDuration || 1800 );
						}
					} );
				}, startFadeDuration || 3000 );
			} );
			onLoad && onLoad();
		} );
	}

	window.setTheme = theme;
} );