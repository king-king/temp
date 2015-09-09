var a = document.createElement( "div" );
a.classList.add( "okok" );
a.style.height = "100px";
a.style.width = "200px";
a.style.position = "absolute";
a.style.background = "red";
a.style.webkitTransition = "2s linear 0s";
$0.body.appendChild( a );

var s;
a.addEventListener( "webkitTransitionEnd", function () {
    console.log( "end" );
    console.log( (new Date()).getTime() - s )
}, false );
a.onclick = function () {
    a.style.left = "200px";
    s = (new Date()).getTime();
};