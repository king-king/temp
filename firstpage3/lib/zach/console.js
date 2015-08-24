/**
 * Created by 白 on 2014/8/26.
 */

var ColorMap = {
	red : "31",
	green : "32",
	yellow : "33",
	blue : "34",
	purple : "35",
	cyan : "36"
};

function colorString( color, string ) {
	return "\033[" + ( ColorMap[color] || "39" ) + "m" + string + "\033[39m";
}

exports.colorString = colorString;