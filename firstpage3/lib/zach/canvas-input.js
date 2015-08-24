/**
 * 	author:	胡剑青 huhuh1234567@126.com
 * 	date:	2014.12
 */

library(function(){

	var Util = imports("util.js");
	var Event = Util.Event;
	var insert = Util.insert;
	var loop = Util.loop;
	var loopObject = Util.loopObj;
	var loopArray = Util.loopArray;

	var LinkedList = imports("linked-list.js");

	var TextUtil = imports("text-util.js");

	var Canvas = imports("canvas.js");

	var Pointer = imports("pointer.js");

	var Keyboard = imports("keyboard.js");
	var KEY_CODE = Keyboard.KEY_CODE;

	function Character(ch){
		return {
			character: ch
		};
	}

	function InputBox(mode){

		//说明:
		//对于事件类型的操作: KeyRepeat/KeyPress/IMEInput/CursorDown|Move|Up
		//全部触发flashReset, 重置光标闪烁
		//对于属性类型的操作: width/height/lineHeight/font/color/value/flashReset
		//全部触发area.dirty, 请求重绘
		//对于修改类操作: insert(KeyPress/IMEInput/Paste/value/KeyDown[ENTER])/KeyDown[BACKSPACE]/KeyDown[DELETE]
		//全部触发reflow = true和inputEvent.trig
		//在draw时使用syncIMECursor同步IME光标和输入框光标位置

		var rst = {};

		var area = Canvas.Area();
		insert(rst,{
			area: area
		});

		var ime = Keyboard.IME();
		insert(rst,{
			ime:ime
		});

		//properties
		var fields = {
			width: 160,
			height: mode? 200:20,
			lineHeight: 16,
			font: "12px sans-serif",
			color: "#000000"
		};
		var flags = {};
		loopObject(fields,function(k){
			flags[k] = true;
			Object.defineProperty(rst,k,{
				get: function(){
					return fields[k];
				},
				set: function(value){
					fields[k] = value;
					flags[k] = true;
					area.dirty();
				}
			});
		});

		//content
		var characters = null;
		var text = null;
		var lines = null;
		var reflow = null;

		//snapshot
		var snapshot = document.createElement("canvas");
		var snapshotGC = snapshot.getContext("2d");

		//flash
		var flashTimer = 0;
		var flashShow = false;
		function flashReset(){
			//clear flash
			flashShow = false;
			if(flashTimer){
				clearTimeout(flashTimer);
				flashTimer = 0;
			}
			//restart flash
			(function flash(){
				flashShow = !flashShow;
				area.dirty();
				flashTimer = setTimeout(flash, 500);
			})();
		}

		//cursor
		var currentNode = null;
		var currentOffsetX = 0;
		var currentOffsetY = 0;
		var cursorX = 0;
		var cursorY = 0;
		function setCursorFromPoint(){
			var index = Math.min((Math.max(cursorY,0)/fields.lineHeight)<<0,lines.length-1);
			var lastNode = lines[index+1]? lines[index+1].previous:characters.tail();
			currentNode = LinkedList.loopNodes(lines[index],lastNode,function(element,node){
				if(cursorX<element.offsetX+element.width/2){
					return node;
				}
			})||lastNode;
		}
		function setPointFromCursor(){
			cursorX = currentNode.value.offsetX;
			if(!mode){
				if(cursorX-currentOffsetX>fields.width){
					currentOffsetX = cursorX-fields.width;
				}
				else if(cursorX-currentOffsetX<0){
					currentOffsetX = cursorX;
				}
			}
			cursorY = currentNode.value.offsetY;
			if(mode){
				if(cursorY+fields.lineHeight-currentOffsetY>fields.height){
					currentOffsetY = cursorY+fields.lineHeight-fields.height;
				}
				else if(cursorY-currentOffsetY<0){
					currentOffsetY = cursorY;
				}
			}
		}
		function syncIMECursor(){
			var coordinate = Canvas.coordinateAreaToPage(area,[cursorX-currentOffsetX,cursorY-currentOffsetY,1]);
			ime.pageX = coordinate[0];
			ime.pageY = coordinate[1];
		}

		//focus
		var focus = false;
		insert(rst,{
			focus: function(){
				focus = true;
				ime.focus();
			},
			blur: function(){
				focus = false;
				ime.blur();
			}
		});

		//draw
		area.onDraw(function(gc){
			//measure text
			if(reflow||flags.font||mode&&flags.width){
				//character
				gc.font = fields.font;
				LinkedList.loop(characters,function(element){
					if(flags.font||element.width===undefined||element.width===null){
						element.width = gc.measureText(element.character).width;
					}
				});
				//text
				text = "";
				LinkedList.loop(characters,function(element){
					text += element.character;
				});
				//line
				if(mode){
					lines = TextUtil.buildAllBreakLines(characters.head(),null,fields.width,0);
					var offsetY = 0;
					loopArray(lines,function(headNode,i){
						//align
						var endNode = i===lines.length-1? null:lines[i+1];
						TextUtil.alignLeftLine(headNode,endNode,0,0);
						//flow
						LinkedList.loopNodes(headNode,endNode,function(element){
							element.offsetY = offsetY;
						});
						offsetY += fields.lineHeight;
					});
				}
				else{
					lines = [characters.head()];
					TextUtil.alignLeftLine(characters.head(),null,0,0);
					LinkedList.loopNodes(characters.head(),null,function(element){
						element.offsetY = (fields.height-fields.lineHeight)/2;
					});
				}
			}
			//measure point
			setPointFromCursor();
			syncIMECursor();
			//draw snapshot
			if(reflow||flags.width||flags.height||flags.lineHeight||flags.font||flags.color){
				snapshot.width = mode? fields.width:characters.tail().value.offsetX;
				snapshot.height = mode? lines.length*fields.lineHeight:fields.height;
				snapshotGC.clearRect(0,0,snapshot.width,snapshot.height);
				snapshotGC.textBaseline = "top";
				snapshotGC.font = fields.font;
				snapshotGC.fillStyle = fields.color;
				LinkedList.loop(characters,function(element){
					element.character&&element.character!=="\n"&&snapshotGC.fillText(element.character,element.offsetX,element.offsetY);
				});
			}
			//draw text
			gc.beginPath();
			gc.rect(0,0,fields.width,fields.height);
			gc.clip();
			snapshot.width&&snapshot.height&&gc.drawImage(snapshot,-currentOffsetX,-currentOffsetY);
			//draw cursor
			if(focus){
				if(flashShow){
					gc.fillStyle = fields.color;
					gc.fillRect((cursorX-currentOffsetX)<<0,(cursorY-currentOffsetY)<<0,1,fields.lineHeight);
				}
			}
			//clean flag
			reflow = false;
			loopObject(flags,function(k){
				flags[k] = false;
			});
		});

		//point
		Pointer.onPointerDown(area,function(e,x,y){
			function setPoint(x,y){
				var coordinate = Canvas.coordinatePageToArea(area,[x,y,1]);
				cursorX = coordinate[0]+currentOffsetX;
				cursorY = coordinate[1]+currentOffsetY;
				setCursorFromPoint();
			}
			flashReset();
			setPoint(x,y);
			e.onMove(function(e,x,y){
				flashReset();
				setPoint(x,y);
			});
			e.onUp(function(e,x,y){
				flashReset();
				setPoint(x,y);
			});
		});

		//event
		var inputEvent = Event();
		insert(rst,{
			onInput: inputEvent.regist
		});

		//keyboard
		function insertText(s){
			var str = s.replace(/\r/g,"");
			str = mode? str:str.replace(/\n/g," ");
			loop(str.length, function(i){
				var ch = str.charAt(i);
				characters.insert(LinkedList.Node(Character(ch)),currentNode);
			});
			inputEvent.trig(str);
			reflow = true;
		}
		ime.onInput(function(e,str){
			if(focus){
				flashReset();
				insertText(str);
			}
		});
		Keyboard.onKeyPress(function(e,ch){
			if(focus){
				flashReset();
				if(e.which>=32&&e.which<=126){
					insertText(ch);
				}
			}
		});
		var ctrlProcess = [];
		ctrlProcess[KEY_CODE.V] = function(){
			if(focus){
				if(window.clipboardData){
					var str = clipboardData.getData("text");
					insertText(str);
				}
			}
		};
		var normalProcess = [];
		normalProcess[KEY_CODE.BACKSPACE] = function(){
			if(currentNode.previous!==null){
				characters.remove(currentNode.previous);
				inputEvent.trig("");
				reflow = true;
			}
		};
		normalProcess[KEY_CODE.DELETE] = function(){
			var nextNode = currentNode.next;
			if(nextNode!==null){
				characters.remove(currentNode);
				currentNode = nextNode;
				inputEvent.trig("");
				reflow = true;
			}
		};
		normalProcess[KEY_CODE.LEFT] = function(){
			if(currentNode.previous!==null){
				currentNode = currentNode.previous;
			}
		};
		normalProcess[KEY_CODE.RIGHT] = function(){
			if(currentNode.next!==null){
				currentNode = currentNode.next;
			}
		};
		normalProcess[KEY_CODE.ENTER] = function(){
			if(mode){
				insertText("\n");
			}
		};
		normalProcess[KEY_CODE.UP] = function(){
			if(mode){
				cursorY -= fields.lineHeight;
				setCursorFromPoint();
			}
		};
		normalProcess[KEY_CODE.DOWN] = function(){
			if(mode){
				cursorY += fields.lineHeight;
				setCursorFromPoint();
			}
		};
		Keyboard.onKeyRepeat(function(e){
			if(focus){
				flashReset();
				if(e.ctrlKey&&!e.altKey&&!e.shiftKey&&ctrlProcess[e.which]){
					e.preventDefault();
					ctrlProcess[e.which](e);
				}
				if(!e.ctrlKey&&!e.altKey&&!e.shiftKey&&normalProcess[e.which]){
					e.preventDefault();
					normalProcess[e.which](e);
				}
			}
		});

		//value
		Object.defineProperties(rst,{
			value: {
				get: function(){
					return text;
				},
				set: function(value){
					characters = LinkedList();
					characters.insert(LinkedList.Node(Character("")),null);
					currentNode = characters.head();
					insertText(value);
					area.dirty();
				}
			}
		});

		//init
		rst.value = "";

		//return
		return rst;
	}

	module.exports = InputBox;

});