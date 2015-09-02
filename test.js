var addDigits = function ( num ) {

    function decompose( n ) {
        var result = [];
        while ( n >= 10 ) {
            result.push( n % 10 );
            n = n / 10 << 0;
        }
        result.push( n );
        return result;
    }

    function add( arr ) {
        var result = 0;
        for ( var i = 0; i < arr.length; i++ ) {
            result += arr[i];
        }
        return result;
    }

    while ( num >= 10 ) {
        num = add( decompose( num ) );
    }
    return num;
};