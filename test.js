var deleteNode = function ( node ) {
    if ( !node.next ) {
        node = null;
    }
    else {
        node.val = node.next.val;
        node.next = node.next.next;
    }
};