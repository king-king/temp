/**
 * Created by 白 on 2015/2/25.
 * 封装经典异步需求
 */

library( function () {
	var array = imports( "array" ),
		object = imports( "object" ),
		func = imports( "function" ),
		LinkedList = imports( "linked-list" );

	// 空函数
	function empty() {
	}

	// 事件,使用regist注册任务,在trig时会触发
	function Event() {
		var events = LinkedList();

		return {
			trig : function () {
				for ( var cur = events.head(); cur !== null; cur = cur.next ) {
					cur.value && cur.value.apply( null, arguments );
				}
			},
			regist : function ( response ) {
				var node = events.insert( LinkedList.Node( response ), null );
				return {
					func : response,
					remove : function () {
						events.remove( node );
					}
				};
			}
		};
	}


	// 流程,当一个步骤完成时,回调下一个步骤
	function sequence( steps, callback ) {
		callback && steps.push( callback );
		var len = steps.length;

		func.recursion( function call( i, arg ) {
			var func = steps[i];
			if ( func ) {
				func.apply( null, i === len - 1 ? arg : [function () {
					call( i + 1, Array.prototype.slice.call( arguments, 0 ) );
				}].concat( arg ) );
			}
		}, 0, [] );
	}

	// 并发执行多个任务,在所有任务完成后回调
	function concurrency( tasks, callback ) {
		var count = tasks.length;
		count === 0 ? callback && callback() : array.foreach( tasks, function ( task ) {
			task( function () {
				--count === 0 && callback && callback();
			} );
		} );
	}

	// 等待者
	function Waiter( task ) {
		var completeEvent = Event();

		task( function () {
			completeEvent.trig();
			completeEvent = null;
		} );

		return {
			onComplete : function ( callback ) {
				if ( completeEvent ) {
					return completeEvent.regist( callback );
				}
				else {
					callback && callback();
					return {
						remove : function () {
						}
					};
				}
			}
		};
	}

	// 加载者,调用时加载,仅加载一次
	function Loader( loadFunc ) {
		var waiter;

		return {
			load : function ( callback ) {
				if ( !waiter ) {
					waiter = Waiter( loadFunc );
				}

				return waiter.onComplete( callback );
			}
		};
	}

	// 继续,用于组合异步流程
	// 当一个步骤错误时,流程错误,不继续,若没有错误,则继续
	function GoOn( onError ) {
		return function ( stepDone, doErr ) {
			return function ( err, result ) {
				if ( err ) {
					onError && onError( doErr ? doErr( err ) : err );
				}
				else {
					stepDone && stepDone( result );
				}
			};
		};
	}

	// 统一两种形态的异步回调
	function Callback( callbackArg ) {
		var error, success;

		if ( object.is.Function( callbackArg ) ) {
			success = function () {
				Array.prototype.unshift.call( arguments, null );
				callbackArg.apply( null, arguments );
			};
			error = callbackArg;
		}
		else {
			callbackArg = callbackArg || {};
			success = callbackArg.onSuccess || empty;
			error = callbackArg.onError || empty;
		}

		return object.insert( callbackArg, {
			success : success,
			error : error
		} );
	}

	// 日程
	function Schedule() {
		var task = null, start = false;

		return {
			prepare : function ( target ) {
				task = target;
				start && task();
			},
			start : function () {
				task && task();
				start = true;
			}
		};
	}

	// 多种触发,一次触发,解除所有
	function once( task, regist ) {
		var handles = regist( function () {
			task();
			array.foreach( handles, function ( handle ) {
				handle.remove();
			} );
		} );
	}

	// setTimeout的remove版
	function setTimeout( task, duration ) {
		var handle = window.setTimeout( task, duration );

		return {
			remove : function () {
				window.clearTimeout( handle );
			}
		};
	}

	// 轮询
	function polling( getter, callback, timeout ) {
		func.recursion( function wait() {
			if ( getter() ) {
				callback();
			}
			else {
				setTimeout( wait, timeout || 100 );
			}
		} );
	}

	exports.Event = Event;
	exports.concurrency = concurrency;
	exports.sequence = sequence;
	exports.Waiter = Waiter;
	exports.Loader = Loader;
	exports.GoOn = GoOn;
	exports.Callback = Callback;
	exports.Schedule = Schedule;
	exports.once = once;
	exports.setTimeout = setTimeout;
	exports.polling = polling;
} );