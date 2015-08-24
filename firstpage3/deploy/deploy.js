/**
 * Created by 白 on 2015/3/24.
 */

var zfs = require( "../lib/zach/fs" ),
	async = require( "../lib/zach/async" ),
	array = require( "../lib/zach/array" ),
	object = require( "../lib/zach/object" ),
	Path = require( "path" ),
	zsp = require( "zach-sprite" ),
	merge = require( "../lib/zach/merge" ),
	string = require( "../lib/zach/string" ),
	http = require( "../lib/zach/http" ),
	sprite = require( "../lib/zach/sprite" ),
	jsdom = require( "jsdom" ),
	yui = require( "yuicompressor" ),
	deploy = require( "../lib/zach/deploy" ),

	project = [],

	destDir = "../../firstpage3-deploy/web",
	imageUncompressedDir = "../content/image",
	imageCompressedDir = Path.join( destDir, "content/image" ),
	envPath = "env.json",
	env = {};

var scriptData = {
	firstpageScript : "arguments.callee"
};

var goOn = async.GoOn( function ( err ) {
	console.log( err );
} );

async.sequence( [
	// 读取环境变量
	function ( callback ) {
		zfs.readJSONFile( Path.join( destDir, envPath ), goOn( function ( result ) {
			env = result || {};
			callback();
		} ), true );
	},

	// 生成html
	function ( callback ) {
		// 读取脚本
		async.sequence( [
			function ( callback ) {
				zfs.readContent( {
					path : "preview-deploy.js",
					encoding : "utf8"
				}, goOn( function ( result ) {
					callback( result.data.replace( /window\.firstpageVersion = (\d*);/, function () {
						return string.format( "window.firstpageVersion = %version%;", {
							version : env.version = ( env.version || 0 ) + 1
						} );
					} ) );
				} ) )
			},

			// 压缩脚本
			function ( callback, script ) {
				yui.compressString( script, {
					type : "js"
				}, goOn( callback ) );
			},

			// 生成html
			function ( script ) {
				var document = jsdom.jsdom( "<!DOCTYPE html>" ),
					head = document.head;

				// 页面标题
				document.title = "初页部署";

				// 添加meta
				array.foreach( [
					{
						"charset" : "utf8"
					},
					{
						name : "mobileoptimized",
						content : "0"
					},
					{
						name : "viewport",
						content : "width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
					},
					{
						name : "apple-mobile-web-app-capable",
						content : "yes"
					},
					{
						name : "format-detection",
						content : "telephone=no"
					},
					{
						name : "screen-orientation",
						content : "portrait"
					},
					{
						name : "browsermode",
						content : "application"
					}
				], function ( meta ) {
					var metaNode = document.createElement( "meta" );
					object.foreach( meta, function ( k, v ) {
						metaNode.setAttribute( k, v );
					} );
					head.appendChild( metaNode );
				} );

				document.body.appendChild( document.createElement( "script" ) );

				// 加入项目
				project.push( {
					path : "firstpage.html",
					data : jsdom.serializeDocument( document ).replace( "<script></script>", "<script>" + script + "</script>" ),
					encoding : "utf8"
				} );

				callback && callback();
			}
		] );
	},

	// 合并icon图片
	function ( callback ) {
		var iconList = [];
		zfs.listDir( "../icon", function ( err, contentList ) {
			var groupMap = {}, pathMap = {};

			async.sequence( [
				function ( callback ) {
					async.concurrency( array.map( contentList, function ( content ) {
						return function ( done ) {
							zfs.readContent( content, goOn( function ( content ) {
								var path = content.path, // 路径
									relativePath = Path.relative( "../icon", path ),
									iconPath = relativePath.replace( /\\/gi, "/" ).replace( ".png", "" ), // 图标路径
									pathParts = iconPath.split( "/" ), // 路径的部分
									groupName = ["icon"].concat( pathParts.slice( 0, pathParts.length - 1 ) ).join( "-" ), // 分组名
									group = groupMap[groupName] = groupMap[groupName] || []; // 组

								pathMap[path] = {
									groupName : groupName,
									iconPath : iconPath
								};

								project.push( {
									path : Path.join( "content", "image", "icon", relativePath ),
									data : content.data
								} );

								group.push( content );

								done();
							} ) );
						};
					} ), callback );
				},

				function () {
					// 合并每一组图片
					async.concurrency( array.collect( function ( push ) {
						object.foreach( groupMap, function ( groupName, group ) {
							push( function ( done ) {
								sprite( {
									contentList : group.sort( function ( lhs, rhs ) {
										return lhs.path.localeCompare( rhs.path );
									} ),
									align : 2,
									padding : 2
								}, goOn( function ( result ) {
									array.foreach( result.images.sort( function ( lhs, rhs ) {
										return lhs.path.localeCompare( rhs.path );
									} ), function ( img ) {
										var imgInfo = pathMap[img.path];

										iconList.push( {
											path : imgInfo.iconPath,
											x : img.x,
											y : img.y,
											w : img.width,
											h : img.height
										} );
									} );

									zfs.writeContent( {
										path : Path.join( "../content/image", groupName ) + ".png",
										data : result.data
									}, goOn( done ) );
								} ) );
							} );
						} );
					} ), function () {
						scriptData.iconMap = JSON.stringify( object.collect( function ( push ) {
							array.foreach( iconList.sort( function ( lhs, rhs ) {
								return lhs.path.localeCompare( rhs.path );
							} ), function ( icon ) {
								push( icon.path, object.exclude( icon, ["path"] ) )
							} );
						} ) );
						callback();
					} );
				}
			] );
		} );
	},

	// 合并压缩脚本
	function ( callback ) {
		var application = {}, applicationPath = {}, applicationContentList = {};
		async.sequence( [
			// 读取application
			function ( callback ) {
				zfs.readJSONFile( "../application.json", goOn( function ( result ) {
					application = result;
					application.js = ["release.js"].concat( application.js );
					callback();
				} ) );
			},

			// 解析路径
			function ( callback ) {
				async.concurrency( array.collect( function ( push ) {
					object.foreach( application, function ( key, list ) {
						push( function ( done ) {
							async.sequence( array.map( list, function ( path ) {
								return function ( done ) {
									zfs.resolvePath( Path.join( "../src", path ), goOn( function ( pathList ) {
										applicationPath[key] = array.concat( applicationPath[key] || [], pathList );
										done();
									} ) );
								};
							} ), done );
						} );
					} );
				} ), callback );
			},

			// 读取文件
			function ( callback ) {
				async.concurrency( array.collect( function ( push ) {
					object.foreach( applicationPath, function ( key, list ) {
						push( function ( done ) {
							zfs.readContentList( array.map( list, function ( content ) {
								return object.insert( content, {
									encoding : "utf8"
								} );
							} ), goOn( function ( result ) {
								applicationContentList[key] = result;
								done();
							} ) );
						} );
					} );
				} ), callback );
			},

			// 合并并压缩样式
			function ( callback ) {
				yui.compressString( merge.mergeCSS( {
					input : applicationContentList.css
				} ), {
					type : "css"
				}, goOn( function ( result ) {
					scriptData.firstpageStyle = JSON.stringify( result.replace( /[^0-9](0)(\s)*\{/gi, function ( text ) {
						return text.replace( "0", "0%" );
					} ) );
					callback();
				} ) );
			},

			// 合并脚本
			function () {
				merge.mergeJS( {
					input : [{
						path : "",
						data : array.collect( function ( push ) {
							object.foreach( scriptData, function ( name, data ) {
								push( string.format( "var %name% = %data%;", {
									name : name,
									data : data
								} ) );
							} );
						} ).join( "\n" )
					}].concat( applicationContentList.js )
				}, goOn( function ( result ) {
					project.push( {
						path : "content/firstpage.js",
						data : result,
						encoding : "utf8"
					} );

					yui.compressString( result, {
						type : "js"
					}, goOn( function ( result ) {
						project.push( {
							path : "content/firstpage.min.js",
							data : result,
							encoding : "utf8"
						} );
						callback();
					} ) );
				} ) );
			}
		] );
	},

	// 压缩图片
	function ( callback ) {
		var oldMap = [], compareList;
		async.sequence( [
			// 读取未压缩的图片和已压缩的图片
			function ( callback ) {
				async.concurrency( [
					function ( done ) {
						zfs.listDir( imageUncompressedDir, goOn( function ( contentList ) {
							zfs.readContentList( contentList, goOn( function ( contentList ) {
								compareList = zfs.compareContentList( env.compressedImages || [], array.map( contentList, function ( content ) {
									content.path = Path.relative( imageUncompressedDir, content.path );
									content.md5 = zfs.getContentMd5( content );
									return content;
								} ) );
								done();
							} ) );
						} ) );
					},
					function ( done ) {
						if ( env.version > 1 ) {
							zfs.listDir( imageCompressedDir, goOn( function ( contentList ) {
								zfs.readContentList( contentList, goOn( function ( contentList ) {
									oldMap = zfs.listToMap( array.map( contentList, function ( content ) {
										content.path = Path.relative( imageCompressedDir, content.path );
										return content;
									} ) );
									done();
								} ) );
							} ) );
						}
						else {
							oldMap = {};
							done();
						}
					}
				], callback );
			},

			function () {
				var compressedList = [],
					unCompressedList = [],
					toCompressList = [],
					compressCount = 0,
					trackMap = zfs.listToMap( env.compressedImages || [] );

				array.foreach( compareList, function ( content ) {
					switch ( content.type ) {
						case "create":
						case "update":
							if ( Path.extname( content.path ).replace( ".", "" ) in {png : true, jpg : true} ) {
								toCompressList.push( content );
							}
							else {
								unCompressedList.push( content );
							}
							break;
						case "not-modified" :
							compressedList.push( object.extend( oldMap[content.path], {
								md5 : content.md5,
								ratio : trackMap[content.path].ratio
							} ) );
							break;
					}
				} );

				// 使用tinypng的服务逐项压缩
				async.concurrency( array.map( toCompressList, function ( content ) {
					return function ( done ) {
						zsp.compress( {
							input : Path.join( imageUncompressedDir, content.path ),
							key : "M1wU7QziatpdhbH7V-DzKRiALT0gm0OB"
						}, goOn( function ( result ) {
							http.request( {
								url : result.url
							}, function ( err, response ) {
								if ( err ) {
									console.log( string.format( "%filename%压缩失败 %index%/%total%", {
										filename : content.path,
										index : ++compressCount,
										total : toCompressList.length
									} ) );
								}
								else {
									compressedList.push( {
										path : content.path,
										md5 : content.md5,
										data : response.data,
										ratio : result.ratio
									} );
									console.log( string.format( "压缩%filename% 节省了%ratio% %index%/%total%", {
										filename : content.path,
										ratio : 1 - result.ratio,
										index : ++compressCount,
										total : toCompressList.length
									} ) );
								}
								done();
							} );
						} ) );
					}
				} ), function () {
					// 加入到部署列表中
					array.foreach( compressedList.concat( unCompressedList ), function ( content ) {
						project.push( object.extend( content, {
							path : Path.join( "content/image", content.path )
						} ) );
					} );

					// 记录
					env.compressedImages = array.map( compressedList, function ( content ) {
						return {
							path : content.path,
							md5 : content.md5,
							ratio : content.ratio
						};
					} );

					callback();
				} );
			}
		] );
	},

	// 完成
	function () {
		project.push( {
			path : envPath,
			data : JSON.stringify( env, null, 4 ),
			encoding : "utf8"
		} );

		deploy( {
			contentList : project,
			destDir : destDir
		} );
	}
] );