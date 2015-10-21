/**
 * Created by WQ on 2015/10/14.
 */

var child_process = require( "child_process" );
var httpServer = child_process.fork( "fc-server.js" );

httpServer.on( "exit" , function () {
    setTimeout( function () {
        // 1min ������
        httpServer = child_process.fork( "server-worker.js" )
    } , 1000 * 60 );
} );

process.on( "exit" , function () {
    // �������˳��Զ��ر��ӽ���
    httpServer && httpServer.kill();
} );