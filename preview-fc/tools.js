/**
 * Created by WQ on 2015/10/13.
 */
function loopArray( arr , func ) {
    for ( var i = 0; i < arr.length; i++ ) {
        func( arr[ i ] , i );
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
function blend( arg1 , arg2 , arg3 ) {
    var arg_1 = JSON.parse( JSON.stringify( arg1 ) );
    var arg_2 = JSON.parse( JSON.stringify( arg2 ) );
    for ( var key in arg_1 ) {
        if ( arg_2[ key ] ) {
            // 如果这个key在arg_1和arg_2中都有，那么继续调用combine
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

function onTap( el , func ) {
    addEventListener( el , "mousedown" , function () {
        el.classList.add( "tap" );
        var gh = addEventListener( document , "mouseup" , function () {
            el.classList.remove( "tap" );
            gh.remove();
            jh.remove();
        } );
        var jh = addEventListener( el , "mouseup" , function () {
            func();
        } );
    } );
}


function post( url , data , callback ) {
    var xhr = new XMLHttpRequest();
    xhr.open( "post" , url , true );
    xhr.send( JSON.stringify( data ) );
    xhr.onreadystatechange = function () {
        if ( xhr.readyState == 4 ) {
            callback( JSON.parse( xhr.responseText ) );
        }
    }
}

function get( url , callback ) {
    var xhr = new XMLHttpRequest();
    xhr.open( "get" , url , true );
    xhr.send();
    xhr.onreadystatechange = function () {
        if ( xhr.readyState == 4 ) {
            callback( JSON.parse( xhr.responseText ) );
        }
    }
}