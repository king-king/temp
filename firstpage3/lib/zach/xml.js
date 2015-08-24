/**
 * Created by 白 on 2014/8/25.
 */

library( function () {
	var util = imports( "util" ),
		loopObj = util.loopObj,
		loopString = util.loopString;

	// 根据字符串制作一个ascii表,返回一个函数,用来判断一个字符是否属于这个ascii表
	function AsciiMap( string ) {
		// 一个ascii表是一个bool[128]
		var asciiMaps = new Array( 128 );
		loopString( string, function ( ch ) {
			asciiMaps[ch] = true;
		} );

		return function ( ch ) {
			return ch < 128 && ch >= 0 && asciiMaps[ch] === true;
		};
	}

	var isTokenChar = AsciiMap( "_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" ), // 是否是Token字符
		isBlank = AsciiMap( "\t\n " ), // 是否是空白符
		escapeMapInQuote = {
			"\\" : "\\",
			"\"" : "\"",
			"'" : "'",
			"n" : "\n",
			"t" : "\t",
			"b" : "\b"
		}, // 字符串中的转义字符表
		escapeMapInXML = {
			"lt" : "<",
			"gt" : ">",
			"amp" : "&"
		}, // xml中的转移字符
		encodeMapInXML = function () {
			var retVal = {};
			loopObj( escapeMapInXML, function ( k, v ) {
				retVal[v] = k;
			} );
			return retVal;
		}(); // xml中的编码表

	function XMLReader( str ) {
		var cur = 0, ch;

		function eat() {
			ch = str.charAt( cur++ );
		}

		// 读token
		function readToken( firstChar ) {
			var retVal = firstChar || "";
			eat();
			while ( isTokenChar( ch.charCodeAt( 0 ) ) ) {
				retVal += ch;
				eat();
			}
			return retVal;
		}

		// 读取引号包起来的字符串
		function readQuoteString() {
			eat(); // 吃掉起始的引号
			var retVal = "";

			while ( ch !== '"' ) {
				// 如果读到了\,在读一个,转义
				if ( ch === "\\" ) {
					eat();
					retVal += escapeMapInQuote[ch];
				}
				// 否则直接加入到结果中
				else {
					retVal += ch;
				}
				eat();
			}
			eat(); // 吃掉结束的引号

			return retVal;
		}

		// 读属性,返回这个标签有没有结束
		function readAttribute( obj ) {
			// 读空白符
			while ( isBlank( ch.charCodeAt( 0 ) ) ) {
				eat();
			}

			// 读到了">",起始标记
			if ( ch === ">" ) {
				eat();
				obj.$type = XMLReader.nodeType.startTag;
				return false;
			}
			// 读到了"/>",对象标记
			else if ( ch === "/" ) {
				eat();
				eat();
				obj.$type = XMLReader.nodeType.object;
				return false;
			}
			else {
				var attrName = readToken( ch );
				// 读掉空白符和等号
				while ( isBlank( ch.charCodeAt( 0 ) ) || ch === "=" ) {
					eat();
				}
				obj[attrName] = readQuoteString();
				return true;
			}
		}

		function readTag() {
			var retVal = {};
			eat();

			// 如果上来就是/,这是一个结束标记
			if ( ch === "/" ) {
				retVal.$type = XMLReader.nodeType.endTag;
				retVal.$tagName = readToken();
				eat(); // 吃掉>
			}
			// 否则是起始标记或者对象
			else {
				retVal.$tagName = readToken( ch );
				while ( readAttribute( retVal ) ) {
				}
			}

			return retVal;
		}

		eat();
		return {
			read : function () {
				var retVal = {};

				// 读到末尾,返回null
				if ( ch === "" ) {
					return null;
				}
				// 读到<,返回tag
				else if ( ch === "<" ) {
					retVal = readTag();
				}
				// 否则读到了字符
				else {
					// 读到了"&",xml的转义
					if ( ch === "&" ) {
						eat();
						var escapeWord = "";
						while ( ch !== ";" ) {
							escapeWord += ch;
							eat();
						}
						ch = escapeMapInXML[escapeWord];
					}

					retVal = {
						$type : XMLReader.nodeType.character,
						ch : ch
					};
					eat();
				}

				return retVal;
			}
		};
	}

	XMLReader.encodeString = function ( str ) {
		var retVal = "";
		loopString( str, function ( ch ) {
			var escape = encodeMapInXML[ch];
			retVal += escape ? "&" + escape + ";" : ch;
		}, true );
		return retVal;
	};

	XMLReader.nodeType = {
		startTag : 0,
		endTag : 1,
		character : 2,
		object : 3
	};

	module.exports = XMLReader;
} );