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
		random = imports( "random" ),
		Layout = imports( "../../src/layout" ),
		widget = imports( "../widget" ),
		$ = imports( "element" ),
		Select = widget.Select,

		fp = null,
		modeSelect = null,
		pageSelect = null,

		noOrderTimeline = null,
		imageTimeline = null,
		textTimeline = null,
		imageAnimationSelect = null,
		textAnimationSelect = null;

	widget.setPhoneSize( 320, 568 );

	function Timeline( name, parent ) {
		var duration = widget.ProgressBar( {
				title : name + "持续",
				start : 4 * 2,
				end : 20 * 2,
				value : 10 * 2,
				handler : function ( value ) {
					return value / 2 / 10;
				},
				ratio : 4,
				changeOnUp : true,
				parent : parent
			} ),
			delay = widget.ProgressBar( {
				start : 0,
				end : 10 * 2,
				value : 4 * 2,
				handler : function ( value ) {
					return value / 2 / 10;
				},
				ratio : 6,
				changeOnUp : true,
				parent : parent
			} );

		duration.onChange( preview );
		delay.onChange( preview );

		return {
			result : function () {
				return {
					duration : duration.value,
					delay : delay.value
				};
			},
			disable : function ( val ) {
				delay.disable( val );
				duration.disable( val );
			}
		};
	}

	function preview() {
		if ( imageAnimationSelect.data && textAnimationSelect.data ) {
			var noOrder = true;

			if ( modeSelect.data === "noOrder" ) {
				textTimeline.disable( true );
				imageTimeline.disable( true );
				noOrderTimeline.disable( false );
			}
			else {
				noOrder = false;
				textTimeline.disable( false );
				imageTimeline.disable( false );
				noOrderTimeline.disable( true );
			}

			fp.run( {
				pageData : pageSelect.data,
				animationGroup : function ( layout ) {
					var applyEnter = layout.applyEnter || {},
						enterComponentTable = {
							text : [],
							image : [],
							multiImage : []
						},
						last = 0;

					// 提取需要动画的元素,并根据类型计数
					Layout.loopComponent( layout, function ( component ) {
						var applyEnter = component.applyEnter || {},
							type = applyEnter.type;

						if ( type ) {
							enterComponentTable[type] = enterComponentTable[type] || [];
							enterComponentTable[type].push( component );
						}
					} );

					// 分配动画
					array.foreach( [[enterComponentTable.image, parseMarshall( imageAnimationSelect.data )], [enterComponentTable.text, parseMarshall( textAnimationSelect.data )]], function ( arg ) {
						array.foreach( arg[0], function ( comp ) {
							comp.enter = random.select( arg[1] );
						} );
					} );

					function applySpeed( components, arg ) {
						var lastEnter = null,
							duration = arg.duration,
							delay = arg.delay;

						array.foreach( components, function ( comp, i ) {
							lastEnter = comp.enter = object.extend( comp.enter, {
								duration : duration + ( comp.enter.durationCorrect || 0 ),
								delay : delay * duration * i + last
							} );
						} );
						last = lastEnter ? lastEnter.duration + lastEnter.delay : last;
					}

					// 有序
					if ( noOrder ) {
						applySpeed( random.arrange( enterComponentTable.text.concat( enterComponentTable.image ) ), noOrderTimeline.result() );
					}
					// 无序
					else {
						if ( applyEnter.first === "text" ) {
							applySpeed( enterComponentTable.text, textTimeline.result() );
							applySpeed( enterComponentTable.image, imageTimeline.result() );
						}
						else {
							applySpeed( enterComponentTable.image, imageTimeline.result() );
							applySpeed( enterComponentTable.text, textTimeline.result() );
						}
					}
				}
			} );
		}
	}

	function parseMarshall( list ) {
		return array.map( list, function ( name ) {
			return fp.enterAnimationList[name];
		} );
	}

	function loadMarshall( done ) {
		ajax( {
			url : "/server.js?get=marshall"
		}, function ( err, xhr ) {
			var marshallData = JSON.parse( xhr.responseText );

			$.remove( imageAnimationSelect );
			$.remove( textAnimationSelect );

			imageAnimationSelect = Select( {
				title : "图动画组合",
				options : marshallData,
				parent : document.querySelector( "#image-column" )
			} );

			imageAnimationSelect.onSelect( preview );

			textAnimationSelect = Select( {
				title : "字动画组合",
				options : marshallData,
				parent : document.querySelector( "#text-column" )
			} );

			textAnimationSelect.onSelect( preview );

			done();
		} );
	}

	async.concurrency( [
		function ( done ) {
			imageTimeline = Timeline( "图", document.querySelector( "#image-column" ) );
			textTimeline = Timeline( "字", document.querySelector( "#text-column" ) );

			window.onPhoneLoad = function ( result ) {
				fp = result;

				pageSelect = Select( {
					title : "页",
					options : fp.pageList,
					parent : document.querySelector( "#page-column" )
				} );

				modeSelect = Select( {
					title : "模式",
					options : {
						"无序" : "noOrder",
						"有序" : "inOrder"
					},
					parent : document.querySelector( "#page-column" )
				} );

				noOrderTimeline = Timeline( "无序", document.querySelector( "#page-column" ) );

				pageSelect.onSelect( preview );
				modeSelect.onSelect( preview );

				done();
			};
		},
		loadMarshall
	], function () {
		var marshallPanel = $( "div.panel", document.querySelector( "#page-column" ) ),
			marshallButton = $( "button.big", "编辑动画分组", marshallPanel ),
			marshallWindow = null, marshallIframe = null;

		$.bind( marshallButton, "click", function () {
			if ( !marshallWindow ) {
				marshallWindow = $( "div.window", document.body );
				window.onMarshallDone = function ( callback ) {
					loadMarshall( function () {
						marshallWindow.classList.add( "hidden" );
						callback && callback();
					} );
				};
				marshallIframe = $( "iframe", {
					src : "marshall.html"
				}, marshallWindow );
			}
			marshallWindow.classList.remove( "hidden" );
		} );

		preview();
	} );

	document.querySelector( "#phone-frame" ).src = "preview.html";
} );