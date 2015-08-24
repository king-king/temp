/**
 * Created by 白 on 2015/1/14.
 */

var http = require( "http" ),
	httpZ = require( "./lib/zach/http" ),
	sizeOf = require( "image-size" ),
	zfs = require( "./lib/zach/fs" ),
	array = require( "./lib/zach/array" ),
	object = require( "./lib/zach/object" ),
	URL = require( "./lib/zach/url" ),
	async = require( "./lib/zach/async" ),
	Path = require( "path" );

http.createServer( function ( request, response ) {
	var url = URL( request.url ),
		arg = url.arg;

	function jsonp( data ) {
		var jsonp = arg.jsonp ? "window." + arg.jsonp + " = " : "";
		response.writeHead( 200, {
			"Content-Type" : jsonp ? "application/javascript" : "text/plain;charset=utf8"
		} );
		response.end( jsonp + JSON.stringify( data ) + ( arg.jsonp ? ";\n" : "" ) );
	}

	function resolvePath( path, callback ) {
		zfs.resolvePath( path, function ( err, contentList ) {
			if ( err ) {
				callback( err );
			}
			else {
				callback( null, array.map( contentList, function ( content ) {
					return content.path;
				} ) );
			}
		} );
	}

	var getProcedure = {
			listPath : function () {
				resolvePath( arg.path, function ( err, pathList ) {
					jsonp( array.map( pathList, function ( path ) {
						return "/" + path.replace( /\\/g, "/" );
					} ) );
				} );
			},
			avatar : function () {
				var retVal = [];

				resolvePath( "debug/content/avatar/*.jpg", function ( err, pathList ) {
					pathList.reverse();
					array.foreach( pathList, function ( path, i ) {
						retVal.push( {
							avatar : path.replace( /\\/g, "/" ),
							uid : i,
							name : Path.basename( path, ".jpg" )
						} )
					} );
					jsonp( retVal );
				} );
			},
			plugin : function () {
				var retVal = {};

				async.sequence( [
					function ( callback ) {
						zfs.readJSONFile( "application.json", function ( err, data ) {
							callback( data );
						} );
					},

					function ( callback, data ) {
						var tasks = [];

						object.foreach( data, function ( key, pathList ) {
							tasks.push( function ( done ) {
								var result = [];

								async.sequence( array.map( pathList, function ( path ) {
									return function ( done ) {
										resolvePath( Path.join( "src", path ), function ( err, pathList ) {
											array.foreach( pathList, function ( path ) {
												result.push( Path.relative( "src", path ).replace( /\\/g, "/" ) );
											} );
											done();
										} );
									};
								} ), done );

								retVal[key] = result;
							} );
						} );

						async.concurrency( tasks, callback );
					},

					function () {
						jsonp( retVal );
					}
				] );
			},
			icon : function () {
				var retVal = {};

				zfs.listDir( "icon", function ( err, contentList ) {
					async.concurrency( array.map( contentList, function ( content ) {
						var path = content.path;
						return function ( done ) {
							sizeOf( path, function ( err, dimensions ) {
								retVal[Path.relative( "icon", path ).replace( /\\/gi, "/" )] = dimensions;
								done();
							} );
						};
					} ), function () {
						jsonp( retVal );
					} );
				} );

				resolvePath( "icon/*.png", function ( err, pathList ) {

				} );
			},
			marshall : function () {
				zfs.readJSONFile( "ignore/marshall.json", function ( err, data ) {
					jsonp( data || {} );
				}, true );
			}
		},
		postProcedure = {
			saveMarshall : function ( data ) {
				zfs.writeJSONFile( "ignore/marshall.json", data, function () {
					jsonp( "" );
				}, 4 );
			}
		};

	if ( request.method.toLowerCase() === "post" ) {
		httpZ.receiveData( request, function ( err, buffer ) {
			httpZ.parseJSON( buffer, function ( err, data ) {
				postProcedure[arg["post"]]( data );
			} );
		} );
	}
	else {
		getProcedure[arg["get"]]();
	}
} ).listen( process.env.PORT );