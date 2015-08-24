/**
 * Created by bai on 2015/4/7.
 */

!function () {
	var arg = {};

	decodeURIComponent( location.search ).replace( "?", "" ).split( "&" ).forEach( function ( searchPair ) {
		var keyValue = searchPair.split( "=" );
		arg[keyValue[0]] = keyValue[1];
	} );

	var id = window.workId = arg.id || "135291",
		server = arg.server || "chuyebeta.cloud7.com.cn",
		script, scriptCode;

	window.contentPath = arg.contentPath || "content/";
	window.virtualPath = "http://" + server + "/";
	window.workDetailUrl = virtualPath + "Work/Detail/" + id;
	window.hotLink = function ( address ) {
		//noinspection JSCheckFunctionSignatures
		return location.href.replace( id, address.replace( "/", "" ) );
	};
	window.firstpageVersion = 1;

	// console
	window.useBrowserConsole = function () {
		localStorage.setItem( "use-browser-console", "true" );
	};

	if ( !localStorage.getItem( "use-browser-console" ) ) {
		var pre = document.body.appendChild( document.createElement( "pre" ) );
		pre.setAttribute( "style", "pointer-events: none; position: fixed; left: 0px; top: 0px; z-index: 100000; color: rgb(0, 0, 0); font-size: 13px; line-height: 15px; background: white;" );

		window.console = {
			log : function () {
				var text = "";
				for ( var i = 0; i !== arguments.length; ++i ) {
					i !== 0 && ( text += " " );
					text += arguments[i];
				}
				pre.innerHTML += text + "\n";
			},
			clear : function () {
				pre.innerHTML = "";
			}
		};
	}

	window.onerror = function ( e ) {
		console.log( e );
	};

	// 列表模式
	if ( arg.list ) {
		console.log( "初页流" );
		var list = [123, 135291, 6557201, 1585736, 5207334, 2263643, 1598029, 2877685, 1456775];

		window.firstpage = {
			workList : list,
			switchWorkStart : function () {
			},
			switchWorkEnd : function () {
			},
			enterFullScreen : function () {
			},
			leaveFullScreen : function () {
			},
			switchFirst : function () {
				setTimeout( function () {
					firstpage.updateWorkList();
				}, 1000 );
			},
			switchLast : function () {
				setTimeout( function () {
					firstpage.updateWorkList( list = list.concat( [4622516] ) );
					firstpage.switchLast = function () {
						setTimeout( function () {
							firstpage.updateWorkList( list );
						} );
					};
				}, 1000 );
			}
		};
	}

	// 脚本加载
	try {
		if ( window.firstpageVersion ) {
			window.localResource = JSON.parse( localStorage.getItem( "resource" ) || JSON.stringify( {
					list : []
				} ) );
		}
	}
	catch ( e ) {
	}

	if ( !arg.debug && window.localResource && localResource.version === window.firstpageVersion && ( scriptCode = localStorage.getItem( "script" ) ) ) {
		( new Function( "return " + scriptCode ) )()();
		window.runFirstPage();
	}
	else {
		script = document.head.appendChild( document.createElement( "script" ) );
		script.onload = function () {
			window.runFirstPage();
			script.onload = null;
		};
		script.src = "content/" + ( arg.debug ? "firstpage.js" : "firstpage.min.js" );
	}
}();