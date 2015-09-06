var removeElements = function ( head, val ) {
    while ( head && head.val == val ) {
        head = head.next;
    }
    if ( !head ) {
        return head;
    }
    var pre = head;
    var p = head.next;
    while ( p ) {
        if ( p.val == val ) {
            pre.next = p.next;
        }
        else {
            pre = p;
        }
        p = p.next;
    }
    return head;
};