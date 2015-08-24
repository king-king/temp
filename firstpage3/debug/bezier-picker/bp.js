/**
 * Created by WQ on 2015/5/21.
 */

main( function () {
    var Picker = imports( "../bezier-picker" );
    var $ = imports( "element" );
    var css = imports( "css" );

    var inputs = document.querySelectorAll( "input" );
    inputs[0].value = "0,0,1,1";
    inputs[1].value = "0,0,1,1";
    var p1 = Picker( {
        size : 80,
        pointR : 5,
        onChange : function ( data ) {
            inputs[0].value = data.toString();
        }
    } );
    p1.classList.add( "bezier-picker1" );
    document.body.appendChild( p1 );

    var p2 = Picker( {
        size : 80,
        pointR : 5,
        onChange : function ( data ) {
            inputs[1].value = data.toString();
        }
    } );
    p2.classList.add( "bezier-picker2" );
    document.body.appendChild( p2 );

    var btn1 = $( "div", {
        classList : "btn1",
        innerHTML : "GO"
    }, document.body );

    var btn2 = $( "div", {
        classList : "btn2",
        innerHTML : "GO"
    }, document.body );

    var borders = document.querySelectorAll( ".border" );

    function go() {
        var data1 = p1.data || [0, 0, 1, 1];
        var data2 = p2.data || [0, 0, 1, 1];
        css( borders[0], {
            "-webkit-transition" : "2s cubic-bezier(" + data1.toString() + ")"
        } );
        css( borders[1], {
            "-webkit-transition" : "2s cubic-bezier(" + data2.toString() + ")"
        } );
        borders[0].classList.toggle( "go" );
        borders[1].classList.toggle( "go" );
    }

    btn1.onclick = go;
    btn2.onclick = go;
} );