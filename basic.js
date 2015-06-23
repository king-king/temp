/**
 * Created by WQ on 2015/5/29.
 *
 * 提供基础的工具
 *
 */


(function () {

    // 如果引用debug.js的话会覆盖这个函数，上传的时候可以不必删掉代码中的remote.log
    window.remote = {
        log : function () {
        }
    };

    function loopArray( arr, func ) {
        for ( var i = 0; i < arr.length; i++ ) {
            func( arr[i], i );
        }
    }

    function compare( var1, var2 ) {
        if ( var1 < var2 ) {
            return -1;
        }
        else if ( var1 == var2 ) {
            return 0;
        }
        else {
            return 1;
        }
    }

    function compare2( var1, var2 ) {
        if ( var1 < var2 ) {
            return 1;
        }
        else if ( var1 == var2 ) {
            return 0;
        }
        else {
            return -1;
        }
    }

    Array.prototype.Sort = function ( des ) {
        var arr = this;
        return des ? arr.sort( compare ) : arr.sort( compare2 );
    };

    Node.prototype.remove = function () {
        var node = this;
        if ( node.parentNode ) {
            node.parentNode.removeChild( node );
        }
    };

    Node.prototype.bindEvent = function ( type, listener, useCapture ) {
        var el = this;
        el.addEventListener( type, listener, useCapture || false );
        return {
            remove : function () {
                el.removeEventListener( type, listener, useCapture || false );
            }
        }
    };

    Node.prototype.transform = function ( x, y, z, rotate, scale ) {
        var el = this;
        el.style.setProperty( "-webkit-transform", "translate3d(" + (x || 0) + "px," + (y || 0) + "px," + (z || 0) + "px) " +
            "scale(" + (scale || 1) + ") rotate(" + (rotate || 0) + "deg)", null );
        el.wx = x || 0;
        el.wy = y || 0;
        el.ez = z || 0;
        el.wrotate = rotate || 0;
        el.wscale = scale || 1;
        return el;
    };

    Node.prototype.onDrag = function ( arg ) {
        var el = this;
        el.isTouching = false;
        el.bindEvent( "touchstart", function ( start ) {
            if ( el.isTouching == true ) {
                return;
            }
            var startTime = (new Date()).getTime();
            arg.onStart && arg.onStart();
            el.isTouching = true;
            start.preventDefault();
            var spx = start.touches[0].pageX, spy = start.touches[0].pageY,
                lastx = spx, lasty = spy,
                isMoving = false,
                isGet = false;
            var moveHandler = document.bindEvent( "touchmove", function ( move ) {
                var dds = Math.pow( move.touches[0].pageX - spx, 2 ) + Math.pow( move.touches[0].pageY - spy, 2 ),
                    xgty = Math.abs( move.touches[0].pageX - spx ) > Math.abs( move.touches[0].pageY - spy );
                if ( dds > 9 ) {
                    if ( !arg.y && !arg.x ) {
                        isMoving = true;
                    }
                    else if ( !isGet && !isMoving && dds > 50 ) {
                        arg.y && !xgty && (isMoving = true );
                        arg.x && xgty && (isMoving = true );
                        isGet = true;
                    }
                    if ( isMoving ) {
                        arg.onMove && arg.onMove( {
                            dx : move.touches[0].pageX - lastx,
                            dy : move.touches[0].pageY - lasty
                        } );
                        lastx = move.touches[0].pageX;
                        lasty = move.touches[0].pageY;
                    }
                }
            } );
            var endHandler = el.bindEvent( "touchend", function () {
                moveHandler.remove();
                endHandler.remove();
                if ( isMoving ) {
                    var dt = (new Date()).getTime() - startTime;
                    arg.onEnd && arg.onEnd( {
                        dx : lastx - spx,
                        dy : lasty - spy,
                        speedx : (lastx - spx) / dt,
                        speedy : ( lasty - spy) / dt
                    } );
                }
                else {
                    el.isTouching = false;
                }
            } );
        } );
    };

    Node.prototype.onTap = function ( callback ) {
        var el = this;
        var istouching = false;
        el.bindEvent( "touchstart", function ( se ) {
            el.classList.add( "tap" );
            if ( !istouching ) {
                istouching = true;
                var isTap = true;
                var mh = el.bindEvent( "touchmove", function ( me ) {
                    if ( isTap && Math.pow( me.touches[0].pageX - se.touches[0].pageX, 2 ) + Math.pow( me.touches[0].pageY - se.touches[0].pageY, 2 ) > 9 ) {
                        isTap = false;
                    }
                }, false );
                var eh = el.bindEvent( "touchend", function () {
                    istouching = false;
                    el.classList.remove( "tap" );
                    isTap && callback();
                    mh.remove();
                    eh.remove();
                }, false );
            }
        }, false );

    };

    Node.prototype.css = function ( style ) {
        for ( var key in style ) {
            this.style.setProperty( key, style[key], null );
        }
    };

    Node.prototype.transition = function ( style, callback ) {
        var el = this;
        el.css( style );
        el.addEventListener( "webkitTransitionEnd", function () {
            el.style.removeProperty( "-webkit-transition" );
            callback();
        }, false );
    };

    // 在指定的时间内做动画，到时就停止
    function doAnimate( duration, keyframe, callback ) {
        var st = (new Date()).getTime();//  ms
        function animate() {
            var ct = (new Date()).getTime();// ms
            if ( duration - ct + st > 10 && ct - st < duration ) {
                setTimeout( function () {
                    keyframe( (ct - st ) / duration );
                    animate();
                }, 1000 / 60 );
            }
            else {
                callback();
            }
        }

        animate();
    }

    // 持续做动画，除非
    function requestAnimate( keyframe ) {
        var timeID;

        function animate() {
            clearTimeout( timeID );
            if ( keyframe() ) {
                timeID = setTimeout( function () {
                    animate();
                }, 1000 / 60 );
            }
        }

        animate();

        return {
            stop : function () {
                clearTimeout( timeID );
            }
        }
    }

    function createElement( tagName, arg, parent ) {
        var el = document.createElement( tagName );
        for ( var key in arg ) {
            switch ( key ) {
                case "classList":
                    if ( Object.prototype.toString.call( arg[key] ) == "[object String]" ) {
                        el.classList.add( arg[key] );
                    }
                    else if ( Object.prototype.toString.call( arg[key] ) == "[object Array]" ) {
                        loopArray( arg[key], function ( klass ) {
                            el.classList.add( klass );
                        } );
                    }
                    break;
                case "css":
                    el.css( arg[key] );
                    break;
                default :
                    el[key] = arg[key];
            }
        }
        parent && parent.appendChild( el );
        return el;
    }

    var insertCSSRules = function () {
        var style = document.createElement( "style" );
        document.querySelector( "head" ).appendChild( style );
        return function ( rules ) {
            for ( var selector in rules ) {
                style.sheet.insertRule( selector + "" + JSON.stringify( rules[selector] ).replace( /"/g, "" ), style.sheet.rules.length );
            }
        }
    }();

    function makeBanner( banner, data ) {
        var content = createElement( "div", {classList : "content"}, banner );
        var curIndex = 0;
        var width = content.offsetWidth;
        var items = {
            all : [],
            length : 0,
            fetch : function ( index ) {
                index = (index + items.all.length) % items.all.length;
                return items.all[index];
            },
            push : function ( item ) {
                items.length++;
                items.all.push( item );
                var index = items.all.length - 1;
                item.next = function () {
                    return items.fetch( index + 1 );
                };
                item.pre = function () {
                    return items.fetch( index - 1 );
                }
            }
        };
        loopArray( data, function ( src ) {
            var item = createElement( "div", {
                classList : "item",
                css : {
                    background : "url(" + src + ")",
                    "background-size" : "cover"
                }
            } );
            items.push( item );
        } );
        function initPosition( item ) {
            item.pre().transform( -width, 0, 0 );
            item.transform( 0, 0, 0 );
            item.next().transform( width, 0, 0 );
            content.appendChild( item.pre() );
            content.appendChild( item );
            content.appendChild( item.next() );
        }

        initPosition( items.fetch( curIndex ) );

        function removeItems( item ) {
            item.remove();
            item.pre().remove();
            item.next().remove();
        }

        var handler = {};

        banner.onDrag( {
            x : true,
            onStart : function () {
                clearTimeout( timeID );
            },
            onMove : function ( arg ) {
                loopArray( [items.fetch( curIndex ), items.fetch( curIndex ).pre(), items.fetch( curIndex ).next()], function ( item ) {
                    item.transform( item.wx += arg.dx, 0, 0 );
                } );
            },
            onEnd : function ( arg ) {
                var count = 0;
                loopArray( [items.fetch( curIndex ).pre(), items.fetch( curIndex ), items.fetch( curIndex ).next()], function ( item, i ) {
                    item.transition( {
                        "-webkit-transform" : "translate3d(" + (arg.dx < 0 ? width * (i - 2) : width * i) + "px,0,0)",
                        "-webkit-transition" : "0.2s linear"
                    }, function () {
                        count += 1;
                        if ( count == 2 ) {
                            removeItems( items.fetch( curIndex ) );
                            curIndex = (curIndex + (arg.dx < 0 ? 1 : -1) + items.length) % items.length;
                            handler.onCut && handler.onCut( curIndex );
                            initPosition( items.fetch( curIndex ) );
                            banner.isTouching = false;
                            autoSlide();
                        }
                    } )
                } );
            }
        } );

        var timeID;

        function autoSlide() {
            function timer( func, delay ) {
                timeID = setTimeout( func, delay );
            }

            function cut() {
                clearTimeout( timeID );
                doAnimate( 300, function ( process ) {
                    loopArray( [
                        items.fetch( curIndex ).pre(),
                        items.fetch( curIndex ),
                        items.fetch( curIndex ).next()
                    ], function ( item, i ) {
                        item.transform( -width * easingEffects.easeOutQuart( process ) + width * (i - 1), 0, 0 );
                    } )
                }, function () {
                    removeItems( items.fetch( curIndex ) );
                    curIndex = (curIndex + 1 + items.length) % items.length;
                    handler.onCut && handler.onCut( curIndex );
                    initPosition( items.fetch( curIndex ) );
                    timer( cut, 3000 );
                } );
            }

            timer( cut, 3000 );
        }

        autoSlide();
        return handler;
    }

    // 并发
    function concurrentTask( tasks, callback ) {
        var len = tasks.length,
            count = 0;
        tasks.forEach( function ( task ) {
            task( function () {
                count++;
                if ( count == len ) {
                    callback();
                }
            } );
        } );
    }

    function map( array, func ) {
        var mapArray = [];
        array.forEach( function ( item, i ) {
            mapArray.push( func( item, i ) );
        } );
        return mapArray;
    }

    // 顺序执行
    function serialTask( tasks, callback ) {
        var index = 0;
        tasks[index] && tasks[index]( function () {
            ++index == tasks.length ? callback() : tasks[index]( arguments.callee );
        } );
    }

    window.util = {
        // 数组处理
        loopArray : loopArray,
        map : map,

        doAnimate : doAnimate,
        insertCSSRules : insertCSSRules,
        createElement : createElement,
        makeBanner : makeBanner,
        requestAnimate : requestAnimate,

        concurrentTask : concurrentTask,
        serialTask : serialTask
    }
})();