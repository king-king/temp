/**
 * Created by 白 on 2015/3/24.
 */

var zfs = require( "../lib/zach/fs" ),
	async = require( "../lib/zach/async" ),
	array = require( "../lib/zach/array" ),
	object = require( "../lib/zach/object" ),
	Path = require( "path" ),
	merge = require( "../lib/zach/merge" ),
	string = require( "../lib/zach/string" ),
	http = require( "../lib/zach/http" ),
	jsdom = require( "jsdom" ),
	yui = require( "yuicompressor" ),
	deploy = require( "../lib/zach/deploy" ),

	project = [],

	destDir = "../../firstpage3-deploy/web",
	envPath = "env.json",
	env = {};

var scriptData = {};

var goOn = async.GoOn( function ( err ) {
	console.log( err );
} );

async.sequence( [
	// 合并icon图片
	function ( callback ) {
		zfs.resolvePath( "content/*.png", goOn( function ( result ) {
			var imageData = {};
			zfs.readContentList( array.map( result, function ( content ) {
				content.encoding = "base64";
				return content;
			} ), goOn( function ( result ) {
				array.foreach( result, function ( content ) {
					imageData[Path.basename( content.path )] = "data:image/png;base64," + content.data;
				} );
				scriptData.imageData = JSON.stringify( imageData );
				callback();
			} ) );
		} ) );
	},

	// 合并压缩脚本
	function ( callback ) {
		var application = {
			js : ["theme-preview.js"].concat( ["../src/content/image.js", "../src/content/shape.js", "../src/mode/animation-css.js", "../src/mode/animation-js.js",
				"../src/enter-animation/1.js", "../src/enter-animation/2.js"] )
		}, applicationPath = {}, applicationContentList = {};
		async.sequence( [
			// 解析路径
			function ( callback ) {
				async.concurrency( array.collect( function ( push ) {
					object.foreach( application, function ( key, list ) {
						push( function ( done ) {
							async.sequence( array.map( list, function ( path ) {
								return function ( done ) {
									zfs.resolvePath( path, goOn( function ( pathList ) {
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
					yui.compressString( result, {
						type : "js"
					}, goOn( function ( result ) {
						callback( result );
					} ) );
				} ) );
			}
		] );
	},

	// 生成html
	function ( callback, script ) {
		var document = jsdom.jsdom( "<!DOCTYPE html>" ),
			head = document.head;

		// 页面标题
		document.title = "主题预览";

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

		callback && callback( jsdom.serializeDocument( document ).replace( "<script></script>", "<script>" + script + "</script>" ) );
	},

	// 完成
	function ( html ) {
		zfs.writeContent( {
			path : "theme-preview-deploy.html",
			data : html,
			encoding : "utf8"
		} );
	}
] );