var reverseList = function (head) {
    if (!head) {
        return head;
    }
    var cur = head.next;
    var pre = head;
    var next;
    while (cur) {
        next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }
    head.next = null;
    return pre;
};