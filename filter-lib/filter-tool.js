/**
 * Created by WQ on 2015/10/26.
 */

function loopArray( arr , func ) {
    for ( var i = 0; i < arr.length; i++ ) {
        func( arr[ i ] , i );
    }
}

function addEventListener( el , type , listener , useCapture ) {
    el.addEventListener( type , listener , useCapture );
    return {
        remove : function () {
            el.removeEventListener( type , listener , useCapture );
        }
    }
}

function onDragV( el , listener ) {
    var preX;
    addEventListener( el , "mousedown" , function ( de ) {
        listener.onTap && listener.onTap();
        preX = de.pageX;
        var mHandle = addEventListener( document , "mousemove" , function ( me ) {
            listener.onDrag && listener.onDrag( me.pageX - preX );
            preX = me.pageX;
        } );
        var uHandle = addEventListener( document , "mouseup" , function () {
            listener.onUp && listener.onUp();
            mHandle.remove();
            uHandle.remove();
        } );
    } );
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

function replaceAll( str , oldStr , newStr ) {
    while ( str.indexOf( oldStr ) != -1 ) {
        str = str.replace( oldStr , newStr );
    }
    return str;
}