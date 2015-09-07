/*

 Given two binary strings, return their sum (also a binary string).

 For example,
 a = "11"
 b = "1"
 Return "100".

 */


var addBinary = function ( a, b ) {
    var ai = a.length - 1, bi = b.length - 1;
    var carry = 0;
    var result = [];
    var aa, bb;
    while ( ai >= 0 && bi >= 0 ) {
        aa = parseInt( a[ai] );
        bb = parseInt( b[bi] );
        result.push( (aa + bb + carry) % 2 );
        carry = (aa + bb + carry) / 2 << 0;
        ai -= 1;
        bi -= 1;
    }
    var li, last;
    if ( ai >= 0 ) {
        li = ai;
        last = a;
    }
    if ( bi >= 0 ) {
        li = bi;
        last = b;
    }
    while ( li >= 0 ) {
        aa = parseInt( last[li] );
        result.push( (aa + carry) % 2 );
        carry = (aa + carry) / 2 << 0;
        li -= 1;
    }
    if ( carry == 1 ) {
        result.push( 1 );
    }
    var re = "";
    for ( aa = 0; aa < result.length; aa++ ) {
        re = result[aa] + re;
    }
    return re;
};