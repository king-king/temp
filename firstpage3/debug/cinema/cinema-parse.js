library( function () {

    var css = imports( "css" ),
        filterOld = imports( "filter-old" ),
        filterBlur = imports( "filter-blur-stack" ),
        filterBlackAndWhite = imports( "filter-desaturate" ),
        filterBlend = imports( "filter-blend" ),
        filterSobel = imports( "filter-sobel" ),
        filterdull = imports( "filter-dull-polish" ),
        $ = imports( "element" ),
        Img = imports( "../../src/img" ),
        object = imports( "object" ),
        array = imports( "array" ),
        sysPlugin = imports( "./cinema-plugin.js" ),
        cssAnimation = imports( "css-animation" );

    var Filter = {
            "black-white" : function ( pageData ) {
                return filterBlackAndWhite( pageData );
            },
            "older" : function ( pageData ) {
                return filterOld( pageData );
            },
            "blur" : function ( pageData ) {
                return filterBlur( pageData, 20 );
            },
            "flower" : function ( pageData1, pageData2 ) {
                return filterBlend( pageData1, pageData2, "Linear-Light" );
            },
            "hard" : function ( pageData1, pageData2 ) {
                return filterBlend( pageData1, pageData2, "Hard-Mix" );
            },
            "sobel" : function ( pageData ) {
                return filterSobel( pageData );
            },
            "filter-dull" : function ( pageData ) {
                return filterdull( pageData )
            }
        },
        additiveImgData;

    function getPageFilterData( page, filter, callback ) {
        var gc = page.getContext( "2d" ),
            data1 = gc.getImageData( 0, 0, clientWidth, clientHeight );
        if ( filter == "flower" || filter == "hard" ) {
            additiveImgData ? callback( Filter[filter]( data1, additiveImgData ) ) : Img( "img/cinema-dream.jpg", {
                crossOrigin : true,
                onLoad : function ( img ) {
                    gc.drawImage( img, 0, 0, clientWidth, clientHeight );
                    additiveImgData = gc.getImageData( 0, 0, clientWidth, clientHeight );
                    callback( Filter[filter]( data1, additiveImgData ) );
                }
            } );
        }
        else {
            callback( Filter[filter]( data1 ) );
        }
    }

    // 生成一个可以传递给cssAnimation.animation的参数
    function constructAnimation( arg, delay ) {
        function getSumDuration( arg ) {
            var duration = 0;
            object.foreach( arg, function ( key, value ) {
                duration += value.duration;
            } );
            return duration;
        }

        function isFloat( number ) {
            return Math.ceil( number ) - number > 0;
        }

        var frames = {},
            duration = getSumDuration( arg ),
            process = 0;
        array.foreach( arg, function ( value, i ) {
            // x、y的数值如果是整数，就认为单位是px，如果有小数部分，就认为单位是%
            array.foreach( ["x", "y"], function ( key ) {
                if ( object.is.String( value[key] ) ) {
                    try {
                        var w = clientWidth, h = clientHeight;
                        value[key] = eval( value[key] );
                    }
                    catch ( e ) {
                        console.warn( "err~!动画帧中" + value[key] + "无法解析" );
                    }
                }
            } );
            var scale = value.scale,
                x = isFloat( value.x ) ? value.x * 100 + "%" : value.x + "px",
                y = isFloat( value.y ) ? value.y * 100 + "%" : value.y + "px",
                rotate = value.rotate;
            process = (i == arg.length - 1 ? 100 : process + value.duration / duration * 100) << 0;
            frames[process] = {
                opacity : value.opacity,
                "-webkit-transform" : "translate3d(" + x + "," + y + ",0) rotate(" + rotate + "deg) scale(" + scale + ")"
            };
        } );
        return [frames, duration, delay || 0];
    }

    // 将各组件数据实体化,page是做film的页面的dom，arg是动画的配置要素
    function materialize( page, _data, callback ) {
        var data = JSON.parse( JSON.stringify( _data ) );

        function getTimeSpend( plugin ) {
            if ( plugin.name == "plugin-hearts" ) {
                return plugin.delay + 2;
            }
            else if ( plugin.name == "bubble-hearts" ) {
                return plugin.delay + 5;
            }
            var duration = plugin.delay;
            array.foreach( plugin.frames, function ( frame ) {
                duration += frame.duration;
            } );
            return duration;
        }

        var tempBorder = $( "div", {
            css : {
                position : "absolute",
                top : "0px",
                left : "0px",
                right : "0px",
                bottom : "0px",
                "z-index" : 1000
            }
        }, body );
        var handles = [];

        var spendTimes = [];

        object.foreach( data, function ( id, plugin ) {
            spendTimes.push( getTimeSpend( plugin ) );
            var handle = {
                    name : plugin.name
                },
                style = null;
            if ( plugin.frames && plugin.frames.length ) {
                // 如果有frames，则构造之
                style = cssAnimation.animation( constructAnimation( plugin.frames, plugin.delay ), handle );
            }
            if ( plugin.name == "page" ) {
                // 如果是name，那么就要做特殊处理，比如滤镜。合成滤镜是异步操作，因为要下载图片。
                // 所有的滤镜全都统一成异步回调的形式，具体就是在getPageData上体现。
                // 关于异步处理问题，这里的处理有一个基本的原则就是，不管有没有滤镜都会生成一个含有page内容的canvas，
                // 不会等待是否完成滤镜才会播放，而是先播放，如果滤镜数据出来了，就加上去
                var visualPage = page.toCanvas();
                css( visualPage, {
                    "-webkit-animation" : style,
                    "-webkit-animation-fill-mode" : "both"
                } );
                tempBorder.appendChild( visualPage );
                plugin.filter && plugin.filter != "none" && getPageFilterData( visualPage, plugin.filter, function ( data ) {
                    visualPage.getContext( "2d" ).putImageData( data, 0, 0 );
                } );
                handles.push( handle );
            }
            else {
                if ( plugin.name in sysPlugin ) {
                    // sysPlugin中一般是用css无法实现的复杂动画，用js实现，所以有特殊之处
                    var h = sysPlugin[plugin.name]( tempBorder, plugin );
                    handles.push( {
                        handle : h
                    } );
                }
                else {
                    // 剩下的就是纯粹的组件，用css的animation实现之
                    array.foreach( ["x", "y", "h"], function ( key ) {
                        if ( object.is.String( plugin[key] ) ) {
                            try {
                                var w = clientWidth, h = clientHeight;
                                plugin[key] = eval( plugin[key] );
                            }
                            catch ( e ) {
                                plugin[key] = 0;
                                console.warn( plugin.name + "组件的" + key + "属性为:" + plugin[key] + " 无法解析" );
                            }
                        }
                    } );

                    $( "img", {
                        css : {
                            height : plugin.h < 1 && plugin.h > -1 ? plugin.h * 100 + "%" : plugin.h + "px",
                            position : "absolute",
                            top : plugin.y < 1 && plugin.y > -1 ? plugin.y * 100 + "%" : plugin.y + "px",
                            left : plugin.x < 1 && plugin.x > -1 ? plugin.x * 100 + "%" : plugin.x + "px",
                            "-webkit-transform" : "rotateZ(" + plugin.rotate + "deg)",
                            "-webkit-animation" : style,
                            opacity : plugin.opacity,
                            "-webkit-animation-fill-mode" : "both"
                        },
                        src : "img/plugin/" + plugin.name + ".png"
                    }, tempBorder );
                    handles.push( handle );
                }
            }
        } );

        var isDestroy = false;// 记录是否销毁过

        function destroy() {
            // todo:将无用的style清除，停止未做完的动画，删除dom
            if ( !isDestroy ) {
                isDestroy = true;
                // 刪除dom
                tempBorder.parentNode.removeChild( tempBorder );
                tempBorder = null;
                // 清除style动画
                array.foreach( handles, function ( item ) {
                    item.handle && item.handle.remove();
                } );
                callback && callback();
            }
        }

        var sumTime = Math.max.apply( this, spendTimes ) * 1000;

        setTimeout( destroy, sumTime );

        return {
            duration : sumTime,
            destroy : destroy
        }
    }


    exports.constructAnimation = constructAnimation;
    exports.materialize = materialize;
} );