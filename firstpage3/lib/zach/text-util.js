/**
 * 	author:	胡剑青 huhuh1234567@126.com
 * 	date:	2014.12
 */

library(function(){

	var LinkedList = imports("linked-list");

	var prefix = /^[（【“‘]$/;
	var suffix = /^[）】”’，。；：？！、]$/;
	var connector = /^[0-9a-zA-Z`~!@#\$%\^&\*\(\)\-_=\+\[\{\]\}\\\|:;"'<,>\.\?\/]$/;
	var blank = /^[ 	　]$/;
	var enter = /^[\n\r]$/;

	function character(element){
		return element.character||"";
	}

	function isWord(left,right){
		return left&&right&&								//both text
			(prefix.test(left)&&!blank.test(right)||		//prefix is not the end
			!blank.test(left)&&suffix.test(right)||			//suffix is not the begin
			connector.test(left)&&connector.test(right)||	//connectors connect
			blank.test(left)&&blank.test(right));			//blanks connect
	}

	function BuildLines(canBreak,compressBlank){
		return function(beginNode,endNode,width,indent){
			var offset = indent;
			var lineBeginNode = beginNode;
			var wordWidth = 0;
			var wordText = "";
			var wordBeginNode = beginNode;
			var lines = [];
			LinkedList.iterate(beginNode,endNode,function(element,node){
				//update word
				wordWidth += element.width;
				wordText += character(element);
				//end word
				if(canBreak(character(element),node.next===endNode? "":character(node.next.value))){
					//new line
					if(enter.test(wordText)){
						lines.push(lineBeginNode);
						lineBeginNode = node.next;
						offset = indent;
					}
					else if(wordBeginNode!==lineBeginNode&&offset+wordWidth>width&&!(compressBlank&&blank.test(character(wordBeginNode.value)))){
						lines.push(lineBeginNode);
						lineBeginNode = wordBeginNode;
						offset = wordWidth;
					}
					else{
						offset += wordWidth;
					}
					//reset word
					wordText = "";
					wordWidth = 0;
					wordBeginNode = node.next;
				}
			});
			lines.push(lineBeginNode);
			return lines;
		};
	}
	var buildAllBreakLines = BuildLines(function(left,right){
		return true;
	},false);
	var buildWordBreakLines = BuildLines(function(left,right){
		return !isWord(left,right);
	},true);

	function alignLeftLine(beginNode,endNode,width,offset){
		var offsetX = offset;
		LinkedList.iterate(beginNode,endNode,function(element){
			element.offsetX = offsetX;
			offsetX += element.width;
		});
	}

	function alignSideLine(beginNode,endNode,width,offset){
		//skip back space
		var lastNode = beginNode;
		LinkedList.iterate(beginNode,endNode,function(element,node){
			if(!element.character||!blank.test(element.character)){
				lastNode = node;
			}
		});
		//calculate space
		var totalSpaceCount = 0;
		var totalWidth = 0;
		LinkedList.iterate(beginNode,lastNode.next,function(element,node){
			totalWidth += element.width;
			if(node.next!==lastNode.next&&!isWord(element.character,node.next.value.character)){
				totalSpaceCount++;
			}
		});
		//calculate x
		var space = totalSpaceCount>0? (width-offset-totalWidth)/totalSpaceCount:0;
		var offsetX = offset;
		var spaceOffsetX = 0;
		var spaceCount = 0;
		LinkedList.iterate(beginNode,endNode,function(element,node){
			element.offsetX = offsetX+spaceOffsetX;
			offsetX += element.width;
			if(node.next!==endNode&&!isWord(element.character,node.next.value.character)){
				spaceCount++;
				spaceOffsetX = (space*Math.min(spaceCount,totalSpaceCount)+0.5)<<0;
			}
		});
	}

	exports.buildAllBreakLines = buildAllBreakLines;
	exports.buildWordBreakLines = buildWordBreakLines;

	exports.alignLeftLine = alignLeftLine;
	exports.alignSideLine = alignSideLine;

});