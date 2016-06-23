/**
 * Created by wq on 16/6/21.
 */
function loopArray(arr, func) {
    for (var i = 0; i < arr.length; i++) {
        func(arr[i], i);
    }
}

function loop(i, func) {
    for (var n = 0; n < i; n++) {
        func(n);
    }
}

function css(el, style) {
    for (var key in style) {
        el.style.setProperty(key, style[key], null);
    }
    return el;
}

function addEventListener(el, type, listener, useCapture) {
    el.addEventListener(type, listener, useCapture);
    return {
        remove: function () {
            el.removeEventListener(type, listener, useCapture);
        }
    }
}

function onTap(el, func) {
    addEventListener(el, "touchstart", function (e) {
        var x0 = e.touches[0].pageX;
        var y0 = e.touches[0].pageY;
        var x1, y1;
        var isTap = true;
        el.classList.add("tap");
        var mh = addEventListener(document, "touchmove", function (e) {
            if (isTap) {
                x1 = e.touches[0].pageX;
                y1 = e.touches[0].pageY;
                if ((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0) > 10) {
                    isTap = false;
                }
            }
        });
        var gh = addEventListener(document, "touchend", function () {
            el.classList.remove("tap");
            gh.remove();
            jh.remove();
            mh.remove();
        });
        var jh = addEventListener(el, "touchend", function () {
            isTap && func();
        });
    });
}

var insertCSSRules = function () {
    var style = document.createElement("style");
    document.querySelector("head").appendChild(style);
    return function (rules) {
        for (var selector in rules) {
            style.sheet.insertRule(selector + "" + JSON.stringify(rules[selector]).replace(/"/g, "").replace(/,/g, ";"), style.sheet.rules.length);
            console.log(selector + "" + JSON.stringify(rules[selector]).replace(/"/g, "").replace(/,/g, ";"))
        }
    }
}();

function $(tagName, arg, parent) {
    var el = document.createElement(tagName);
    for (var key in arg) {
        switch (key) {
            case "classList":
                if (Object.prototype.toString.call(arg[key]) == "[object String]") {
                    el.classList.add(arg[key]);
                }
                else if (Object.prototype.toString.call(arg[key]) == "[object Array]") {
                    loopArray(arg[key], function (klass) {
                        el.classList.add(klass);
                    });
                }
                break;
            case "css":
                css(el, arg[key]);
                break;
            case "children":
                loopArray(arg[key], function (child) {
                    el.appendChild(child);
                });
                break;
            default :
                el[key] = arg[key];
        }
    }
    parent && parent.appendChild(el);
    return el;
}
