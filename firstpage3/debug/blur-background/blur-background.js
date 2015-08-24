/**
 * Created by 白 on 2015/5/4.
 */

main( function () {
	var array = imports( "array" ),
		object = imports( "object" ),
		widget = imports( "../widget" ),
		css = imports( "css" ),
		async = imports( "async" ),
		blur = imports( "filter-blur-stack" ),
		imageViewer = imports( "image-viewer" ),

		optionColumn = document.querySelector( "#option-column" ),
		phoneFrame = document.querySelector( ".phone-frame" );

	var phone = widget.setPhoneSize( 320, 568, phoneFrame );

	function make() {
		setTimeout( function () {
			var pageData = pageSelect.data,
				imageInfo = pageData.imageInfo,
				background = document.createElement( "canvas" ),
				gc = background.getContext( "2d" ),
				dir = pageData.label,
				images = [];

			function src( index, postfix ) {
				return "content/" + dir + "/" + index + "." + postfix;
			}

			background.width = 320;
			background.height = 568;

			// 加载图片
			async.concurrency( array.map( pageData.image, function ( postfix, i ) {
				return function ( done ) {
					var img = new Image();
					images.push( img );
					img.onload = done;
					img.src = src( i + 1, postfix );
				};
			} ), function () {
				phoneFrame.innerHTML = "";
				phoneFrame.appendChild( background );
				array.foreach( imageInfo, function ( info, i ) {
					var img = images[i];
					phone.layImage( img, info );

					if ( info.background ) {
						imageViewer.drawImageLayout( gc, imageViewer.layImageByFrame( img, {
							width : 320,
							height : 568,
							size : imageViewer.Size.cover,
							align : [0.5, 0.5]
						} ) );

						gc.putImageData( blur( gc.getImageData( 0, 0, 320, 568 ), blurRadiusBar.data ), 0, 0 );
					}
				} );
			} );
		}, 0 );
	}

	var pageSelect = widget.Select( {
		title : "页",
		parent : optionColumn,
		options : {
			1 : {
				label : 1,
				image : ["jpg", "png"],
				imageInfo : [{
					x : 0,
					alignX : 0.5,
					y : 198 / 2,
					background : true,
					border : {
						radius : 298 / 4,
						width : 2,
						color : "white"
					}
				}, {
					x : 0,
					alignX : 0.5,
					y : 657 / 2
				}]
			}
		},
		onSelect : make
	} );

	var blurRadiusBar = widget.ProgressBar( {
		title : "模糊程度",
		parent : optionColumn,
		start : 1,
		value : 50,
		end : 180,
		onChange : make
	} );
} );