/**
 * Created by WQ on 2015/10/14.
 */

var child_process = require( "child_process" );
var httpServer = child_process.fork( "fc-server.js" );

httpServer.on( "exit" , function () {
    setTimeout( function () {
        // 1min 后重启
        httpServer = child_process.fork( "server-worker.js" )
    } , 1000 * 60 );
} );

process.on( "exit" , function () {
    // 父进程退出自动关闭子进程
    httpServer && httpServer.kill();
} );