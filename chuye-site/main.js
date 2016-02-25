/**
 * Created by WQ on 2016/2/23.
 */

(function () {
    var querySelector = document.querySelector.bind( document );
    var querySelectorAll = document.querySelectorAll.bind( document );
    var bodyHeight;
    var sections = querySelectorAll( ".section" );
    var wrappers = querySelectorAll( ".wrapper" );
    var scrollWrapper = querySelector( ".scroll-wrapper" );

    function loopArray( arr , func ) {
        for ( var i = 0; i < arr.length; i++ ) {
            func( arr[ i ] , i );
        }
    }

    function resize() {
        bodyHeight = document.body.offsetHeight;
        scrollWrapper.style.transform = "translate3d(0,-" + bodyHeight + "px,0)";
        var cubeHeight = bodyHeight > 768 ? 768 : bodyHeight;
        loopArray( sections , function ( setction , i ) {
            setction.style.height = bodyHeight + "px";
            wrappers[ i ].style.width = wrappers[ i ].style.height = cubeHeight + "px";
            wrappers[ i ].style.marginLeft = wrappers[ i ].style.marginTop = -cubeHeight / 2 + "px"
        } );
        loopArray( querySelectorAll( ".yellow-phone" ) , function ( phone ) {
            phone.style.marginTop = -cubeHeight * 0.82291666 / 2 + "px";
        } );
    }

    function init() {
        //第一页的小图标，鼠标放上时候要变化
        loopArray( querySelectorAll( ".page1-icon" ) , function ( icon , i ) {
            var src = icon.src;
            var outScr = src.slice( 0 , src.length - 4 ) + "-1.png";
            icon.onmouseover = function () {
                icon.src = outScr;
            };
            icon.onmouseout = function () {
                icon.src = src;
            };
        } );
        resize();
    }

    init();
})();