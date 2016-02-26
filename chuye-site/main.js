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

    function loop( count , func ) {
        for ( var i = 0; i < count; i++ ) {
            func( i );
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

    function concurrentTask( tasks , callback ) {
        var len = tasks.length , count = 0;
        tasks.forEach( function ( task ) {
            task( function () {
                ++count == len && callback();
            } );
        } );
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
        var imgBorders = querySelectorAll( ".page-2.content-border-item" );
        var srcs = [ page2Tags[ 0 ].src , page2Tags[ 1 ].src ];
        loopArray( page2Tags , function ( tag , i ) {
            tag.onmouseover = function () {
                // 选中当前
                page2Tags[ i ].src = srcs[ i ].slice( 0 , srcs[ i ].length - 5 ) + "0.png";
                page2Tags[ 1 - i ].src = srcs[ 1 - i ].slice( 0 , srcs[ 1 - i ].length - 5 ) + "1.png";
                imgBorders[ i ].classList.remove( "hide" );
                imgBorders[ 1 - i ].classList.add( "hide" );
            }
        } );
    }

    function initPage3() {
        var contentImages = querySelectorAll( ".page-3 .content-img" );
        var canvas = querySelector( ".page3-canvas" );
        var yellowPhone = querySelector( ".page-3 .yellow-phone" );
        var gc = canvas.getContext( "2d" );
        var clock = new Image() , clockPointer = new Image();
        var da = Math.PI / 180;
        var da0 = -Math.PI / 2;

        function frame( angle ) {
            gc.clearRect( 0 , 0 , 86 , 86 );
            gc.fillStyle = angle == 360 ? "white" : "#ffecc4";
            gc.save();
            gc.beginPath();
            gc.moveTo( 43 , 43 );
            gc.lineTo( 43 , 13 );
            gc.arc( 43 , 43 , 29 , da0 , da0 + da * angle );
            gc.lineTo( 43 , 43 );
            gc.closePath();
            gc.fill();
            gc.drawImage( clock , 0 , 0 );
            gc.translate( 43 , 43 );
            gc.rotate( da * angle );
            gc.drawImage( clockPointer , -2 , -26 );
            gc.restore();
        }

        concurrentTask( [
            function ( done ) {
                clock.src = "img/clock.png";
                clock.onload = done;
            } , function ( done ) {
                clockPointer.src = "img/clock-pointer.png";
                clockPointer.onload = done;
            } ] , function () {
            frame( 0 );
        } );
        // 图片要能够轮播
        var curIndex = 0;
        var angle = 0;
        var dangle = 120;

        function slide() {
            contentImages[ curIndex ].classList.remove( "select" );
            curIndex = (curIndex + 1) % 3;
            contentImages[ curIndex ].classList.add( "select" );
            animate( 1000 , function ( percent ) {
                frame( angle + dangle * percent * percent );
            } , function () {
                angle = curIndex == 0 ? 0 : angle + dangle;
                frame( angle );
            } );
        }

        var slideHandler = Timer( 5000 , slide );

        yellowPhone.onmouseout = sections[ 3 ].play = function () {
            slideHandler = Timer( 5000 , slide );
        };
        yellowPhone.onmouseover = sections[ 3 ].stop = function () {
            slideHandler.remove();
        };

    }

    function initPage4() {
        var contentImage = querySelectorAll( ".page-4 .content-img" );
        var circles = querySelectorAll( ".page4-circle" );
        var contentBorder = querySelector( ".page-4.content-border" );
        var curIndex = 0;
        loopArray( contentImage , function ( img , i ) {
            img.zindex = img.style.zIndex = i;
            function onEnd() {
                // 将之前飞过去的清除
                loop( 5 , function ( num ) {
                    contentImage[ num ].zindex = (contentImage[ num ].zindex + 1) % 5;
                    contentImage[ num ].style.zIndex = contentImage[ num ].zindex;
                    if ( num != i ) {
                        contentImage[ num ].classList.remove( "fly" );
                    }
                } );
            }

            bindEvent( img , "webkitAnimationEnd" , onEnd );
            bindEvent( img , "animationend" , onEnd );
        } );

        function fly() {
            circles[ curIndex ].classList.remove( "select" );
            contentImage[ 4 - curIndex ].classList.add( "fly" );
            curIndex = (curIndex + 1) % 5;
            circles[ curIndex ].classList.add( "select" );
        }

        var flyHandler = Timer( 5000 , fly );
        contentBorder.onmouseout = sections[ 4 ].play = function () {
            if ( !contentBorder.classList.contains( "tap" ) ) {
                flyHandler = Timer( 5000 , fly );
            }
        };

        contentBorder.onclick = function () {
            contentBorder.classList.toggle( "tap" );
        };

        contentBorder.onmouseover = sections[ 4 ].stop = function () {
            flyHandler.remove();
        };

    }

    function initPage5() {
        var page5Tags = querySelectorAll( ".page5-tag" );
        var imgBorders = querySelectorAll( ".page-5.content-border-item" );
        var srcs = [ page5Tags[ 0 ].src , page5Tags[ 1 ].src ];
        loopArray( page5Tags , function ( tag , i ) {
            tag.onmouseover = function () {
                // 选中当前
                page5Tags[ i ].src = srcs[ i ].slice( 0 , srcs[ i ].length - 5 ) + "0.png";
                page5Tags[ 1 - i ].src = srcs[ 1 - i ].slice( 0 , srcs[ 1 - i ].length - 5 ) + "1.png";
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
                sections[ curPageIndex ] && sections[ curPageIndex ].classList.remove( "show" );
                curPageIndex = i;
                indicatorItems[ curPageIndex ].classList.add( "select" );
                sections[ curPageIndex ] && sections[ curPageIndex ].classList.add( "show" );
                scrollWrapper.style.transform = "translate3d(0,-" + bodyHeight * curPageIndex + "px,0)";
            }
        } );
        // page-0
        initPage0();
        // page-2
        initPage2();
        // page-3
        initPage3();
        // page-4
        initPage4();
        // page-5
        initPage5();
        resize();
    }

    init();
})();