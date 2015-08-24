/**
 * Created by Json on 2015/4/14.
 */
!function () {
	window.out = {
		"多图07" : {
			label : "MutipleImage07",
			image : (function () {
				var imgs = [];
				for ( var i = 0; i < 8; i++ ) {
					imgs.push( "content/image/mi07/head" + i + ".jpg" );
				}
				return imgs;
			})()
		},
		"全景图01" : {
			label : "Panorama01",
			image : debugImageList( "pan01", ["jpg", "jpg", "png"] )
		},
		"图文6" : {
			label : "ImageText06",
			image : [imgLib.Hydrangeas],
			text : [
				"【行程】↵全程10天2280Km：2昆明-2大理-2双廊-2丽江-2泸沽湖",
				"【伙伴】↵人数:昆明4人、大理6人，双廊6人、丽江6人、泸沽湖4人",
				"【费用】↵提费用心疼：全程10天云南吃住共计约2500左右"
			]
		}
	}
}();