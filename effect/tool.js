/**
 * Created by WQ on 2016/3/22.
 */
function loopArray( arr , func ) {
    var len = arr.length;
    for ( var i = 0; i < len; i++ ) {
        func( arr[ i ] , i );
    }
}

function loop( num , func ) {
    for ( var i = 0; i < num; i++ ) {
        func( i );
    }
}

function loopObj( obj , func ) {
    for ( var key in obj ) {
        func( key , obj[ key ] );
    }
}

function css( el , style ) {
    loopObj( style , function ( key , value ) {
        el.style.setProperty( key , value );
    } );
}
