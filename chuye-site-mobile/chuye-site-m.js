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

    function bindEvent( el , type , func ) {
        el.addEventListener( type , func );
        return {
            remove : function () {
                el.removeEventListener( type , func );
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

    loopArray( pages , function ( p ) {
        css( p , {
            height : Height + "px"
        } );
        content.removeChild( p );
    } );

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

    var curPageIndex = 0;

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

    function concurrentTask( tasks , callback ) {
        var len = tasks.length , count = 0;
        loopArray( tasks , function ( task ) {
            task( function () {
                ++count == len && callback();
            } );
        } );
    }

    function init() {
        var loadingWord = [ "正在加载" , "正在加载 ." , "正在加载 . ." , "正在加载 . . ." ];
        var loadingIndex = 0;
        var loadingHandle = Timer( 500 , function () {
            loadingIndex = (loadingIndex + 1) % loadingWord.length;
            loadingTips.textContent = loadingWord[ loadingIndex ];
        } );



        var sliding = false;
        content.appendChild( pages[ curPageIndex ] );
        var loadingPage = querySelector( ".loading-page" );
        setTimeout( function () {
            loadingHandle.remove();
            loadingPage.parentNode.removeChild( loadingPage )
        } , 4000 );
        onSwipe( function ( dy ) {
            if ( !sliding ) {
                sliding = true;
                var prePageIndex = curPageIndex;
                var animateName;
                if ( dy < 0 ) {
                    //  下面的上來
                    if ( curPageIndex == pages.length - 1 ) {
                        sliding = false;
                        return;
                    } else {
                        animateName = "slide-up";
                        curPageIndex = (curPageIndex + 1) % pages.length;
                    }
                }
                else {   // 向上翻
                    if ( curPageIndex != 0 ) {
                        animateName = "slide-down";
                        curPageIndex = (curPageIndex - 1 + pages.length) % pages.length;
                    } else {
                        sliding = false;
                        return;
                    }
                }
                css( pages[ prePageIndex ] , {
                    animation : animateName + " 0.8s ease-in-out both"
                } );
                content.appendChild( css( pages[ curPageIndex ] , {
                    top : (animateName == "slide-up" ? "" : "-") + Height + "px" ,
                    animation : animateName + " 0.8s ease-in-out both"
                } ) );
                animateEnd( pages[ curPageIndex ] , function () {
                    sliding = false;
                    css( pages[ curPageIndex ] , {
                        top : 0 ,
                        animation : "none"
                    } );
                    css( pages[ prePageIndex ] , { animation : "none" } );
                    content.removeChild( pages[ prePageIndex ] );
                } );
            }

        } );
    }

    init();

})();