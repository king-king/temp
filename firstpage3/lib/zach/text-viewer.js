/**
 * Created by Zuobai on 2014/12/13.
 */

library( function () {
	var textUtil = imports( "text-util" ),
		section = imports( "section" ),
		string = imports( "string" ),
		List = imports( "linked-list" ),
		array = imports( "array" );

	var MeasureGc = function () {
		var gc;
		return function () {
			return gc ? gc : gc = document.createElement( "canvas" ).getContext( "2d" );
		};
	}();

	// 根据style对象生成一个font字符串
	function Font( style ) {
		style = style || {};
		return [style.fontStyle || "normal", style.fontVariant || "normal", style.fontWeight || "normal",
			( style.fontSize || 12 ) + "px", style.fontFamily || "sans-serif"].join( " " );
	}

	// 测量文字
	function measureText( text, style ) {
		var gc = MeasureGc();
		gc.font = Font( style );
		return gc.measureText( text );
	}

	// 根据样式和宽度摆放样式
	function layText( text, width, style ) {
		var gc = MeasureGc(),
			marginCount = 0, lineCount = 0,
			list = List(),
			align = style.align;

		gc.font = Font( style );

		// 计算每个字符的宽度
		string.foreach( text.replace( /\r/g, "" ), function ( ch ) {
			List.push( list, {
				character : ch,
				width : ch === "\n" ? 0 : gc.measureText( ch ).width
			} );

			if ( ch === "\n" ) {
				++marginCount;
			}
		} );

		// 断行,遍历断行的结果(区间链表),算对齐
		section.foreach( function ( value ) {
			array.foreach( style.lineBreak( list.head(), null, width, 0 ), value );
		}, function ( start, end ) {
			start && ( start.value.lineStart = true );
			align( start, end, width, 0 );
			++lineCount;
		} );

		list.style = style;
		list.width = width;
		list.height = lineCount * style.lineHeight + marginCount * ( style.margin || ( style.margin = 0 ) );
		return list;
	}

	// 绘制纯文字排版
	function drawTextLayout( gc, layout ) {
		var style = layout.style,
			lineHeight = style.lineHeight,
			margin = style.margin,
			y = -lineHeight,
			midY = lineHeight / 2 << 0;

		gc.font = Font( style );
		gc.fillStyle = style.color;
		gc.textBaseline = "middle";

		List.foreach( layout, function ( node ) {
			if ( node.lineStart ) {
				y += lineHeight;
			}
			if ( node.character === "\n" ) {
				y += margin;
			}

			gc.fillText( node.character, node.offsetX, y + midY );
		} );
	}

	exports.LineBreak = {
		breakAll : textUtil.buildAllBreakLines,
		normal : textUtil.buildWordBreakLines
	};

	exports.Align = {
		left : textUtil.alignLeftLine,
		side : function ( begin, end, width ) {
			( end && end.previous.value.character !== "\n" ? textUtil.alignSideLine : textUtil.alignLeftLine)( begin, end, width, 0 );
		}
	};

	exports.Font = Font;
	exports.measureText = measureText;
	exports.layText = layText;
	exports.drawTextLayout = drawTextLayout;
} );