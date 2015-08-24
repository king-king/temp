/**
 * Created by 白 on 13-11-5.
 * 自动的引用分析器和脚本加载器
 */

(function () {
	// 修剪src,剪掉多余的./
	function trimSrc( src ) {
		var retParts = [];
		src.split( "/" ).forEach( function ( part ) {
			if ( part !== "." ) {
				if ( part === ".." && retParts.length !== 0 && retParts[retParts.length - 1] !== ".." ) {
					retParts.pop();
				}
				else {
					retParts.push( part );
				}
			}
		} );
		return retParts.join( "/" );
	}

	// 将一个地址转换为绝对路径
	function toAbsURL( src ) {
		var a = document.createElement( 'a' );
		a.href = src;
		return a.href;
	}

	// 连接两个路径
	function join( path1, path2 ) {
		var parts1 = path1.split( "/" ), parts2 = path2.split( "/" );
		parts1.pop();
		return parts1.concat( parts2 ).join( "/" );
	}

	// 补全src,如果没有.js,添加.js
	function completeSrc( src ) {
		return /\.js$/.test( src ) ? src : src + ".js";
	}

	// 获取当前正在执行脚本的src,如果正在执行的是个内联脚本,返回""
	function currentScriptSrc() {
		var scripts = document.scripts;
		return scripts[scripts.length - 1].getAttribute( "src" ) || "";
	}

	// 加载脚本
	function loadScript( src, onLoad ) {
		var script = document.createElement( "script" );
		onLoad && ( script.onload = function () {
			onLoad();
			delete script.onload;
		} );
		script.src = src + ( navigator.platform !== "Win32" ? "?timestamp=" + new Date().getTime() : "" );
		document.head.appendChild( script );
	}

	var lib = {}, libFunc = {}, // 库和库函数
		requireList = {}, // require列表

		coreLibBaseURI = currentScriptSrc(), // 核心库的baseUri,它等同于当前脚本的路径
		curLibSrc, // 当前imports的脚本
		curLoadingModuleSrc, // 当前正在加载的模块地址
		curModuleFunc; // 当前正在解析的模块函数

	window.library = function ( func ) {
		// 存入库函数,并记录为当前正在解析的模块函数
		libFunc[(/\//.test( curLoadingModuleSrc ) ? toAbsURL( curLoadingModuleSrc ) : curLoadingModuleSrc).toLowerCase()] = curModuleFunc = func;
	};

	Object.defineProperty( window.module = {}, "exports", {
		set : function ( val ) {
			lib[curLibSrc] = val;
		}
	} );

	// 根据baseUri获取其他库
	function Imports( baseUri ) {
		return function ( libSrc ) {
			libSrc = completeSrc( libSrc );
			var path = "";
			if ( /\//.test( libSrc ) ) {
				path = join( baseUri, libSrc );
				libSrc = toAbsURL( path );
			}
			libSrc = libSrc.toLowerCase();

			// 如果有libName对应的包,直接返回这个包,否则进入创建流程,调用库函数,
			if ( lib[libSrc] === undefined ) {
				var oldImports = window.imports, oldExports = window.exports, oldLibSrc = curLibSrc;

				// 调用库函数,修改各个上下文
				//noinspection JSUnusedAssignment
				curLibSrc = libSrc;
				window.exports = lib[libSrc] = {};
				window.imports = Imports( path );
				libFunc[libSrc]();

				// 回复到上一个
				curLibSrc = oldLibSrc;
				window.imports = oldImports;
				window.exports = oldExports;

				// 删除库函数
				delete libFunc[libSrc];
			}
			return lib[libSrc];
		};
	}

	// 获取函数中的require
	function getRequires( func, done, baseUri ) {
		var code = func.toString(),
			requirePattern = /[^0-9A-Za-z]imports\(([^()]*)\)/g,
			regResult, moduleName, absUrl,
			result = [];

		// 分析代码中的引用
		while ( ( regResult = requirePattern.exec( code ) ) !== null ) {
			moduleName = completeSrc( JSON.parse( "[" + regResult[1] + "]" )[0] );
			moduleName = /\//.test( moduleName ) ? join( baseUri, moduleName ) : moduleName;
			absUrl = toAbsURL( moduleName );
			if ( requireList[absUrl] !== true ) {
				requireList[absUrl] = true;
				result.push( moduleName );
			}
		}

		// 按顺序加载script
		function load( index ) {
			var src = curLoadingModuleSrc = result[index];

			if ( src ) {
				loadScript( trimSrc( /\//.test( src ) ? src : join( coreLibBaseURI, src ) ), function () {
					getRequires( curModuleFunc, function () {
						load( index + 1 );
					}, src );
				} );
			}
			else {
				done && done();
			}
		}

		load( 0 );
	}

	window.main = function ( func ) {
		var mainSrc = currentScriptSrc();
		getRequires( func, function () {
			window.imports = Imports( mainSrc );
			func();
			delete window.main;
			delete window.imports;
		}, mainSrc );
	};

	window.loadPlugins = function ( plugins, onLoad ) {
		function load( index ) {
			var src = plugins[index];

			if ( src ) {
				window.plugin = function ( func ) {
					getRequires( func, function () {
						window.imports = Imports( src );
						func();
						delete window.imports;
						load( index + 1 );
					}, src );
				};
				loadScript( src );
			}
			else {
				onLoad && onLoad();
				delete window.plugin;
			}
		}

		load( 0 );
	};
})();