/**
 * Created by 白 on 2014/11/10.
 */

var enterAnimation = null;
firstpageStyle = null;
library( function () {
	var object = imports( "object" ),
		$ = imports( "element" ),
		pointer = imports( "pointer" ),
		array = imports( "array" ),
		ua = imports( "ua" ),
		css = imports( "css" ),
		async = imports( "async" ),
		URL = imports( "url" ),
		setup = null,
		args = URL( location.href ).arg,
		srcPath = "/src/",

		arg = URL( location.href ).arg,
		id = window.workId = parseInt( arg.id || "135291" );

	enterAnimation = imports( "../src/enter-animation" );

	window.virtualPath = "http://" + ( arg.server || "chuye.cloud7.com.cn" ) + "/";
	window.workDetailUrl = virtualPath + "Work/Detail/" + id;
	window.hotLink = function ( address ) {
		return URL.concatArg( location.href, {
			id : array.top( address.split( "/" ) )
		} );
	};


	window.Icon = function ( src ) {
		var info = localIconTable[src = src + ".png"],
			width = Math.round( info.width / 2 ),
			height = Math.round( info.height / 2 );

		var img = $( "img", {
			src : window.iconPath + src,
			css : {
				width : css.px( width ),
				height : css.px( height )
			},
			ps : {
				width : width,
				height : height
			}
		} );
		img.fullWidth = width * 2;
		img.fullHeight = height * 2;
		img.halfWidth = width;
		img.halfHeight = height;
		return img;
	};

	imports( "./debug-data" );
	imports( "../src/main" );

	window.iconPath = "/icon/";
	window.contentPath = "/content/";

	// 调试用console
	window.useBrowserConsole = function () {
		localStorage.setItem( "use-browser-console", "true" );
	};

	window.onerror = function ( e ) {
		if ( !ua.win32 ) {
			alert( e );
		}
	};

	if ( !localStorage.getItem( "use-browser-console" ) ) {
		var pre = $( "div", {
			css : {
				"pointer-events" : "none",
				position : "fixed",
				left : 0,
				top : 0,
				right : 0,
				"z-index" : "100000",
				background : "white",
				color : "#000000",
				"font-size" : "13px",
				"line-height" : "15px"
			}
		}, document.body );

		window.console = {
			log : function () {
				var text = "";
				for ( var i = 0; i !== arguments.length; ++i ) {
					i !== 0 && ( text += " " );
					text += arguments[i];
				}
				pre.innerHTML += text + "<br/>";
			},
			clear : function () {
				pre.innerHTML = "";
			}
		};
	}

	ua.win32 && css.insertRules( "::-webkit-scrollbar", {
		width : 0
	}, true );

	// 加载脚本
	function loadScript( src, onLoad ) {
		var script = document.createElement( "script" );
		onLoad && ( script.onload = function () {
			onLoad();
			delete script.onload;
		} );
		script.src = src;
		document.head.appendChild( script );
	}

	function DebugSystem( name, defaultValue ) {
		// 取出调试信息
		var debugInfo = localStorage.getItem( name ),
			toolbar = $( "table", {
				css : {
					position : "absolute",
					left : 0,
					width : "100%",
					top : 0,
					"z-index" : 10000
				}
			}, document.body ), // 构建工具条
			tr = $( "tr", toolbar ),
			optionCount = 0;

		debugInfo = debugInfo ? JSON.parse( debugInfo ) : defaultValue;

		pointer.onPointerDown( toolbar, function ( event ) {
			event.stopPropagation();
		} );

		return {
			info : function () {
				return debugInfo;
			},
			Option : function ( fieldName, optionInfo ) {
				var td = $( "td", {
						css : {
							"text-align" : "center"
						}
					}, tr ),
					select = $( "select", td );

				select.onchange = function () {
					debugInfo[fieldName] = select.value;
					localStorage.setItem( name, JSON.stringify( debugInfo ) );
					location.reload();
				};

				object.foreach( optionInfo, function ( name, value ) {
					var option = $( "option", {
						value : value,
						innerHTML : name
					}, select );

					if ( debugInfo[fieldName] === value + "" ) {
						option.selected = true;
					}
				} );

				++optionCount;

				// 设置单元格宽度
				array.foreach( tr.querySelectorAll( "td" ), function ( td ) {
					css( td, "width", 100 / optionCount + "%" );
				} );
			}
		};
	}

	function loadData( arg, callback ) {
		var dir = arg.dir;
		loadScript( URL.concatArg( "/server.js", {
			get : "listPath",
			path : "debug/" + dir + "/*.js",
			jsonp : "pathList"
		} ), function () {
			async.sequence( array.map( window.pathList, function ( path ) {
				return function ( callback ) {
					loadScript( path, function () {
						arg.doOut( window[arg.jsonp || "out"] );
						callback();
					} );
				};
			} ), callback );
		} );
	}

	function loadFirstPage( arg, callback ) {
		var pageData = {};

		loadData( {
			jsonp : "pageData",
			dir : "standard-page",
			doOut : function ( data ) {
				object.foreach( data, function ( name, data ) {
					pageData[name] = data;
				} );
			}
		}, function () {
			var plugins;

			window.pageData = pageData;

			switch ( arg.type ) {
				case "local":
					plugins = ["local.js"];
					break;
				case "release":
					plugins = ["release.js"];
					break;
			}

			// 加载全局变量
			async.concurrency( array.map( [{
				get : "avatar",
				jsonp : "avatarList"
			}, {
				get : "plugin",
				jsonp : "pluginList"
			}, {
				get : "icon",
				jsonp : "localIconTable"
			}], function ( arg ) {
				return function ( done ) {
					var script = $( "script", {
						src : URL.concatArg( "/server.js", arg ),
						onload : done
					}, document.head );
				};
			} ), function () {
				array.foreach( array.map( pluginList.css, function ( src ) {
					return srcPath + src;
				} ), function ( path ) {
					$( "link", {
						href : path,
						rel : "stylesheet"
					}, document.head );
				} );

				loadPlugins( array.map( plugins.concat( pluginList.js ), function ( src ) {
					return srcPath + src;
				} ), callback );
			} );
		} );
	}

	var sidebars = {};

	function Options( arg ) {
		arg = arg || {};

		var sidebar = $( "div.need-default", {
				css : {
					position : "absolute",
					"max-height" : "100%",
					bottom : 0,
					width : css.px( arg.width || 80 ),
					background : "rgba(0,0,0,0.4)",
					"overflow-y" : ua.win32 ? "auto" : "scroll",
					"overflow-scrolling" : "touch",
					"z-index" : 10000
				}
			}, document.body ),
			options = {},
			fontSize = arg.fontSize || 10,
			curSelected = null;

		function select( option ) {
			curSelected && css( curSelected, "color", "white" );
			css( sidebar.selected = curSelected = option, "color", "red" );
			sidebar.data = option.data;
			return option;
		}

		css( sidebar, arg.left ? "left" : "right", 0 );

		sidebars[arg.name] = sidebar;

		return object.insert( sidebar, {
			option : function ( title, data ) {
				var option = options[title] = $( "div", {
					css : {
						padding : "10px",
						color : "white",
						"font-size" : css.px( fontSize ),
						"line-height" : css.px( fontSize + 2 ),
						overflow : "hidden",
						cursor : "pointer"
					},
					innerHTML : title
				}, sidebar );
				option.data = data;
				onTap( option, function () {
					select( option );
					setArg( arg.name, title );
					setup && setup() === undefined && runFirstPage();
				} );
				return option;
			},
			select : function ( name ) {
				var option = select( options[name] || firstInMap( options ) );
				sidebar.scrollTop = option.offsetTop;
			}
		} );
	}

	function firstInMap( map ) {
		//noinspection LoopStatementThatDoesntLoopJS
		for ( var k in map ) {
			return map[k];
		}
	}

	function setArg( name, value ) {
		var obj = {};
		obj[name] = value;
		history.replaceState( null, "", URL( URL.concatArg( location.href, obj ) ) );
	}

	function start() {
		object.foreach( sidebars, function ( name, sidebar ) {
			sidebar.select( args[name] );
		} );
		setup && setup() === undefined && runFirstPage();
	}

	Object.defineProperty( exports, "setup", {
		set : function ( val ) {
			setup = val;
		},
		get : function () {
			return setup;
		}
	} );

	window.Custom = function ( arg ) {
		var pageMap = {},
			dataList = [],
			srcList = arg.image,
			infoList = arg.imageinfo || [];

		array.foreach( infoList, function ( info, i ) {
				var data = {
					url : srcList[i],
					imageinfo : info
				};

				function insert( i, data ) {
					return object.insert( pageMap[i] || ( pageMap[i] = {} ), data );
				}

				if ( info && info.mask ) {
					insert( info.mask, {
						mask : data
					} );
				}
				else if ( info && info.frame ) {
					insert( info.frame, {
						frame : data
					} );
				}
				else {
					dataList.push( insert( i, data ) );
				}
			}
		);

		return {
			label : arg.label || "custom-2",
			image : dataList,
			custom : arg.custom
		};
	};

	exports.themeNames = ["萌萌哒", "逗比", "小清新", "文艺", "大气", "历史", "简约", "精致"];
	exports.start = start;
	exports.loadData = loadData;
	exports.DebugSystem = DebugSystem;
	exports.loadFirstPage = loadFirstPage;
	exports.Options = Options;
} );