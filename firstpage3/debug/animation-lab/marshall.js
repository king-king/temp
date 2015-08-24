/**
 * Created by Zuobai on 2015/4/19.
 */

main( function () {
	var array = imports( "array" ),
		css = imports( "css" ),
		ajax = imports( "ajax" ),
		async = imports( "async" ),
		debug = imports( "../debug" ),
		object = imports( "object" ),
		widget = imports( "../widget" ),
		$ = imports( "element" ),
		Select = widget.Select,
		Check = widget.Check,

		curMarshallOption = null,
		marshallData = null,
		marshallSelect = null,
		animationCheck = null,
		fp = null;

	async.concurrency( [
		function ( done ) {
			window.onPhoneLoad = function ( result ) {
				fp = result;
				done();
			};
		},
		function ( done ) {
			ajax( {
				url : "/server.js?get=marshall"
			}, function ( err, xhr ) {
				marshallData = JSON.parse( xhr.responseText );
				done();
			} );
		}
	], function () {
		marshallSelect = Select( {
			title : "动画分组",
			options : marshallData,
			parent : document.querySelector( "#marshall-column" )
		} );

		marshallSelect.addOperation( "新建", function () {
			var name;
			if ( !( ( name = window.prompt( "名称", "动画分组" ) ) in marshallData ) ) {
				marshallSelect.addOption( name, null, true );
			}
			else {
				alert( "已有名为" + name + "的分组" );
			}
		} );

		marshallSelect.addOperation( "删除", function () {
			var toDeleted = curMarshallOption;
			marshallSelect.select( curMarshallOption.previousElementSibling || curMarshallOption.nextElementSibling );
			delete marshallData[toDeleted.title];
			$.remove( toDeleted );
		} );

		marshallSelect.addOperation( "保存", function () {
			document.documentElement.classList.add( "lock" );
			ajax( {
				url : "/server.js?post=saveMarshall",
				method : "post",
				data : JSON.stringify( marshallData )
			}, function () {
				if ( window.parent != window ) {
					window.parent.onMarshallDone( function () {
						document.documentElement.classList.remove( "lock" );
					} );
				}
				else {
					document.documentElement.classList.remove( "lock" );
				}
			} );
		} );

		function select() {
			curMarshallOption = marshallSelect.option;

			$.remove( animationCheck );

			animationCheck = Check( {
				title : "包含动画",
				options : fp.enterAnimationList,
				parent : document.querySelector( "#animation-column" )
			} );

			array.foreach( animationCheck.options.children, function ( animationOption ) {
				var caption = animationOption.querySelector( "span" ),
					input = animationOption.querySelector( "input" );

				if ( array.contains( marshallData[curMarshallOption.title] || [], function ( name ) {
						return caption.innerHTML === name;
					} ) ) {
					input.checked = true;
				}

				$.bind( input, "change", function () {
					marshallData[curMarshallOption.title] = array.map( animationCheck.checkedList, function ( option ) {
						return option.querySelector( "span" ).innerHTML;
					} );
				} );

				$.bind( caption, "click", function () {
					fp.run( animationOption.data );
				} )
			} );
		}

		marshallSelect.onSelect( select );
		select();
	} );

	widget.setPhoneSize( 320, 504 );

	document.querySelector( "#phone-frame" ).src = "../enter-animation.html";
} );