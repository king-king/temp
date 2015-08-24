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
		gblur = imports( "../../src/lib/blur" ),

		optionColumn = document.querySelector( "#option-column" ),
		phoneFrame = document.querySelector( ".phone-frame" );

	widget.setPhoneSize( 320, 504 );

	function make() {
		var pageData = pageSelect.data,
			imageInfo = pageData.imageInfo,
			background = document.createElement( "canvas" ),
			gc = background.getContext( "2d" ),
			dir = pageData.label,
			images = [];

		background.width = 320;
		background.height = 504;

		function src( index, postfix ) {
			return "content/" + dir + "/" + index + "." + postfix;
		}

		// 加载图片
		async.concurrency( array.map( [src( 0, pageData.bg || "jpg" )].concat( array.map( array.range( imageInfo.length ), function ( i ) {
			return src( i + 1, "png" );
		} ) ), function ( src ) {
			var img = new Image();
			images.push( img );
			return function ( done ) {
				img.onload = done;
				img.src = src;
			};
		} ), function () {
			// 清空phone
			phoneFrame.innerHTML = "";

			// 绘制背景
			phoneFrame.appendChild( background );
			gc.drawImage( images[0], 0, 0, 320, 504 );

			array.foreach( imageInfo, function ( info, i ) {
				var img = phoneFrame.appendChild( images[i + 1] ),
					width = img.naturalWidth / 2, // 图片宽
					height = img.naturalHeight / 2, // 图片高
					x = info.alignX ? ( 320 - width ) * info.alignX : info.x, // 图片x
					y = info.alignY ? ( 504 - height ) * info.alignY : info.y, // 图片y
					blurSize = blurSizeBar.value << 0, // 模糊相对于图片的尺寸
					blurX = x - blurSize, blurY = y - blurSize, // 模糊x和y
					blurWidth = width + blurSize * 2, blurHeight = height + blurSize * 2; // 模糊的宽和高

				// 摆放图片
				css( img, {
					position : "absolute",
					width : css.px( width ),
					left : css.px( x ),
					top : css.px( y )
				} );

				// 设置模糊
				if ( gradientBlurCheck.checkedList.length !== 0 ) {
					gc.drawImage( gblur.blurRectGradient( gc, blurRadiusBar.value, blurSizeBar.value, blurX, blurY, blurWidth, blurHeight ), blurX, blurY );
				}
				else {
					gc.putImageData( blur( gc.getImageData( blurX, blurY, blurWidth, blurHeight ), blurRadiusBar.value ), blurX, blurY );
				}
			} );
		} );

	}

	var pageSelect = widget.Select( {
		title : "页",
		parent : optionColumn,
		options : {
			1 : {
				label : 1,
				imageInfo : [{
					x : 0,
					alignX : 0.5,
					y : 709 / 2
				}]
			},
			2 : {
				label : 2,
				bg : "png",
				imageInfo : [{
					x : 0,
					alignX : 0.5,
					y : 200 / 2
				}, {
					x : 0,
					alignX : 0.5,
					y : 325 / 2
				}]
			},
			3 : {
				label : 3,
				bg : "png",
				imageInfo : [{
					x : 0,
					alignX : 0.5,
					y : 200 / 2
				}, {
					x : 0,
					alignX : 0.5,
					y : 325 / 2
				}]
			},
			4 : {
				label : 4,
				bg : "png",
				imageInfo : [{
					x : 0,
					alignX : 0.5,
					y : 200 / 2
				}, {
					x : 0,
					alignX : 0.5,
					y : 325 / 2
				}]
			}
		}
	} );
	pageSelect.onSelect( make );

	var blurRadiusBar = widget.ProgressBar( {
		title : "模糊程度",
		parent : optionColumn,
		start : 1,
		value : 10,
		end : 180,
		onChange : make
	} );
	blurRadiusBar.onChange( make );

	var blurSizeBar = widget.ProgressBar( {
		title : "模糊尺寸",
		parent : optionColumn,
		start : 0,
		value : 5,
		end : 30,
		ratio : 10
	} );
	blurSizeBar.onChange( make );

	var gradientBlurCheck = widget.Check( {
		title : "边缘模糊",
		parent : optionColumn,
		options : {
			"开启" : "isGradient"
		}
	} );
	gradientBlurCheck.onCheck( make );

	make();
} );