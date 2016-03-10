(function () {
    var m = document.body.offsetHeight;
    var r = document.querySelectorAll.bind( document );
    var c = document.querySelector.bind( document );
    var v = c( ".content" );
    var j = r( ".page" );
    var A = c( ".loading-tips" );
    var w = r( ".indicator .circle" );
    var t = r( ".page-temp-logo" );
    var B = r( ".page-temp-btn" );
    var y = navigator.userAgent , z = navigator.appVersion;
    var s = {
        ios : (/iphone|ipad/gi).test( z ) ,
        android : (/android/gi).test( z ) ,
        MicroMessenger : y.toLowerCase().match( /MicroMessenger/i ) == "micromessenger"
    };
    window.onerror = function ( J , H , G , I , K ) {
        alert( JSON.stringify( J ) + " " + G + " curpageindex:" + curPageIndex )
    };
    function d( H , G , I ) {
        H.addEventListener( G , I , false );
        return {
            remove : function () {
                H.removeEventListener( G , I , false )
            }
        }
    }

    function p( G , I ) {
        for ( var H = 0; H < G.length; H++ ) {
            I( G[ H ] , H )
        }
    }

    function b( I , H ) {
        for ( var G in I ) {
            H( I[ G ] , G )
        }
    }

    function i( G , H ) {
        b( H , function ( J , I ) {
            G.style.setProperty( I , J )
        } );
        return G
    }

    function u( I , H ) {
        var G;
        G = setTimeout( function () {
            G = setTimeout( arguments.callee , I );
            H()
        } , I );
        return {
            remove : function () {
                clearTimeout( G )
            }
        }
    }

    function f( H ) {
        var G = {};
        d( document , "touchstart" , function ( I ) {
            I.preventDefault();
            G.remove && G.remove();
            var J = I.touches[ 0 ].pageY;
            G = d( document , "touchmove" , function ( L ) {
                var K = L.touches[ 0 ].pageY - J;
                if ( Math.abs( K ) > 10 ) {
                    H( K );
                    G.remove()
                }
            } )
        } )
    }

    function C( I , J ) {
        var H = {} , G = {};
        H = d( I , "webkitAnimationEnd" , function () {
            H.remove && H.remove();
            G.remove && G.remove();
            J()
        } );
        G = d( I , "animationend" , function () {
            H.remove && H.remove();
            G.remove && G.remove();
            J()
        } )
    }

    function D( G , I ) {
        var H = [];
        p( G , function ( J ) {
            H.push( I( J ) )
        } );
        return H
    }

    function a( J , I ) {
        var G = J.length , H = 0;
        p( J , function ( K ) {
            K( function () {
                ++H == G && I()
            } )
        } )
    }

    function F() {
        function G( H ) {
            p( H , function ( I ) {
                I.src = I.getAttribute( "w-src" )
            } )
        }

        G( j[ 3 ].querySelectorAll( "img" ) );
        G( j[ 4 ].querySelectorAll( "img" ) );
        G( j[ 5 ].querySelectorAll( "img" ) );
        G( j[ 6 ].querySelectorAll( "img" ) )
    }

    function E( H , I ) {
        var K , J , G = false;
        d( H , "touchstart" , function ( N ) {
            N.stopPropagation();
            H.classList.add( "tap" );
            K = N.touches[ 0 ].pageX;
            J = N.touches[ 0 ].pageY;
            var M = d( document , "touchmove" , function ( O ) {
                if ( Math.pow( O.touches[ 0 ].pageX - K , 2 ) + Math.pow( O.touches[ 0 ].pageY - J , 2 ) > 20 ) {
                    G = true;
                    H.classList.remove( "tap" )
                }
            } );
            var L = d( document , "touchend" , function ( O ) {
                !G && I( O );
                !G && H.classList.remove( "tap" );
                G = false;
                M.remove();
                L.remove()
            } )
        } )
    }

    function q() {
        var H , G = 0;
        var I = j[ 0 ].querySelectorAll( ".page0-word" );
        j[ 0 ].stop = function () {
            clearTimeout( H )
        };
        j[ 0 ].play = function () {
            H = setTimeout( function () {
                I[ G ].classList.add( "none" );
                G = (G + 1) % 2;
                I[ G ].classList.remove( "none" );
                H = setTimeout( arguments.callee , 7400 )
            } , 5000 )
        }
    }

    function o() {
        var H , G = 0;
        var I = j[ 1 ].querySelectorAll( ".page1-word" );
        j[ 1 ].stop = function () {
            clearTimeout( H )
        };
        j[ 1 ].play = function () {
            H = setTimeout( function () {
                I[ G ].classList.add( "none" );
                G = (G + 1) % 3;
                I[ G ].classList.remove( "none" );
                H = setTimeout( arguments.callee , 7400 )
            } , 5000 )
        }
    }

    function g( G ) {
        c( ".log" ).textContent = G
    }

    function n() {
        var G = j[ 2 ].querySelectorAll( ".page2-content-border" );
        var I = {} , H = 0;
        j[ 2 ].stop = function () {
            I.remove && I.remove()
        };
        j[ 2 ].play = function () {
            I = u( 5500 , function () {
                G[ H ].classList.add( "none" );
                H = (H + 1) % 2;
                G[ H ].classList.remove( "none" )
            } )
        }
    }

    function l() {
        var H = j[ 3 ].querySelector( ".page3-play-btn" );
        var J = j[ 3 ].querySelector( ".page-3 iframe" );
        var G = j[ 3 ].querySelector( ".page-3-border" );
        var I = j[ 3 ].querySelector( ".page3-close-iframe" );
        J.width = document.body.offsetWidth;
        J.height = document.body.offsetHeight - 35;
        E( H , function () {
            G.classList.remove( "hide" );
            J.src = "/18572299"
        } );
        function K() {
            G.classList.add( "hide" );
            J.src = ""
        }

        E( I , K );
        j[ 3 ].stop = K
    }

    function k() {
        var H = j[ 4 ].querySelector( ".page-4-content-border" );
        var K = j[ 4 ].querySelector( ".page4-content-wrapper" );
        var G = document.body.offsetHeight / 1920 * 666;
        i( H , { width : G + "px" } );
        var I = {} , J = 0;
        j[ 4 ].stop = function () {
            J = 0;
            I.remove && I.remove()
        };
        j[ 4 ].play = function () {
            I = u( 4000 , function () {
                if ( J == 4 ) {
                    J = 0;
                    i( K , {
                        transition : "none" ,
                        "-webkit-transition" : "none" ,
                        transform : "translate3d(0,0,0)" ,
                        "-webkit-transform" : "translate3d(0,0,0)"
                    } );
                    setTimeout( function () {
                        J = (J + 1) % 5;
                        i( K , {
                            transition : "0.3s ease-in-out" ,
                            "-webkit-transition" : "0.3s ease-in-out" ,
                            transform : "translate3d(-" + (20 * J) + "%,0,0)" ,
                            "-webkit-transform" : "translate3d(-" + (20 * J) + "%,0,0)"
                        } )
                    } , 0 )
                } else {
                    J = (J + 1) % 5;
                    i( K , {
                        transform : "translate3d(-" + (20 * J) + "%,0,0)" ,
                        "-webkit-transform" : "translate3d(-" + (20 * J) + "%,0,0)"
                    } )
                }
            } )
        }
    }

    function h() {
        var G;
        j[ 6 ].stop = function () {
            G.parentNode && G.parentNode.removeChild( G )
        };
        j[ 6 ].play = function () {
            G = document.createElement( "div" );
            G.className = "download-btn absolute";
            j[ 6 ].appendChild( G );
            E( G , e )
        }
    }

    function e() {
        if ( s.android ) {
            location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.cloud7.firstpage"
        } else {
            location.href = s.MicroMessenger ? "http://a.app.qq.com/o/simple.jsp?pkgname=com.cloud7.firstpage" : "https://itunes.apple.com/cn/app/chu-ye/id910560238?mt=8"
        }
    }

    p( r( ".page-temp-btn" ) , function ( G ) {
        E( G , e )
    } );
    E( c( ".page0-btn" ) , e );
    p( j , function ( G ) {
        i( G , { height : m + "px" , top : m * 2 + "px" } )
    } );
    function x() {
        var G = 0;
        q();
        o();
        n();
        l();
        k();
        h();
        var K = false;
        var J = [ "正在加载" , "正在加载 ." , "正在加载 . ." , "正在加载 . . ." ];
        var I = 0;
        var O = c( ".loading-page" );
        var H = u( 500 , function () {
            A.textContent = J[ I ];
            I = (I + 1) % J.length
        } );
        var N = Array.prototype.concat.apply( [] , j[ 0 ].querySelectorAll( "img" ) );
        var M = Array.prototype.concat.apply( [] , j[ 1 ].querySelectorAll( "img" ) );
        var L = Array.prototype.concat.apply( [] , j[ 2 ].querySelectorAll( "img" ) );
        N.concat();
        a( D( N.concat( M ).concat( L ) , function ( P ) {
            return function ( Q ) {
                P.src = P.getAttribute( "w-src" );
                P.onload = P.onerror = Q
            }
        } ) , function () {
            F();
            v.appendChild( j[ G ] );
            i( j[ G ] , { top : 0 } );
            j[ G ].classList.add( "show" );
            j[ G ].play();
            H.remove();
            O.parentNode.removeChild( O );
            var P = false;
            f( function ( Q ) {
                if ( !K ) {
                    K = true;
                    var U = G;
                    var T;
                    if ( Q < 0 ) {
                        if ( G == j.length - 1 ) {
                            P = true
                        }
                        T = "slide-up";
                        G = (G + 1) % j.length
                    } else {
                        if ( G != 0 || (G == 0 && P) ) {
                            T = "slide-down";
                            G = (G - 1 + j.length) % j.length
                        } else {
                            K = false;
                            return
                        }
                    }
                    w[ U ].classList.remove( "select" );
                    w[ G ].classList.add( "select" );
                    j[ U ].stop && j[ U ].stop();
                    if ( j[ G ].play ) {
                        j[ G ].play()
                    }
                    i( j[ U ] , {
                        animation : T + " 0.8s ease-in-out both" ,
                        "-webkit-animation" : T + " 0.8s ease-in-out both"
                    } );
                    i( j[ G ] , {
                        top : (T == "slide-up" ? "" : "-") + m + "px" ,
                        animation : T + " 0.8s ease-in-out both" ,
                        "-webkit-animation" : T + " 0.8s ease-in-out both"
                    } );
                    j[ G ].classList.add( "show" );
                    C( j[ G ] , function () {
                        K = false;
                        i( j[ G ] , { top : 0 , animation : "none" , "-webkit-animation" : "none" } );
                        i( j[ U ] , { animation : "none" , top : m * 2 + "px" } );
                        j[ U ].classList.remove( "show" );
                        if ( G < 6 && G > 0 ) {
                            R( [ t[ 0 ] , B[ 0 ] , t[ 1 ] , B[ 1 ] ] );
                            S( [ t[ 2 ] , B[ 2 ] ] )
                        }
                    } );
                    function R( V ) {
                        p( V , function ( W ) {
                            W.classList.add( "hide" )
                        } )
                    }

                    function S( V ) {
                        p( V , function ( W ) {
                            W.classList.remove( "hide" )
                        } )
                    }

                    if ( (Q > 0 && G == 0) || (Q < 0 && G == 1) ) {
                        S( [ t[ 0 ] , B[ 0 ] ] );
                        R( [ t[ 2 ] , B[ 2 ] ] )
                    } else {
                        if ( (Q < 0 && G == 6) || (Q > 0 && G == 5) ) {
                            S( [ t[ 1 ] , B[ 1 ] ] );
                            R( [ t[ 2 ] , B[ 2 ] ] )
                        } else {
                            if ( (G == 0 && Q < 0) || (G == 6 && Q > 0) ) {
                                R( [ t[ 0 ] , B[ 0 ] , t[ 1 ] , B[ 1 ] , t[ 2 ] , B[ 2 ] ] )
                            } else {
                                R( [ t[ 0 ] , B[ 0 ] , t[ 1 ] , B[ 1 ] ] );
                                S( [ t[ 2 ] , B[ 2 ] ] )
                            }
                        }
                    }
                }
            } )
        } )
    }

    x()
})();