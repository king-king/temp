var reverseKGroup = function (head, k) {
    var p = head;
    var len = 0;
    while (p) {
        len += 1;
        p = p.next;
    }
    if (len < k || k == 1) {
        return head;
    } else {
        p = head.next;
        var pre = head;
        var heads = [];
        var count = len / k << 0;
        var index = 0;
        var i = 1;
        var next;
        var tail = head;
        while (p) {
            next = p.next;
            p.next = pre;
            i += 1;
            if (i == k) {
                heads.push(p);
                tail && heads.push(tail);
                tail = next;
                index += 1;
                if (index == count) {
                    next && heads.push(next);
                    for (var n = 1; n < heads.length; n += 2) {
                        if (heads[n + 1]) {
                            heads[n].next = heads[n + 1];
                        } else {
                            heads[n].next = null;
                        }
                    }
                    return heads[0];
                } else {
                    i = 1;
                    p = next.next;
                    pre = next;
                }
            } else {
                pre = p;
                p = next;
            }
        }
    }
};