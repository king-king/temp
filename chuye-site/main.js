/**
 * Created by WQ on 2016/2/23.
 */

(function () {
    var querySelector = document.querySelector.bind( document );
    var querySelectorAll = document.querySelectorAll.bind( document );
    var bodyHeight;
    var sections = querySelectorAll( ".section" );

    function loopArray( arr , func ) {
        for ( var i = 0; i < arr.length; i++ ) {
            func( arr[ i ] , i );
        }
    }

    function resize() {
        bodyHeight = document.body.offsetHeight;
        loopArray( sections , function ( setction ) {
            setction.style.height = bodyHeight + "px";
        } );
    }

    function init() {
        resize();
    }

    init();
})();