/**
 * Created by WQ on 2015/6/30.
 *
 * 统计一个文件夹中js文件和css文件的代码行数
 *
 */

var fs = require( "fs" );
var pt = require( "path" );
var colors = require( "colors" );

function readDir( path, callback ) {
    if ( pt.extname( path ) != "" ) {
        // 是文件
        callback( [] );
    }
    else {
        fs.readdir( path, function ( err, arr ) {
            if ( err ) {
                console.log( colors.red( "处理失败: " + path ) );
                callback( [] );
            }
            else {
                callback( arr );
            }
        } );
    }
}

function loopArray( arr, func ) {
    for ( var i = 0; i < arr.length; i++ ) {
        func( arr[i], i );
    }
}

var dirs = [],
    files = [],
    paths = [];


var curPath = "test/t800";

readDir( curPath, function ( arr ) {
    loopArray( arr, function ( obj ) {
        if ( pt.extname( obj ) != "" ) {
            //　是文件
            files.push( pt.resolve( curPath, obj ) );
        }
        else {
            //　是文件夹
            dirs.push( pt.resolve( curPath, obj ) );
        }
    } );
    curPath = dirs.pop();
    if ( curPath ) {
        readDir( curPath, arguments.callee );
    }
    else {
        end();
    }
} );

function map( array, func ) {
    var mapArray = [];
    array.forEach( function ( item, i ) {
        mapArray.push( func( item, i ) );
    } );
    return mapArray;
}

function serialTask( tasks, callback ) {
    var index = 0;
    tasks[index] && tasks[index]( function () {
        ++index == tasks.length ? callback() : tasks[index]( arguments.callee );
    } );
}

var line = {
    css : 0,
    js : 0
};
var scriptFileNum = 0;
var cssFileNum = 0;

function end() {
    function getFileLineNumber( path, callback ) {
        fs.readFile( path, function ( err, str ) {
            var match = str.toString().match( /\n/g );
            var num = match ? match.length + 1 : 1;
            callback( err, num );
        } );
    }

    var process = map( files, function ( file ) {
        return function ( done ) {
            var extName = pt.extname( file ).slice( 1 );
            if ( extName == "js" || extName == "css" ) {
                getFileLineNumber( file, function ( err, number ) {
                    if ( err ) {
                        console.log( colors.red( "处理失败: " + file ) );
                        done();
                    }
                    else {
                        console.log( colors.green( "成功处理: " + file ) );
                        line[extName] += number;
                        extName == "js" ? scriptFileNum++ : cssFileNum++;
                        done();
                    }
                } );
            }
            else {
                done();
            }
        }
    } );

    serialTask( process, function () {
        console.log( "--------------------------------------------------" );
        console.log( "over~!!" );
        console.log( "--------------------------------------------------" );
        console.log( colors.green( "js文件有 " + scriptFileNum + " 个, 共 " + line.js + "  行" ) );
        console.log( "--------------------------------------------------" );
        console.log( colors.green( "js文件有 " + cssFileNum + " 个, 共 " + line.css + "  行" ) );
    } );


}

