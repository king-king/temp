/**
 * 	author:	胡剑青 huhuh1234567@126.com
 * 	date:	2014.11
 */

library(function(){

	var LinkedList = imports("linked-list");

	// region tree
	//==================================================================================

	function Node(value,isParent){
		var node = LinkedList.Node(value);
		node.parent = null;
		node.children = isParent? LinkedList():null;
		return node;
	}

	function insert(parentNode,node,position){
		node.parent = parentNode;
		parentNode&&parentNode.children.insert(node,position);
		return node;
	}

	function remove(node){
		var parentNode = node.parent;
		node.parent = null;
		parentNode&&parentNode.children.remove(node);
	}

	//endregion

	// region view tree
	//==================================================================================================

	function foreach(node,op){
		op(node.value,node);
		node.children&&LinkedList.foreach(node.children,function(value,node){
			foreach(node,op);
		});
	}

	//find siblings
	function FindSibling(direction){
		return function(node){
			var currentNode = node;
			while(currentNode!==null){
				var nextNode = direction? currentNode.next:currentNode.previous;
				if(nextNode!==null){
					currentNode = nextNode;
					break;
				}
				currentNode = currentNode.parent;
			}
			return currentNode;
		};
	}
	var findNext = FindSibling(true);
	var findPrevious = FindSibling(false);

	//find leaves
	function FindChild(direction){
		return function(node){
			var currentNode = node;
			while(currentNode!==null&&currentNode.children!==null){
				currentNode = direction? currentNode.children.tail():currentNode.children.head();
			}
			return currentNode;
		}
	}
	var findLastChild = FindChild(true);
	var findFirstChild = FindChild(false);

	//list parents from root to nearest
	function findParents(node){
		var rst = [];
		var currentNode = node.parent;
		while(currentNode!==null){
			rst.unshift(currentNode);
			currentNode = currentNode.parent;
		}
		return rst;
	}

	function findCross(node1,node2,parents1,parents2){
		//find parents
		parents1 = parents1||findParents(node1);
		parents2 = parents2||findParents(node2);
		//find cross node
		var index = 0;
		while(index<parents1.length&&index<parents2.length){
			if(parents1[index]!==parents2[index]){
				break;
			}
			else{
				index++;
			}
		}
		//return cross
		return {
			common: parents1[index-1],
			diff1: index===parents1.length? node1:parents1[index],
			diff2: index===parents2.length? node2:parents2[index]
		};
	}

	function isBefore(node1,node2,crossNodes){
		if(node1===node2){
			return false;
		}
		else{
			crossNodes = crossNodes||findCross(node1,node2);
			return LinkedList.isBefore(crossNodes.diff1,crossNodes.diff2);
		}
	}

	function isAncestor(anode,node){
		var current = node.parent;
		while(current!==null){
			if(current===anode){
				return true;
			}
			else{
				current = current.parent;
			}
		}
		return false;
	}

	function isFlat(firstNode,lastNode,crossNodes){
		crossNodes = crossNodes||findCross(firstNode,lastNode);
		return firstNode===findFirstChild(crossNodes.diff1)&&lastNode===findLastChild(crossNodes.diff2);
	}

	function isWhole(firstNode,lastNode,crossNodes){
		crossNodes = crossNodes||findCross(firstNode,lastNode);
		return firstNode===findFirstChild(crossNodes.common)&&lastNode===findLastChild(crossNodes.common);
	}

	function isTerminal(firstNode,lastNode){
		if(firstNode!==null&&lastNode!==null){
			if(firstNode.parent!==lastNode.parent){
				return false;
			}
			else{
				var rst = true;
				LinkedList.loopNodes(firstNode,lastNode.next,function(value,node){
					if(node.children!==null){
						rst = false;
						return true;
					}
				});
				return rst;
			}
		}
		else{
			return false;
		}
	}

	// endregion

	// region mod tree
	//==================================================================================================

	function move(beginNode,endNode,newParentNode,position){
		var currentNode = beginNode;
		while(currentNode!==endNode){
			var nextNode = currentNode.next;
			remove(currentNode);
			insert(newParentNode,currentNode,position);
			currentNode = nextNode;
		}
	}

	function split(parentNode, beginNode){
		var newParentNode = Node(null,true);
		insert(parentNode.parent,newParentNode,parentNode.next);
		move(beginNode,null,newParentNode,null);
		return newParentNode;
	}

	function combine(leftNode,rightNode){
		move(rightNode.children.head(),null,leftNode,null);
		remove(rightNode);
	}

	function branch(parentNode, beginNode, endNode){
		var newParentNode = Node(null,true);
		insert(parentNode,newParentNode,beginNode);
		move(beginNode,endNode,newParentNode,null);
		return newParentNode;
	}

	function merge(parentNode){
		if(parentNode!==null&&parentNode.parent!==null){
			move(parentNode.children.head(),null,parentNode.parent,parentNode);
			remove(parentNode);
		}
	}

	// endregion

	exports.Node = Node;
	exports.insert = insert;
	exports.remove = remove;
	exports.foreach = foreach;
	exports.findNext = findNext;
	exports.findPrevious = findPrevious;
	exports.findFirstChild = findFirstChild;
	exports.findLastChild = findLastChild;
	exports.findParents = findParents;
	exports.findCross = findCross;

	exports.isBefore = isBefore;
	exports.isAncestor = isAncestor;
	exports.isFlat = isFlat;
	exports.isWhole = isWhole;
	exports.isTerminal = isTerminal;

	exports.split = split;
	exports.combine = combine;
	exports.branch = branch;
	exports.merge = merge;

});