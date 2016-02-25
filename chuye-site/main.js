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
    var indicatorItems = querySelectorAll( ".indicator .item" );


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
    }

    var curPageIndex = 0;
    var isScrolling = false;

    function wheelScroll( direction ) {
        if ( isScrolling ) {
            return;
        }
        isScrolling = true;
        indicatorItems[ curPageIndex ] && indicatorItems[ curPageIndex ].classList.remove( "select" );
        sections[ curPageIndex ] && sections[ curPageIndex ].classList.remove( "show" );
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
            transform( scrollWrapper , "translate3d(0,-" + (bodyHeight * 5 + 167) + "px,0)" );
        } else {
            indicatorItems[ curPageIndex ] && indicatorItems[ curPageIndex ].classList.add( "select" );
            sections[ curPageIndex ] && sections[ curPageIndex ].classList.add( "show" );
            transform( scrollWrapper , "translate3d(0,-" + bodyHeight * curPageIndex + "px,0)" );
        }
    }

    function animate( duration , frame , onEnd ) {
        var s = (new Date()).getTime();
        setTimeout( function () {
            var cur = (new Date()).getTime();
            if ( cur - s < duration ) {
                frame( (cur - s ) / duration );
                setTimeout( arguments.callee , 20 );
            } else {
                frame( 1 );
                onEnd();
            }
        } , 20 );
    }

    function Timer( duration , func ) {
        var timeID;
        timeID = setTimeout( function () {
            func();
            timeID = setTimeout( arguments.callee , duration );
        } , duration );
        return {
            remove : function () {
                clearTimeout( timeID );
            }
        }
    }

    function transform( el , style ) {
        el.style.webkitTransform = style;
        el.style.transform = style;
    }

    function initPage0() {
        var curIndex = 0;
        var slideWrapper = querySelector( ".page0-img-border-wrapper" );
        var slideBorder = querySelector( ".page0-img-border" );
        var circles = querySelectorAll( ".page0-circle" );

        loopArray( querySelectorAll( ".page0-img-border-wrapper .item" ) , function ( item , i ) {
            item.style.left = 25 * i + "%";
        } );
        function slide() {
            circles[ curIndex ].classList.remove( "select" );
            circles[ curIndex + 1 == 3 ? 0 : curIndex + 1 ].classList.add( "select" );
            animate( 400 , function ( percent ) {
                slideWrapper.style.transform = "translate3d(-" + (25 * curIndex + 25 * percent * percent) + "%,0,0)"
            } , function () {
                curIndex += 1;
                if ( curIndex == 3 ) {
                    // 从头开始
                    curIndex = 0;
                    slideWrapper.style.transform = "translate3d(0,0,0)"
                }
            } );
        }

        //定时轮播
        var timerHandler = Timer( 4000 , slide );

        slideBorder.onmouseover = sections[ 0 ].stop = function () {
            // 当页面移出时，要停止轮播图
            timerHandler.remove();
        };

        slideBorder.onmouseout = sections[ 0 ].play = function () {
            // 当页面重新移入时，要继续轮播图
            timerHandler = Timer( 4000 , slide );
        };

    }

    function initPage2() {
        var page2Tags = querySelectorAll( ".page2-tag" );
        var imgBorders = querySelectorAll( ".content-border-item" );
        var images = querySelectorAll( ".page2-tag" );
        var srcs = [ images[ 0 ].src , images[ 1 ].src ];
        loopArray( page2Tags , function ( tag , i ) {
            tag.onmouseover = function () {
                // 选中当前
                images[ i ].src = srcs[ i ].slice( 0 , srcs[ i ].length - 5 ) + "0.png";
                images[ 1 - i ].src = srcs[ 1 - i ].slice( 0 , srcs[ 1 - i ].length - 5 ) + "1.png";
                imgBorders[ i ].classList.remove( "hide" );
                imgBorders[ 1 - i ].classList.add( "hide" );
            }
        } );
    }

    function init() {
        bindEvent( document , "mousewheel" , function ( e ) {
            wheelScroll( e.wheelDelta );
        } );
        bindEvent( document , "DOMMouseScroll" , function ( e ) {
            wheelScroll( -e.detail );
        } );
        // 第一页的小图标，鼠标放上时候要变化
        loopArray( querySelectorAll( ".page1-icon" ) , function ( icon ) {
            var src = icon.src;
            var outScr = src.slice( 0 , src.length - 4 ) + "-1.png";
            icon.onmouseover = function () {
                icon.src = outScr;
            };
            icon.onmouseout = function () {
                icon.src = src;
            };
        } );
        // 给左侧导航按钮添加点击事件
        loopArray( indicatorItems , function ( item , i ) {
            item.onclick = function () {
                indicatorItems[ curPageIndex ] && indicatorItems[ curPageIndex ].classList.remove( "select" );
                curPageIndex = i;
                indicatorItems[ curPageIndex ].classList.add( "select" );
                scrollWrapper.style.transform = "translate3d(0,-" + bodyHeight * curPageIndex + "px,0)";
            }
        } );
        // page-0
        initPage0();
        // page-2
        initPage2();
        resize();
    }

    init();
})();