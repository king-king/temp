$( document ).ready( function () {
    var a = new Swiper( ".swiper-container", {
        mode : "vertical", onSlideChangeStart : function () {
            switch ( a.activeIndex ) {
                case 0:
                    $( "#s0" ).addClass( "ani" );
                    break;
                case 1:
                    $( "#s1" ).addClass( "ani" );
                    break;
                case 2:
                    $( "#s2" ).addClass( "ani" ), $( "#s2 .wmw" ).css( "opacity", "1" ), $( "#s2 .wmw *" ).css( "opacity", "1" ), $( "#s2" ).parallax();
                    break;
                case 3:
                    $( "#s3" ).addClass( "ani" ).parallax();
                    break;
                case 4:
                    $( "#s4" ).addClass( "ani" );
                    break;
                case 5:
                    $( "#s5" ).addClass( "ani" );
                    break;
                case 6:
                    $( "#s6" ).addClass( "ani" ).parallax(), $( "#s6 .wmw" ).css( "opacity", "1" ), $( "#s6 .wmw *" ).css( "opacity", "1" );
                    break;
                case 7:
                    $( "#s7" ).addClass( "ani" ), $( "#s7 .container0" ).css( "opacity", "1" );
                    break;
                case 8:
                    $( "#s8" ).addClass( "ani" );
                    break;
                case 9:
                    $( "#s9" ).addClass( "ani" );
                    break;
                case 10:
                    $( "#s10" ).addClass( "ani" ).parallax(), $( "#s10 .wmw" ).css( "opacity", "1" ), $( "#s10 .wmw *" ).css( "opacity", "1" );
                    break;
                case 11:
                    $( "#s11" ).addClass( "ani" );
                    break;
                case 12:
                    $( "#s12" ).addClass( "ani" );
                    break;
                case 13:
                    $( "#s13" ).addClass( "ani" );
                    break;
                case 14:
                    $( "#s14" ).addClass( "ani" ), $( "#s14 .container0" ).css( "opacity", "1" )
            }
        }, onSlideChangeEnd : function () {
            switch ( a.activeIndex ) {
                case 0:
                    $( "#s1" ).removeClass( "ani" );
                    break;
                case 1:
                    $( "#s0" ).removeClass( "ani" ), $( "#s2" ).removeClass( "ani" ), $( "#s2 .wmw" ).css( "opacity", "0" ), $( "#s2 .wmw *" ).css( "opacity", "0" );
                    break;
                case 2:
                    $( "#s1" ).removeClass( "ani" ), $( "#s3" ).removeClass( "ani" );
                    break;
                case 3:
                    $( "#s2" ).removeClass( "ani" ), $( "#s2 .wmw" ).css( "opacity", "0" ), $( "#s2 .wmw *" ).css( "opacity", "0" ), $( "#s4" ).removeClass( "ani" );
                    break;
                case 4:
                    $( "#s3" ).removeClass( "ani" ), $( "#s5" ).removeClass( "ani" );
                    break;
                case 5:
                    $( "#s4" ).removeClass( "ani" ), $( "#s6" ).removeClass( "ani" ), $( "#s6 .wmw" ).css( "opacity", "0" ), $( "#s6 .wmw *" ).css( "opacity", "0" );
                    break;
                case 6:
                    $( "#s5" ).removeClass( "ani" ), $( "#s7" ).removeClass( "ani" ), $( "#s7 .container0" ).css( "opacity", "0" );
                    break;
                case 7:
                    $( "#s6" ).removeClass( "ani" ), $( "#s6 .wmw" ).css( "opacity", "0" ), $( "#s6 .wmw *" ).css( "opacity", "0" ), $( "#s8" ).removeClass( "ani" );
                    break;
                case 8:
                    $( "#s7" ).removeClass( "ani" ), $( "#s7 .container0" ).css( "opacity", "0" ), $( "#s9" ).removeClass( "ani" );
                    break;
                case 9:
                    $( "#s8" ).removeClass( "ani" ), $( "#s10" ).removeClass( "ani" ), $( "#s10 .wmw" ).css( "opacity", "0" ), $( "#s10 .wmw *" ).css( "opacity", "0" );
                    break;
                case 10:
                    $( "#s9" ).removeClass( "ani" ), $( "#s11" ).removeClass( "ani" );
                    break;
                case 11:
                    $( "#s10" ).removeClass( "ani" ), $( "#s10 .wmw" ).css( "opacity", "0" ), $( "#s10 .wmw *" ).css( "opacity", "0" ), $( "#s12" ).removeClass( "ani" );
                    break;
                case 12:
                    $( "#s11" ).removeClass( "ani" ), $( "#s13" ).removeClass( "ani" );
                    break;
                case 13:
                    $( "#s12" ).removeClass( "ani" ), $( "#s14" ).removeClass( "ani" ), $( "#s14 .container0" ).css( "opacity", "0" );
                    break;
                case 14:
                    $( "#s13" ).removeClass( "ani" )
            }
        }
    } );
    $( "#s0" ).addClass( "ani" ).parallax()
} );
