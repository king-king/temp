/**
 * Created by 白 on 13-11-5.
 */

require( "./node.js" );
var http = require( "http" ),
	https = require( "https" ),
	url = require( "url" ),
	array = require( "./array" ),
	object = require( "./object" ),
	URL = require( "./url" );

// 做出响应
function respond( response, arg ) {
	response.writeHead( arg.code, arg.header );
	response.end( arg.data );
}

// 获取post的data
function receiveData( receiver, callback ) {
	var chunks = [], size = 0;
	receiver.on( "data", function ( postDataChunk ) {
		chunks.push( postDataChunk );
		size += postDataChunk.length;
	} );
	receiver.on( "end", function () {
		callback && callback( null, Buffer.concat( chunks, size ) );
	} );
}

// 获取json
function parseJSON( buff, callback ) {
	var error = null;

	try {
		buff = JSON.parse( buff.toString( "utf8" ) || '""' );
	}
	catch ( e ) {
		error = e;
	}

	callback && callback( error, error ? undefined : buff );
}

// 允许跨域
function allowCORS( response ) {
	response.setHeader( "Access-Control-Allow-Origin", "*" );
}

// 创建一个服务器,带端口号
function createServer( arg ) {
	var server = http.createServer( function ( request, response ) {
		arg.server( request, response );
	} );

	// 监听端口
	object.foreach( arg.listen, function ( host, port ) {
		server.listen( port, host );
		console.log( "Create server on " + ( host === "" ? "*" : host ) + ":" + port );
	} );
}

// 发送http请求
function request( arg, callback ) {
	//noinspection JSUnresolvedVariable
	var url = URL( arg.url ),
		contentLength = arg.data ? arg.data.length : undefined,
		headers = arg.headers || {},
		req = ( url.protocol.match( /https/gi ) ? https.request : http.request )( {
			method : arg.method || "GET",
			hostname : url.hostname,
			port : parseInt( url.port ),
			path : url.pathname + url.search,
			headers : object.extend( headers, {
				"Content-Length" : contentLength
			} )
		}, function ( response ) {
			receiveData( response, function ( err, buff ) {
				response.data = buff;
				callback && callback( null, response );
			} );
		} );

	req.on( "error", function ( error ) {
		callback && callback( error );
	} );

	arg.data && req.write( arg.data );
	req.end();

	return req;
}

exports.request = request;
exports.respond = respond;
exports.createServer = createServer;
exports.receiveData = receiveData;
exports.parseJSON = parseJSON;
exports.allowCORS = allowCORS;