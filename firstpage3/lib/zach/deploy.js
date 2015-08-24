/**
 * Created by 白 on 2015/4/3.
 */

var zachFS = require( "./fs" ),
	fs = require( "fs" ),
	Path = require( "path" ),
	colorStr = require( "./console" ).colorString,
	array = require( "./array" ),
	object = require( "./object" ),
	func = require( "./function" ),

	async = require( "./async" ),
	GoOn = async.GoOn;

function log( type, msg ) {
	var tips, color;

	switch ( type ) {
		case "create":
			tips = "创建";
			color = "blue";
			break;
		case "update":
			tips = "更新";
			color = "green";
			break;
		case "remove":
			tips = "删除";
			color = "purple";
			break;
		case "not-modified":
			tips = "未更改";
			color = "cyan";
			break;
		case "err":
			tips = "错误";
			color = "red";
			break;
	}

	console.log( colorStr( color, tips ) + " " + msg );
}

function logCompareContentList( list ) {
	var numChange = 0;

	array.foreach( list, function ( content ) {
		if ( content.type !== "not-modified" ) {
			log( content.type, content.path );
			++numChange;
		}
	} );

	if ( numChange === 0 ) {
		console.log( "没有检测到变化" );
	}
}

function deploy( arg, callback ) {
	var newList = array.map( zachFS.computeListDir( arg.contentList ), function ( content ) {
			return object.extend( content, {
				md5 : zachFS.getContentMd5( content )
			} );
		} ),
		goOn = GoOn( callback || function ( err ) {
			log( "err", err );
		} ),
		destDir = arg.destDir;

	func.callWith( function ( write ) {
		fs.exists( destDir, function ( exists ) {
			if ( exists ) {
				zachFS.listDir( destDir, goOn( function ( contentList ) {
					zachFS.readContentList( contentList, goOn( write ) );
				} ), true );
			}
			else {
				write( [] );
			}
		} );
	}, function ( oldList ) {
		// 计算相对路径和md5
		array.foreach( oldList, function ( content ) {
			content.path = Path.relative( destDir, content.path );
			content.md5 = zachFS.getContentMd5( content );
		} );

		// 替换为实际路径
		var compareList = zachFS.compareContentList( oldList, newList );
		array.foreach( compareList, function ( content ) {
			content.path = Path.join( destDir, content.path );
		} );

		// 写入到文件系统中,并输出结果
		zachFS.writeCompareContentList( compareList, goOn( function () {
			logCompareContentList( compareList );
			callback && callback( null );
		} ) );
	} );
}

module.exports = deploy;