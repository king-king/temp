var swapPairs = function (head) {
    if (!head) {
        return head;
    }
    var p = head;
    var temp;
    while (p && p.next) {
        temp = p.val;
        p.val = p.next.val;
        p.next.val = temp;
        p = p.next.next;
    }
    return head;
};