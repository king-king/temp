/**
 * Created by 白 on 2015/1/21.
 */

library( function () {
	var object = imports( "object" ),
		array = imports( "array" ),
		extend = object.extend,
		exclude = object.exclude;

	// 将相对地址转换为绝对地址
	function toAbsolute( url ) {
		var a = document.createElement( 'a' );
		a.href = url;
		return a.href;
	}

	// 将对象转化问URI字符串
	function encodeObject( obj ) {
		var retVal = "", i = 0;
		object.foreach( obj || {}, function ( key, value ) {
			if ( value !== undefined ) {
				i++ && ( retVal += "&" );
				retVal += encodeURIComponent( key );
				retVal += '=';
				retVal += encodeURIComponent( value );
			}
		} );
		return retVal;
	}

	// 解析配对连接字符串,如name=tom&class=2&grade=3
	function parsePairString( str, split1, split2, doPair ) {
		array.foreach( str.split( split1 ), function ( searchPair ) {
			var keyValue = searchPair.split( split2 );
			doPair( keyValue[0], keyValue[1] );
		} );
	}

	// 为字符串提供url解析功能
	var regUrl = /(?:((?:[^:/]*):)\/\/)?([^:/?#]*)(?::([0-9]*))?(\/[^?#]*)?(\?[^#]*)?(#.*)?/;

	function URL( str ) {
		if ( regUrl.test( str ) ) {
			this.protocol = RegExp.$1;
			this.hostname = RegExp.$2;
			this.port = RegExp.$3;
			this.pathname = RegExp.$4;
			this.search = RegExp.$5;
			this.hash = RegExp.$6;
		}
	}

	//noinspection JSUnusedGlobalSymbols
	URL.prototype.inspect = URL.prototype.valueOf = URL.prototype.toString = URL.prototype.toJSON = function () {
		return this.href;
	};

	Object.defineProperties( URL.prototype, {
		href : {
			get : function () {
				return this.origin + this.pathname + this.search + this.hash;
			}
		},
		host : {
			get : function () {
				return this.hostname + ( this.port ? ":" + this.port : "" );
			}
		},
		origin : {
			get : function () {
				return this.protocol ? this.protocol + "//" + this.host : this.host;
			}
		},
		arg : {
			get : function () {
				var arg = {};
				parsePairString( this.search.substring( 1 ), "&", "=", function ( key, value ) {
					key !== "" && ( arg[key] = decodeURIComponent( value ) );
				} );
				return arg;
			}
		}
	} );

	function parse( str ) {
		return new URL( str );
	}

	function concatArg( url, arg ) {
		url = parse( url );
		var newSearch = encodeObject( extend( url.arg, arg ) );
		return url.origin + url.pathname + ( newSearch ? "?" : "" ) + newSearch + url.hash;
	}

	function removeArg( url, argNameList ) {
		url = parse( url );
		var newSearch = encodeObject( exclude( url.arg, argNameList ) );
		return url.origin + url.pathname + ( newSearch ? "?" : "" ) + newSearch + url.hash;
	}

	module.exports = parse;
	parse.toAbsolute = toAbsolute;
	parse.encodeObject = encodeObject;
	parse.concatArg = concatArg;
	parse.removeArg = removeArg;
} );