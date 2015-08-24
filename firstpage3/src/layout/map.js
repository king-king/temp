/**
 * Created by 白 on 2015/3/18.
 */

plugin( function () {
	var $ = imports( "element" ),
		css = imports( "css" ),
		tips = imports( "../tips" ),
		bmap = imports( "../lib/bmap" ),
		csa = imports( "css-animation" ),
		Img = imports( "../img" ),
		history = imports( "../history" ),

		infoWindowTemplate = '<div class="map-info-window"><div class="name"></div><div class="info"><div>地址:<span class="address"></span></div></div></div>';

	layoutFormats.map = {
		resource : {
			location : "map/location"
		},
		create : function ( layout, ds, resource ) {
			var yR = yRatio / 1008 * 1136;

			Component( Content.ImageCover( ds.image( 0 ) ), layout );

			var icon = Component( Content.Image( resource.location, yR ), layout );
			icon.x = p.center( icon );
			icon.y = 574 * yR / 2 << 0;

			var address = Component( Content.Label( ds.location( 0 ).address, {
				lineHeight : 14 * yR << 0,
				fontSize : 12 * yR << 0,
				color : "#FFFFFF"
			} ), layout );
			address.x = p.center( address );
			address.y = 680 * yR / 2 << 0;

			// 地图图标闪烁
			layout.onShow( function () {
				csa.runAnimation( [icon.element, {
					"50" : {
						opacity : 0.4
					}
				}, 3, "linear", "infinite"] );
			} );

			var click = Component( Content.Rect( 120, 100 ), layout );
			click.x = p.center( click );
			click.y = ( 574 - 20 ) * yR / 2 << 0;

			// 点击地图图标,弹出地图页
			var slidePage;
			onTap( click.element, function () {
				// 如果没有地图页,创建它
				if ( !slidePage ) {
					slidePage = history.SlidePage();
					slidePage.classList.add( "map-slide-page" );

					var back = slidePage.appendChild( $( "div.title-bar", {
							children : [$( "div.back", [
								$( Img.Icon.center( "map/back" ) )
							] ), $( "div.line" ), $( "div.caption" )]
						} ) ),
						loading = tips.Loading( slidePage );

					onTap( back, history.back );

					bmap.MarkerMap( {
						data : ds.location(),
						parent : slidePage,
						make : function ( item ) {
							var infoWindow = $( infoWindowTemplate );
							infoWindow.querySelector( ".name" ).innerHTML = item.name;
							infoWindow.querySelector( ".address" ).innerHTML = item.address;
							return infoWindow;
						},
						onLoad : function () {
							$.remove( loading );
						}
					} );
				}

				slidePage.slideIn();
			} );
		}
	};
} );