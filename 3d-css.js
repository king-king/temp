/**
 * Created by WQ on 2015/6/10.
 */
(function () {

    function eye() {
        return [
            [ 1 , 0 , 0 , 0 ] ,
            [ 0 , 1 , 0 , 0 ] ,
            [ 0 , 0 , 1 , 0 ] ,
            [ 0 , 0 , 0 , 1 ]
        ]
    }

    function translate3dM( x , y , z ) {
        return [
            [ 1 , 0 , 0 , x ] ,
            [ 0 , 1 , 0 , y ] ,
            [ 0 , 0 , 1 , z ] ,
            [ 0 , 0 , 0 , 1 ]
        ]
    }

    function perspectiveM( d ) {
        return [
            [ 1 , 0 , 0 , 0 ] ,
            [ 0 , 1 , 0 , 0 ] ,
            [ 0 , 0 , 1 , 0 ] ,
            [ 0 , 0 , -1 / d , 1 ]
        ]
    }

    function rotate3dM( x , y , z , a ) {
        a = a * Math.PI / 180;
        var cosa = Math.cos( a ) , sina = Math.sin( a );

        var r = Math.sqrt( x * x + y * y + z * z );
        x /= r;
        y /= r;
        z /= r;

        return [
            [ 1 + (1 - cosa) * ( x * x - 1 ) , z * sina + x * y * (1 - cosa) , -y * sina + x * z * (1 - cosa) , 0 ] ,
            [ -z * sina + x * y * (1 - cosa) , 1 + (1 - cosa) * (y * y - 1) , x * sina + y * z * (1 - cosa) , 0 ] ,
            [ y * sina + x * z * (1 - cosa) , -x * sina + y * z * (1 - cosa) , 1 + (1 - cosa) * (z * z - 1) , 0 ] ,
            [ 0 , 0 , 0 , 1 ]
        ]
    }

    function scale3dM( sx , sy , sz ) {
        return [
            [ sx , 0 , 0 , 0 ] ,
            [ 0 , sy , 0 , 0 ] ,
            [ 0 , 0 , sz , 0 ] ,
            [ 0 , 0 , 0 , 1 ]
        ]
    }

    Array.prototype.matrixStringify = function () {
        var marix = this;
        var nmatrix = [];
        for ( var c = 0; c < marix.length; c++ ) {
            nmatrix[ c ] = [];
            for ( var r = 0; r < marix[ c ].length; r++ ) {
                nmatrix[ c ][ r ] = marix[ r ][ c ];
            }
        }
        return nmatrix.join();
    };

    function combine() {
        var result = [
            [ 1 , 0 , 0 , 0 ] ,
            [ 0 , 1 , 0 , 0 ] ,
            [ 0 , 0 , 1 , 0 ] ,
            [ 0 , 0 , 0 , 1 ]
        ];
        for ( var i = 0; i < arguments.length; i++ ) {
            result = mul( result , arguments[ i ] );
        }
        return result;
    }

    function mul( m1 , m2 ) {
        var re = [];
        for ( var r = 0; r < m1.length; r++ ) {
            re[ r ] = [];
            for ( var c = 0; c < m1[ r ].length; c++ ) {
                re[ r ][ c ] = 0;
                for ( var k = 0; k < m1.length; k++ ) {
                    re[ r ][ c ] += m1[ r ][ k ] * m2[ k ][ c ];
                }
            }
        }
        return re;
    }

    // matrix:4*4,vector:1*4
    function decompose3d( matrix , vector ) {
        return [
            matrix[ 0 ][ 0 ] * vector[ 0 ] + matrix[ 0 ][ 1 ] * vector[ 1 ] + matrix[ 0 ][ 2 ] * vector[ 2 ] + matrix[ 0 ][ 3 ] * vector[ 3 ] ,
            matrix[ 1 ][ 0 ] * vector[ 0 ] + matrix[ 1 ][ 1 ] * vector[ 1 ] + matrix[ 1 ][ 2 ] * vector[ 2 ] + matrix[ 1 ][ 3 ] * vector[ 3 ] ,
            matrix[ 2 ][ 0 ] * vector[ 0 ] + matrix[ 2 ][ 1 ] * vector[ 1 ] + matrix[ 2 ][ 2 ] * vector[ 2 ] + matrix[ 2 ][ 3 ] * vector[ 3 ] ,
            1
        ]
    }

    function origin3d( transformation , x , y , z ) {
        return combine( translate3dM( x , y , z ) , transformation , translate3dM( -x , -y , -z ) );
    }

    window._3d = {
        eye : eye ,
        perspectiveM : perspectiveM ,
        translate3dM : translate3dM ,
        rotate3dM : rotate3dM ,
        scale3dM : scale3dM ,
        mul : mul ,
        combine : combine ,
        decompose3d : decompose3d ,
        origin3d : origin3d
    }

})();