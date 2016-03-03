/**
 * Created by WQ on 2016/3/3.
 */

(function () {
    var Height = document.body.offsetHeight;
    var querySelectorAll = document.querySelectorAll.bind( document );
    var querySelector = document.querySelector.bind( document );
    var pages = document.querySelectorAll( ".page" );

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



})();