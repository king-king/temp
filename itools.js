/**
 * Created by WQ on 2015/10/13.
 */

var querySelector = document.querySelector.bind( document );

function loopArray( arr , func ) {
    for ( var i = 0; i < arr.length; i++ ) {
        func( arr[ i ] , i );
    }
}

function loop( i , func ) {
    for ( var n = 0; n < i; n++ ) {
        func( n );
    }
}

// ����
function concurrentTask( tasks , callback ) {
    var len = tasks.length , count = 0;
    tasks.forEach( function ( task ) {
        task( function () {
            count++;
            count == len && callback();
        } );
    } );
}

function map( array , func ) {
    var mapArray = [];
    array.forEach( function ( item , i ) {
        mapArray.push( func( item , i ) );
    } );
    return mapArray;
}


function element( tag , arg , parent ) {
    var el = document.createElement( tag );
    for ( var key in arg ) {
        switch ( key ) {
            case "classList":
                loopArray( arg.classList , function ( klass ) {
                    el.classList.add( klass );
                } );
                break;
            default :
                el[ key ] = arg[ key ];
        }
    }
    parent && parent.appendChild( el );
    return el;
}

function css( el , style ) {
    for ( var key in style ) {
        el.style.setProperty( key , style[ key ] , null );
    }
    return el;
}