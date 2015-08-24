/**
 * Created by 白 on 2015/4/20.
 */

library( function () {
	var $ = imports( "element" ),
		array = imports( "array" ),
		css = imports( "css" ),
		object = imports( "object" ),
		math = imports( "math" ),
		pointer = imports( "pointer" ),
		async = imports( "async" ),
		Event = async.Event;

	function setPhoneSize( width, height, parent ) {
		css.insertRules( {
			".phone-frame" : {
				width : css.px( width ),
				height : css.px( height )
			}
		} );

		return {
			layImage : function ( img, info ) {
				var width = img.naturalWidth / 2, // 图片宽
					height = img.naturalHeight / 2, // 图片高
					x = info.alignX ? ( 320 - width ) * info.alignX : info.x, // 图片x
					y = info.alignY ? ( 504 - height ) * info.alignY : info.y, // 图片y
					border;

				parent.appendChild( img );

				// 摆放图片
				css( img, {
					position : "absolute",
					width : css.px( width ),
					left : css.px( x ),
					top : css.px( y )
				} );

				if ( border = info.border ) {
					css( img, {
						border : [css.px( border.width ), "solid", border.color].join( " " ),
						"border-radius" : css.px( border.radius )
					} );
				}

				return img;
			}
		};
	}

	function Panel( arg, className ) {
		var wrapper = $( "div.panel", [
				$( "div.head", [
					$( "span.title", arg.title ),
					$( "div.operations" )
				] )
			], arg.parent ),
			operations = wrapper.operations = wrapper.querySelector( ".operations" );

		wrapper.classList.add( className );

		return object.insert( wrapper, {
			addOperation : function ( name, onClick ) {
				var operation = $( "button.operation", name, operations );
				$.bind( operation, "click", onClick );
				return operation;
			},
			disable : function ( val ) {
				val ? wrapper.classList.add( "disable" ) : wrapper.classList.remove( "disable" );
			}
		} );
	}

	function Select( arg ) {
		var panel = Panel( arg, "select" ),
			options = $( "div.options", panel ),
			selected = null,
			selectEvent = Event();

		function select( option ) {
			if ( option ) {
				if ( selected ) {
					selected.classList.remove( "selected" );
				}
				selected = option;
				option.classList.add( "selected" );
				panel.data = option.data;
				panel.option = option;
				selectEvent.trig();
			}
		}

		function add( name, data, selectThis ) {
			var option = $( "div.option", {
				innerHTML : name
			}, options );
			option.title = name;
			option.data = data;
			$.bind( option, "click", function () {
				select( option );
			} );
			( selectThis || !selected ) && select( option );
		}

		object.foreach( arg.options, add );

		return object.insert( panel, {
			title : arg.title,
			select : select,
			addOption : add,
			onSelect : selectEvent.regist
		} );
	}

	function Check( arg ) {
		var panel = Panel( arg, "check" ),
			options = panel.options = $( "div.options", panel ),
			checkEvent = Event();

		function check( option ) {
			option.selected ? option.classList.remove( "selected" ) : option.classList.add( "selected" );
			option.selected = !option.selected;
		}

		object.foreach( arg.options, function ( name, data ) {
			var option = $( "div.option", [
				$( "<input type=checkbox>" ),
				$( "span", name )
			], options );
			option.data = data;
			$.bind( option, "click", function () {
				check( option );
				checkEvent.trig();
			} );
		} );

		Object.defineProperties( panel, {
			checkedList : {
				get : function () {
					return array.filter( options.children, function ( option ) {
						return option.querySelector( "input" ).checked;
					} );
				}
			}
		} );

		panel.onCheck = checkEvent.regist;
		return panel;
	}

	function ProgressBar( arg ) {
		var panel = Panel( arg, "progress-bar" ),
			start = arg.start,
			end = arg.end,
			length = end - start,
			ratio = arg.ratio || 1,

			barWrapper = $( "div.bar-wrapper", panel ),
			bar = $( "div", {
				css : {
					position : "relative",
					display : "inline-block",
					width : css.px( length * ratio + 21 ),
					height : "21px",
					background : "#CDCDCD"
				},
				children : [
					$( "div", {
						css : {
							position : "absolute",
							left : "10px",
							top : "10px",
							height : "1px",
							width : css.px( length * ratio + 1 ),
							background : "#666666"
						}
					} )
				]
			}, barWrapper ),
			block = $( "div", {
				css : {
					position : "absolute",
					width : "21px",
					height : "21px",
					top : 0,
					background : "#202020",
					cursor : "move"
				}
			}, bar ),
			oValue = $( "div", {
				css : {
					display : "inline-block",
					"vertical-align" : "top",
					"line-height" : "21px",
					"margin-left" : "8px"
				}
			}, barWrapper ),
			value = 0,

			changeEvent = Event();

		function setPos( targetValue ) {
			value = targetValue;
			targetValue = math.range( value, start, end ) << 0;
			oValue.innerHTML = panel.value = arg.handler ? arg.handler( targetValue ) : targetValue;
			css( block, {
				left : css.px( ( targetValue - start ) * ratio )
			} );
		}

		setPos( arg.value || arg.start );

		pointer.onPointerDown( block, function ( event ) {
			event.preventDefault();

			pointer.onMoveUp( {
				onMove : function ( event ) {
					setPos( value + event.dX / ratio );
					!arg.changeOnUp && changeEvent.trig();
				},
				onUp : function () {
					arg.changeOnUp && changeEvent.trig();
				}
			} );
		} );

		panel.onChange = changeEvent.regist;

		return panel;
	}

	exports.Panel = Panel;
	exports.Select = Select;
	exports.Check = Check;
	exports.ProgressBar = ProgressBar;
	exports.setPhoneSize = setPhoneSize;
} );