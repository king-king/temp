/**
 * Created by 白 on 2014/8/15.
 */

require( "./node.js" );
var Path = require( "path" ),
	func = require( "./function" ),
	parseRequire = require( "./require-parser" ),
	array = require( "./array" ),
	object = require( "./object" ),
	async = require( "./async" ),
	GoOn = async.GoOn;

// 合并文件
function merge( contentList ) {
	var result = "";

	// 合并内容
	array.foreach( contentList, function ( content, i ) {
		i !== 0 && ( result += "\n" );
		result += content.data;
	} );

	return result;
}

// 合并css,同步
function mergeCSS( mergeInfo ) {
	var outDir = mergeInfo.outDir;

	return merge( array.map( mergeInfo.input, function ( content ) {
		var inDir = Path.dirname( content.path );

		return {
			path : content.path,
			data : outDir ? content.data.replace( /url\(([^)]*)\)/g, function () {
				var url = RegExp.$1;
				if ( !/^data:/.test( url ) && !/:\/\//.test( url ) ) {
					url = Path.relative( outDir, Path.join( inDir, url.replace( /["']/, "" ) ) ).replace( /\\/g, "/" );
					url = mergeInfo.doUrl ? mergeInfo.doUrl( url ) : url;
					return "url(" + url + ")";
				}
			} ) : content.data
		};
	} ) );
}

// javaScript合并的头
var jsMergeClient = function () {
	//noinspection JSUnusedLocalSymbols
	var library = function () {
			var count = 0;
			return function ( module ) {
				library[count++] = {};
				module();
			};
		}(),
		main = function ( func ) {
			func();
		},
		plugin = main;

	/*code*/
};

// 合并js,由于要解析引用,异步
function mergeJS( mergeInfo, callback ) {
	var lib = {},
		cwd = process.cwd();

	parseRequire( mergeInfo.input, GoOn( callback )( function ( contentList ) {
		array.foreach( array.filter( contentList, function ( content ) {
			return content.isLibrary;
		} ), function ( content, i ) {
			lib[Path.resolve( content.path ).toLowerCase()] = i;
		} );

		var result = merge( array.map( contentList, function ( content ) {
			//noinspection JSUnresolvedFunction
			var inPath = content.path,
				curPath = parseRequire.modulePath( null, "./" + Path.relative( cwd, inPath ) );

			return {
				path : inPath,
				data : content.data.replace( parseRequire.RequirePattern(), function () {
					//noinspection JSUnresolvedFunction
					return 'library["' + lib[parseRequire.modulePath( inPath, parseRequire.getRequireResult( arguments ) ).toLowerCase()] + '"]';
				} ).replace( parseRequire.ExportsPattern(), function () {
					return RegExp.$1 + 'library["' + lib[curPath.toLowerCase()] + '"]';
				} )
			};
		} ) );

		callback( null, "(" + jsMergeClient.toString().replace( "/*code*/", result ) + ")();\n" );
	} ) );
}

exports.mergeJS = mergeJS;
exports.mergeCSS = mergeCSS;