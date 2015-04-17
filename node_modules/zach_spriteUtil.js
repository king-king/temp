/**
 * Created by Json on 2014/12/4.
 */
function loopArray( data, func ) {
	for ( var i = 0; i < data.length; i++ ) {
		func( data[i], i );
	}
}

function loop( count, func ) {
	for ( var i = 0; i < count; i++ ) {
		func( i );
	}
}

var https = require( "https" );
var fs = require( "fs" );
var options = require( "url" ).parse( "https://api.tinypng.com/shrink" );
options.method = "POST";
var compress = function ( obj, callback ) {
	try {
		fs.statSync( obj.input );
	}
	catch ( e ) {
		callback && callback( {
			text : obj.input + ":不存在该文件"
		} );
		return;
	}
	if ( !obj.key ) {
		callback && callback( {text : "缺少key"} );
	}
	else {
		var input = fs.createReadStream( obj.input );
		options.auth = "api:" + obj.key;
		var request = https.request( options, function ( response ) {
			var responseString = '';
			var resultObject;
			response.on( 'data', function ( data ) {
				responseString += data;
			} );
			response.on( 'end', function () {
				resultObject = JSON.parse( responseString );
				if ( response.statusCode === 201 ) {
					callback && callback( null, {
						ratio : resultObject.output.ratio,
						rawSize : resultObject.input.size,
						size : resultObject.output.size,
						url : response.headers.location
					} );
				}
				else {
					callback && callback( resultObject );
				}
			} );
		} );
		request.on( "error", function ( err ) {
			callback && callback( err );
		} );
		input.pipe( request );
	}
};

var util = {
	loopArray : loopArray,
	loop : loop,
	compress : compress
};
exports.util = util;