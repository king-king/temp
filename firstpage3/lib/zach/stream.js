/**
 * Created by Zuobai on 2014/11/22.
 */

library( function () {
	// 字符串流
	function StringStream( str ) {
		var i = 0, len = str.length;
		return {
			eat : function () {
				++i;
			},
			cur : function () {
				return str.charAt( i );
			},
			isEnd : function () {
				return i >= len;
			}
		}
	}

	// 将Reader接口封装为流接口
	function ReaderStream( reader ) {
		var current = reader.read();
		return {
			eat : function () {
				return current = reader.read();
			},
			cur : function () {
				return current;
			},
			isEnd : function () {
				return current === null;
			}
		};
	}

	exports.StringStream = StringStream;
	exports.ReaderStream = ReaderStream;
} );