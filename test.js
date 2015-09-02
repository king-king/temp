var majorityElement = function ( nums ) {
    var result = [];
    if ( nums.length == 0 ) {
        return [];
    }
    if ( nums.length < 3 ) {
        nums[0] && result.push( nums[0] );
        nums[1] && nums[1] != nums[0] && result.push( nums[1] );
        return result;
    }
    var arr = nums.sort( function ( a, b ) {
        return a - b;
    } );

    var len_3 = arr.length / 3,
        len_23 = (( arr.length * 2 / 3) << 0) + 1,
        count = 0,
        curval = arr[0];

    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] == curval ) {
            count += 1;
            if ( i == len_23 - 1 ) {
                if ( count > len_3 ) {
                    result.push( arr[i] );
                }
            }
        }
        else {
            if ( count > len_3 ) {
                result.push( arr[i - 1] );
            }
            curval = arr[i];
            count = 0;
        }
    }
    return result;
};