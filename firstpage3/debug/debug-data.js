/**
 * Created by 白 on 2015/4/7.
 */

library( function () {
	var array = imports( "array" ),
		func = imports( "function" ),
		object = imports( "object" );

	window.debugImage = function ( src ) {
		return "/debug/content/image/" + src;
	};

	window.debugImageList = function ( pageName, arg1, arg2 ) {
		if ( object.is.Array( arg1 ) ) {
			return array.map( arg1, function ( postfix, i ) {
				return debugImage( pageName + "/" + ( i + 1 ) + "." + postfix );
			} );
		}
		else {
			return array.collect( function ( push ) {
				func.loop( arg2, function ( i ) {
					push( debugImage( pageName + "/" + ( i + 1 ) + "." + arg1 ) );
				} );
			} );
		}
	};

	// 图片
	window.imgLib = {
		Koala : debugImage( "Koala.jpg" ),
		Desert : debugImage( "Desert.jpg" ),
		Chrysanthemum : debugImage( "Chrysanthemum.jpg" ),
		Hydrangeas : debugImage( "Hydrangeas.jpg" ),
		Jellyfish : debugImage( "Jellyfish.jpg" ),
		Lighthouse : debugImage( "Lighthouse.jpg" ),
		Tulips : debugImage( "Tulips.jpg" ),
		Penguins : debugImage( "Penguins.jpg" )
	};
} );