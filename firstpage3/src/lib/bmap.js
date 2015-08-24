/**
 * Created by Zuobai on 2015/3/15.
 * 封装百度地图
 */

library( function () {
	var async = imports( "async" ),
		array = imports( "array" ),
		pointer = imports( "pointer" ),
		Img = imports( "../img" ),
		$ = imports( "element" );

	var loadBMap = function () {
		return async.Loader( function ( done ) {
			window.bmapInit = function () {
				done();
				delete window.bmapInit;
			};

			// 加载百度地图脚本
			$( "script", {
				src : 'http://api.map.baidu.com/api?type=quick&ak=D5a271a3083d77f21c63ff307e9f60b9&v=1.0&callback=bmapInit'
			}, document.head );
		} ).load;
	}();

	// 标记物地图
	function MarkerMap( arg ) {
		loadBMap( function () {
			var oMap = $( "div", {
					css : {
						height : "100%",
						width : "100%"
					}
				}, arg.parent ),
				points = [];

			$.onInsert( oMap, function () {
				var map = new BMap.Map( oMap );

				// 添加覆盖物,点击覆盖物会弹出大厦信息
				array.foreach( arg.data, function ( item ) {
					var point = new BMap.Point( parseFloat( item.lng ), parseFloat( item.lat ) ),
						marker = new BMap.Marker( point ),
						markerIcon = new BMap.Icon( Img.staticSrc( "map-mark.png" ), new BMap.Size( 30, 30 ) );

					marker.setIcon( markerIcon );
					map.addOverlay( marker );
					points.push( point );

					if ( arg.make ) {
						var infoWindow = new BMap.InfoWindow( arg.make( item ) );
						marker.addEventListener( "click", function () {
							marker.openInfoWindow( infoWindow );
						} );
					}
				} );

				// 初始化地图，设置中心点坐标和地图级别
				if ( points.length !== 0 ) {
					map.centerAndZoom( points[0], 16 );
					map.setViewport( points );
				}
				else {
					map.centerAndZoom( "北京市" );
				}
			} );

			arg.onLoad && arg.onLoad();
		} );
	}

	exports.MarkerMap = MarkerMap;
} );
