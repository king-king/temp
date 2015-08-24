/**
 * Created by 白 on 2015/3/27.
 * 金酸梅板式
 */

plugin( function () {
	var array = imports( "array" ),
		object = imports( "object" ),
		enterAnimation = imports( "../enter-animation" );

	function Razzies( isSingle ) {
		return {
			resource : {
				background : isSingle ? "razzies-single.png" : "razzies-double.png",
				bannerLeft : "razzies/banner-left",
				bannerCenter : "razzies/banner-center",
				bannerRight : "razzies/banner-right",
				cup : "razzies-cup.png"
			},
			create : function ( layout, ds, resource ) {
				var yR = yRatio / 1008 * 1136;

				function setPosition( comp, x, y ) {
					comp.y = y * yR;
					comp.x = ( x - 160 ) * yR + clientWidth / 2;
					return comp;
				}

				// 头像
				var headSize = 104 * yR;
				if ( isSingle ) {
					setPosition( Component( Content.ImageCover( ds.image( 0 ), headSize, headSize ), layout ), 108, 41 );
				}
				else {
					setPosition( Component( Content.ImageCover( ds.image( 0 ), headSize, headSize ), layout ), 56, 41 );
					setPosition( Component( Content.ImageCover( ds.image( 1 ), headSize, headSize ), layout ), 161, 41 );
				}

				// 背景
				var background = Component( Content.Image( resource.background, yR ), layout );
				background.x = p.center( background );

				// 横幅
				var bannerText = Component( Content.Label( ds.text( 0 ), {
						fontSize : 15 * yR << 0,
						color : "#fdf1c8"
					} ) ),
					bannerLeft = Component( Content.Image( resource.bannerLeft, yR ) ),
					banner = Component( Content.Rect( bannerText.width + 50 * yR << 0, bannerLeft.height ), layout ),
					bannerRight = Component( Content.Image( resource.bannerRight, yR ) ),
					bannerCenter = Component( Content.Image( resource.bannerCenter, banner.width - bannerLeft.width * 2 + 8, bannerLeft.height ) );

				array.foreach( [bannerLeft, bannerRight, bannerCenter, bannerText], function ( comp ) {
					comp.appendTo( banner );
				} );

				bannerRight.x = p.rightIn( bannerRight, banner, true );
				bannerCenter.x = p.center( bannerCenter, banner, true );
				bannerText.x = p.center( bannerText, banner, true );
				bannerText.y = ( 30 * yR - bannerText.height ) / 2 << 0;
				banner.x = p.center( banner );
				banner.y = 153 * yR;

				// 奖杯和获奖文字
				var awardText = Component( Content.BlockText( ds.text( 1 ), {
					width : 250 * yR,
					lineHeight : 20 * yR << 0,
					fontSize : 12 * Math.max( yR, 1 ) << 0,
					color : "#fdf1c9"
				} ), layout );
				awardText.x = p.center( awardText );
				awardText.y = 200 * yR;

				var cup = Component( Content.Image( resource.cup, yR ) ),
					cupFrame = setPosition( Component( Content.Rect( cup.width, cup.height ), layout ), 132 / 2, 566 / 2 ),
					cupCaption = Component( Content.Rect( 85 * yR, 37 * yR ), cupFrame );

				cup.appendTo( cupFrame );
				cupCaption.zi = 1;
				cupCaption.x = p.center( cupCaption, cupFrame, true ) - 1;
				cupCaption.y = 129 * yR;

				var awardName = ds.text( 2 ).toString().split( "\n" ),
					cupCationInfo = {
						fontSize : 15 * yR,
						color : "#40234a"
					};

				function CupCaption( i, y ) {
					var comp = Component( Content.Label( awardName[i], cupCationInfo ), cupCaption );
					comp.x = p.center( comp, cupCaption, true );
					comp.y = y === undefined ? p.middle( comp, cupCaption, true ) : y;
				}

				if ( awardName.length === 1 ) {
					CupCaption( 0 );
				}
				else {
					CupCaption( 0, 0 );
					CupCaption( 1, 20 * yR );
				}

				sequence( [
					[banner, enterAnimation.fallDownAndShake],
					[awardText, enterAnimation.Emerge()],
					[cupFrame, object.extend( enterAnimation.shrink, {
						delay : 0.3
					} )]
				] );
			}
		};
	}

	layoutFormats["razzies-single"] = Razzies( true );
	layoutFormats["razzies-double"] = Razzies( false );
} );