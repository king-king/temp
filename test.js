var majorityElement = function ( nums ) {
    var arg = {};
    for ( var i = 0; i < nums.length; i++ ) {
        if ( !arg[nums[i]] ) {
            arg[nums[i]] = 1;
        }
        else {
            arg[nums[i]] += 1;
        }
    }
    var res = [], len = nums.length / 3 << 0;
    for ( var key in arg ) {
        if ( arg[key] > len ) {
            res.push( key );
        }
    }
    return res;
};