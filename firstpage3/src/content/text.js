/**
 * Created by 白 on 2014/10/13.
 * 文本相关的组件
 */

library( function () {
	var object = imports( "object" ),
		insert = object.insert,
		textViewer = imports( "text-viewer" ),
		css = imports( "css" ),
		$ = imports( "element" ),
		Img = imports( "../img" ),
		Font = textViewer.Font;

	// 测量
	function measure( func ) {
		var canvas = document.createElement( "canvas" );
		func( canvas.getContext( "2d" ) );
	}

	// 行文本
	function LineText( text, width, info ) {
		var fontSize = info.fontSize;

		function draw( gc, height ) {
			// 绘制
			gc.font = Font( info );
			gc.textBaseline = "middle";
			gc.fillStyle = info.color;
			gc.fillText( text, 0, height / 2 << 0 );
		}

		return {
			width : width,
			height : fontSize,
			element : function () {
				var canvas = Img.Canvas( width + 4, fontSize + 4 ),
					gc = canvas.context;
				gc.translate( 2, 0 );
				draw( gc, fontSize + 4 );

				return $( "div", [$( canvas, {
					css : {
						"margin-left" : "-2px",
						"margin-top" : "-2px"
					}
				} )] );
			},
			draw : function ( gc ) {
				draw( gc, fontSize );
			}
		};
	}

	// 标签,不指定宽度.文字多长,宽度就是多少
	Content.Label = Content( function ( text, info ) {
		text = text.toString();
		return LineText( text, textViewer.measureText( text, info ).width, info );
	} );

	// 行文本,需指定宽度,多出部分截取
	Content.LineText = Content( function ( text, info ) {
		text = text.toString();
		var width = info.width,
			drawText = "";

		measure( function ( gc ) {
			function getWidth( text ) {
				return gc.measureText( text ).width;
			}

			gc.font = Font( info );
			if ( info.overflow && getWidth( text ) > width ) {
				for ( var i = 0; i !== text.length; ++i ) {
					if ( getWidth( text.substring( 0, i + 1 ) + "…" ) > width ) {
						break;
					}
				}
				drawText = text.substring( 0, i ) + "…";
			}
			else {
				drawText = text;
			}
		} );

		return LineText( drawText, width, info );
	} );

	// 块文本
	Content.BlockText = Content( function ( text, info ) {
		text = text.toString();

		var textLayout = textViewer.layText( text, info.width, insert( info, {
			lineBreak : info.breakWord ? textViewer.LineBreak.breakAll : textViewer.LineBreak.normal,
			align : info.breakWord ? textViewer.Align.left : textViewer.Align.side
		} ) );

		return {
			width : info.width,
			height : textLayout.height,
			draw : function ( gc ) {
				textViewer.drawTextLayout( gc, textLayout );
			}
		};
	} );
} );