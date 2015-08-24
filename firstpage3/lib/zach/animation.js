/**
 * Created by 白 on 2014/8/5.
 */

library( function () {
	var math = imports( "math" ),
		Bezier = math.Bezier,

		array = imports( "array" ),
		object = imports( "object" ),

		LinkedList = imports( "linked-list" ),

		timeout = null,
		tasks = LinkedList(),

		Timing = {
			linear : Bezier( 1, 1, 1, 1, function ( t ) {
				return t;
			} ),
			ease : Bezier( 0.25, 0.1, 0.25, 1 ),
			easeIn : Bezier( 0.42, 0, 1, 1 ),
			easeOut : Bezier( 0, 0, .58, 1 ),
			easeInOut : Bezier( 0.42, 0, 0.58, 1 )
		};

	function fromTo( from, to, ratio ) {
		return from + ( to - from ) * ratio;
	}

	// 请求连续动画
	function requestFrame( task ) {
		var node = null;

		function start() {
			// 如果任务没有添加进链表,添加到链表中
			if ( node === null ) {
				node = tasks.insert( LinkedList.Node( task ), null );

				// 如果当前没有计时,开始计时
				if ( timeout === null ) {
					timeout = setTimeout( function frame() {
						var cur;
						if ( tasks.tail() !== null ) {
							timeout = setTimeout( frame, 1000 / 60 );
							for ( cur = tasks.head(); cur !== null; cur = cur.next ) {
								cur.value();
							}
						}
						else {
							timeout = null;
						}
					}, 1000 / 60 );
				}
			}
		}

		start();

		return {
			start : start,
			remove : function () {
				node && tasks.remove( node );
				node = null;
			}
		};
	}

	// 进度器
	function Progress( arg ) {
		var duration = ( arg.duration || 1 ) * 1000, // 持续时间,传入的是秒数,转换为毫秒
			timing = arg.timing || Timing.ease, // 缓动函数
			progress = -( arg.delay || 0 ) * 1000, // 动画进度
			lastTime = new Date(); // 上帧时间

		return {
			// 计算当前比例
			ratio : function () {
				var now = new Date();
				progress += now - lastTime; // 更新进度
				lastTime = now;

				return progress < 0 ? null : timing( progress >= duration ? 1 : progress / duration );
			},
			// 判断进度是否结束
			isEnd : function () {
				return progress >= duration;
			},
			// 快进到目标比例
			progress : function ( targetRatio ) {
				progress = targetRatio * duration;
				lastTime = new Date()
			}
		};
	}

	function requestFrames( arg ) {
		var progress = Progress( arg ),
			go = arg.onAnimate;

		function goEnd() {
			animateEvent.remove();
			arg.onAnimate( 1 );
			arg.onEnd && arg.onEnd();
		}

		go( 0 );
		var animateEvent = requestFrame( function () {
			go( progress.ratio() );

			if ( progress.isEnd() ) {
				goEnd();
			}
		} );

		return {
			remove : animateEvent.remove,
			progress : progress.progress,
			fastForward : goEnd
		};
	}

	exports.Bezier = Bezier;
	exports.Timing = Timing;
	exports.fromTo = fromTo;
	exports.requestFrame = requestFrame;
	exports.Progress = Progress;
	exports.requestFrames = requestFrames;
} );