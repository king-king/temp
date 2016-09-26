(function () {
    function checkBrowser() {
        var canvas = document.createElement("canvas");
        var div = document.createElement("div");
        if (!canvas || !canvas.getContext || !canvas.getContext("2d") || !document.querySelector || !div.classList) {
            makeDownloadPage();
            return true
        }
        function makeDownloadPage() {
            document.body.className = "not-support";
            document.body.innerHTML = "<div class='browser-update' ><h1>请升级您的浏览器</h1>" + "<h2>尊敬的用户，您现在使用的浏览器版本过低，请升级后继续使用初页的服务。</h2>" + "<h3>您可以选择：</h3>" + "<ul>" + "<li class='chrome'><a href='http://www.google.cn/intl/zh-CN/chrome/browser/' target='_blank'><h4>Google" + "Chrome</h4></a></li>" + "<li class='firefox'><a href='http://www.mozilla.org/zh-CN/firefox/new/' target='_blank'><h4>Mozilla Firefox</h4>" + "</a></li>" + "<li class='ie'><a href='http://www.microsoft.com/china/windows/IE/upgrade/index.aspx' target='_blank'><h4>" + "Internet Explorer 9+</h4></a></li>" + "</ul>" + "</div>"
        }

        return false
    }

    if (checkBrowser()) {
        return
    }
    var querySelector = document.querySelector.bind(document);
    var querySelectorAll = document.querySelectorAll.bind(document);
    var bodyHeight;
    var sections = querySelectorAll(".section");
    var wrappers = querySelectorAll(".wrapper");
    var scrollWrapper = querySelector(".scroll-wrapper");
    var indicatorItems = querySelectorAll(".indicator .item");
    var curPageIndex = 0;
    var isScrolling = false;
    var yellowPhones = querySelectorAll(".section .yellow-phone");
    var tempWrapper = querySelector(".temp-wrapper");
    var isAppleWebKit = navigator.userAgent.indexOf("AppleWebKit") != -1;
    var page5mask = querySelector(".page5-mask");
    var isMasking = false;

    function loopArray(arr, func) {
        for (var i = 0; i < arr.length; i++) {
            func(arr[i], i)
        }
    }

    function loop(count, func) {
        for (var i = 0; i < count; i++) {
            func(i)
        }
    }

    function bindEvent(el, type, func) {
        el.addEventListener(type, func);
        return {
            remove: function () {
                el.removeEventListener(type, func)
            }
        }
    }

    function resize() {
        bodyHeight = document.body.offsetHeight;
        page5mask.style.height = bodyHeight - 168 + "px";
        if (curPageIndex == 6) {
            scrollWrapper.style.transform = "translate3d(0,-" + (bodyHeight * 5 + 168) + "px,0)"
        } else {
            scrollWrapper.style.transform = "translate3d(0,-" + bodyHeight * curPageIndex + "px,0)"
        }
        var cubeHeight = bodyHeight > 768 ? 768 : bodyHeight;
        loopArray(sections, function (setction, i) {
            setction.style.height = bodyHeight + "px";
            wrappers[i].style.width = wrappers[i].style.height = cubeHeight + "px";
            wrappers[i].style.marginTop = -cubeHeight / 2 + "px";
            wrappers[i].style.marginLeft = -(cubeHeight * 0.52 << 0) + "px"
        });
        tempWrapper.style.width = tempWrapper.style.height = cubeHeight + "px";
        tempWrapper.style.marginTop = -cubeHeight / 2 + "px";
        tempWrapper.style.marginLeft = -(cubeHeight * 0.52 << 0) + "px"
    }

    function wheelScroll(direction) {
        if (isScrolling || isMasking) {
            return
        }
        isScrolling = true;
        indicatorItems[curPageIndex] && indicatorItems[curPageIndex].classList.remove("select");
        if (!(direction < 0 && curPageIndex == 5)) {
            sections[curPageIndex] && sections[curPageIndex].classList.remove("show")
        }
        if (direction < 0) {
            if (curPageIndex != 4) {
                sections[curPageIndex] && sections[curPageIndex].stop && sections[curPageIndex].stop();
                curPageIndex += 1;
                sections[curPageIndex] && sections[curPageIndex].play && sections[curPageIndex].play();
            }
        } else {
            if (curPageIndex != 0) {
                sections[curPageIndex] && sections[curPageIndex].stop && sections[curPageIndex].stop();
                curPageIndex -= 1;
                sections[curPageIndex] && sections[curPageIndex].play && sections[curPageIndex].play();
            }
        }
        loopArray(yellowPhones, function (phone) {
            phone.classList.add("hide")
        });
        if ((direction > 0 && curPageIndex == 0) || (direction < 0 && curPageIndex == 1)) {
            yellowPhones[0].classList.remove("hide");
            tempWrapper.classList.add("hide")
        } else if ((direction < 0 && curPageIndex == 4) || (direction > 0 && curPageIndex == 3)) {
            yellowPhones[2].classList.remove("hide");
            tempWrapper.classList.add("hide")
        } else if (direction == 0) {
            isScrolling = false;
            return
        } else {
            yellowPhones[curPageIndex - 1].classList.add("hide");
            tempWrapper.classList.remove("hide")
        }
        setTimeout(function () {
            isScrolling = false;
            if (curPageIndex < 4 && curPageIndex > 0) {
                yellowPhones[curPageIndex - 1].classList.remove("hide");
                tempWrapper.classList.add("hide")
            }
        }, 1000);
        if (curPageIndex == 4) {
            transform(scrollWrapper, "translate3d(0,-" + (bodyHeight * 3 + 167) + "px,0)")
        } else {
            indicatorItems[curPageIndex] && indicatorItems[curPageIndex].classList.add("select");
            sections[curPageIndex] && sections[curPageIndex].classList.add("show");
            transform(scrollWrapper, "translate3d(0,-" + bodyHeight * curPageIndex + "px,0)")
        }
    }

    function animate(duration, frame, onEnd) {
        var s = (new Date()).getTime();
        var timeID;
        timeID = setTimeout(function () {
            var cur = (new Date()).getTime();
            if (cur - s < duration) {
                frame((cur - s) / duration);
                timeID = setTimeout(arguments.callee, 20)
            } else {
                frame(1);
                onEnd()
            }
        }, 20);
        return {
            remove: function () {
                clearTimeout(timeID)
            }
        }
    }

    function Timer(duration, func) {
        var timeID;
        timeID = setTimeout(function () {
            timeID = setTimeout(arguments.callee, duration);
            func()
        }, duration);
        return {
            remove: function () {
                clearTimeout(timeID)
            }
        }
    }

    function transform(el, style) {
        el.style.webkitTransform = style;
        el.style.transform = style
    }

    function concurrentTask(tasks, callback) {
        var len = tasks.length, count = 0;
        tasks.forEach(function (task) {
            task(function () {
                ++count == len && callback()
            })
        })
    }

    function initPage0() {
        var curIndex = 0;
        var slideWrapper = querySelector(".page0-img-border-wrapper");
        var circles = querySelectorAll(".page0-circle");
        var qrBorder = querySelector(".page0-qr");
        qrBorder.onmouseover = function () {
            qrBorder.classList.add("onover")
        };
        qrBorder.onmouseout = function () {
            qrBorder.classList.remove("onover")
        };
        querySelector(".page0-btn").onclick = function () {
            location.href = this.getAttribute("w-rel") ? this.getAttribute("w-rel") : "/account/login"
        };
        querySelector(".page0-hot-btn").onclick = function () {
            location.href = this.getAttribute("w-rel")
        };
        loopArray(querySelectorAll(".page0-word"), function (word) {
            function onEnd() {
                word.style.setProperty("animation", "none")
            }

            bindEvent(word, "webkitAnimationEnd", onEnd);
            bindEvent(word, "animationend", onEnd)
        });
        loopArray(querySelectorAll(".page0-img-border-wrapper .item"), function (item, i) {
            item.style.left = 25 * i + "%"
        });
        function slide() {
            circles[curIndex].classList.remove("select");
            circles[curIndex + 1 == 3 ? 0 : curIndex + 1].classList.add("select");
            animate(400, function (percent) {
                slideWrapper.style.transform = "translate3d(-" + (25 * curIndex + 25 * percent * percent) + "%,0,0)"
                slideWrapper.style.webkitTransform = "translate3d(-" + (25 * curIndex + 25 * percent * percent) + "%,0,0)"
            }, function () {
                curIndex += 1;
                if (curIndex == 3) {
                    curIndex = 0;
                    slideWrapper.style.transform = "translate3d(0,0,0)"
                }
            })
        }

        var timerHandler = Timer(4000, slide);
        sections[0].stop = function () {
            loopArray(querySelectorAll(".page0-word"), function (word) {
                word.style.removeProperty("animation")
            });
            timerHandler && timerHandler.remove && timerHandler.remove()
        };
        sections[0].play = function () {
            loopArray(querySelectorAll(".page0-word"), function (word) {
                word.style.removeProperty("animation")
            });
            timerHandler && timerHandler.remove && timerHandler.remove();
            timerHandler = Timer(4000, slide)
        }
    }

    function initFooter() {
        var contactBtn = querySelector(".footer-contact-us");
        var chuyeInfo = querySelector(".chuye-info");
        var aboutUs = querySelector(".footer .about-us");
        var indicator = querySelector(".indicator");
        var wrapper = querySelector(".page5-mask-word-wrapper");
        querySelector(".page5-mask-close").onclick = function () {
            indicator.classList.remove("hide");
            page5mask.classList.remove("show");
            isMasking = false
        };
        aboutUs.onclick = function () {
            indicator.classList.toggle("hide");
            page5mask.classList.toggle("show");
            isMasking = !isMasking;
        };
        contactBtn.onmouseover = function () {
            chuyeInfo.classList.remove("hide")
        };
        contactBtn.onmouseout = function () {
            chuyeInfo.classList.add("hide")
        }
    }

    function init() {
        resize();
        var loadingTips = querySelector(".loading-tips");
        var contents = ["正在加载", "正在加载 .", "正在加载 . .", "正在加载 . . ."];
        var index = -1;
        var loadingHandler = Timer(500, function () {
            index = (index + 1) % 4;
            loadingTips.textContent = contents[index]
        });
        var page0Phone = querySelector(".page0-phone");
        page0Phone.src = page0Phone.getAttribute("data-src");
        page0Phone.onload = function () {
            sections[0].classList.add("show");
            loadingHandler.remove();
            document.querySelector(".content").classList.remove("hide");
            window.onresize = function () {
                resize()
            };
            initPage0()
        };
        bindEvent(document, "mousewheel", function (e) {
            wheelScroll(e.wheelDelta)
        });
        bindEvent(document, "DOMMouseScroll", function (e) {
            wheelScroll(-e.detail)
        });
        loopArray(querySelectorAll(".page1-icon"), function (icon) {
            var src = icon.src;
            var outScr = src.slice(0, src.length - 4) + "-1.png";
            icon.onmouseover = function () {
                icon.src = outScr
            };
            icon.onmouseout = function () {
                icon.src = src
            }
        });
        loopArray(indicatorItems, function (item, i) {
            item.onclick = function () {
                if (!isScrolling && !isMasking) {
                    loopArray(yellowPhones, function (phone) {
                        phone.classList.add("hide")
                    });
                    var isNeedFixed = (curPageIndex < 4 && curPageIndex > 0) && (i < 4 && i > 0);
                    if (isNeedFixed) {
                        yellowPhones[curPageIndex - 1].classList.add("hide");
                        tempWrapper.classList.remove("hide")
                    }
                    isScrolling = true;
                    indicatorItems[curPageIndex] && indicatorItems[curPageIndex].classList.remove("select");
                    sections[curPageIndex] && sections[curPageIndex].classList.remove("show");
                    sections[curPageIndex] && sections[curPageIndex].stop && sections[curPageIndex].stop();
                    curPageIndex = i;
                    sections[curPageIndex] && sections[curPageIndex].play && sections[curPageIndex].play();
                    indicatorItems[curPageIndex].classList.add("select");
                    sections[curPageIndex] && sections[curPageIndex].classList.add("show");
                    transform(scrollWrapper, "translate3d(0,-" + bodyHeight * curPageIndex + "px,0)");
                    setTimeout(function () {
                        isScrolling = false;
                        if (isNeedFixed) {
                            yellowPhones[curPageIndex - 1].classList.remove("hide");
                            tempWrapper.classList.add("hide")
                        }
                    }, 1000);
                    if (!isNeedFixed && (curPageIndex < 6 && curPageIndex > 0)) {
                        yellowPhones[curPageIndex - 1].classList.remove("hide");
                        tempWrapper.classList.add("hide")
                    }
                }
            };
            item.onmouseover = function () {
                item.classList.add("tap")
            };
            item.onmouseout = function () {
                item.classList.remove("tap")
            }
        });
        initFooter()
    }

    init()
})();