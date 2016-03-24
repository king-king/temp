/**
 * Created by WQ on 2016/3/24.
 */
function animate( func ) {
    function frame() {
        // do something
        func();
        setTimeout( frame , 20 );
    }

    frame();
}

function loopObj( obj , func ) {
    for ( var key in obj ) {
        func( key , obj[ key ] );
    }
}

function loopArray( arr , func ) {
    for ( var i = 0; i < arr.length; i++ ) {
        func( arr[ i ] , i );
    }
}

function css( el , style ) {
    loopObj( style , function ( key , value ) {
        el.style.setProperty( key , value );
    } );
}