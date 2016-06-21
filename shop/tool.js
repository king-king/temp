/**
 * Created by wq on 16/6/21.
 */
function loopArray(arr, func) {
    for (var i = 0; i < arr.length; i++) {
        func(arr[i], i);
    }
}