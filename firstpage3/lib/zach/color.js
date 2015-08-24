/**
 * Created by 白 on 2014/7/10.
 * 颜色相关的函数
 */

library( function () {
	var array = imports( "array" ),
		func = imports( "function" );

	function hslToRgb( hsl ) {
		function hue2rgb( p, q, t ) {
			if ( t < 0 ) t += 1;
			if ( t > 1 ) t -= 1;
			if ( t < 1 / 6 ) return p + (q - p) * 6 * t;
			if ( t < 1 / 2 ) return q;
			if ( t < 2 / 3 ) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}

		function fix( r ) {
			return Math.floor( r * 255 );
		}

		var h = hsl[0], s = hsl[1], l = hsl[2];
		var r, g, b;

		if ( s == 0 ) {
			r = g = b = l; // achromatic
		}
		else {
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb( p, q, h + 1 / 3 );
			g = hue2rgb( p, q, h );
			b = hue2rgb( p, q, h - 1 / 3 );
		}

		return [fix( r ), fix( g ), fix( b )];
	}

	function rgbToHsl( rgb ) {
		var r = rgb[0], g = rgb[1], b = rgb[2];
		r /= 255;
		g /= 255;
		b /= 255;
		var max = Math.max( r, g, b ), min = Math.min( r, g, b );
		var h, s, l = ( max + min ) / 2;

		if ( max == min ) {
			h = s = 0; // achromatic
		}
		else {
			var d = max - min;
			s = l > 0.5 ? d / ( 2 - max - min ) : d / ( max + min );
			switch ( max ) {
				case r:
					h = ( g - b ) / d + ( g < b ? 6 : 0 );
					break;
				case g:
					h = ( b - r ) / d + 2;
					break;
				case b:
					h = ( r - g ) / d + 4;
					break;
			}
			h /= 6;
		}

		return [h, s, l];
	}

	function parseColorStr( colorStr ) {
		var retVal = [];

		function doHex( colorStr ) {
			if ( colorStr.length === 3 ) {
				func.loop( 3, function ( i ) {
					var str = colorStr.charAt( i );
					retVal[i] = parseInt( str + str, 16 );
				} );
			}
			else if ( colorStr.length === 6 ) {
				func.loop( 3, function ( i ) {
					retVal[i] = parseInt( colorStr.substring( i * 2, i * 2 + 2 ), 16 );
				} );
			}
		}

		if ( colorStr.charAt( 0 ) === "#" ) {
			doHex( colorStr.substring( 1, 7 ) );
		}

		return retVal;
	}

	function genColorStr( rgb ) {
		var retVal = "#";

		function toBit2( str ) {
			if ( str.length === 2 ) {
				return str;
			}
			else {
				return "0" + str;
			}
		}

		array.foreach( rgb, function ( c ) {
			retVal += toBit2( c.toString( 16 ) );
		} );
		return retVal;
	}

	function invertColor( colorString ) {
		var rgb = parseColorStr( colorString );
		return genColorStr( [255 - rgb[0], 255 - rgb[1], 255 - rgb[2]] );
	}

	exports.hslToRgb = hslToRgb;
	exports.rgbToHsl = rgbToHsl;
	exports.parseColorStr = parseColorStr;
	exports.genColorStr = genColorStr;
	exports.invertColor = invertColor;
} );