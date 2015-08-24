/**
 * Created by 白 on 2015/6/9.
 */

library( function () {
	var ajax = imports( "ajax" ),
		URL = imports( "url" ),
		object = imports( "object" ),
		array = imports( "array" ),
		async = imports( "async" ),
		$ = imports( "element" ),
		tips = imports( "../tips" ),
		func = imports( "function" ),
		css = imports( "css" ),

		share = imports( "./share" ),
		Img = imports( "../img" ),

		href = URL( location.href ),

		workDataCache = [];

	href = href.arg.returnUrl || href;

	function LoadWork( workInfoUrl ) {
		workInfoUrl = URL( workInfoUrl );
		var id = array.top( workInfoUrl.pathname.split( "/" ) );

		return function ( callback, workBody ) {
			// 查找缓存中的作品数据
			function findCacheWorkData() {
				var dataInfo = array.findFirst( workDataCache, function ( dataInfo ) {
					return dataInfo.id === id;
				} );
				return dataInfo ? dataInfo.data : null;
			}

			workBody.workId = id;

			func.callWith( function ( parseWork ) {
				var workData = window.workData || findCacheWorkData();
				workData ? parseWork( workData ) : ajax( {
					url : workInfoUrl
				}, function ( err, xhr ) {
					var data;
					try {
						data = JSON.parse( xhr.responseText );
					}
					catch ( e ) {
						parseWork( {
							code : 1500
						} );
					}

					data && parseWork( data );
				} );
			}, function ( workData ) {
				// 缓存作品数据
				if ( workInfoUrl && !findCacheWorkData() ) {
					workDataCache.push( {
						id : id,
						data : workData
					} );
					workDataCache.length > 100 && workDataCache.unshift();
				}

				// 回调读到的数据
				window.parent.onWorkLoad && window.parent.onWorkLoad( workData );

				// 如果code不是200,进入异常流程
				if ( workData.code !== 200 ) {
					var iconCode, title;

					switch ( workData.code ) {
						case 1401:
							iconCode = 1401;
							title = "您没有权限查看该作品";
							break;
						case 1500:
							iconCode = 1500;
							title = "哎呀,页面出错了,一会再来吧";
							break;
						default :
							iconCode = 500;
							title = "抱歉,您访问的页面已失踪";
							break;
					}

					workBody.innerHTML = "";
					workBody.loadError = true;
					workBody.onLoadError && workBody.onLoadError();
					workBody.workTitle = title;
					css( workBody, "background", "white" );

					var errorImage = Img( Img.staticSrc( iconCode + ".png" ), {
						onLoad : function () {
							$( errorImage, {
								css : p.cssCenter( errorImage.halfWidth, errorImage.halfHeight )
							}, workBody );
						}
					} );
					return;
				}

				if ( workData = workData.data ) {
					var workInfo = {
							id : id,
							picture : document.thumbnail = workData.thumbnail,
							title : workBody.workTitle = workData.title,
							url : href.origin + href.pathname,
							desc : document.description = workData.description || "",
							uid : workData.uid
						},
						pages = array.map( workData.pages, function ( pageData ) {
							return pageData.layout;
						} ),
						noLoop = false;

					// 如果在初夜中,回调onFirstPageDataLoad方法
					if ( ua.chuye ) {
						ua.chuyeVersion < 2 && async.polling( function () {
							return !!document.onFirstPageDataLoad;
						}, function () {
							document.onFirstPageDataLoad();
						} );
					}
					else {
						// 设置分享url
						share( workInfo );
					}

					if ( workData.copyright ) {
						var authorPageData = {
							label : "author",
							data : {
								uid : workData.uid
							}
						};

						if ( workData.author ) {
							authorPageData.image = [workData.headimgurl || Img.staticSrc( "default-avatar.jpg" )];
							authorPageData.data.author = workData.author;
						}

						pages.push( authorPageData );
					}
					else {
						noLoop = true;
						tips.PoweredBy();
					}

					callback( {
						workInfo : workInfo,
						theme : workData.theme,
						mode : workData.mode,
						color : workData.backgroud ? workData.backgroud.color === "FFFFFF" ? "#FFFFFF" : workData.backgroud.color : "#FFFFFF",
						pageSwitch : workData.pageSwitch ? workData.pageSwitch.animateId || "classic" : "classic",
						music : workData.music ? workData.music.src : null,
						pages : pages,
						noLoop : noLoop
					} );
				}
			} );
		};
	}

	module.exports = LoadWork;
} );