var reverseList = function (head) {
    if (!head) {
        return head;
    }

    function ListNode(val) {
        this.val = val;
        this.next = null;
    }

    var arr = [];
    var p = head;
    while (p) {
        arr.push(new ListNode(p.val));
        p = p.next;
    }
    var len = arr.length - 1;
    for (var i = len; i >= 0; i--) {
        arr[i].next = arr[i - 1];
    }
    return arr[len];
};