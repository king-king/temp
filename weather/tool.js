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

function insertCssAnimation() {
    var style = document.createElement( "style" );
    document.head.appendChild( style );
    return function ( arg ) {
        var name = "keyframe" + style.sheet.rules.length;
        var s = "@keyframes " + name + "{";
        loopObj( arg[ 1 ] , function ( percent , value ) {
            s += (percent + "%" + JSON.stringify( value ) );
        } );
        s += "}";
        arg[ 0 ].style.setProperty( "animation" , name + " 2s linear infinite both" );
        while ( s.indexOf( "\"" ) != -1 ) {
            s = s.replace( "\"" , "" );
        }
        style.sheet.insertRule( s , style.sheet.rules.length );
    }
}

var cssAnimation = insertCssAnimation;
