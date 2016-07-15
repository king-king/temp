var JIATHIS_CONFIGS = {
    webhost: "http://www.jiathis.com",
    lhost: "http://l.jiathis.com",
    shost: "http://s.jiathis.com",
    _s: null,
    codehost: "",
    sc: false,
    uid: 1626433,
    ckprefix: "jt_",
    jtcbk: "jtss",
    jtck: "",
    custom: [],
    servicelist: {
        // 'jt_weixin': '微信,wx,weixin,weixin.qq.com',
        'jt_tsina': '微博,xlwb,weibo.com',
        'jt_cqq': 'QQ好友,cqq,qqhl,connect.qq.com',
        'jt_qzone': 'QQ空间,qqkj,sns.qzone.qq.com',
        'jt_copy': '复制网址,fzwz',
        // 'jt_fav': '收藏夹,scj',
        'jt_print': '打印,dy',
        'jt_email': '邮件,yj',
        'jt_renren': '人人网,rrw,www.renren.com',
        'jt_kaixin001': '开心网,kxw,www.kaixin001.com',
        'jt_evernote': '印象笔记,evernote',
        'jt_linkedin': '领英,linkedin',
        'jt_feixin': '飞信,fx,space.feixin.10086.cn',
        'jt_douban': '豆瓣,db,www.douban.com',
        'jt_twitter': 'Twitter,twitter,t.co',
        'jt_fb': 'Facebook,facebook,www.facebook.com',
        'jt_ishare': '一键分享,yjfx',
        'jt_ujian': '猜你喜欢,cnxh',
        'jt_yixin': '易信,yx,www.yixin.im',
        'jt_huaban': '花瓣网,hbw,huaban.com',
        'jt_tqq': '腾讯微博,txwb,t.qq.com',
        'jt_googleplus': 'Google+,googlej,plus.url.google.com',
        'jt_alibaba': '阿里巴巴,albb,www.1688.com',
        'jt_xiaoyou': '朋友网,pyw,share.pengyou.com',
        'jt_sdonote': '麦库记事,mkjs',
        'jt_baidu': '百度搜藏,bdsc,cang.baidu.com',
        'jt_gmail': 'Gmail邮箱,gmailyx,mail.google.com',
        'jt_ydnote': '有道云笔记,ydybj,note.youdao.com',
        'jt_tianya': '天涯社区,tysq,my.tianya.cn',
        'jt_tieba': '百度贴吧,bdtb,tieba.baidu.com',
        'jt_qingbiji': '轻笔记,qbj',
        'jt_tifeng': '凤凰微博,fhwb,t.ifeng.com',
        'jt_fanfou': '饭否,ff,fanfou.com',
        'jt_mingdao': '明道,md,www.mingdao.com',
        'jt_douban9dian': '豆瓣9点,db9d,9.douban.com',
        'jt_google': '谷歌,gg',
        'jt_buzz': '谷歌Buzz,ggbuzz',
        'jt_youdao': '有道书签,ydsq,shuqian.youdao.com',
        'jt_qq': 'QQ书签,qqsq,shuqian.qq.com',
        'jt_msn': 'MSN,msn',
        'jt_pinterest': 'Pinterest,pinterest',
        'jt_duitang': '堆糖,dt,www.duitang.com',
        'jt_tyaolan': '摇篮微博,ylwb',
        'jt_hi': '百度空间,bdkj,apps.hi.baidu.com',
        'jt_hotmail': 'Hotmail邮箱,hotmailyx',
        'jt_xqw': '雪球,xqw,xueqi.com',
        'jt_hexun': '和讯,hx,bookmark.hexun.com',
        'jt_139mail': '139邮箱,139yx',
        'jt_189mail': '189邮箱,189yx',
        'jt_189cn': '翼友圈,yyq,club.189.cn',
        'jt_tpeople': '人民微博,rmwb,t.people.com.cn',
        'jt_txinhua': '新华微博,xhwb',
        'jt_translate': '谷歌翻译,ggfy',
        'jt_tuita': '推他,tt,www.tuita.com',
        'jt_mop': '猫扑推客,mptk,tk.mop.com',
        'jt_meilishuo': '美丽说,mls',
        'jt_mogujie': '蘑菇街,mgj,mogujie.cn',
        'jt_ganniu': '赶牛网,gnw,www.ganniu.com',
        'jt_poco': 'Poco网,pocow,my.poco.cn',
        'jt_leihou': '雷猴网,lhw,leihou.com',
        'jt_thexun': '和讯微博,hxwb,t.hexun.com',
        'jt_dream163': '游戏江湖,yxjh,hi.163.com',
        'jt_jcrb': '法律微博,flwb',
        'jt_tumblr': 'Tumblr,tumblr,www.tumblr.com',
        'jt_reddit': 'Reddit,reddit',
        'jt_instapaper': 'Instapaper,instapaper,www.instapaper.com',
        'jt_pocket': 'Pocket,pocket,getpocket.com',
        'jt_caimi': '财迷,cm,t.eastmoney.com',
        'jt_iwo': 'WO+分享,iwo,wfx,i.wo.com.cn',
        'jt_waakee': '挖客网,wkw',
        'jt_cyzone': '创业邦,cyb,u.cyzone.cn',
        'jt_99earth': '救救地球,jjdq',
        'jt_chouti': '抽屉网,ctw',
        'jt_dig24': '递客网,dkw,www.dig24.cn',
        'jt_yijee': '易集网,yjw,www.yijee.com',
        'jt_pdfonline': 'Pdf在线转换,pdfzxzh',
        'jt_printfriendly': '友好打印,yhdy',
        'jt_w3c': 'W3c验证,w3cyz',
        'jt_bitly': 'Bit.ly,bitly,bit.ly',
        'jt_digg': 'Digg,digg,digg.com',
        'jt_mailru': 'Mail.ru,mail.ru',
        'jt_diigo': 'Diigo,diigo',
        'jt_friendfeed': 'FriendFeed,friendfeed',
        'jt_myspace': 'Myspace,myspace',
        'jt_mixx': 'Mixx,mixx',
        'jt_netlog': 'NetLog,netlog',
        'jt_netvibes': 'Netvibes,netvibes',
        'jt_phonefavs': 'Phonefavs,phonefavs',
        'jt_pingfm': 'Ping.fm,ping.fm',
        'jt_plaxo': 'Plaxo,plaxo',
        'jt_delicious': 'Delicious,delicious,www.delicious.com',
        'jt_wong': 'Mister Wong,misterwong',
        'jt_stumbleupon': 'Stumbleupon,stumbleupon',
        'jt_plurk': 'Plurk,plurk',
        'jt_funp': 'Funp,funp',
        'jt_myshare': 'Myshare,myshare'
    }
};
(function () {
    var z = document.getElementsByTagName('script');
    for (var i = 0, ci; ci = z[i++];) {
        if (/jiathis.com/.test(ci.src)) {
            JIATHIS_CONFIGS.codehost = ci.src.substring(0, ci.src.lastIndexOf("/"));
            ci.src.replace(/(uid)=([^&]+)/g, function (a, p, v) {
                JIATHIS_CONFIGS[p] = v
            })
        }
    }
    var d = document, isStrict = d.compatMode == "CSS1Compat", dd = d.documentElement, db = d.body, m = Math.max, ie = !!d.all, ua = navigator.userAgent.toLowerCase(), head = d.getElementsByTagName("head")[0] || dd, wlh = window.location.host, conf = (typeof(jiathis_config) == 'undefined') ? {} : jiathis_config, _ckpre = JIATHIS_CONFIGS.ckprefix, _lists = JIATHIS_CONFIGS.servicelist, _ref = d.referrer, _reced = false, getWH = function () {
            return {h: (isStrict ? dd : db).clientHeight, w: (isStrict ? dd : db).clientWidth}
        }, getS = function () {
            return {t: m(dd.scrollTop, db.scrollTop), l: m(dd.scrollLeft, db.scrollLeft)}
        },
        creElm = function (o, t, a) {
            var b = d.createElement(t || "div");
            loopObj(o, function (p) {
                p == "style" ? (b[p].cssText = o[p]) : (b[p] = o[p]);
            });
            return (a || db).insertBefore(b, (a || db).firstChild)
        }, _uniqueConcat = function (a, b) {
            var c = {}, i;
            for (i = 0; i < a.length; i++) {
                c[a[i]] = 1
            }
            for (i = 0; i < b.length; i++) {
                if (!c[b[i]]) {
                    a.push(b[i]);
                    c[b[i]] = 1
                }
            }
            return a
        }, _sc = function (a, b, c) {
            var d = new Date();
            d.setTime(d.getTime() + c * 1000);
            document.cookie = a + "=" + escape(b) + (c ? ";expires=" + d.toGMTString() : "") + ";path=/"
        }, _gc = function (a) {
            var b = document.cookie;
            var c = b.indexOf(a + "=");
            if (c != -1) {
                c += a.length + 1;
                var d = b.indexOf(";", c);
                if (d == -1) {
                    d = b.length
                }
                return unescape(b.substring(c, d))
            }
            return ""
        }, _MR = function (w, d, a) {
            w /= d;
            w = Math.round(w * 10) / 10;
            if ((w + "").length >= 4) {
                w = Math.round(w)
            }
            return w + a
        }, _FN = function (a) {
            var d = ("" + a).split(".").shift().length;
            if (isNaN(a)) {
                return '0'
            } else {
                if (d < 4) {
                    return Math.round(a)
                } else {
                    if (d < 7) {
                        return _MR(a, 1000, "K")
                    } else {
                        if (d < 10) {
                            return _MR(a, 1000000, "M")
                        } else {
                            return _MR(a, 1000000000, "B")
                        }
                    }
                }
            }
        }, _rck = function (X) {
            var A = {}, D = (new Date()).getTime(), E, F, G, H, V = String(X);
            if (V !== undefined && V.indexOf("|") > -1) {
                E = V.split('|');
                F = E[0];
                G = E[1];
                H = Math.floor((D - G) / 1000);
                A.shares = parseInt(F);
                A.lifetime = G;
                A.timedeff = H;
                return A
            }
            return false
        }, _gck = function () {
            var A = _gc("jiathis_rdc"), B = {};
            if (A) {
                B = eval("(" + A + ")")
            }
            return B
        }, _sck = function (U, S, T) {
            var A = _gck();
            if (A[U]) {
                delete A[U]
            }
            $CKE.shares = parseInt(S);
            A[U] = '"' + parseInt(S) + '|' + T + '"';
            _sc("jiathis_rdc", _otc(A), 0)
        }, _otc = function (o) {
            var A = '', B = '';
            loopObj(o, function (k) {
                A += B + '"' + k + '":' + o[k];
                B = !B ? ',' : B
            });
            return "{" + A + "}"
        }, _renderCounter = function (a, b) {
            loopObj(a, function (k) {
                var c = d.getElementById(a[k]);
                if (c) {
                    c.title = '累计分享' + b + '次';
                    c.innerHTML = _FN(b)
                }
            });
        }, _custom = function () {
            var u = conf.services_custom;
            if (u) {
                if (!(u instanceof Array)) {
                    u = [u]
                }
                for (var a = 0; a < u.length; a++) {
                    var c = u[a];
                    if (c.name && c.icon && c.url) {
                        c.code = c.url = c.url.replace(/ /g, "");
                        c.code = c.code.split("//").pop().split("?").shift().split("/").shift().toLowerCase();
                        JIATHIS_CONFIGS.custom[c.code] = c;
                        JIATHIS_CONFIGS.servicelist[_ckpre + c.code] = c.name + ',' + c.code + ',' + c.code
                    }
                }
            }
        }, _gw = function (a, b, c) {
            var d = "";
            do {
                d = a[b++]
            } while (b < a.length && (!_lists[_ckpre + d] || c[d]));
            if (c[d] || !_lists[_ckpre + d]) {
                d = '';
                loopObj(_lists, function (k) {
                    k = k.slice(3);
                    if (!c[k] && _lists[_ckpre + k]) {
                        d = k;
                        return true;
                    }
                });
            }
            return d
        }, _renderToolbox = function () {
            _custom();
            var hidemore = conf.hideMore || false;
            var f = "qzone,tsina,tqq,weixin,renren,kaixin001,evernote,linkedin,douban,ydnote,xiaoyou,msn,fb,twitter,tieba,baidu,google", _jck = JIATHIS_CONFIGS.jtck || f, jck = _uniqueConcat(_jck.split(","), f.split(",")), parentServices = {}, _WR = {}, h = d.getElementsByTagName("a"), _url = String(conf.url || d.location), _CF = null, webid, likeid, tl, fl, bt, preferred;
            for (var i = 0, ci, tmp; ci = h[i++];) {
                if (/\bjiathis\b/.test(ci.className)) {
                    ci.onmouseout = $CKE.out;
                    ci.onmousemove = $CKE.move;
                    !hidemore && (ci.onclick = $CKE.center);
                    ci.onmouseover = $CKE.over;
                    ci.hideFocus = true;
                    continue;
                }
                webid = '', likeid = '', tl = false, fl = false, bt = false, preferred = false;
                if (ci.className && (tmp = ci.className.match(/^jiathis_button_([\w\.]+)(?:\s|$)/)) && tmp[1]) {
                    if (tmp[1].indexOf("tools") > -1 || tmp[1].indexOf("icons") > -1) {
                        var s;
                        if (tmp[1].indexOf("tools") > -1) {
                            tl = true;
                            s = ci.className.match(/jiathis_button_tools_([0-9]+)(?:\s|$)/)
                        } else {
                            s = ci.className.match(/jiathis_button_icons_([0-9]+)(?:\s|$)/)
                        }
                        var g = ((s && s.length) ? Math.min(16, Math.max(1, parseInt(s[1]))) : 1) - 1;
                        webid = _gw(jck, g, parentServices);
                        preferred = true
                    } else {
                        webid = tmp[1]
                    }
                    bt = true
                }
                if (webid && _lists[_ckpre + webid]) {
                    bt && (parentServices[webid] = 1);
                    var j = function (a, b) {
                        for (var c in b) {
                            var o = b[c];
                            if (o.preferred && o.webid == a) {
                                return c;
                            }
                        }
                        return false
                    }, t = j(webid, _WR);
                    if (t !== false) {
                        var T = _WR[t] || {};
                        if (T.webid && T.ci) {
                            var TWID = _gw(jck, 0, parentServices);
                            T.bt && (parentServices[TWID] = 1);
                            _WR[t] = {
                                "ci": T.ci,
                                "webid": TWID,
                                "bt": T.bt,
                                "fl": T.fl,
                                "tl": T.tl,
                                "preferred": T.preferred
                            }
                        }
                    }
                    _WR[i] = {"ci": ci, "webid": webid, "bt": bt, "fl": fl, "tl": tl, "preferred": preferred}
                } else if (bt || fl) {
                    ci.innerHTML = ""
                }
            }
            if (_WR) {
                loopObj(_WR, function (k) {
                    var o = _WR[k], ci = o.ci, fl = o.fl, tl = o.tl, webid = o.webid;
                    if (typeof(ci) == "object" && ci.innerHTML.indexOf('jtico jtico_') == -1) {
                        var v = _lists[_ckpre + webid].split(',');
                        var w = ci.innerHTML.replace(/^\s+|\s+$/g, "");
                        var x = JIATHIS_CONFIGS.custom[webid] || {};
                        var y = (x.icon) ? ' style="background:url(' + x.icon + ') no-repeat left;"' : '';
                        if (tl || w) {
                            w = w ? w : v[0];
                            ci.innerHTML = '<span class="jiathis_txt jiathis_separator jtico jtico_' + webid + '"' + y + '>' + w + '</span>'
                        } else {
                            ci.innerHTML = '<span class="jiathis_txt jtico jtico_' + webid + '"' + y + '></span>'
                        }
                        if (fl) {
                            ci.onclick = function (a) {
                                return function () {
                                    window.open(a.rel, '')
                                }
                            }(ci);
                            ci.title = ci.title ? ci.title : "在" + v[0] + "关注我们"
                        } else {
                            ci.onclick = function (a) {
                                return function () {
                                    jiathis_sendto(a)
                                }
                            }(webid);
                            if (!ci.title) {
                                if (webid == 'copy' || webid == 'print') {
                                    ci.title = v[0]
                                } else if (webid == 'fav') {
                                    ci.title = "加入" + v[0]
                                } else {
                                    ci.title = "分享到" + v[0]
                                }
                            }
                        }
                    }
                });
            }
            if (_CF) {
                $CKE.counter()
            }
        },
        _rec = function (e) {
            if (!_reced) {
                _renderToolbox();
                _req();
                _reced = true
            }
        }, _req = function () {
            var a, s, E = encodeURIComponent, o = _grf(_ref), T = document.title || "", Y = window.location.href || "", an = Y ? Y.indexOf(JIATHIS_CONFIGS.jtcbk) : -1, d1 = _gd(o.host), d2 = _gd(Y), q = null, f = (d1 && d2 && d1 == d2) ? false : true;
            if (an > -1) {
                a = Y.substr(an);
                q = a.split("#").pop().split("-").pop().split("=").pop();
                q = _lists[_ckpre + q] ? q : ''
            }
            q = (!q && o.webid) ? o.webid : q;
            if (q && f) {
                s = 'rsc=' + q + '&rnm=' + parseInt(JIATHIS_CONFIGS.uid) + '&rfh=' + E(o.host) + '&rfp=' + E(o.path) + '&pre=' + E(Y) + '&tit=' + escape(T);
                (new Image).src = JIATHIS_CONFIGS.lhost + "/l.gif?" + s
            }
        }, _gd = function (o) {
            var d = null;
            if (o) {
                d = o.split(".").slice(-2).join(".");
                d = (d == "com.cn") ? o.split(".").slice(-3).join(".") : d;
                d = d.split("/").shift()
            }
            return d
        }, _grf = function (r) {
            var h = "", p = "", q = "", m;
            if (r.match(/(?:[a-z]\:\/\/)([^\/\?]+)(.*)/gi)) {
                h = RegExp.$1;
                p = RegExp.$2;
                h = h ? h : "";
                p = p ? p : "";
                if (h) {
                    for (var k in _lists) {
                        m = _lists[k].split(',');
                        if (m[2] && m[2] == h) {
                            q = k.slice(3);
                            break
                        }
                    }
                }
            }
            return {host: h, path: p, webid: q}
        },
        jiathis_utility_ifr = !!window.postMessage ? creElm({
            style: "display:none;",
            frameBorder: 0,
            src: JIATHIS_CONFIGS.codehost + "/share/jiathis_utility.html" //todo 修改路径
        }, "iframe") : null,
        div = creElm({
            className: "jiathis_style",
            style: "position:absolute;z-index:1000000000;display:none;overflow:auto;"
        }),
        div1 = creElm({
            className: "jiathis_style",
            style: "position:absolute;z-index:1000000000;display:none;top:50%;left:50%;overflow:auto;"
        }),
        iframe = creElm({
            style: "position:" + (/firefox/.test(ua) ? "fixed" : "absolute") + ";display:none;filter:alpha(opacity=0);opacity:0",
            frameBorder: 0
        }, "iframe"), timer, inputTimer, list, clist, h, texts = {}, ckcpjs;
    creElm({href: JIATHIS_CONFIGS.codehost + "/share/jiathis_share.css", rel: "stylesheet", type: "text/css"}, "link");
    $CKE = {
        jid: "", pop: div, centerpop: div1, shares: 0, containers: [], disappear: function (a) {
            var b = window.event || a, t = b.srcElement || b.target, tn = t.tagName ? t.tagName.toUpperCase() : "", c = div.contains ? div.contains(t) : !!(div.compareDocumentPosition(t) & 16), c1 = div1.contains ? div1.contains(t) : !!(div1.compareDocumentPosition(t) & 16), c2 = true;
            if (tn == "IMG") {
                c2 = t.parentNode.className.indexOf("jiathis") == "-1"
            } else if (tn == "A") {
                c2 = t.className.indexOf("jiathis") == "-1"
            } else if (tn == "SPAN") {
                c2 = t.className.indexOf("jiathis_counter") == "-1"
            }
            if (!c && !c1 && c2) {
                iframe.style.display = div1.style.display = 'none'
            }
        }, over: function () {
            return false
        }, out: function () {
            timer = setTimeout(function () {
                div.style.display = "none";
                div1.style.display != "block" && (iframe.style.display = "none")
            }, 100)
        }, move: function () {
            clearTimeout(timer)
        }, center: function () {
            div.style.display = iframe.style.display = "none";
            if (!ckcpjs) {
                ckcpjs = creElm({src: JIATHIS_CONFIGS.codehost + "ckecenterpop.js", charset: "utf-8"}, "script", head);
                db.style.position = "static"
            } else {
                var a = getS();
                div1.style.display = "block";
                div1.style.margin = (-div1.offsetHeight / 2 + a.t) + "px " + (-div1.offsetWidth / 2 + a.l) + "px";
                list = d.getElementById("jiathis_sharelist"), clist = list.cloneNode(true), h = clist.getElementsByTagName("input");
                for (var i = 0, ci; ci = h[i++];) {
                    texts[ci.value] = ci.parentNode
                }
                with (iframe.style) {
                    left = top = "50%";
                    width = div1.offsetWidth + "px";
                    height = div1.offsetHeight + "px";
                    margin = div1.style.margin;
                    display = "block"
                }
            }
            return false
        }, choose: function (o) {
            clearTimeout(inputTimer);
            inputTimer = setTimeout(function () {
                var s = o.value.replace(/^\s+|\s+$/, ""), frag = d.createDocumentFragment();
                for (var p in texts) {
                    eval("var f = /" + (s || ".") + "/ig.test(p)");
                    !!texts[p].cloneNode && (f && frag.appendChild(texts[p].cloneNode(true)))
                }
                list.innerHTML = "";
                list.appendChild(frag)
            }, 100)
        }, centerClose: function () {
            iframe.style.display = div1.style.display = "none"
        }, rdc: function (o) {
            if (o.shares !== undefined) {
                var A = $CKE.containers, B = parseInt(o.shares), C = String(conf.url || d.location), D = _gck(), J = _rck(D[C]), T = (new Date()).getTime(), S = B;
                if (J && J.shares > B) {
                    S = J.shares
                }
                _sck(C, S, T);
                _renderCounter(A, S)
            }
        }, counter: function () {
        }, open: function (A) {
            creElm({src: A, charset: "utf-8"}, "script", head)
        }, fireEvent: function (F, O) {
            if (F) {
                F = typeof(F) == "function" ? F : eval(F);
                F(O)
            }
        }
    };
    if (!!window.addEventListener) {
        !!window.addEventListener && window.addEventListener("message", _rec, false)
    } else {
        if (!!window.postMessage) {
            (!!window.attachEvent && window.attachEvent("onmessage", _rec))
        } else {
            _renderToolbox()
        }
    }
    div.onmouseover = function () {
        clearTimeout(timer)
    };
    div.onmouseout = function () {
        $CKE.out()
    };
    ie ? d.attachEvent("onclick", $CKE.disappear) : d.addEventListener("click", $CKE.disappear, false);
})();
function jiathis_sendto(a) {
    var b = jiathis_get_des(), pic = jiathis_get_pic();
    var c = jiathis_config || {};
    var d = encodeURIComponent, cu = JIATHIS_CONFIGS.custom[a] || {}, U = String(c.url || document.location), W = "?webid=" + a, G = "&url=" + d(U), T = "&title=" + d(c.title || document.title), S = c.summary ? "&summary=" + d(c.summary) : (b ? "&summary=" + d(b) : ""), F = JIATHIS_CONFIGS.uid ? "&uid=" + parseInt(JIATHIS_CONFIGS.uid) : "", E = c.data_track_clickback ? "&jtss=1" : "", K = (c.appkey && c.appkey[a]) ? "&appkey=" + c.appkey[a] : "", P = c.pic ? "&pic=" + d(c.pic) : (pic ? "&pic=" + d(pic) : ''), C = $CKE.jid ? "&jid=" + $CKE.jid : "", R = (c.ralateuid && c.ralateuid[a]) ? "&ralateuid=" + c.ralateuid[a] : "", Q = (c.evt && c.evt['share']) ? c.evt['share'] : null, A = 'http://s.jiathis.com/', X = (cu.name && cu.url) ? "&acn=" + d(cu.name) + "&acu=" + d(cu.url) : "", SU = c.shortUrl == false ? '' : '&su=1';
    B = A + W + G + T + F + E + K + P + R + S + X + C + SU;
    if (a == 'copy' || a == 'fav' || a == 'print' || a == 'weixin') {
        $CKE.open(B);
        if (a == 'copy') {
            jiathis_copyUrl()
        } else if (a == 'fav') {
            jiathis_addBookmark()
        } else {
            window.print()
        }
    } else {
        window.open(B, '')
    }
    $CKE.rdc({shares: ($CKE.shares + 1)});
    $CKE.fireEvent(Q, {type: 'share', data: {service: a, url: U}});
    return false
}
function jiathis_addBookmark() {
    var d = jiathis_config || {};
    var a = d.title || document.title;
    var b = d.url || parent.location.href;
    var c = window.sidebar;
    if (c && !!c.addPanel) {
        c.addPanel(a, b, "")
    } else if (document.all) {
        window.external.AddFavorite(b, a)
    } else {
        alert('请按 Ctrl + D 为你的浏览器添加书签！')
    }
}
function jiathis_copyUrl() {
    var d = jiathis_config || {};
    var a = d.url || this.location.href;
    var b = d.title || document.title;
    var c = b + " " + a;
    var f = navigator.userAgent.toLowerCase();
    var g = f.indexOf('opera') != -1 && opera.version();
    var h = (f.indexOf('msie') != -1 && !g) && f.substr(f.indexOf('msie') + 5, 3);
    if (h) {
        clipboardData.setData('Text', c);
        alert("复制成功,请粘贴到你的QQ/MSN上推荐给你的好友！")
    } else if (prompt('你使用的是非IE核心浏览器，请按下 Ctrl+C 复制代码到剪贴板', c)) {
        alert('复制成功,请粘贴到你的QQ/MSN上推荐给你的好友！')
    } else {
        alert('目前只支持IE，请复制地址栏URL,推荐给你的QQ/MSN好友！')
    }
}
function jiathis_get_pic() {
    var a = document.getElementsByTagName('img'), pic = '', con = '', picArr = [];
    for (var i = 0; i < a.length; i++) {
        var b = parseInt(a.item(i).offsetWidth), imgH = parseInt(a.item(i).offsetHeight), minW = 300, minH = 150, width = (300 / imgH) * 150, height = (150 / b) * 300;
        if (b >= minW && imgH >= minH) {
            if ((width - height) <= 150) {
                pic += con + a.item(i).src;
                con = ','
            }
        }
    }
    picArr = pic.split(',');
    var c = parseInt(Math.random() * picArr.length);
    return picArr[c]
}
function jiathis_get_des() {
    var a = '';
    var b = document.getElementsByTagName("meta");
    var c = b.length;
    if (/msie/i.test(navigator.userAgent)) {
        for (var i = 0; i < c; i++) {
            if (b[i].name == 'description') {
                a = b[i].content
            }
        }
        if (a == '') {
            for (var k in b) {
                if (k == 'description') {
                    a = b[k].content
                }
            }
        }
        if (/msie 6/i.test(navigator.userAgent)) {
            a = ''
        }
    } else {
        for (k in b) {
            if (/chrome/i.test(navigator.userAgent)) {
                if (typeof(b[k].name) != 'undefined') {
                    if (b[k].name == 'description') {
                        a = b[k].content
                    }
                }
            } else {
                if (k == 'description') {
                    a = b[k].content
                }
            }
        }
    }
    a = a.replace(/\s/g, '');
    return a
}
function loopObj(obj, func) {
    for (var k in obj) {
        if (func(k, obj[k])) {
            break;
        }
    }
}
