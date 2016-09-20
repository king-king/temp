function loopObj(obj, func) {
    for (var key in obj) {
        func(key, obj[key]);
    }
}
function loopArray(arr, func) {
    for (var i = 0; i < arr.length; i++) {
        func(arr[i], i);
    }
}
function $(tag, obj, parent) {
    var dom = document.createElement(tag);
    loopObj(obj, function (key, value) {
        if (key == "classList") {
            loopArray(value, function (klass) {
                dom.classList.add(klass);
            });
        } else if (key == "css") {
            loopObj(value, function (n, v) {
                dom.style[n] = v;
            })
        } else if (key == "children") {
            loopArray(value, function (child) {
                dom.appendChild(child);
            });
        } else {
            dom[key] = value;
        }
    });
    parent && parent.appendChild(dom);
    return dom;
}
function css(el, obj) {
    loopObj(obj, function (key, value) {
        el.style[key] = value;
    })
}
function ajax(id, callback) {
    var url = id ? "http://api.ichuye.cn/protal/v1/realtime?lastId=" + id : "http://api.ichuye.cn/protal/v1/realtime";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(JSON.parse(xhr.responseText));
        }
    }
}
var content = document.querySelector(".content");
function T(text) {
    var test = $("div", {
        css: {
            display: "inline-block",
            position: "absolute",
            "line-height": "22px",
            "font-size": "14px",
            width: "187px"
        }
    }, document.body);
    test.innerHTML = text;
    var t;
    if (test.offsetHeight > 44) {
        for (var i = 2; i < text.length; i++) {
            test.innerHTML = text.slice(0, i) + "...";
            if (test.offsetHeight > 44) {
                t = text.slice(0, i - 1) + "...";
                break;
            }
        }
        document.body.removeChild(test);
        return t;
    } else {
        document.body.removeChild(test);
        return text;
    }
}

function func(data) {
    loopArray(data.data.Recommends, function (d) {
        var item = $("div", {
            classList: ["item"],
            css: {
                position: "relative",
                width: "192px",
                height: "290px",
                "margin-right": "10px",
                "float": "left"
            }
        }, content);
        var imgBorder = $("div", {
            css: {
                height: "192px",
                overflow: "hidden",
                background: "#dfdbd5"
            }
        }, item);
        var ah = $("a", {}, imgBorder);
        ah.href = d.WorkUrl;
        ah.target = "_blank";
        var thumbnail = $("img", {
            classList: ["thumbnailUrl"],
            src: d.ThumbnailUrl
        }, ah);
        thumbnail.onload = function () {
            if (thumbnail.naturalWidth > thumbnail.naturalHeight) {
                css(thumbnail, {
                    height: "100%",
                    "margin-left": -(192 / thumbnail.naturalHeight * thumbnail.naturalWidth - 192) / 2 + "px"
                });
            } else if (thumbnail.naturalWidth < thumbnail.naturalHeight) {
                css(thumbnail, {
                    width: "100%",
                    "margin-top": -(192 / thumbnail.naturalWidth * thumbnail.naturalHeight - 192) / 2 + "px"
                });
            } else {
                css(thumbnail, {
                    height: "100%"
                });
            }
        };
        var user = $("div", {
            css: {
                position: "relative",
                height: "22px",
                "line-height": "22px",
                "padding-left": "33px",
                "font-size": "13px",
                color: "#ff829e",
                "box-sizing": "border-box",
                "margin-top": "8px"
            },
            textContent: d.Author.Nickname
        }, item);
        $("div", {
            css: {
                height: "22px",
                width: "22px",
                position: "absolute",
                top: 0,
                left: "5px",
                "border-radius": "22px",
                overflow: "hidden"
            },
            children: [$("img", {
                src: d.Author.HeadPhotoUrl,
                css: {
                    height: "22px"
                }
            }, user)]
        }, user);
        $("div", {
            css: {
                "margin-top": "12px",
                height: "43px",
                "line-height": "22px",
                "font-size": "14px",
                "padding-left": "5px",
                "box-sizing": "border-box",
                overflow: "hidden"
            },
            innerHTML: T(d.Title)
        }, item);
    });
}
var lastID, loading = true, loadBtn = document.querySelector(".load-more");
loadBtn.textContent = "正在加载…";
ajax(lastID, function (data) {
    loadBtn.textContent = "加载更多";
    lastID = data.data.LastId;
    func(data);
    loading = false;
});
loadBtn.onclick = function () {
    if (!loading) {
        loadBtn.textContent = "正在加载…";
        loading = true;
        ajax(lastID, function (data) {
            loadBtn.textContent = "加载更多";
            loading = false;
            lastID = data.data.LastId;
            func(data);
        });
    }
};