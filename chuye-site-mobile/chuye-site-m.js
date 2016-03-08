/**
 * Created by WQ on 2016/3/3.
 */

(function () {
    var Height = document.body.offsetHeight;
    var querySelectorAll = document.querySelectorAll.bind( document );
    var querySelector = document.querySelector.bind( document );
    var content = querySelector( ".content" );
    var pages = querySelectorAll( ".page" );
    var loadingTips = querySelector( ".loading-tips" );
    var circles = querySelectorAll( ".indicator .circle" );
    var tempLogos = querySelectorAll( ".page-temp-logo" );
    var tempBtns = querySelectorAll( ".page-temp-btn" );
    var ua = navigator.userAgent ,
        appVersion = navigator.appVersion;
    var uaa = {
        ios : (/iphone|ipad/gi).test( appVersion ) ,
        android : (/android/gi).test( appVersion ) ,
        MicroMessenger : ua.toLowerCase().match( /MicroMessenger/i ) == "micromessenger"
    };
    window.onerror = function ( errorMessage , scriptURI , lineNumber , columnNumber , errorObj ) {
        // TODO
        alert( JSON.stringify( errorMessage ) + " " + lineNumber + " curpageindex:" + curPageIndex );
    };

    function bindEvent( el , type , func ) {
        el.addEventListener( type , func , false );
        return {
            remove : function () {
                el.removeEventListener( type , func , false );
            }
        }
    }

    function loopArray( arr , func ) {
        for ( var i = 0; i < arr.length; i++ ) {
            func( arr[ i ] , i );
        }
    }

    function loopObj( obj , func ) {
        for ( var key in obj ) {
            func( obj[ key ] , key );
        }
    }

    function css( el , styles ) {
        loopObj( styles , function ( value , key ) {
            el.style.setProperty( key , value );
        } );
        return el;
    }

    function Timer( duration , func ) {
        var timeID;
        timeID = setTimeout( function () {
            timeID = setTimeout( arguments.callee , duration );
            func();
        } , duration );
        return {
            remove : function () {
                clearTimeout( timeID );
            }
        }
    }

    function onSwipe( func ) {
        var mHandle = {};
        bindEvent( document , "touchstart" , function ( e ) {
            e.preventDefault();
            mHandle.remove && mHandle.remove();
            var sy = e.touches[ 0 ].pageY;
            mHandle = bindEvent( document , "touchmove" , function ( e ) {
                var dy = e.touches[ 0 ].pageY - sy;
                if ( Math.abs( dy ) > 10 ) {
                    func( dy );
                    mHandle.remove();
                }
            } );
        } );
    }

    function animateEnd( el , func ) {
        var handle01 = {} , handle02 = {};
        handle01 = bindEvent( el , "webkitAnimationEnd" , function () {
            handle01.remove && handle01.remove();
            handle02.remove && handle02.remove();
            func();
        } );
        handle02 = bindEvent( el , "animationend" , function () {
            handle01.remove && handle01.remove();
            handle02.remove && handle02.remove();
            func();
        } );
    }

    function map( arr , func ) {
        var re = [];
        loopArray( arr , function ( item ) {
            re.push( func( item ) );
        } );
        return re;
    }

    function concurrentTask( tasks , callback ) {
        var len = tasks.length , count = 0;
        loopArray( tasks , function ( task ) {
            task( function () {
                ++count == len && callback();
            } );
        } );
    }

    function loadingLeft() {
        function load( imgs ) {
            loopArray( imgs , function ( img ) {
                img.src = img.getAttribute( "w-src" );
            } );
        }

        load( pages[ 3 ].querySelectorAll( "img" ) );
        load( pages[ 4 ].querySelectorAll( "img" ) );
        load( pages[ 5 ].querySelectorAll( "img" ) );
        load( pages[ 6 ].querySelectorAll( "img" ) );
    }

    function onTap( el , func ) {
        var sx , sy , ismove = false;
        bindEvent( el , "touchstart" , function ( e ) {
            e.stopPropagation();
            el.classList.add( "tap" );
            sx = e.touches[ 0 ].pageX;
            sy = e.touches[ 0 ].pageY;
            var moveH = bindEvent( document , "touchmove" , function ( e ) {
                if ( Math.pow( e.touches[ 0 ].pageX - sx , 2 ) + Math.pow( e.touches[ 0 ].pageY - sy , 2 ) > 20 ) {
                    ismove = true;
                    el.classList.remove( "tap" );
                }
            } );
            var endH = bindEvent( document , "touchend" , function ( e ) {
                !ismove && func( e );
                !ismove && el.classList.remove( "tap" );
                ismove = false;
                moveH.remove();
                endH.remove();
            } );
        } );
    }

    function initPage0() {
        var handle = {} , curIndex = 0;
        var page0Words = pages[ 0 ].querySelectorAll( ".page0-word" );
        pages[ 0 ].stop = function () {
            handle.remove && handle.remove();
        };
        pages[ 0 ].play = function () {
            //log( "page0" );
            handle = Timer( 4000 , function () {
                page0Words[ curIndex ].classList.add( "none" );
                curIndex = (curIndex + 1) % 2;
                page0Words[ curIndex ].classList.remove( "none" );
            } );
        };
    }

    function initPage1() {
        var handle = {} , curIndex = 0;
        var page1Words = pages[ 1 ].querySelectorAll( ".page1-word" );
        pages[ 1 ].stop = function () {
            handle.remove && handle.remove();
        };
        pages[ 1 ].play = function () {
            //log( "page1" );
            handle = Timer( 4000 , function () {
                page1Words[ curIndex ].classList.add( "none" );
                curIndex = (curIndex + 1) % 3;
                page1Words[ curIndex ].classList.remove( "none" );
            } );
        };
    }

    function log( str ) {
        querySelector( ".log" ).textContent = str;
    }

    function initPage2() {
        var contentBorders = pages[ 2 ].querySelectorAll( ".page2-content-border" );
        var handle = {} , curIndex = 0;
        pages[ 2 ].stop = function () {
            handle.remove && handle.remove();
        };
        pages[ 2 ].play = function () {
            //log( "page2" );
            //var i = 0;
            handle = Timer( 4000 , function () {
                //log( "page2 a " + (i++) );
                contentBorders[ curIndex ].classList.add( "none" );
                curIndex = (curIndex + 1) % 2;
                contentBorders[ curIndex ].classList.remove( "none" );
            } );
        };
    }

    function initPage3() {
        var playBtn = pages[ 3 ].querySelector( ".page3-play-btn" );
        var iframe = pages[ 3 ].querySelector( ".page-3 iframe" );
        var iframeBorder = pages[ 3 ].querySelector( ".page-3-border" );
        var closeIframe = pages[ 3 ].querySelector( ".page3-close-iframe" );

        iframe.width = document.body.offsetWidth;
        iframe.height = document.body.offsetHeight - 35;
        onTap( playBtn , function () {
            iframeBorder.classList.remove( "hide" );
            iframe.src = "../test100.html";
        } );
        function close() {
            iframeBorder.classList.add( "hide" );
            iframe.src = "";
        }

        onTap( closeIframe , close );
        pages[ 3 ].stop = close;
    }

    function initPage4() {
        var border = pages[ 4 ].querySelector( ".page-4-content-border" );
        var wrapper = pages[ 4 ].querySelector( ".page4-content-wrapper" );
        var w = document.body.offsetHeight / 1920 * 666;
        css( border , {
            width : w + "px"
        } );
        var handle = {} , curindex = 0;
        pages[ 4 ].stop = function () {
            curindex = 0;
            handle.remove && handle.remove();
        };
        pages[ 4 ].play = function () {
            //log( "page4" );
            handle = Timer( 4000 , function () {
                if ( curindex == 4 ) {
                    curindex = 0;
                    css( wrapper , {
                        transition : "none" ,
                        "-webkit-transition" : "none" ,
                        transform : "translate3d(0,0,0)" ,
                        "-webkit-transform" : "translate3d(0,0,0)"
                    } );
                    setTimeout( function () {
                        curindex = (curindex + 1) % 5;
                        css( wrapper , {
                            transition : "0.3s ease-in-out" ,
                            "-webkit-transition" : "0.3s ease-in-out" ,
                            transform : "translate3d(-" + (20 * curindex) + "%,0,0)" ,
                            "-webkit-transform" : "translate3d(-" + (20 * curindex) + "%,0,0)"
                        } );
                    } , 0 );
                } else {
                    curindex = (curindex + 1) % 5;
                    css( wrapper , {
                        transform : "translate3d(-" + (20 * curindex) + "%,0,0)" ,
                        "-webkit-transform" : "translate3d(-" + (20 * curindex) + "%,0,0)"
                    } );
                }
            } );
        };

    }

    function initPage6() {
        var downBtn;
        pages[ 6 ].stop = function () {
            downBtn.parentNode && downBtn.parentNode.removeChild( downBtn );
        };
        pages[ 6 ].play = function () {
            //log( "page6" )
            downBtn = document.createElement( "div" );
            downBtn.className = "download-btn absolute";
            pages[ 6 ].appendChild( downBtn );
            onTap( downBtn , jump );
        };
    }

    function jump() {
        if ( uaa.android ) {
            location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.cloud7.firstpage";
        }
        else {
            location.href = uaa.MicroMessenger ? "http://a.app.qq.com/o/simple.jsp?pkgname=com.cloud7.firstpage"
                : "https://itunes.apple.com/cn/app/chu-ye/id910560238?mt=8";
        }
    }

    loopArray( querySelectorAll( ".page-temp-btn" ) , function ( btn ) {
        onTap( btn , jump );
    } );
    onTap( querySelector( ".page0-btn" ) , jump );
    loopArray( pages , function ( p ) {
        css( p , {
            height : Height + "px" ,
            top : Height * 2 + "px"
        } );
        //content.removeChild( p );
    } );
    function init() {
        var curPageIndex = 0;
        initPage0();
        initPage1();
        initPage2();
        initPage3();
        initPage4();
        initPage6();
        var sliding = false;
        var loadingWord = [ "正在加载" , "正在加载 ." , "正在加载 . ." , "正在加载 . . ." ];
        var loadingIndex = 0;
        var loadingPage = querySelector( ".loading-page" );
        var loadingHandle = Timer( 500 , function () {
            loadingTips.textContent = loadingWord[ loadingIndex ];
            loadingIndex = (loadingIndex + 1) % loadingWord.length;
        } );
        // 先将前三页加载出来
        var p0 = Array.prototype.concat.apply( [] , pages[ 0 ].querySelectorAll( "img" ) );
        var p1 = Array.prototype.concat.apply( [] , pages[ 1 ].querySelectorAll( "img" ) );
        var p2 = Array.prototype.concat.apply( [] , pages[ 2 ].querySelectorAll( "img" ) );
        p0.concat();
        concurrentTask( map( p0.concat( p1 ).concat( p2 ) , function ( img ) {
            return function ( done ) {
                img.src = img.getAttribute( "w-src" );
                img.onload = img.onerror = done;
            }
        } ) , function () {
            loadingLeft();
            content.appendChild( pages[ curPageIndex ] );
            css( pages[ curPageIndex ] , {
                top : 0
            } );

            pages[ curPageIndex ].classList.add( "show" );
            pages[ curPageIndex ].play();
            loadingHandle.remove();
            loadingPage.parentNode.removeChild( loadingPage );
            var getLast = false;
            onSwipe( function ( dy ) {
                if ( !sliding ) {
                    sliding = true;
                    var prePageIndex = curPageIndex;
                    var animateName;
                    if ( dy < 0 ) {
                        //  下面的上來
                        if ( curPageIndex == pages.length - 1 ) {
                            getLast = true;
                        }
                        animateName = "slide-up";
                        curPageIndex = (curPageIndex + 1) % pages.length;
                    }
                    else {   // 向上翻
                        if ( curPageIndex != 0 || (curPageIndex == 0 && getLast) ) {
                            animateName = "slide-down";
                            curPageIndex = (curPageIndex - 1 + pages.length) % pages.length;
                        } else {
                            sliding = false;
                            return;
                        }
                    }
                    //log( "arrive" );
                    circles[ prePageIndex ].classList.remove( "select" );
                    circles[ curPageIndex ].classList.add( "select" );
                    pages[ prePageIndex ].stop && pages[ prePageIndex ].stop();
                    if ( pages[ curPageIndex ].play ) {
                        pages[ curPageIndex ].play();
                    } else {
                        //log( "err" + curPageIndex + "  " + pages[ curPageIndex ].play );
                    }
                    css( pages[ prePageIndex ] , {
                        animation : animateName + " 0.8s ease-in-out both" ,
                        "-webkit-animation" : animateName + " 0.8s ease-in-out both"
                    } );
                    css( pages[ curPageIndex ] , {
                        top : (animateName == "slide-up" ? "" : "-") + Height + "px" ,
                        animation : animateName + " 0.8s ease-in-out both" ,
                        "-webkit-animation" : animateName + " 0.8s ease-in-out both"
                    } );
                    //content.appendChild( pages[ curPageIndex ] );
                    pages[ curPageIndex ].classList.add( "show" );
                    animateEnd( pages[ curPageIndex ] , function () {
                        sliding = false;
                        css( pages[ curPageIndex ] , {
                            top : 0 ,
                            animation : "none" ,
                            "-webkit-animation" : "none"
                        } );
                        css( pages[ prePageIndex ] , { animation : "none" , top : Height * 2 + "px" } );
                        pages[ prePageIndex ].classList.remove( "show" );
                        //content.removeChild( pages[ prePageIndex ] );
                        if ( curPageIndex < 6 && curPageIndex > 0 ) {
                            hide( [ tempLogos[ 0 ] , tempBtns[ 0 ] , tempLogos[ 1 ] , tempBtns[ 1 ] ] );
                            display( [ tempLogos[ 2 ] , tempBtns[ 2 ] ] );
                        }
                    } );

                    function hide( els ) {
                        loopArray( els , function ( el ) {
                            el.classList.add( "hide" );
                        } );
                    }

                    function display( els ) {
                        loopArray( els , function ( el ) {
                            el.classList.remove( "hide" );
                        } );
                    }

                    if ( (dy > 0 && curPageIndex == 0) || (dy < 0 && curPageIndex == 1) ) {
                        // 0-1或1-0
                        display( [ tempLogos[ 0 ] , tempBtns[ 0 ] ] );
                        hide( [ tempLogos[ 2 ] , tempBtns[ 2 ] ] );
                    } else if ( (dy < 0 && curPageIndex == 6) || (dy > 0 && curPageIndex == 5) ) {
                        // 5-6或6-5
                        display( [ tempLogos[ 1 ] , tempBtns[ 1 ] ] );
                        hide( [ tempLogos[ 2 ] , tempBtns[ 2 ] ] );
                    } else if ( (curPageIndex == 0 && dy < 0) || (curPageIndex == 6 && dy > 0) ) {
                        // 6-0
                        hide( [ tempLogos[ 0 ] , tempBtns[ 0 ] , tempLogos[ 1 ] , tempBtns[ 1 ] , tempLogos[ 2 ] , tempBtns[ 2 ] ] );
                    }
                    else {
                        hide( [ tempLogos[ 0 ] , tempBtns[ 0 ] , tempLogos[ 1 ] , tempBtns[ 1 ] ] );
                        display( [ tempLogos[ 2 ] , tempBtns[ 2 ] ] );
                    }

                }
            } );
        } );

    }

    document.body.onload = init;

})();