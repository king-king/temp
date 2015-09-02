var majorityElement = function ( nums ) {
    if ( nums.length == 0 ) {
        return nums[0];
    }
    var arg = {};
    var threshold = nums.length / 2 << 0;
    for ( var i = 0; i < nums.length; i++ ) {
        if ( !arg[nums[i]] ) {
            arg[nums[i]] = 1;
        }
        else {
            arg[nums[i]] += 1;
            if ( arg[nums[i]] > threshold ) {
                return nums[i];
            }
        }
    }
};