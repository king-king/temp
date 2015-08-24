/**
 * Created by Zuobai on 2014/11/22.
 */

library( function () {
	var object = imports( "object" ),
		is = object.is;

	// 链表
	function LinkedList() {
		var head = null, tail = null;

		return {
			head : function () {
				return head;
			},
			tail : function () {
				return tail;
			},
			insert : function ( tarNode, refNode ) {
				var previous = refNode ? refNode.previous : tail;
				tarNode.next = refNode;
				tarNode.previous = previous;
				previous ? previous.next = tarNode : head = tarNode;
				refNode ? refNode.previous = tarNode : tail = tarNode;
				tarNode.inserted = true;
				return tarNode;
			},
			remove : function ( node ) {
				if ( node.inserted === true ) {
					node.previous ? node.previous.next = node.next : head = node.next;
					node.next ? node.next.previous = node.previous : tail = node.previous;
					node.inserted = false;
				}
			}
		};
	}

	// 节点
	function Node( value ) {
		return {
			previous : null,
			next : null,
			value : value
		};
	}

	// 遍历
	function foreach( list, func ) {
		var retVal;
		for ( var cur = list.head(); cur !== null; cur = cur.next ) {
			if ( ( retVal = func( cur.value, cur ) ) !== undefined ) {
				return retVal;
			}
		}
	}

	// 迭代,从begin到end,默认end是null,可指定迭代方向
	function iterate( begin, arg2, arg3, arg4 ) {
		var end, block, reverse, cur, retVal;
		if ( is.Function( arg2 ) ) {
			end = null;
			block = arg2;
			reverse = arg3;
		}
		else {
			end = arg2;
			block = arg3;
			reverse = arg4;
		}

		for ( cur = begin; cur !== end; cur = reverse ? cur.previous : cur.next ) {
			if ( ( retVal = block( cur.value, cur ) ) !== undefined ) {
				return retVal;
			}
		}
	}

	// 加入到最后
	function push( list, value ) {
		return list.insert( Node( value ), null );
	}

	// 移除最后
	function pop( list ) {
		var node = list.tail();
		list.remove( node );
		return node.value;
	}

	function isBefore( node1, node2 ) {
		for ( ; node2 && node2 !== node1; node2 = node2.next ) {
		}
		return node2 === null;
	}

	module.exports = LinkedList;
	LinkedList.Node = Node;
	LinkedList.foreach = foreach;
	LinkedList.iterate = iterate;
	LinkedList.push = push;
	LinkedList.pop = pop;
	LinkedList.isBefore = isBefore;
} );