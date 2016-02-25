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

    function bindEvent( el , type , func ) {
        el.addEventListener( type , func );
        return {
            remove : function () {
                el.removeEventListener( type , func );
            }
        }
    }

    function resize() {
        bodyHeight = document.body.offsetHeight;
        scrollWrapper.style.transform = "translate3d(0,-" + 0 + "px,0)";
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

    var curPageIndex = 0;
    var isScrolling = false;

    function wheelScroll( direction ) {
        if ( isScrolling ) {
            return;
        }
        isScrolling = true;
        var items = querySelectorAll( ".indicator .item" );
        items[ curPageIndex ] && items[ curPageIndex ].classList.remove( "select" );
        // 负数-向下翻-下一页，正数-向上翻-上一页
        if ( direction < 0 ) {
            // 下一页
            if ( curPageIndex != 6 ) {
                curPageIndex += 1;
            }
        }
        else {
            // 上一页
            if ( curPageIndex != 0 ) {
                curPageIndex -= 1;
            }
        }
        setTimeout( function () {
            isScrolling = false;
        } , 1000 );
        if ( curPageIndex == 6 ) {
            scrollWrapper.style.transform = "translate3d(0,-" + (bodyHeight * 5 + 167) + "px,0)";
        } else {
            items[ curPageIndex ].classList.add( "select" );
            scrollWrapper.style.transform = "translate3d(0,-" + bodyHeight * curPageIndex + "px,0)";
        }
    }

    bindEvent( document , "mousewheel" , function ( e ) {
        wheelScroll( e.wheelDelta );
    } );
    bindEvent( document , "DOMMouseScroll" , function ( e ) {
        wheelScroll( -e.detail );
    } );

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
        console.log( navigator.userAgent );
        document.addEventListener( "mousewheel" , function ( e ) {
            console.log( "data:" + e.detail );//wheelDelta
        } );
    }

    init();
})();