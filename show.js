/**
 * Created by WQ on 2015/12/25.
 */
var style = document.createElement( "style" );
document.head.appendChild( style );

function loopArray( arr , func ) {
    for ( var i = 0; i < arr.length; i++ ) {
        func( arr[ i ] , i );
    }
}

document.body.onload = function () {
    style.sheet.insertRule( ".img{height:" + (document.body.offsetWidth * 18 / 32 << 0) + "px}" , 0 );
    var content = document.querySelector( ".content" );
    loopArray( data , function ( d ) {
        var item = document.createElement( "div" );
        item.classList.add( "item" );
        item.innerHTML = "<div class='img'></div><div class='text'><div class='name'>摇一摇</div><div class='author'></div></div>"
        content.appendChild( item );
        item.querySelector( ".name" ).textContent = d.name;
        item.querySelector( ".img" ).style.background = "url(" + d.img + ") no-repeat center center ";
        item.querySelector( ".img" ).style.backgroundSize = "cover";
        onTap( item , function () {
            location.href = d.src;
        } );
    } );
};

function onTap( el , func ) {
    el.addEventListener( "touchstart" , function ( se ) {
        var prex = se.pageX , prey = se.pageY;
        var s = 0;
        var istap = true;
        el.classList.add( "tap" );
        function move( e ) {
            s += ((e.pageX - prex) * (e.pageX - prex) + (e.pageY - prey) * (e.pageY - prey));
            istap = s < 10;
            !istap && el.classList.remove( "tap" );
        }

        document.addEventListener( "touchmove" , move );
        document.addEventListener( "touchend" , function () {
            istap && func && func();
            document.removeEventListener( "touchmove" , move );
            document.removeEventListener( "touchend" , arguments.callee );
        } );
    } );
}
