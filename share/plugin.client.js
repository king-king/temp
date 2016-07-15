(function () {
    var d = document, w = window, dd = d.documentElement, db = d.body, head = d.getElementsByTagName("head")[0] || dd, ws = w.screen, dm = w.location.host || "", dm = dm.replace(/^www\./, ''), na = navigator, ua = na.userAgent.toLowerCase(), se = {
        baidu: 'wd',
        google: 'q',
        haosou: 'q',
        soso: 'w',
        sogou: 'query',
        yahoo: 'p',
        youdao: 'q',
        iask: 'k',
        'sina': 'key',
        zhongsou: 'w',
        bing: 'q',
        so: 'q'
    }, dms = {
        cn: 'com|org|gov|net',
        tw: 'com',
        hk: 'com'
    }, ec = encodeURIComponent, H = 'http://lc.jiathis.com', MU = H + '/c.gif', idurl = 'http://id.jiathis.com/id.php', p,
    intsallUyan = 0, intsallUjian = 0, scr = d.getElementsByTagName('script');
    for (var i = 0, ss; ss = scr[i++];) {
        if (ss.src) {
            if (ss.src.indexOf('jia.js') != -1 || ss.src.indexOf('jiathis_r.js') != -1) {
                intsallJiathis = 1
            }
            if (ss.src.indexOf('uyan.js') != -1 || ss.src.indexOf('uyan.cc/js/iframe.js') != -1) {
                intsallUyan = 1
            }
            if (ss.src.indexOf('ujian.js') != -1) {
                intsallUjian = 1
            }
            if (ss.src.indexOf('plugin.client.js') != -1) {
                ss.src.replace(/(u|t|r|f)=([^&]+)/g, function (a, p, v) {
                    params[p] = v
                })
            }
        }
    }
    w._gnayTrack = {
        creElm: function (o, t, a) {
            var b = d.createElement(t || "div");
            for (var p in o) {
                p == "style" ? (b[p].cssText = o[p]) : (b[p] = o[p])
            }
            return (a || db).insertBefore(b, (a || db).firstChild)
        }, trim: function (s) {
            return s.replace(/^\s+|\s+$/g, '')
        }, getP: function (s, n, d) {
            s = n == 'p' ? s.replace("fp_ip=", "fp_ips=") : s;
            return s.match(new RegExp(n.replace(/([\[\]])/g, '\\\$1') + "=([^&\\?#]*)"), 'gm') ? RegExp.$1 : d || null
        }, getDm: function (h, g) {
            var k = h.split('.').reverse(), i = 0, l = k.length, o, ao;
            do {
                o = k[i];
                ao = k[i + 1];
                if (dms[o] && ao && ao.match(dms[o])) {
                    break
                }
            } while (++i < l);
            o = k[i < l ? i + 2 : 1];
            if (g && o) {
                o = "." + h.match(new RegExp(".*(" + o + ".*?)$"))[1]
            }
            return o
        }, getRf: function (r) {
            if (r.match(/(?:[a-z]\:\/\/)([^\/\?]+)(.*)/gi)) {
                var o = {host: RegExp.$1, path: RegExp.$2}, h = this.getDm(o.host), k;
                if (se[h]) {
                    k = this.getP(o.path, se[h]);
                    o.key = k;
                    o.source = h
                }
                return o
            }
            return 0
        }, def: function (o) {
            return o && typeof o != 'undefined' && o != 'undefined'
        }, getReqUrl: function () {
            var r = this.trim(params['f'] == 'j' ? (params['r'] != null ? params['r'] : '') : d.referrer);
            var a = this.trim(String(params['f'] == 'j' ? (params['t'] != null ? params['t'] : '') : d.title));
            var b = this.trim(String(params['f'] == 'j' ? (params['u'] != null ? params['u'] : '') : d.location));
            var o = this.getRf(r), keyword = "", source = "", ref = "", b = 'u=' + ec(b) + '&t=' + ec(a);
            if (o && o.host != dm && !o.host.match(dm.replace(/^www/, '').replace(/\./g, '\\.') + '$') && o.source) {
                if (o.key) {
                    keyword = ec(o.key)
                } else {
                    keyword = ""
                }
                source = o.source
            }
            if (r) {
                ref = ec(r)
            }
            b += '&r=' + ref + '&k=' + keyword + '&s=' + source;
            b += '&jiathis=' + intsallJiathis + '&uyan=' + intsallUyan + '&ujian=' + intsallUjian;
            b += '&time=' + new Date().getTime();
            return b
        }, req: function (a) {
            var b = this.getReqUrl();
            var c = 'id=' + a + '&' + b;
            (new Image).src = MU + "?" + c
        }, reqImg: function (a) {
            (new Image).src = a
        }, init: function () {
            var a = this.getReqUrl();
            var b = idurl + "?" + a;
            this.creElm({src: b, charset: "utf-8"}, "script", head)
        }
    };
    _gnayTrack.init()
})();