/**
 * Created by WQ on 2015/7/21.
 */

// 复杂动画用js实现
library( function () {
    var array = imports( "array" ),
        animate = imports( "animation" ),
        $ = imports( "element" ),
        cssAnimation = imports( "css-animation" );

    function pluginHearts( body, arg ) {
        var animates = [];
        array.foreach(
            [
                {
                    0 : {
                        opacity : 0
                    },
                    50 : {
                        opacity : 1
                    },
                    100 : {
                        "-webkit-transform" : "translate3d(-300%, 200%, 0) scale(1.2) rotateZ(-30deg)",
                        opacity : 0
                    }
                },
                {
                    0 : {
                        opacity : 0
                    },
                    50 : {
                        opacity : 1
                    },
                    100 : {
                        "-webkit-transform" : "translate3d(-300%, -200%, 0) scale(1.1) rotateZ(30deg)",
                        opacity : 0
                    }
                },
                {
                    0 : {
                        opacity : 0
                    },
                    50 : {
                        opacity : 1
                    },
                    100 : {
                        "-webkit-transform" : "translate3d(-300%, 170%, 0) scale(1.1) rotateZ(30deg)",
                        opacity : 0
                    }
                },
                {
                    0 : {
                        opacity : 0
                    },
                    50 : {
                        opacity : 1
                    },
                    100 : {
                        "-webkit-transform" : "translate3d(-300%, 0, 0) scale(1.1) rotateZ(30deg)",
                        opacity : 0
                    }
                }
            ], function ( animate ) {
                animates.push( cssAnimation.Keyframes( animate ) );
            } );
        var handle = null;
        var isDestroy = false;
        var timeId = setTimeout( function () {
            if ( !isDestroy ) {
                // 如果还没做动画就remove了，则不必再执行下面的代码
                handle = animate.requestFrames( {
                    duration : 5,
                    timing : function ( t ) {
                        return t;
                    },
                    onAnimate : function ( process ) {
                        $( "img", {
                            src : "img/plugin/heart.png",
                            css : {
                                width : "10px",
                                height : "10px",
                                position : "absolute",
                                opacity : 0,
                                left : ((10 + (clientWidth - 10) * process) << 0) + "px",
                                top : arg.y / 480 * clientHeight + "px",
                                "-webkit-animation" : animates[(Math.random() * 10 % 4) << 0].id + " " + (Math.random() * 2 + 0.2) + "s ease-out " + (Math.random() / 10) + "s forwards"
                            }
                        }, body );
                    }
                } );
            }
        }, arg.delay * 1000 );

        return {
            remove : function () {
                isDestroy = true;
                clearTimeout( timeId );
                array.foreach( animates, function ( animate ) {
                    animate.remove();
                } );
                handle && handle.remove();
            }
        }
    }

    function bubbleHearts( body, arg ) {
        var animates = [];
        array.foreach(
            [
                {
                    0 : {
                        opacity : 1,
                        "-webkit-transform" : "translate3d(0, 0, 0) rotateZ(-90deg)"
                    },
                    100 : {
                        "-webkit-transform" : "translate3d(0, -100px, 0) rotateZ(-80deg)",
                        opacity : 0
                    }
                },
                {
                    0 : {
                        opacity : 1,
                        "-webkit-transform" : "translate3d(0, 0, 0) rotateZ(-90deg)"
                    },
                    100 : {
                        "-webkit-transform" : "translate3d(0, -110px, 0) rotateZ(-92deg)",
                        opacity : 0
                    }
                },
                {
                    0 : {
                        opacity : 1,
                        "-webkit-transform" : "translate3d(0, 0, 0) rotateZ(-90deg)"
                    },
                    100 : {
                        "-webkit-transform" : "translate3d(0, -80px, 0) rotateZ(-98deg)",
                        opacity : 0
                    }
                },
                {
                    0 : {
                        opacity : 1,
                        "-webkit-transform" : "translate3d(0, 0, 0) rotateZ(-90deg)"
                    },
                    100 : {
                        "-webkit-transform" : "translate3d(0, -90px, 0) rotateZ(-85deg)",
                        opacity : 0
                    }
                }
            ], function ( animate ) {
                animates.push( cssAnimation.Keyframes( animate ) );
            } );

        var isDestroy = false;
        var handle;
        var timeId = setTimeout( function () {
            if ( !isDestroy ) {
                handle = animate.requestFrames( {
                    duration : 2,
                    timing : function ( t ) {
                        return t;
                    },
                    onAnimate : function () {
                        for ( var i = 0; i < 2; i++ ) {
                            var random = Math.random();
                            $( "img", {
                                src : "img/plugin/heart.png",
                                css : {
                                    width : "10px",
                                    height : "10px",
                                    position : "absolute",
                                    opacity : 0,
                                    left : (clientWidth * random << 0) + "px",
                                    bottom : "0px",
                                    "-webkit-animation" : animates[(random * 10 % 4) << 0].id + " " + (random * 2 + 2) + "s ease-out " + (random / 10) + "s forwards"
                                }
                            }, body );
                        }
                    }
                } );
            }
        }, arg.delay * 1000 );

        return {
            remove : function () {
                isDestroy = true;
                clearTimeout( timeId );
                array.foreach( animates, function ( animate ) {
                    animate.remove();
                } );
                handle && handle.remove();
            }
        }
    }


    exports["plugin-hearts"] = pluginHearts;
    exports["bubble-hearts"] = bubbleHearts;

} );