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

function insertCssAnimation() {
    var style = document.createElement( "style" );
    document.head.appendChild( style );
    return function ( arg ) {
        var name = arg[ 2 ] + " keyframe" + style.sheet.rules.length;
        var s = "@keyframes keyframe" + style.sheet.rules.length + "{";
        loopObj( arg[ 1 ] , function ( percent , value ) {
            s += (percent + "%" + JSON.stringify( value ) );
        } );
        s += "}";
        for ( var i = 3; i < arg.length; i++ ) {
            name += " " + arg[ i ] + " ";
        }
        arg[ 0 ].style.setProperty( "animation" , name );
        while ( s.indexOf( "\"" ) != -1 ) {
            s = s.replace( "\"" , "" );
        }
        while ( s.indexOf( ",transform" ) != -1 ) {
            s = s.replace( ",transform" , ";transform" );
        }
        style.sheet.insertRule( s , style.sheet.rules.length );
    }
}

var cssAnimation = insertCssAnimation();

function $( tag , arg , parent ) {
    var el = document.createElement( tag );
    loopObj( arg , function ( key , value ) {
        switch ( key ) {
            case "css":
                css( el , value );
                break;
            case "classList":
                loopArray( value , function ( v ) {
                    el.classList.add( v );
                } );
                break;
            default:
                el[ key ] = value;
        }
    } );
    parent && parent.appendChild( el );
    return el;
}