/**
 * Created by Zuobai on 2014/10/25.
 * 封装一些常用的服务器功能,诸如对multipart的处理等
 */

require( "./node" );
var Buffer = require( 'buffer' ).Buffer,

	StringStream = require( './stream' ).StringStream,

	LF = 10,
	CR = 13,
	HYPHEN = 45;

function doMultiPart( request, routine ) {
	if ( !request.contentType.match( /^multipart\/form\-data; boundary=(.*)/gi ) ) {
		throw new Error( "not multipart" );
	}

	// 状态表,当前处于匹配边界状态
	var S_CR = 0, S_BOUNDARY = 1, S_BOUNDARY_END2 = 2, S_CONTENT = 4, S_HEADER = 5, S_BOUNDARY_END = 6;
	var state = S_BOUNDARY;

	var expected;

	// 边界相关
	var boundaryStr = RegExp.$1, boundaryLength = boundaryStr.length + 2,
		boundary = new Buffer( boundaryLength ), boundIndex = 0,
		lookBehind = new Buffer( boundaryLength + 4 ), lookBehindIndex = 0;

	boundary.write( "--", 'ascii', 0 );
	boundary.write( boundaryStr, 'ascii', 2 );

	// 头相关
	var curHeader = "", headerCRLFCount = 0;

	// 当前字段和当前上下文
	var curField = null, curContext = null;

	request.on( "data", function ( postDataChunk ) {
		var buffStart = 0, buffEnd = 0, // buff的起始位置和结束位置
			remindLookBehind = lookBehindIndex === 0 ? null : lookBehind.slice( 0, lookBehindIndex ), // 遗留的,可能作为内容的部分
			i = 0, len = postDataChunk.length, ch;

		// 将buff中的内容添加到上下文(字符串或流)中
		function pushContent( buff, start, end ) {
			// 如果是文件,像流中写入内容
			if ( curField.filename ) {
				if ( curContext ) {
					request.pause();

					curContext.write( buff.slice( start, end ), function () {
						request.resume();
					} );
				}
			}
			// 否则是值,做字符串拼接操作
			else {
				curContext += buff.toString( routine.charset, start, end );
			}
		}

		// 处理内容
		function doContent( isEnd ) {
			// 第一个boundary
			if ( curField === null ) {
				curField = {};
				return;
			}

			// 如果当前上下文是空,说明是这个字段的第一次处理
			if ( curContext === null ) {
				curContext = curField.filename ? routine.onFile && routine.onFile( curField ) : "";
			}

			// 添加内容
			pushContent( postDataChunk, buffStart, buffEnd );

			// 如果是最后一块
			if ( isEnd ) {
				// 若是文件,结束流
				if ( curField.filename ) {
					curContext && curContext.end();
				}
				// 若是字段,回调
				else {
					routine.onField && routine.onField( curField, curContext );
				}
				boundIndex = lookBehindIndex = 0;
				curField = {};
				curContext = null;
			}
		}

		// 处理头
		function doHeader( isEnd ) {
			curHeader += postDataChunk.toString( "utf8", buffStart, i + 1 );
			if ( isEnd ) {
				var strm = StringStream( curHeader ), curKey = "", curValue = "";

				function savePair() {
					curField[curKey.toLowerCase()] = curValue;
					curKey = "";
					curValue = "";
				}

				function readLine() {
					var ch = strm.cur();
					// 处理空行
					if ( ch === "\r" ) {
						strm.eat();
						strm.eat();
					}
					else {
						// 读前半部分,即分号或\r\n之前
						while ( ( ch = strm.cur() ) !== ":" ) {
							curKey += ch;
							strm.eat();
						}
						strm.eat(); // :
						strm.eat(); // 空格
						while ( ( ch = strm.cur() ) !== "\r" && ch !== ";" ) {
							curValue += ch;
							strm.eat();
						}
						savePair();

						// 读后半部分
						while ( ch !== "\r" ) {
							strm.eat(); // ;
							strm.eat(); // 空格
							while ( ( ch = strm.cur() ) !== "=" ) {
								curKey += ch;
								strm.eat();
							}
							strm.eat(); // 等号
							while ( ( ch = strm.cur() ) !== "\r" && ch !== ";" ) {
								ch !== '"' && ( curValue += ch );
								strm.eat();
							}
							savePair();
						}
						strm.eat(); // \r
						strm.eat(); // \n
					}
				}

				while ( !strm.isEnd() ) {
					readLine();
				}
				curHeader = "";
			}
		}

		// 读边界
		function readBoundary( isMatch, nextState ) {
			// 如果匹配到了相匹配的字符,将它存放到lookBehind中,转到下一个状态,读下一个字符
			if ( isMatch ) {
				lookBehind[lookBehindIndex++] = ch;
				state = is.Number( nextState ) ? nextState : nextState();
				++i;
				return true;
			}
			// 否则,不读下一个字符,将当前字符,放回到S_CONTENT状态进行判断
			else {
				// 如果有遗留的boundary,添加到content中
				if ( remindLookBehind ) {
					pushContent( remindLookBehind, 0, remindLookBehind.length );
					remindLookBehind = null;
				}
				boundIndex = lookBehindIndex = 0;
				buffEnd = i;
				state = S_CONTENT;
			}
		}

		for ( ; i !== len; ) {
			ch = postDataChunk[i];

			switch ( state ) {
				// part的内容,读到CR的话,开始准备匹配边界
				case S_CONTENT:
					if ( ch === CR ) {
						lookBehind[lookBehindIndex++] = ch;
						state = S_CR;
					}
					else {
						buffEnd = i + 1;
					}
					++i;
					break;

				// 读到行首(CR),期待LF
				case S_CR:
					readBoundary( ch === LF, S_BOUNDARY );
					break;

				// 匹配边界中,如果边界全部匹配,跳转到S_BOUNDARY_END态
				case S_BOUNDARY:
					readBoundary( ch === boundary[boundIndex], function () {
						return ++boundIndex === boundaryLength ? S_BOUNDARY_END : S_BOUNDARY;
					} );
					break;

				// 读到结束,可能遇到\r\n和--两种情况
				case S_BOUNDARY_END:
					if ( readBoundary( ch === CR || ch === HYPHEN, S_BOUNDARY_END2 ) ) {
						expected = ch === CR ? LF : HYPHEN;
					}
					break;

				// 读到CR期待LF,读到-期待-,如果匹配,内容部分结束,开始一段新的buff
				case S_BOUNDARY_END2:
					if ( readBoundary( ch === expected, S_HEADER ) ) {
						doContent( true );
						buffStart = i;
					}
					break;

				// 读头,如果读到了连续的\r\n\r\n,头部读完,由于头部是纯文本,不考虑\r\r这种情况
				case S_HEADER:
					if ( ch === CR || ch === LF ) {
						if ( ++headerCRLFCount === 4 ) {
							doHeader( true );
							headerCRLFCount = 0;
							buffStart = i + 1;
							state = S_CONTENT;
						}
					}
					else {
						headerCRLFCount = 0;
					}
					++i;
					break;
			}
		}

		// 一个包结束,判断处于content状态还是header状态,处理余下的内容
		( state === S_HEADER ? doHeader : doContent )( false );
	} );

	request.on( "end", routine.onEnd );
}

module.exports = doMultiPart;