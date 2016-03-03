/**
 * Created by WQ on 2016/3/3.
 */

(function () {
    var Height = document.body.offsetHeight;
    var querySelectorAll = document.querySelectorAll.bind( document );
    var querySelector = document.querySelector.bind( document );
    var pages = document.querySelectorAll( ".page" );

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
    }

    loopArray( pages , function ( p ) {
        css( p , {
            height : Height + "px"
        } );
    } );

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

    onSwipe( function ( dy ) {
        console.log( dy );
    } );
})();