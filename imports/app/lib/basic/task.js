/**
 * Created by WQ on 2015/6/25.
 */
Package( function ( exports ) {
    // 顺序执行
    function serialTask( tasks, callback ) {
        var index = 0;
        tasks[index] && tasks[index]( function () {
            ++index == tasks.length ? callback() : tasks[index]( arguments.callee );
        } );
    }

    // 并发执行
    function concurrentTask( tasks, callback ) {
        var len = tasks.length,
            count = 0;
        tasks.forEach( function ( task ) {
            task( function () {
                count++;
                if ( count == len ) {
                    callback();
                }
            } );
        } );
    }

    exports.serialTask = serialTask;
    exports.concurrentTask = concurrentTask;
} );