/**
 * Created by 白 on 2015/4/15.
 */

!(function () {
	function deg( d ) {
		return d / 180 * Math.PI;
	}

	window.pageData = {
		qrcode : {
			label : "qrcode",
			image : debugImageList( "qrcode", ["jpg", "png", "png"] )
		},
		mi10 : {
			label : "MutipleImage10",
			image : debugImageList( "mi10", ["png", "png", "png", "jpg", "jpg"] )
		},
		cu01 : Custom( {
			custom : {
				type : "y",
				animationFirst : "image"
			},
			image : ["#FFFFFF"].concat( debugImageList( "cu01", ["png", "jpg", "png", "jpg", "jpg"] ) ),
			imageinfo : [null, {
				x : 234 / 2,
				y : 152 / 2,
				type : "text"
			}, {
				x : 235 / 2,
				y : 257 / 2,
				type : "text"
			}, {
				x : 160 / 2,
				y : 332 / 2,
				type : "text"
			}, {
				x : 16 / 2,
				y : 414 / 2,
				type : "image"
			}, {
				x : 328 / 2,
				y : 414 / 2,
				type : "image"
			}]
		} ),
		cu02 : Custom( {
			custom : {
				type : "y",
				animationFirst : "image"
			},
			image : debugImageList( "cu02", ["jpg", "png", "jpg", "png", "jpg", "png", "jpg", "png", "png"] ),
			imageinfo : [null, {
				x : 16 / 2,
				y : 84 / 2,
				rotate : deg( 4 ),
				frame : 2,
				width : 427 / 2,
				height : 541 / 2,
				type : "image"
			}, {
				x : 31 / 2,
				y : 98 / 2,
				rotate : deg( 4 ),
				type : "image"
			}, {
				x : 331 / 2,
				y : 470 / 2,
				rotate : deg( -6 ),
				frame : 4,
				width : 289 / 2,
				height : 361 / 2,
				type : "image"
			}, {
				x : 346 / 2,
				y : 484 / 2,
				rotate : deg( -6 ),
				type : "image"
			}, {
				x : 21 / 2,
				y : 687 / 2,
				rotate : deg( 4 ),
				frame : 6,
				width : 289 / 2,
				height : 361 / 2,
				type : "image"
			}, {
				x : 36 / 2,
				y : 701 / 2,
				rotate : deg( 4 ),
				type : "image"
			}, {
				x : 350 / 2,
				y : 926 / 2,
				type : "text"
			}, {
				x : 505 / 2,
				y : 157 / 2,
				type : "text"
			}]
		} ),
		cu03 : Custom( {
			custom : {
				type : "y",
				animationFirst : "image"
			},
			image : ["#FFFFFF"].concat( debugImageList( "cu03", ["jpg", "jpg", "jpg", "jpg", "png", "png"] ) ),
			imageinfo : [null, {
				x : 40 / 2,
				y : 104 / 2,
				type : "image"
			}, {
				x : 40 / 2,
				y : 354 / 2,
				type : "image"
			}, {
				x : 316 / 2,
				y : 104 / 2,
				type : "image"
			}, {
				x : 40 / 2,
				y : 828 / 2,
				type : "image"
			}, {
				x : 38 / 2,
				y : 710 / 2,
				type : "text"
			}, {
				x : 267 / 2,
				y : 706 / 2,
				type : "text"
			}]
		} ),
		cu04 : Custom( {
			custom : {
				animationFirst : "image"
			},
			image : ["#000000"].concat( debugImageList( "cu04", ["jpg", "png"] ) ),
			imageinfo : [null, {
				x : 109 / 2,
				y : 197 / 2,
				type : "image"
			}, {
				x : 103 / 2,
				y : 629 / 2,
				type : "text"
			}]
		} ),
		cu05 : Custom( {
			custom : {
				type : "y",
				animationFirst : "image"
			},
			image : ["#FFFFFF"].concat( debugImageList( "cu05", ["jpg", "jpg", "jpg", "png", "png", "png", "png"] ) ),
			imageinfo : [null, {
				x : -112 / 2,
				y : 634 / 2,
				borderWidth : 5,
				borderColor : "#FFFFFF",
				rotate : deg( 30 ),
				type : "image"
			}, {
				x : 232 / 2,
				y : 273 / 2,
				borderWidth : 5,
				borderColor : "#FFFFFF",
				rotate : deg( 30 ),
				type : "image"
			}, {
				x : -142 / 2,
				y : 114 / 2,
				borderWidth : 5,
				borderColor : "#FFFFFF",
				rotate : deg( 30 ),
				type : "image"
			}, {
				x : 335 / 2,
				y : 62 / 2,
				rotate : deg( 30 ),
				type : "text"
			}, {
				x : 416 / 2,
				y : 138 / 2,
				rotate : deg( 30 ),
				type : "text"
			}, {
				x : 167 / 2,
				y : 114 / 2,
				rotate : deg( 30 ),
				type : "text",
				enterTiming : "same"
			}, {
				x : 375 / 2,
				y : 894 / 2,
				rotate : deg( 30 ),
				type : "text"
			}]
		} ),
		cu06 : Custom( {
			custom : {
				type : "y",
				animationFirst : "image"
			},
			image : ["#FFFFFF"].concat( debugImageList( "cu06", ["jpg", "jpg", "jpg", "png", "png", "png", "png", "png"] ) ),
			imageinfo : [null, {
				x : 20 / 2,
				y : 20 / 2,
				type : "image"
			}, {
				x : 20 / 2,
				y : 496 / 2,
				type : "image"
			}, {
				x : 294 / 2,
				y : 588 / 2,
				type : "image"
			}, {
				mask : 1
			}, {
				mask : 2
			}, {
				mask : 3
			}, {
				x : 292 / 2,
				y : 966 / 2,
				type : "text"
			}, {
				x : 295 / 2,
				y : 1037 / 2,
				type : "text"
			}]
		} ),
		cu07 : Custom( {
			custom : {
				type : "y"
			},
			image : function () {
				var arr = debugImageList( "cu07", ["jpg", "png", "png", "png"] );
				arr.splice( 1, 0, "rgba(255,255,255,0.9)" );
				return arr;
			}(),
			imageinfo : [null, {
				x : 0,
				alignX : 0.5,
				width : 640 / 2,
				height : 232 / 2,
				y : 669 / 2
			}, {
				x : 0,
				alignX : 0.5,
				y : 704 / 2,
				type : "text"
			}, {
				x : 0,
				alignX : 0.5,
				y : 782 / 2,
				type : "text"
			}, {
				x : 0,
				alignX : 0.5,
				y : 845 / 2,
				type : "text"
			}]
		} ),
		cu08 : Custom( {
			custom : {
				type : "cover"
			},
			image : debugImageList( "cu08", ["jpg", "png", "png"] ),
			imageinfo : [null, {
				x : 0,
				y : 651 / 2,
				type : "text"
			}, {
				x : 152 / 2,
				y : 731 / 2,
				type : "text"
			}]
		} ),
		cu09 : Custom( {
			custom : {},
			image : debugImageList( "cu09", ["jpg", "png"] ),
			imageinfo : [null, {
				x : 514 / 2,
				y : 182 / 2,
				type : "text"
			}]
		} ),
		cu10 : Custom( {
			custom : {
				type : "cover"
			},
			image : debugImageList( "cu10", ["jpg", "png", "png", "png", "png"] ),
			imageinfo : [null, {
				x : 0,
				y : 0,
				width : 320,
				height : 568,
				type : "screen"
			}, {
				x : 489 / 2,
				y : 626 / 2,
				width : 129 / 2,
				type : "text"
			}, {
				x : 268 / 2,
				y : 733 / 2,
				width : 341 / 2,
				type : "text"
			}, {
				x : 280 / 2,
				y : 822 / 2,
				width : 330 / 2,
				type : "text"
			}]
		} )
	};
})();