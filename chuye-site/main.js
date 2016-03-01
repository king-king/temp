/**
 * Created by WQ on 2016/2/23.
 */

(function () {
    function checkBrowser() {
        var canvas = document.createElement( "canvas" );
        var div = document.createElement( "div" );
        if ( !canvas || !canvas.getContext || !canvas.getContext( "2d" ) || !document.querySelector || !div.classList ) {
            makeDownloadPage();
            return true;
        }
        function makeDownloadPage() {
            document.body.className = "not-support";
            document.body.innerHTML = "<div class='browser-update' ><h1>请升级您的浏览器</h1>" +
                "<h2>尊敬的用户，您现在使用的浏览器版本过低，请升级后继续使用初页的服务。</h2>" +
                "<h3>您可以选择：</h3>" +
                "<ul>" +
                "<li class='chrome'><a href='http://www.google.cn/intl/zh-CN/chrome/browser/' target='_blank'><h4>Google" +
                "Chrome</h4></a></li>" +
                "<li class='firefox'><a href='http://www.mozilla.org/zh-CN/firefox/new/' target='_blank'><h4>Mozilla Firefox</h4>" +
                "</a></li>" +
                "<li class='ie'><a href='http://www.microsoft.com/china/windows/IE/upgrade/index.aspx' target='_blank'><h4>" +
                "Internet Explorer 9+</h4></a></li>" +
                "</ul>" +
                "</div>";
        }

        return false;
    }

    if ( checkBrowser() ) {
        return;
    }
    var querySelector = document.querySelector.bind( document );
    var querySelectorAll = document.querySelectorAll.bind( document );
    var bodyHeight;
    var sections = querySelectorAll( ".section" );
    var wrappers = querySelectorAll( ".wrapper" );
    var scrollWrapper = querySelector( ".scroll-wrapper" );
    var indicatorItems = querySelectorAll( ".indicator .item" );
    var curPageIndex = 0;
    var isScrolling = false;
    var yellowPhones = querySelectorAll( ".section .yellow-phone" );
    var tempWrapper = querySelector( ".temp-wrapper" );
    var isAppleWebKit = navigator.userAgent.indexOf( "AppleWebKit" ) != -1;

    function loopArray( arr , func ) {
        for ( var i = 0; i < arr.length; i++ ) {
            func( arr[ i ] , i );
        }
    }

    function loop( count , func ) {
        for ( var i = 0; i < count; i++ ) {
            func( i );
        }
    }

    function bindEvent( el , type , func ) {
        el.addEventListener( type , func );
        return {
            remove : function () {
                el.removeEventListener( type , func );
            }
        }
    }

    function resize() {
        bodyHeight = document.body.offsetHeight;
        scrollWrapper.style.transform = "translate3d(0,-" + bodyHeight * curPageIndex + "px,0)";
        var cubeHeight = bodyHeight > 768 ? 768 : bodyHeight;
        loopArray( sections , function ( setction , i ) {
            setction.style.height = bodyHeight + "px";
            wrappers[ i ].style.width = wrappers[ i ].style.height = cubeHeight + "px";
            wrappers[ i ].style.marginLeft = wrappers[ i ].style.marginTop = -cubeHeight / 2 + "px"
        } );
        tempWrapper.style.width = tempWrapper.style.height = cubeHeight + "px";
        tempWrapper.style.marginLeft = tempWrapper.style.marginTop = -cubeHeight / 2 + "px"
    }

    function wheelScroll( direction ) {
        if ( isScrolling ) {
            return;
        }
        isScrolling = true;
        indicatorItems[ curPageIndex ] && indicatorItems[ curPageIndex ].classList.remove( "select" );
        if ( !(direction < 0 && curPageIndex == 5) ) {
            sections[ curPageIndex ] && sections[ curPageIndex ].classList.remove( "show" );
        }
        // 负数-向下翻-下一页，正数-向上翻-上一页
        if ( direction < 0 ) {
            // 下一页
            if ( curPageIndex != 6 ) {
                // 只要不是最后一页，都能继续往下翻
                sections[ curPageIndex ] && sections[ curPageIndex ].stop && sections[ curPageIndex ].stop();// 将当前页面的动画暂停
                curPageIndex += 1;
                sections[ curPageIndex ] && sections[ curPageIndex ].play && sections[ curPageIndex ].play();// 开始新页面的动画
            }
        }
        else {
            // 上一页
            if ( curPageIndex != 0 ) {
                // 只要不是第一页，都能往上翻
                sections[ curPageIndex ] && sections[ curPageIndex ].stop && sections[ curPageIndex ].stop();// 将当前页面的动画暂停
                curPageIndex -= 1;
                sections[ curPageIndex ] && sections[ curPageIndex ].play && sections[ curPageIndex ].play();// 开始新页面的动画
            }
        }
        loopArray( yellowPhones , function ( phone ) {
            phone.classList.add( "hide" );
        } );
        if ( (direction > 0 && curPageIndex == 0) || (direction < 0 && curPageIndex == 1) ) {
            yellowPhones[ 0 ].classList.remove( "hide" );
            tempWrapper.classList.add( "hide" );
        } else if ( (direction < 0 && curPageIndex == 6) || (direction > 0 && curPageIndex == 5) ) {
            yellowPhones[ 4 ].classList.remove( "hide" );
            tempWrapper.classList.add( "hide" );
        } else if ( direction == 0 ) {
            isScrolling = false;
            return;
        } else {
            yellowPhones[ curPageIndex - 1 ].classList.add( "hide" );
            tempWrapper.classList.remove( "hide" );
        }
        setTimeout( function () {
            isScrolling = false;
            if ( curPageIndex < 6 && curPageIndex > 0 ) {
                // 1,2,3,4,5
                yellowPhones[ curPageIndex - 1 ].classList.remove( "hide" );
                tempWrapper.classList.add( "hide" );
            }
        } , 1000 );
        if ( curPageIndex == 6 ) {
            transform( scrollWrapper , "translate3d(0,-" + (bodyHeight * 5 + 167) + "px,0)" );
        } else {
            indicatorItems[ curPageIndex ] && indicatorItems[ curPageIndex ].classList.add( "select" );
            sections[ curPageIndex ] && sections[ curPageIndex ].classList.add( "show" );
            transform( scrollWrapper , "translate3d(0,-" + bodyHeight * curPageIndex + "px,0)" );
        }
    }

    function animate( duration , frame , onEnd ) {
        var s = (new Date()).getTime();
        var timeID;
        timeID = setTimeout( function () {
            var cur = (new Date()).getTime();
            if ( cur - s < duration ) {
                frame( (cur - s ) / duration );
                timeID = setTimeout( arguments.callee , 20 );
            } else {
                frame( 1 );
                onEnd();
            }
        } , 20 );
        return {
            remove : function () {
                clearTimeout( timeID );
            }
        }
    }

    function Timer( duration , func ) {
        var timeID;
        timeID = setTimeout( function () {
            timeID = setTimeout( arguments.callee , duration );
            func();
        } , duration );
        return {
            remove : function () {
                clearTimeout( timeID );
            }
        }
    }

    function transform( el , style ) {
        el.style.webkitTransform = style;
        el.style.transform = style;
    }

    function concurrentTask( tasks , callback ) {
        var len = tasks.length , count = 0;
        tasks.forEach( function ( task ) {
            task( function () {
                ++count == len && callback();
            } );
        } );
    }

    function initPage0() {
        var curIndex = 0;
        var slideWrapper = querySelector( ".page0-img-border-wrapper" );
        var circles = querySelectorAll( ".page0-circle" );
        var qrBorder = querySelector( ".page0-qr" );
        qrBorder.onmouseover = function () {
            qrBorder.classList.add( "onover" );
        };
        qrBorder.onmouseout = function () {
            qrBorder.classList.remove( "onover" );
        };

        loopArray( querySelectorAll( ".page0-word" ) , function ( word ) {
            function onEnd() {
                word.style.setProperty( "animation" , "none" );
            }

            bindEvent( word , "webkitAnimationEnd" , onEnd );
            bindEvent( word , "animationend" , onEnd );
        } );

        loopArray( querySelectorAll( ".page0-img-border-wrapper .item" ) , function ( item , i ) {
            item.style.left = 25 * i + "%";
        } );

        function slide() {
            circles[ curIndex ].classList.remove( "select" );
            circles[ curIndex + 1 == 3 ? 0 : curIndex + 1 ].classList.add( "select" );
            animate( 400 , function ( percent ) {
                slideWrapper.style.transform = "translate3d(-" + (25 * curIndex + 25 * percent * percent) + "%,0,0)"
                slideWrapper.style.webkitTransform = "translate3d(-" + (25 * curIndex + 25 * percent * percent) + "%,0,0)"
            } , function () {
                curIndex += 1;
                if ( curIndex == 3 ) {
                    // 从头开始
                    curIndex = 0;
                    slideWrapper.style.transform = "translate3d(0,0,0)"
                }
            } );
        }

        //定时轮播
        var timerHandler = Timer( 4000 , slide );

        sections[ 0 ].stop = function () {
            loopArray( querySelectorAll( ".page0-word" ) , function ( word ) {
                word.style.removeProperty( "animation" );
            } );
            // 当页面移出时，要停止轮播图
            timerHandler && timerHandler.remove && timerHandler.remove();
        };

        sections[ 0 ].play = function () {
            // 当页面重新移入时，要继续轮播图
            loopArray( querySelectorAll( ".page0-word" ) , function ( word ) {
                word.style.removeProperty( "animation" );
            } );
            timerHandler && timerHandler.remove && timerHandler.remove();
            timerHandler = Timer( 4000 , slide );
        };
    }

    function initPage2() {
        var page2Tags = querySelectorAll( ".page2-tag" );
        var imgBorders = querySelectorAll( ".page-2 .content-border-item" );
        var srcs = [ page2Tags[ 0 ].src , page2Tags[ 1 ].src ];
        var curIndex = 0;
        var switchHandler;
        // 定时轮播
        function switchImg() {
            // 关闭当前的
            imgBorders[ curIndex ].classList.add( "hide" );
            imgBorders[ curIndex ].classList.remove( "show" );
            page2Tags[ curIndex ].src = srcs[ curIndex ].slice( 0 , srcs[ curIndex ].length - 5 ) + "1.png";
            // 打开下一个
            curIndex = (curIndex + 1) % 2;
            imgBorders[ curIndex ].classList.remove( "hide" );
            imgBorders[ curIndex ].classList.add( "show" );
            page2Tags[ curIndex ].src = srcs[ curIndex ].slice( 0 , srcs[ curIndex ].length - 5 ) + "0.png";
        }

        loopArray( page2Tags , function ( tag , i ) {
            var isbad = true;
            tag.onmouseover = function () {
                // 选中当前
                isbad = false;
                curIndex = i;
                switchHandler.remove();
                page2Tags[ i ].src = srcs[ i ].slice( 0 , srcs[ i ].length - 5 ) + "0.png";
                page2Tags[ 1 - i ].src = srcs[ 1 - i ].slice( 0 , srcs[ 1 - i ].length - 5 ) + "1.png";
                imgBorders[ i ].classList.remove( "hide" );
                imgBorders[ i ].classList.add( "show" );
                imgBorders[ 1 - i ].classList.add( "hide" );
                imgBorders[ 1 - i ].classList.remove( "show" );
            };
            tag.onmouseout = function () {
                if ( isbad ) {
                    return;
                }
                switchHandler.remove();
                switchHandler = Timer( 5000 , switchImg );
            };
        } );
        sections[ 2 ].play = function () {
            switchHandler && switchHandler.remove && switchHandler.remove();
            switchHandler = Timer( 5000 , switchImg );
        };
        sections[ 2 ].stop = function () {
            switchHandler && switchHandler.remove && switchHandler.remove();
        };
    }

    function initPage3() {
        var contentImages = querySelectorAll( ".page-3 .content-img" );
        var canvas = querySelector( ".page3-canvas" );
        var playBtn = querySelector( ".page3-play-btn" );
        var page3Border = querySelector( ".page-3 .content-border" );
        var gc = canvas.getContext( "2d" );
        var clock = new Image() , clockPointer = new Image();
        var da = Math.PI / 180;
        var da0 = -Math.PI / 2;
        var rotateHandler;
        var page3Iframe = querySelector( ".page3-iframe" );

        function frame( angle ) {
            gc.clearRect( 0 , 0 , 86 , 86 );
            gc.fillStyle = angle == 360 ? "white" : "#ffecc4";
            gc.save();
            gc.beginPath();
            gc.moveTo( 43 , 43 );
            gc.lineTo( 43 , 13 );
            gc.arc( 43 , 43 , 29 , da0 , da0 + da * angle );
            gc.lineTo( 43 , 43 );
            gc.closePath();
            gc.fill();
            gc.drawImage( clock , 0 , 0 , 86 , 86 );
            gc.translate( 43 , 43 );
            gc.rotate( da * angle );
            gc.drawImage( clockPointer , -2 , -26 , 4 , 52 );
            gc.restore();
        }

        concurrentTask( [
            function ( done ) {
                clock.src = "img/clock.png";
                clock.onload = done;
            } , function ( done ) {
                clockPointer.src = "img/clock-pointer.png";
                clockPointer.onload = done;
            } ] , function () {
            frame( 0 );
        } );
        // 图片要能够轮播
        var angle = 0;
        var dangle = 360;

        var isOver;

        function beginSlide() {
            isOver = false;
            loopArray( contentImages , function ( img ) {
                img.classList.remove( "select" );
            } );
            contentImages[ 0 ].classList.add( "select" );
            frame( 0 );
            rotateHandler = animate( 4000 , function ( percent ) {
                frame( angle + dangle * percent );
                if ( percent > 0.5 ) {
                    contentImages[ 0 ].classList.remove( "select" );
                    contentImages[ 1 ].classList.add( "select" );
                }
            } , function () {
                isOver = true;
                isAppleWebKit && (playBtn.style.display = "block");
                canvas.classList.add( "shake" );
                contentImages[ 1 ].classList.remove( "select" );
                contentImages[ 2 ].classList.add( "select" );
            } );
        }

        canvas.onclick = function () {
            if ( isOver ) {
                page3Iframe.src = "";
                page3Iframe.classList.remove( "play" );
                playBtn.style.display = "none";
                beginSlide();
            }
        };

        playBtn.onclick = function () {
            if ( isOver ) {
                page3Iframe.width = page3Border.offsetWidth;
                page3Iframe.height = page3Border.offsetHeight;
                page3Iframe.src = "http://192.168.0.229:9494/debug/work.html?id=18572299&mode=mv-19";
                page3Iframe.classList.add( "play" );
            }
        };

        sections[ 3 ].stop = function () {
            page3Iframe.src = "";
            page3Iframe.classList.remove( "play" );
            rotateHandler && rotateHandler.remove && rotateHandler.remove();
        };
        sections[ 3 ].play = function () {
            rotateHandler && rotateHandler.remove && rotateHandler.remove();
            playBtn.style.display = "none";
            rotateHandler = setTimeout( beginSlide , 1000 );
        };

    }

    function initPage4() {
        var contentImage = querySelectorAll( ".page-4 .content-img" );
        var circles = querySelectorAll( ".page4-circle" );
        var contentBorder = querySelector( ".page-4.content-border" );
        var curIndex = 0;
        var flyHandler;
        loopArray( contentImage , function ( img , i ) {
            img.zindex = img.style.zIndex = i;
            function onEnd() {
                // 将之前飞过去的清除
                loop( 5 , function ( num ) {
                    contentImage[ num ].zindex = (contentImage[ num ].zindex + 1) % 5;
                    contentImage[ num ].style.zIndex = contentImage[ num ].zindex;
                    if ( num != i ) {
                        contentImage[ num ].classList.remove( "fly" );
                    }
                } );
            }

            bindEvent( img , "webkitAnimationEnd" , onEnd );
            bindEvent( img , "animationend" , onEnd );
        } );

        document.addEventListener( "visibilitychange" , function () {
            // 在chrome里面浏览其他标签页会导致当前页面animationend停止响应
            if ( sections[ 4 ].classList.contains( "show" ) ) {
                reset();
            }
        } );
        function fly() {
            circles[ curIndex ].classList.remove( "select" );
            contentImage[ 4 - curIndex ].classList.add( "fly" );
            curIndex = (curIndex + 1) % 5;
            circles[ curIndex ].classList.add( "select" );
        }

        function reset() {
            curIndex = 0;
            loopArray( contentImage , function ( img , i ) {
                img.zindex = img.style.zIndex = i;
                img.classList.remove( "fly" );
                circles[ i ].classList.remove( "select" );
            } );
            circles[ 0 ].classList.add( "select" );
            flyHandler && flyHandler.remove && flyHandler.remove();
        }

        sections[ 4 ].play = function () {
            if ( !contentBorder.classList.contains( "tap" ) ) {
                reset();
                flyHandler = Timer( 5000 , fly );
            }
        };

        contentBorder.onclick = function () {
            if ( curIndex == 4 && !contentBorder.classList.contains( "tap" ) ) {
                flyHandler.remove();
                contentBorder.classList.add( "tap" );
            } else if ( contentBorder.classList.contains( "tap" ) ) {
                flyHandler.remove();
                flyHandler = Timer( 5000 , fly );
                contentBorder.classList.remove( "tap" );
            }
        };

        sections[ 4 ].stop = function () {
            flyHandler && flyHandler.remove && flyHandler.remove();
        };

    }

    function initPage5() {
        var page5Tags = querySelectorAll( ".page5-tag" );
        var imgBorders = querySelectorAll( ".page-5.content-border-item" );
        var srcs = [ page5Tags[ 0 ].src , page5Tags[ 1 ].src ];
        var curIndex = 0;
        var switchHandler;

        // 定时轮播
        function switchImg() {
            // 关闭当前的
            imgBorders[ curIndex ].classList.add( "hide" );
            page5Tags[ curIndex ].src = srcs[ curIndex ].slice( 0 , srcs[ curIndex ].length - 5 ) + "1.png";
            // 打开下一个
            curIndex = (curIndex + 1) % 2;
            imgBorders[ curIndex ].classList.remove( "hide" );
            page5Tags[ curIndex ].src = srcs[ curIndex ].slice( 0 , srcs[ curIndex ].length - 5 ) + "0.png";
        }

        loopArray( page5Tags , function ( tag , i ) {
            var isbad = true;
            tag.onmouseover = function () {
                isbad = false;
                // 选中当前
                curIndex = i;
                switchHandler.remove();
                page5Tags[ i ].src = srcs[ i ].slice( 0 , srcs[ i ].length - 5 ) + "0.png";
                page5Tags[ 1 - i ].src = srcs[ 1 - i ].slice( 0 , srcs[ 1 - i ].length - 5 ) + "1.png";
                imgBorders[ i ].classList.remove( "hide" );
                imgBorders[ 1 - i ].classList.add( "hide" );
            };
            tag.onmouseout = function () {
                if ( isbad ) {
                    return;
                }
                switchHandler.remove();
                switchHandler = Timer( 5000 , switchImg );
            }
        } );

        sections[ 5 ].play = function () {
            switchHandler && switchHandler.remove && switchHandler.remove();
            switchHandler = Timer( 5000 , switchImg );
        };
        sections[ 5 ].stop = function () {
            switchHandler && switchHandler.remove && switchHandler.remove();
        };

    }

    function initFooter() {
        var contactBtn = querySelector( ".footer-contact-us" );
        var chuyeInfo = querySelector( ".chuye-info" );
        contactBtn.onmouseover = function () {
            chuyeInfo.classList.remove( "hide" );
        };
        contactBtn.onmouseout = function () {
            chuyeInfo.classList.add( "hide" );
        };
    }

    function init() {
        resize();
        // loading
        var loadingTips = querySelector( ".loading-tips" );
        var contents = [ "正在加载" , "正在加载 ." , "正在加载 . ." , "正在加载 . . ." ];
        var index = -1;
        var loadingHandler = Timer( 500 , function () {
            index = (index + 1) % 4;
            loadingTips.textContent = contents[ index ];
        } );
        var page0Phone = querySelector( ".page0-phone" );
        page0Phone.src = page0Phone.getAttribute( "data-src" );
        page0Phone.onload = function () {
            sections[ 0 ].classList.add( "show" );
            loadingHandler.remove();
            document.querySelector( ".content" ).classList.remove( "hide" );
            window.onresize = function () {
                resize();
            };
            // page-0
            initPage0();
        };

        bindEvent( document , "mousewheel" , function ( e ) {
            wheelScroll( e.wheelDelta );
        } );
        bindEvent( document , "DOMMouseScroll" , function ( e ) {
            wheelScroll( -e.detail );
        } );
        // 第一页的小图标，鼠标放上时候要变化
        loopArray( querySelectorAll( ".page1-icon" ) , function ( icon ) {
            var src = icon.src;
            var outScr = src.slice( 0 , src.length - 4 ) + "-1.png";
            icon.onmouseover = function () {
                icon.src = outScr;
            };
            icon.onmouseout = function () {
                icon.src = src;
            };
        } );
        // 给左侧导航按钮添加点击事件
        loopArray( indicatorItems , function ( item , i ) {
            item.onclick = function () {
                if ( !isScrolling ) {
                    loopArray( yellowPhones , function ( phone ) {
                        phone.classList.add( "hide" );
                    } );
                    var isNeedFixed = (curPageIndex < 6 && curPageIndex > 0 ) && (i < 6 && i > 0);
                    if ( isNeedFixed ) {
                        yellowPhones[ curPageIndex - 1 ].classList.add( "hide" );
                        tempWrapper.classList.remove( "hide" );
                    }
                    isScrolling = true;
                    indicatorItems[ curPageIndex ] && indicatorItems[ curPageIndex ].classList.remove( "select" );
                    sections[ curPageIndex ] && sections[ curPageIndex ].classList.remove( "show" );

                    sections[ curPageIndex ] && sections[ curPageIndex ].stop && sections[ curPageIndex ].stop();// 将当前页面的动画暂停
                    curPageIndex = i;
                    sections[ curPageIndex ] && sections[ curPageIndex ].play && sections[ curPageIndex ].play();// 开始新页面的动画

                    indicatorItems[ curPageIndex ].classList.add( "select" );
                    sections[ curPageIndex ] && sections[ curPageIndex ].classList.add( "show" );
                    scrollWrapper.style.transform = "translate3d(0,-" + bodyHeight * curPageIndex + "px,0)";
                    setTimeout( function () {
                        isScrolling = false;
                        if ( isNeedFixed ) {
                            yellowPhones[ curPageIndex - 1 ].classList.remove( "hide" );
                            tempWrapper.classList.add( "hide" );
                        }
                    } , 1000 );
                    if ( !isNeedFixed && (curPageIndex < 6 && curPageIndex > 0) ) {
                        // 1,2,3,4,5
                        yellowPhones[ curPageIndex - 1 ].classList.remove( "hide" );
                        tempWrapper.classList.add( "hide" );
                    }
                }
            };
            item.onmouseover = function () {
                item.classList.add( "tap" );
            };
            item.onmouseout = function () {
                item.classList.remove( "tap" );
            };

        } );
        // page-2
        initPage2();
        // page-3
        initPage3();
        // page-4
        initPage4();
        // page-5
        initPage5();
        // footer
        initFooter();
    }

    init();
})();