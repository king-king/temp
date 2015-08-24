/**
 * Created by Zuobai on 2014/11/30.
 * 用于分析library的引用关系
 */

require( "./node" );
var List = require( "./linked-list" ),
	Path = require( "path" ),
	func = require( "./function" ),
	zachFS = require( "./fs" ),
	async = require( "./async" ),
	array = require( "./array" ),
	libDirPath = Path.dirname( module.filename ),
	cwd = process.cwd();

// 补全src,如果没有.js,添加.js
function completeSrc( src ) {
	return /\.js$/.test( src ) ? src : src + ".js";
}

// require的正则表达式
function RequirePattern() {
	return /[^0-9A-Za-z]imports\(([^()]*)\)/g;
}

// exports的正则表达式,包括exports和module.exports
function ExportsPattern() {
	return /([^0-9A-Za-z])(exports|module\.exports)/g;
}

// 从正则表达式的结果中,获取模块名
function getRequireResult( regResult ) {
	return completeSrc( JSON.parse( "[" + regResult[1] + "]" )[0] );
}

// 将文件路径中的模块名转换为绝对路径
function modulePath( filePath, moduleName ) {
	return /\/|\\/.test( moduleName ) ?
		Path.resolve( Path.join( filePath ? Path.dirname( filePath ) : cwd, moduleName ) ) :
		Path.resolve( Path.join( libDirPath, moduleName ) );
}

// 分析一组脚本的引用,分析完后回调
function parse( contentList, parseDone ) {
	var list = List(), lib = {};

	async.sequence( array.map( contentList, function ( content ) {
		return function ( done ) {
			func.recursion( function parse( content, nextNode, callback ) {
				if ( content ) {
					var path = content.path,
						code = ( new Buffer( content.data, content.encoding ) ).toString( "utf8" ),
						requirePattern = RequirePattern();

					func.recursion( function doModule() {
						var regResult = requirePattern.exec( code );

						if ( regResult !== null ) {
							var curPath = modulePath( path, getRequireResult( regResult ) ).toLowerCase();

							if ( !lib[curPath] ) {
								lib[curPath] = true;
								zachFS.readContent( {
									path : curPath,
									encoding : "utf8"
								}, function ( err, content ) {
									if ( err ) {
										parseDone && parseDone( "Error in parsing " + path + "\n" + err );
									}
									else {
										content.isLibrary = true;
										parse( content, list.insert( List.Node( content ), nextNode ), doModule );
									}
								} );
							}
							else {
								doModule();
							}
						}
						else {
							callback && callback();
						}
					} );
				}
			}, content, list.insert( List.Node( content ), null ), done )
		};
	} ), function () {
		parseDone && parseDone( null, array.collect( function ( push ) {
			List.foreach( list, push );
		} ) );
	} );
}

parse.RequirePattern = RequirePattern;
parse.ExportsPattern = ExportsPattern;
parse.getRequireResult = getRequireResult;
parse.modulePath = modulePath;
module.exports = parse;