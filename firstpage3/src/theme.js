/**
 * Created by 白 on 2015/3/13.
 * 主题
 * http://note.youdao.com/share/?id=673510078ce220f2c7fc38a715062a34&type=note
 */

library( function () {
	var object = imports( "object" ),
		z2d = imports( "2d" ),
		Layout = imports( "./layout" ),
		enterAnimation = imports( "./enter-animation" ),
		random = imports( "random" ),
		array = imports( "array" ); // 全局切换动画

	// 方向动画组
	function DirectionGroup( AnimationGen, isFly, directions ) {
		return array.map( directions || array.range( 4 ), function ( direction ) {
			var animation = AnimationGen( direction );
			isFly && ( animation.flyDirection = direction );
			return animation;
		} );
	}

	// 动画组
	function Group( group ) {
		var result = [];
		array.foreach( group, function ( group ) {
			result = result.concat( group );
		} );
		array.foreach( result, function ( enter ) {
			if ( Layout.isEmphasize( enter ) ) {
				result.isEmphasize = true;
			}
			if ( enter.scale ) {
				result.isScale = true;
			}
		} );
		return result;
	}

	// 入场动画组
	var sa = switchAnimations,
		ea = enterAnimation,
		bounce = Group( [DirectionGroup( ea.BounceFlying, true ), ea.bounceIn] ),
		swing = Group( [ea.swing] ),
		flipIn = Group( [ea.FlipIn( "x" ), ea.FlipIn( "y" )] ),
		shake = Group( [ea.shake, ea.wobble] ),
		fall = Group( [ea.fallDownAndShake] ),
		tada = Group( [ea.tada] ),
		rubberBand = Group( [ea.rubberBand] ),
		rotateIn = Group( [DirectionGroup( ea.RotateIn )] ),
		zoomIn = Group( [DirectionGroup( ea.ZoomIn, true )] ),
		lightSpeedIn = Group( [DirectionGroup( ea.LightSpeedIn, true )] ),
		wave = Group( DirectionGroup( ea.Wave, true, [1, 3] ) ),
		creep = Group( DirectionGroup( ea.Creep, true, [0, 2] ) ),
		circleRound = Group( [ea.circleRound] ),
		coin = Group( [ea.coin] ),
		emerge = Group( [DirectionGroup( ea.Emerge, true ), ea.fadeIn] ),
		overturn = Group( [ea.overturn] ),
		shrink = Group( [ea.shrink] ),
		scale = Group( [ea.scale] ),
		flyInto = Group( DirectionGroup( ea.FlyInto, true ) ),
		flyIntoX = Group( DirectionGroup( ea.FlyInto, true, [1, 3] ) ),
		roundFromFarAndNear = Group( [ea.roundFromFarAndNear] );

	// 获取速度
	function getSpeed( themeNumber ) {
		return {
			1 : [0.8, 0.1, 0.8, 0.1, 0.8, 0.1],
			2 : [0.7, 0.1, 0.7, 0.1, 0.7, 0.1],
			3 : [1.2, 0.3, 1.2, 0.1, 1.2, 0.3],
			4 : [1.4, 0.3, 1.4, 0.1, 1.4, 0.3],
			5 : [0.8, 0.3, 0.8, 0.1, 0.8, 0.1],
			6 : [1.6, 0.6, 1.4, 0.1, 1.6, 0.3],
			7 : [1.6, 0.5, 1.4, 0.3, 1.6, 0.1],
			8 : [1.6, 0.3, 1.6, 0.1, 1.6, 0.3]
		}[themeNumber];
	}

	// 选择主题
	function setTheme( workData ) {
		var themeNumber = window.themeNumber || workData.theme,
			workRandom = random.Random( parseInt( workData.workInfo.id ) ),
			switchAnimation = workRandom.select( {
				1 : [sa.classic, sa.flipOver, sa.push],
				2 : [sa.fade, sa.classic, sa.door, sa.overturn, sa["switch"]],
				3 : [sa.classic, sa.push, sa.overturn],
				4 : [sa.classic, sa.uncover, sa.push, sa["switch"], sa.fade],
				5 : [sa.classic, sa.fade, sa.push],
				6 : [sa.classic, sa.fade, sa.push],
				7 : [sa.classic, sa.fade, sa.push],
				8 : [sa.classic, sa.uncover, sa.fade]
			}[themeNumber] ),
			lastTextGroups = [], lastImageGroups = [],
			appliedGroup = {};

		array.foreach( workData.pages, function ( pageData, pageIndex ) {
			var typeCount = {
					image : 0,
					text : 0
				},
				hasMask = false;

			if ( pageData.label === "custom-2" || pageData.label === "screen" || pageData.name === "screen" ) {
				array.foreach( pageData.image, function ( image ) {
					var imageInfo = image.imageinfo;
					if ( imageInfo ) {
						var type = imageInfo.type;
						if ( type in typeCount ) {
							typeCount[type]++;
						}

						hasMask = !!image.mask;
					}
				} );

				var allImage = typeCount.text === 0, // 全是图
					pureText = typeCount.image === 0, // 纯文本
					singleImage = typeCount.image === 1, // 只有一张图
					lessImage = pureText || singleImage, // 没有图或只有一张图

					imageGroupList = [], textGroupList = [], allGroupList = [], // 动画组
					imageGroup, textGroup,
					inOrder = null; // 速度

				// 根据主题设置速度和动画组
				({
					// 萌萌哒
					1 : function () {
						if ( lessImage ) {
							imageGroupList = [shake, tada, rubberBand];
							allGroupList = [bounce, flipIn, swing, fall];
						}
						else {
							imageGroupList = [shake, tada, rubberBand];
							allGroupList = [bounce, flipIn, fall]
						}
					},

					// 逗比
					2 : function () {
						var lessImageResult = {
								image : [shake, tada, lightSpeedIn, coin],
								text : [lightSpeedIn, flyIntoX]
							},
							result = lessImage ? lessImageResult : workRandom.select( [
								lessImageResult,
								{
									image : [flyInto],
									text : [lightSpeedIn, creep, wave, coin]
								}
							] );
						imageGroupList = result.image;
						textGroupList = result.text;
					},

					// 小清新
					3 : function () {
						allGroupList = lessImage ? [bounce, flipIn, swing, rotateIn, emerge, flyInto, overturn, roundFromFarAndNear]
							: [bounce, rotateIn, flyInto, emerge];
					},

					// 文艺
					4 : function () {
						allGroupList = lessImage ? [flipIn, rotateIn, emerge, scale, roundFromFarAndNear, flyInto, overturn] :
							[flipIn, rotateIn, emerge, scale, flyInto];
					},

					// 大气
					5 : function () {
						var flyEmerge;

						if ( lessImage ) {
							textGroupList = imageGroupList = [overturn, shrink, scale, roundFromFarAndNear, zoomIn];
						}
						else {
							textGroupList = [circleRound, roundFromFarAndNear, overturn, scale, zoomIn];
							imageGroupList = [overturn, scale, zoomIn];
						}

						// 要不然图有飞入,有不然文字有飞入
						flyEmerge = random.select( [textGroupList, imageGroupList] );
						flyEmerge.push( flyInto, emerge );

						// 第一页必有缩放
						if ( pageIndex === 0 ) {
							pureText ? textGroupList = [shrink] : imageGroupList = [shrink];
						}
					},

					// 历史
					6 : function () {
						allGroupList = lessImage ? [flipIn, rotateIn, emerge, overturn, scale, flyInto, overturn] :
							[rotateIn, emerge, overturn, scale, flyInto, roundFromFarAndNear];

						if ( typeCount.image >= 5 ) {
							inOrder = false;
						}
					},

					// 简约
					7 : function () {
						textGroupList = [overturn];

						if ( lessImage ) {
							allGroupList = [flipIn, rotateIn, emerge, scale, flyInto, roundFromFarAndNear];
						}
						else {
							allGroupList = [rotateIn, emerge, scale, flyInto];
						}
					},

					// 精致
					8 : function () {
						if ( lessImage ) {
							allGroupList = [flipIn, rotateIn, emerge, flyInto, roundFromFarAndNear, overturn];
						}
						else {
							textGroupList = [overturn];
							allGroupList = [rotateIn, emerge, flyInto];
						}
					}
				}[themeNumber])();

				imageGroupList = imageGroupList.concat( allGroupList );
				textGroupList = textGroupList.concat( allGroupList );

				// mask元素不会分配缩放动画
				if ( hasMask ) {
					imageGroupList = array.remove( imageGroupList, function ( animationGroup ) {
						return animationGroup.isScale;
					} );
				}

				function selectGroup( groups, lastGroups ) {
					var remindGroups = array.remove( groups, function ( group ) {
							return group === lastGroups[0] || group === lastGroups[1];
						} ),
						selectedGroup = workRandom.select( remindGroups.length === 0 ? groups : remindGroups );

					lastGroups.push( selectedGroup );
					if ( lastGroups.length >= 3 ) {
						lastGroups.shift();
					}
					return selectedGroup;
				}

				// 如果是纯图,这些图不是强调动画
				imageGroup = selectGroup( allImage ? array.filter( imageGroupList, function ( g ) {
					return !g.isEmphasize;
				} ) : imageGroupList, lastImageGroups );

				// 如果图片不是强调的,文字也不是强调的
				textGroup = selectGroup( allImage || !imageGroup.isEmphasize ? array.filter( textGroupList, function ( g ) {
					return !g.isEmphasize;
				} ) : textGroupList, lastTextGroups );

				appliedGroup[pageIndex] = {
					imageGroup : imageGroup,
					textGroup : textGroup,
					inOrder : inOrder
				};
			}
		} );

		return {
			switchAnimation : switchAnimation,
			themeNumber : themeNumber,
			appliedGroup : appliedGroup,
			speed : getSpeed( themeNumber )
		};
	}

	// 设置一个页面的动画
	function setPageAnimate( page, themeData ) {
		var layout = page.wrapper,
			applyEnter = layout.applyEnter,
			speed = themeData.speed,
			enterComponentTable = {
				text : [],
				image : [],
				mulitimage : []
			},
			pageRandom = random.Random( page.hash ),
			last = 0,
			appliedGroup = null;

		// 分配切换动画
		page.switchAnimate = window.switchAnimate || themeData.switchAnimation;

		function applySpeed( components, duration, delay ) {
			var lastEnter = null;
			array.foreach( components, function ( comp, i ) {
				lastEnter = comp.enter = object.extend( comp.enter, {
					duration : duration + ( comp.enter.durationCorrect || 0 ),
					delay : delay * duration * i + last
				} );
			} );
			last = lastEnter ? lastEnter.duration + lastEnter.delay : last;
		}

		// 提取需要动画的元素,并根据类型计数
		Layout.loopComponent( layout, function ( component ) {
			var applyEnter = component.applyEnter || {},
				type = applyEnter.type;

			if ( type ) {
				enterComponentTable[type] = enterComponentTable[type] || [];
				enterComponentTable[type].push( component );
			}
		} );

		if ( applyEnter ) {
			if ( applyEnter.custom ) {
				applySpeed( array.filter( enterComponentTable.text.concat( enterComponentTable.image ).sort( function ( lhs, rhs ) {
					return lhs.applyEnter.animationIndex - rhs.applyEnter.animationIndex;
				} ), function ( component ) {
					var applyEnter = component.applyEnter;
					if ( applyEnter.animation ) {
						component.enter = enterAnimation.table[applyEnter.animation];
						return true;
					}
				} ), speed[4], speed[5] );
			}
			else {
				appliedGroup = themeData.appliedGroup[page.index];

				// 分配动画
				array.foreach( [[enterComponentTable.image, appliedGroup.imageGroup], [enterComponentTable.text, appliedGroup.textGroup]], function ( arg ) {
					array.foreach( arg[0], function ( comp ) {
						var midPoint = z2d.transform( Layout.getPageMatrix( comp ), [comp.width / 2, comp.height / 2, 1] );
						comp.enter = pageRandom.select( array.remove( arg[1], function ( enter ) {
							return enter.flyDirection === ( midPoint[1] + 1 >= clientHeight / 2 ? 0 : 2 ) ||
								enter.flyDirection === ( midPoint[0] + 1 >= clientWidth / 2 ? 3 : 1 );
						} ) );
					} );
				} );

				// 有序
				if ( appliedGroup.inOrder === true || ( appliedGroup.inOrder == null && pageRandom() > 0.5 ) ) {
					if ( applyEnter.first === "text" ) {
						applySpeed( enterComponentTable.text, speed[2], speed[3] );
						applySpeed( enterComponentTable.image, speed[0], speed[1] );
					}
					else {
						applySpeed( enterComponentTable.image, speed[0], speed[1] );
						applySpeed( enterComponentTable.text, speed[2], speed[3] );
					}
				}
				// 无序
				else {
					var unorderedComponents = pageRandom.arrange( enterComponentTable.text.concat( enterComponentTable.image ) ),
						unorderedTexts = [], unorderedTextIndexes = [];

					// 调整文字顺序,保证标题总在最前
					array.foreach( unorderedComponents, function ( comp, i ) {
						if ( comp.applyEnter.type === "text" ) {
							unorderedTextIndexes.push( i );
							unorderedTexts.push( comp );
						}
					} );

					array.foreach( unorderedTexts.sort( function ( lhs, rhs ) {
						return lhs.zi - rhs.zi;
					} ), function ( comp, i ) {
						unorderedComponents[unorderedTextIndexes[i]] = comp;
					} );

					applySpeed( unorderedComponents, speed[4], speed[5] );
				}
			}

			// 处理多图
			array.foreach( enterComponentTable.mulitimage, function ( comp ) {
				last = Component.applyMultiImageAreaAnimation( comp, last );
			} );
		}
	}

	exports.getSpeed = getSpeed;
	exports.setTheme = setTheme;
	exports.setPageAnimate = setPageAnimate;
} );