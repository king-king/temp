var lengthOfLastWord = function ( s ) {
    s = s.trim();
    if ( !s ) {
        return 0;
    }
    else {
        var arr = s.split( " " );
        return arr[arr.length - 1].length;
    }
};