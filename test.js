var containsNearbyDuplicate = function ( nums, k ) {
    if ( !k ) {
        return false;
    }
    var len = nums.length;
    var arg = {};
    if ( len <= k ) {
        for ( var i = 0; i < len; i++ ) {
            if ( arg[nums[i]] ) {
                return true;
            }
            else {
                arg[nums[i]] = true;
            }
        }
        return false;
    }
    else {
        var j;
        for ( j = 0; j <= k; j++ ) {
            if ( arg[nums[j]] ) {
                return true;
            }
            else {
                arg[nums[j]] = true;
            }
        }
        for ( ; j < len; j++ ) {
            arg[nums[j - k - 1]] = false;
            if ( arg[nums[j]] ) {
                return true;
            }
            else {
                arg[nums[j]] = true;
            }
        }
        return false;
    }
};