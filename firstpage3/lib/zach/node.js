/**
 * Created by 白 on 2014/11/19.
 * library在node.js下的适配器
 */

var Path = require( "path" );
global.library = function ( func ) {
	var oldLimit = Error.stackTraceLimit,
		dummyObject = {},
		oldPrepareStackTrace = Error.prepareStackTrace,
		oldImports = global.imports,
		modulePath;

	Error.stackTraceLimit = 2;
	Error.prepareStackTrace = function ( dummyObject, v8StackTrace ) {
		return v8StackTrace;
	};
	Error.captureStackTrace( dummyObject );
	modulePath = ( dummyObject.stack )[1].getFileName();
	Error.prepareStackTrace = oldPrepareStackTrace;
	Error.stackTraceLimit = oldLimit;

	global.imports = function ( moduleName ) {
		return require( /\//.test( moduleName ) ? Path.join( Path.dirname( modulePath ), moduleName ) : "./" + moduleName );
	};
	func();
	global.imports = oldImports;
};