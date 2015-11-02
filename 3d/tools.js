/**
 * Created by WQ on 2015/10/13.
 */
function loop( count , func ) {
    for ( var i = 0; i < count; i++ ) {
        func( i );
    }
}

function loopArray( arr , func ) {
    for ( var i = 0; i < arr.length; i++ ) {
        func( arr[ i ] , i );
    }
}

function loopObj( obj , func ) {
    for ( var key in obj ) {
        func( key , obj[ key ] );
    }
}

function replaceAll( str , oldStr , newStr ) {
    while ( str.indexOf( oldStr ) != -1 ) {
        str = str.replace( oldStr , newStr );
    }
    return str;
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

function css( el , styles ) {
    loopObj( styles , function ( key , value ) {
        el.style.setProperty( key , value )
    } );
}

function addEventListener( el , type , listener , useCapture ) {
    el.addEventListener( type , listener , useCapture );
    return {
        remove : function () {
            el.removeEventListener( type , listener , useCapture );
        }
    }
}

function Drag( el , listener ) {
    var preX , preY;
    addEventListener( el , "mousedown" , function ( de ) {
        listener.onTap && listener.onTap( de );
        preX = de.pageX;
        preY = de.pageY;
        var mHandle = addEventListener( document , "mousemove" , function ( me ) {
            listener.onDrag && listener.onDrag( me.pageX - preX , me.pageY - preY );
            preX = me.pageX;
            preY = me.pageY;
        } );

        var uHandle = addEventListener( document , "mouseup" , function () {
            listener.onUp && listener.onUp();
            mHandle.remove();
            uHandle.remove();
        } );
    } );
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

function onDragH( el , listener ) {
    var preY;
    addEventListener( el , "mousedown" , function ( de ) {
        listener.onTap && listener.onTap();
        preY = de.pageY;
        var mHandle = addEventListener( document , "mousemove" , function ( me ) {
            listener.onDrag && listener.onDrag( me.pageY - preY );
            preY = me.pageY;
        } );

        var uHandle = addEventListener( document , "mouseup" , function () {
            listener.onUp && listener.onUp();
            mHandle.remove();
            uHandle.remove();
        } );
    } );
}

function blend( arg1 , arg2 , arg3 ) {
    var arg_1 = JSON.parse( JSON.stringify( arg1 ) );
    var arg_2 = JSON.parse( JSON.stringify( arg2 ) );
    for ( var key in arg_1 ) {
        if ( arg_2[ key ] ) {
            // ������key��arg_1��arg_2�ж��У���ô��������combine
            arg3[ key ] = {};
            if ( typeof arg_1[ key ] == "object" && typeof arg_2[ key ] == "object" ) {
                arguments.callee( arg_1[ key ] , arg_2[ key ] , arg3[ key ] );
            }
            else {
                arg3[ key ] = arg_1[ key ];
            }
            delete arg_2[ key ];
        }
        else {
            arg3[ key ] = arg_1[ key ];
        }
    }
    for ( var key2 in arg_2 ) {
        arg3[ key2 ] = arg_2[ key2 ];
    }
}
