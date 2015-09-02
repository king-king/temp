var containsNearbyAlmostDuplicate = function ( nums, k, t ) {
    if ( k == 0 && t != 0 ) {
        return false;
    }
    var len = nums.length;
    var min = nums[0];
    var i, j;
    var abs = Math.abs;
    if ( len <= k ) {
        for ( i = 0; i <= len; i++ ) {
            for ( j = i + 1; j <= len; j++ ) {
                if ( min > abs( nums[i] - nums[j] ) ) {
                    min = abs( nums[i] - nums[j] );
                    if ( min <= t ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    else {
        min = abs( nums[0] - nums[1] );
        if ( min <= t ) {
            return true;
        }
        for ( i = 0; i <= k; i++ ) {
            for ( j = i + 1; j <= k; j++ ) {
                if ( min > abs( nums[i] - nums[j] ) ) {
                    min = abs( nums[i] - nums[j] );
                    if ( min <= t ) {
                        return true;
                    }
                }
            }
        }
        for ( i = k + 1; i < len; i++ ) {
            for ( j = i - k; j < i; j++ ) {
                if ( min > abs( nums[i] - nums[j] ) ) {
                    min = abs( nums[i] - nums[j] );
                    if ( min <= t ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
};