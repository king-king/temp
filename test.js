var removeElement = function (nums, val) {
    var arr = [];
    for (var i = 0; i < nums.length; i++) {
        val != nums[i] && arr.push(nums[i]);
    }
    nums = arr;
    return arr.length;
};