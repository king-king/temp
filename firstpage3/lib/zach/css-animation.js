/**
 * Created by 白 on 2015/4/28.
 */


library( function () {
	var object = imports( "object" ),
		css = imports( "css" ),
		$ = imports( "element" ),
		string = imports( "string" ),
		array = imports( "array" ),
		func = imports( "function" ),
		ua = imports( "ua" ),
		progressTable = {},
		keyframeCount = 0,
		prefix = null;

	// 测试animation的前缀
	function testPrefix() {
		if ( prefix === null ) {
			prefix = css.testPrefix( "animation", "a 1s" );
		}
	}

	// 结束事件
	function OnEnd( nameList ) {
		return function ( el, response ) {
			testPrefix();
			return $.bind( el, prefix ? string.camelcaseJoin( [prefix.replace( /-/g, "" )].concat( nameList ) ) : nameList.join( "" ), function ( event ) {
				event && event.stopPropagation();
				response && response();
			} );
		}
	}

	var onAnimationEnd = OnEnd( ["animation", "end"] ),
		onTransitionEnd = OnEnd( ["transition", "end"] );

	function OnEndAdvanced( onEnd ) {
		return function ( el, response, duration, getStart ) {
			duration = duration * 1000;

			var endHandle = onEnd( el, function () {
				endHandle.remove();
				var curDuration = new Date() - getStart();

				func.callWith( function ( remove ) {
					// 处理ios跳帧问题
					if ( ua.ios && curDuration < duration ) {
						setTimeout( function () {
							remove();
						}, duration * 1.05 - curDuration );
					}
					else {
						remove();
					}
				}, response );
			} );

			return endHandle;
		};
	}

	var onAnimationEndAdvanced = OnEndAdvanced( onAnimationEnd ),
		onTransitionEndAdvanced = OnEndAdvanced( onTransitionEnd );

	// 生成关键帧
	function Keyframes( progress ) {
		var progressString = "";

		testPrefix();

		object.foreach( progress, function ( ratio, style ) {
			progressString += ( parseFloat( ratio ) << 0 ) + "% {" + css.ruleString( style ) + "}";
		} );

		var progressNode = progressTable[progressString], id;
		if ( !progressNode ) {
			progressNode = progressTable[progressString] = {
				count : 0,
				id : id = "keyframe" + keyframeCount++,
				handle : css.insertRules( "@" + prefix + "keyframes " + id, progressString )
			};
		}

		++progressNode.count;

		return {
			id : progressNode.id,
			remove : function () {
				if ( --progressNode.count === 0 ) {
					progressNode.handle.remove();
					delete progressTable[progressString];
				}
			}
		};
	}

	function animation( animationArg, parsed ) {
		parsed = parsed || {};

		var duration = null, delay = null, fillMode = "both",
			end, handle = null, args = [];

		// 解析动画数组
		array.foreach( animationArg, function ( arg ) {
			if ( object.is.Object( arg ) ) {
				handle = Keyframes( arg );
				args.push( handle.id );
			}
			else if ( object.is.Number( arg ) ) {
				if ( duration === null ) {
					duration = arg;
				}
				else {
					delay = arg;
				}
				args.push( css.s( arg ) );
			}
			else {
				switch ( arg ) {
					case "forwards":
					case "backwards":
					case "both":
						fillMode = arg;
						break;
					default :
						args.push( arg );
						break;
				}
			}

			if ( arg === "infinite" ) {
				parsed.infinite = true;
			}
		} );

		args.push( fillMode );

		duration = duration || 1;
		delay = delay || 0;
		end = duration + delay;

		object.insert( parsed, {
			end : end,
			handle : handle
		} );

		return args.join( " " );
	}

	// 运行动画
	function runAnimation( list, callback, arg ) {
		var last = null, parsedList = [], infinite = false;
		arg = arg || {};

		func.callWith( function ( parseAnimationArg ) {
			object.is.Array( list[0] ) ? array.foreach( list, parseAnimationArg ) : parseAnimationArg( list );
		}, function ( animationArg ) {
			var el = animationArg[0],
				parsed = {
					el : el
				};

			css( el, "animation", animation( animationArg.slice( 1 ), parsed ) );
			css( el, "animation-play-state", "paused" );

			if ( !last || parsed.end > last.end ) {
				last = parsed;
			}

			if ( parsed.infinite ) {
				infinite = true;
			}

			parsedList.push( parsed );
		} );

		var start;
		setTimeout( function () {
			start = new Date();
			array.foreach( parsedList, function ( parsed ) {
				css( parsed.el, "animation-play-state", "running" );
			} );
		}, ua.ios ? 30 : 0 );

		if ( callback ) {
			var endHandle = onAnimationEndAdvanced( last.el, function () {
				array.foreach( parsedList, function ( parsed ) {
					if ( arg.removeKeyframes ) {
						parsed.handle && parsed.handle.remove();
					}

					css.remove( parsed.el, "animation" );
				} );
				callback && callback();
			}, last.end, function () {
				return start;
			} );

			return {
				fastForward : endHandle.func
			};
		}
	}

	exports.onAnimationEnd = onAnimationEnd;
	exports.onTransitionEnd = onTransitionEnd;
	exports.onAnimationEndAdvanced = onAnimationEndAdvanced;
	exports.onTransitionEndAdvanced = onTransitionEndAdvanced;
	exports.Keyframes = Keyframes;
	exports.animation = animation;
	exports.runAnimation = runAnimation;
} );