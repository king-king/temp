/**
 * Created by 白 on 2015/6/10.
 * 作者页
 */

plugin( function () {
	var Img = imports( "../img" ),
		platform = imports( "../platform" ),
		pointer = imports( "pointer" ),
		async = imports( "async" ),
		history = imports( "../history" ),
		object = imports( "object" ),
		ajax = imports( "ajax" ),
		cookie = imports( "cookie" ),
		token = cookie.get( "_token" ),
		tips = imports( "../tips" ),
		URL = imports( "url" ),
		$ = imports( "element" ),
		css = imports( "css" ),
		isFollow = false,
		FollowSystem = {},
		trackView = {};

	if ( !ua.MicroMessenger ) {
		FollowSystem.canNotLogin = function () {
			alert( "请在微信中使用" );
		};

		FollowSystem.isLogIn = function () {
			return false;
		};
	}
	else {
		FollowSystem.isLogIn = function () {
			return !!token;
		};
		FollowSystem.logIn = function () {
			location.href = "http://passport.cloud7.com.cn/wechat/oauth";
		};
	}

	function tap( element, onIn, onOut, onTap ) {
		onPointerDown( element, function () {
			onIn();

			onTapUp( onTap );

			async.once( function () {
				onOut();
			}, function ( task ) {
				return [pointer.onMoveUp( {
					onUp : task
				} ), onSwipe( task, true ), onLongPress( task )];
			} );
		} );
	}

	function followUser( uid, done ) {
		var xhr = ajax( {
			url : "http://social.cloud7.com.cn/api/follow/add",
			data : JSON.stringify( {
				userId : uid
			} ),
			method : "post",
			headers : {
				"Accept" : "application/json",
				"Content-Type" : "application/json",
				Authorization : "_token " + token
			}
		}, function ( err ) {
			if ( !err ) {
				var data = JSON.parse( xhr.responseText );
				done && done( data.code === 200 ? null : true );
			}
			else {
				done && done( true );
			}
		} );
	}

	// 关注作者页面
	var followAuthorPage = history.registLoginPage( "follow-author", FollowSystem, function ( page, data ) {
		var em = 26 / 2 / 12 + "em";

		isFollow = true;
		css( page, "background", "white" );

		function percent( px ) {
			return px / 1008 * 100 + "%";
		}

		function center( y ) {
			return {
				left : "50%",
				transform : "translate3d(-50%,0,0)",
				top : percent( y )
			};
		}

		function layIcon( src, y, x ) {
			var icon = page.appendChild( Img.Icon( src ) ),
				ps = icon.ps;

			css( icon, {
				position : "absolute",
				width : "auto",
				height : percent( ps.height * 2 )
			} );

			if ( x !== undefined ) {
				css( icon, {
					left : css.px( x ),
					top : css.px( y )
				} );
			}
			else {
				css( icon, center( y ) );
			}

			return icon;
		}

		// 后退按钮
		layIcon( "following/back", 15, 15 );
		var back = $( "div", {
			css : {
				position : "absolute",
				width : "50px",
				height : "50px",
				"z-index" : 1
			}
		}, page );
		onTap( back, history.back );

		// 对勾按钮
		layIcon( "following/ok", 350 );

		function lineStyle( y ) {
			return {
				position : "absolute",
				top : percent( y ),
				left : 0,
				right : 0,
				"text-align" : "center",
				"line-height" : em,
				"font-size" : em
			};
		}

		$( "div", {
			css : lineStyle( 448 ),
			children : [$( "span", {
				innerHTML : "您已关注了",
				css : {
					"margin-right" : percent( 20 ),
					color : "#989898"
				}
			} ), $( "span", {
				innerHTML : data.author,
				css : {
					color : "#393939"
				}
			} )]
		}, page );

		// 下载按钮
		var download = layIcon( "following/download", 582 ),
			downloadActive = layIcon( "following/download-active", 582 );

		downloadActive.classList.add( "hidden" );

		// 下载按钮
		tap( download, function () {
			downloadActive.classList.remove( "hidden" );
			download.classList.add( "hidden" );
		}, function () {
			download.classList.remove( "hidden" );
			downloadActive.classList.add( "hidden" );
		}, function () {
			platform.downloadFirstPage( "DownloadFollow" );
		} );

		followUser( data.uid );

		fp.track( ["Following", platform.systemName, data.uid + " - " + data.workId] );
	} );

	layoutFormats.author = {
		load : function ( pageData, done ) {
			var tasks = [],
				authorData = pageData.data;

			if ( !isFollow && FollowSystem.isLogIn() ) {
				tasks.push( function ( done ) {
					var xhr = ajax( {
						url : URL.concatArg( "http://social.cloud7.com.cn/api/follow/state", {
							userId : authorData.uid
						} ),
						headers : {
							Accept : "application/json",
							"Content-Type" : "application/x-www-form-urlencoded",
							Authorization : "_token " + token
						}
					}, function ( err ) {
						if ( !err ) {
							var data = JSON.parse( xhr.responseText );
							if ( data.code === 200 ) {
								isFollow = data.data === 1;
							}
						}
						done();
					} );
				} );
			}

			if ( authorData.author == null ) {
				tasks.push( function ( done ) {
					var xhr = ajax( {
						url : URL.concatArg( "/WorkV2/GetUserInfo", {
							userId : authorData.uid
						} )
					}, function ( err ) {
						if ( !err ) {
							var data = JSON.parse( xhr.responseText );
							if ( data.code === 200 ) {
								data = data.data;
								authorData.author = data.nickname;
								pageData.image = [data.thumbnail || Img.staticSrc( "default-avatar.jpg" )];
							}
						}
						done();
					} );
				} );
			}

			async.concurrency( tasks, function () {
				done( pageData );
			} );
		},
		resource : {
			create : "author/create",
			createActive : "author/create-active",
			follow : "author/follow",
			following : "author/following"
		},
		create : function ( layout, ds, resource ) {
			var authorData = ds.data(),
				fontSize = Math.max( 14 * yRatio << 0, 12 );

			function layImage( image, info ) {
				return p.layImage( p.transformY, image, info, layout );
			}

			function layText( text, y, color ) {
				var comp = Component( Content.Label( text, {
					lineHeight : fontSize,
					fontSize : fontSize,
					color : color || "#393939"
				} ), layout );
				comp.x = p.center( comp );
				comp.y = y * yRatio;
			}

			layout.background = "white";

			// 作者
			var authorY = ua.chuye ? 340 / 2 : 194 / 2;
			layText( "作", authorY, "#989898" );
			layText( "者", authorY + 20, "#989898" );
			layText( authorData.author, ua.chuye ? 674 / 2 : 561 / 2 );

			// 头像
			var headSize = 144 / 2 * yRatio << 0,
				head = Component( Content.Border( Content.ImageCover( ds.image( 0 ), headSize, headSize ), {
					radius : headSize / 2
				} ), layout );
			head.y = ( ua.chuye ? 490 / 2 : 381 / 2 ) * yRatio;
			head.x = p.center( head );

			// 关注
			if ( ua.MicroMessenger && window.enableFollow !== false ) {
				var following = layImage( resource.following, {
					y : 631 / 2,
					alignX : 0.5
				} );

				if ( !isFollow ) {
					following.visible = false;
					var follow = layImage( resource.follow, {
						y : 631 / 2,
						alignX : 0.5
					} );

					onTap( follow.element, function () {
						followAuthorPage( {
							force : true,
							data : object.extend( authorData, {
								workId : body.workId
							} )
						} );
					} )
				}
			}

			if ( !ua.chuye ) {
				// 创作
				var create = layImage( resource.create, {
						y : 925 / 2,
						alignX : 0.5
					} ),
					createActive = layImage( resource.createActive, {
						y : 925 / 2,
						alignX : 0.5
					} );

				createActive.visible = false;

				tap( create.element, function () {
					create.visible = false;
					createActive.visible = true;
				}, function () {
					create.visible = true;
					createActive.visible = false;
				}, function () {
					platform.downloadFirstPage();
				} );
			}

			// 滑到最后一页时记录
			if ( !trackView[body.workId] ) {
				fp.track( ["Download", "View", platform.systemName] );
				trackView[body.workId] = true;
			}
		}
	};
} );