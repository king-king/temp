/**
 * Created by 白 on 2014/11/10.
 * 封装一些经典的文件系统需求
 */

require( "./node" );
var Path = require( "path" ),
	object = require( "./object" ),
	func = require("./function"),
	crypto = require( "crypto" ),
	fs = require( "fs" ),
	async = require( "./async" ),
	array = require( "./array" ),
	GoOn = async.GoOn;

// region util
// 创建目录
function mkdir( path, callback ) {
	fs.exists( path, function ( exists ) {
		if ( !exists ) {
			var dir = "";

			async.sequence( array.map( splitPath( path ), function ( dirParts, i ) {
				return function ( done ) {
					dir += ( i === 0 ? "" : "/" );
					dir += dirParts;
					fs.mkdir( dir, done )
				};
			} ), callback );
		}
		else {
			callback();
		}
	} );
}

// 移除目录或文件
function remove( path, callback ) {
	var goOn = GoOn( callback );

	fs.stat( path, goOn( function ( stat ) {
		if ( stat.isDirectory() ) {
			// 如果是目录,并发递归其内部的每一个目录后,删除自己
			fs.readdir( path, goOn( function ( pathList ) {
				async.concurrency( array.map( pathList, function ( childPath ) {
					return function ( done ) {
						remove( Path.join( path, childPath ), goOn( done ) );
					};
				} ), function () {
					fs.rmdir( path, goOn( callback ) );
				} );
			} ) );
		}
		else {
			// 如果是文件,直接删除自己
			fs.unlink( path, goOn( callback ) );
		}
	} ) );
}

// 将contentList转换为contentMap
function listToMap( list ) {
	var retVal = {}, cwd = process.cwd();
	array.foreach( list, function ( content ) {
		retVal[Path.relative( cwd, content.path )] = content;
	} );
	return retVal;
}
// endregion

// region 路径
// 拆分路径
function splitPath( path ) {
	return Path.normalize( path ).replace( /\\/g, "/" ).split( "/" );
}

// 将带通配符的路径解析为对应的文件并回调,尚不支持文件夹的通配符
function resolvePath( path, callback ) {
	if ( /\?|\*/gi.test( path ) ) {
		var dir = Path.dirname( path ),
			wildReg = new RegExp( Path.basename( path ).replace( ".", "\\." ).replace( "?", "." ).replace( "*", ".*" ) ),
			matchedFiles = [];

		// 遍历目录,符合通配符的加入到inFile中
		fs.readdir( dir, function ( err, fileList ) {
			if ( err ) {
				callback( err, null );
			}
			else {
				array.foreach( fileList, function ( fileName ) {
					wildReg.test( fileName ) && matchedFiles.push( {
						path : Path.join( dir, fileName )
					} );
				} );

				callback( err, matchedFiles );
			}
		} );
	}
	else {
		callback( null, [{
			path : path
		}] );
	}
}

// 列出路径下的所有文件
function listDir( dir, listDone, doDir ) {
	var result = [];

	func.recursion( function readDir( dir, callback ) {
		async.sequence( [
			// 读取目录下的路径列表
			function ( callback ) {
				fs.readdir( dir, GoOn( listDone )( callback ) )
			},

			// 对于每个路径,如果是文件,加入到结果中,如果是目录,递归调用
			function ( pathList ) {
				async.concurrency( array.map( pathList, function ( path ) {
					return function ( done ) {
						path = Path.join( dir, path );

						fs.stat( path, function ( err, stat ) {
							if ( stat.isDirectory() ) {
								readDir( path, done );

								if ( doDir ) {
									result.push( {
										path : path,
										isDirectory : true
									} );
								}
							}
							else {
								result.push( {
									path : path
								} );
								done();
							}
						} );

					};
				} ), callback );
			}
		] );
	}, dir, function () {
		listDone( null, result );
	} );
}

// 判断路径是否属于目录
function inDir( srcPath, tarPath ) {
	return !/^\.\./.test( Path.relative( tarPath, srcPath ) );
}
// endregion

// region content
// 读取文件,制作成content格式
function readContent( arg, callback ) {
	var path = arg.path,
		encoding = arg.encoding,
		retVal = {
			path : path,
			encoding : encoding
		};

	fs.readFile( path, {
		encoding : encoding
	}, GoOn( callback )( function ( data ) {
		retVal.data = data;
		callback( null, retVal );
	} ) );
}

// 写入content,创建响应的文件夹
function writeContent( content, callback ) {
	var dir = Path.dirname( content.path );

	func.callWith( function ( write ) {
		if ( !dir || dir === Path.dirname( dir ) ) {
			write();
		}
		else {
			mkdir( dir, write );
		}
	}, function () {
		fs.writeFile( content.path, content.data, {
			encoding : content.encoding
		}, callback );
	} );
}

// 计算content的md5
function getContentMd5( content ) {
	if ( !content.isDirectory ) {
		var md5 = crypto.createHash( 'md5' );
		md5.update( content.data, content.encoding );
		return md5.digest( 'hex' );
	}
	return undefined;
}

// 读取一组数据
function readContentList( inContentList, callback ) {
	var contentList = [];

	async.concurrency( array.map( inContentList, function ( content, i ) {
		return function ( done ) {
			func.callWith( function ( pushResult ) {
				if ( content.isDirectory ) {
					pushResult( {
						path : content.path,
						isDirectory : true
					} );
					done();
				}
				else {
					readContent( content, GoOn( callback )( function ( result ) {
						pushResult( result );
						done();
					} ) );
				}
			}, function ( result ) {
				contentList[i] = result;
			} )
		};
	} ), function () {
		callback( null, contentList );
	} );
}

// 计算一个列表中的目录
function computeListDir( contentList ) {
	var newContentList = [],
		map = listToMap( contentList );

	array.foreach( contentList, function ( content ) {
		newContentList.push( content );

		var dir = Path.dirname( content.path );
		while ( dir !== Path.dirname( dir ) && !( dir in map ) ) {
			newContentList.push( {
				path : dir,
				isDirectory : true
			} );
			dir = Path.dirname( dir );
		}
	} );

	return newContentList;
}
// endregion

// region 比较
// 比较内容列表,根据md5出未改变,更新,创建和删除
function compareContentList( srcList, tarList ) {
	var srcMap = listToMap( srcList ), tarMap = listToMap( tarList ),
		retVal = [];

	function result( tarContent, type ) {
		return retVal.push( object.extend( tarContent, {
			type : type
		} ) );
	}

	object.foreach( tarMap, function ( path, tar ) {
		var src = srcMap[path];
		result( tar, src ? tar.md5 === src.md5 && tar.isDirectory === src.isDirectory ? "not-modified" : "update" : "create" );
	} );

	object.foreach( srcMap, function ( path, content ) {
		if ( !( path in tarMap ) ) {
			result( content, "remove" );
		}
	} );

	return retVal;
}

// 判断两个列表是否相等
function isContentListIdentify( arg1, arg2 ) {
	return array.foreach( arg2 === undefined ? arg1 : compareContentList( arg1, arg2 ), function ( content ) {
			return content.type !== "not-modified" ? true : undefined;
		} ) === undefined;
}

// 写入一个比较列表
function writeCompareContentList( compareList, callback ) {
	function doCompareList( func, callback ) {
		async.concurrency( array.map( compareList, function ( content ) {
			return function ( done ) {
				func( GoOn( callback )( done ), content );
			};
		} ), callback );
	}

	async.sequence( [
		// 删除remove
		function ( callback ) {
			doCompareList( function ( done, content ) {
				content.type === "remove" ?
					content.isDirectory ? fs.rmdir( content.path, done ) : fs.unlink( content.path, done ) :
					done();
			}, callback );
		},

		// 更新update和create
		function () {
			doCompareList( function ( done, content ) {
				var type = content.type;
				type === "create" || type === "update" ?
					content.isDirectory ? mkdir( content.path, done ) : writeContent( content, done ) :
					done();
			}, function () {
				callback && callback( null );
			} );
		}
	] );
}
// endregion

// region json读写
// 读取json文件
function readJSONFile( path, callback, ignoreEmpty ) {
	readContent( {
		path : path,
		encoding : "utf8"
	}, function ( err, content ) {
		if ( err ) {
			if ( ignoreEmpty ) {
				callback( null, null );
			}
			else {
				callback( err );
			}
		}

		if ( content ) {
			try {
				var result = JSON.parse( content.data );
			}
			catch ( e ) {
				callback( e );
				return;
			}

			callback( null, result );
		}
	} );
}

// 写入json文件
function writeJSONFile( path, data, callback, indent ) {
	writeContent( {
		path : path,
		encoding : "utf8",
		data : JSON.stringify( data, null, indent || 4 ) + "\n"
	}, callback );
}
// endregion

exports.mkdir = mkdir;
exports.remove = remove;
exports.listToMap = listToMap;

exports.splitPath = splitPath;
exports.inDir = inDir;

exports.resolvePath = resolvePath;
exports.listDir = listDir;

exports.readContent = readContent;
exports.writeContent = writeContent;
exports.readContentList = readContentList;
exports.computeListDir = computeListDir;
exports.getContentMd5 = getContentMd5;

exports.compareContentList = compareContentList;
exports.writeCompareContentList = writeCompareContentList;
exports.isContentListIdentify = isContentListIdentify;

exports.readJSONFile = readJSONFile;
exports.writeJSONFile = writeJSONFile;