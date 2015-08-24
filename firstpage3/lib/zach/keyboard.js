/**
 * 	author:	胡剑青 huhuh1234567@126.com
 * 	date:	2014.11
 */

library( function () {

	var ZU = imports("util");
	var loop = ZU.loop;

	var async = imports("async");
	var Event = async.Event;

	var Browser = imports("browser");
	var bind = Browser.bindEvent;

	var KEY_CODE = {

		ESC: 27,

		ENTER: 13,
		BACKSPACE: 8,
		TAB: 9,

		PAGE_UP: 33,
		PAGE_DOWN: 34,
		END: 35,
		HOME: 36,

		INSERT: 45,
		DELETE: 46,

		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,

		SHIFT: 16,
		CTRL: 17,
		ALT: 18
	};
	var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	loop(letters.length,function(i){
		KEY_CODE[letters.charAt(i)] = letters.charCodeAt(i);
	});
	loop(letters.length,function(i){
		KEY_CODE["DIGIT"+i] = "0".charCodeAt(0)+i;
	});
	loop(12,function(i){
		KEY_CODE["F"+(i+1)] = 112+i;
	});

	//keyboard event
	var keyRepeatEvent = Event();
	var keyDownEvent = Event();
	var keyUpEvent = Event();
	var keyPressEvent = Event();

	//keyboard down up
	var keys = [];
	loop(256,function(i){
		keys[i] = false;
	});
	bind(document,"keydown",function(e){
		keyRepeatEvent.trig(e);
		if(!keys[e.which]){
			keys[e.which] = true;
			keyDownEvent.trig(e);
		}
	});
	bind(document,"keyup",function(e){
		keys[e.which] = false;
		keyUpEvent.trig(e);
	});
	bind(document,"keypress",function(e){
		keyPressEvent.trig(e,String.fromCharCode(e.which));
	});

	function IME(){

		//input element
		var input = document.createElement("input");
		document.body.appendChild(input);
		input.setAttribute("type", "text");
		input.style["width"] = "0px";
		input.style["height"] = "0px";
		input.style["position"] = "absolute";
		input.style["border"] = "none";

		//input event
		var inputEvent = Event();
		bind(input,"compositionend",function(e){
			inputEvent.trig(e, e.data);
			input.value = "";
		});

		var rst = {
			onInput: inputEvent.regist,
			focus: function(){
				input.focus();
			},
			blur: function(){
				input.blur();
			}
		};

		var pageX = 0;
		input.style["left"] = "0px";
		var pageY = 0;
		input.style["top"] = "0px";
		var enable = true;
		input.style["ime-mode"] = "auto";
		Object.defineProperties(rst,{
			pageX: {
				get: function(){
					return pageX;
				},
				set: function(value){
					pageX = value;
					input.style["left"] = value.toString()+"px";
				}
			},
			pageY: {
				get: function(){
					return pageY;
				},
				set: function(value){
					pageY = value;
					input.style["top"] = value.toString()+"px";
				}
			},
			enable: {
				get: function(){
					return enable;
				},
				set: function(value){
					enable = value;
					input.style["ime-mode"] = value? "auto":"disable";
				}
			}
		});

		return rst;
	}


	exports.KEY_CODE = KEY_CODE;

	exports.keys = keys;

	exports.onKeyRepeat = keyRepeatEvent.regist;
	exports.onKeyDown = keyDownEvent.regist;
	exports.onKeyUp = keyUpEvent.regist;
	exports.onKeyPress = keyPressEvent.regist;

	exports.IME = IME;

});