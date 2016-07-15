setTimeout(function () {
    try {
        var f = jiathis_config || {}
    } catch (e) {
        var f = {}
    }
    var g = 0, _fn = typeof(f.boldNum) == "number" ? f.boldNum : 0, _ln = typeof(f.siteNum) == "number" ? f.siteNum : 15, _p = {}, _ck = JIATHIS_CONFIGS.jtck || "", _cp = JIATHIS_CONFIGS.ckprefix, _ls = JIATHIS_CONFIGS.servicelist, _sm = f.sm || "", _hm = f.hideMore || false, _hsf = f.hsf || false, _lk = f.leftLink || {}, _rk = f.rightLink || {}, _wn = f.siteName || "分享到...", _sc = typeof(f.showClose) == "boolean" ? f.showClose : JIATHIS_CONFIGS.sc, _wc = _sc ? '<img src="' + JIATHIS_CONFIGS.codehost + '/images/img_exit.gif" border="0" style="opacity:0.5;filter:alpha(opacity=50);margin:0 10px;cursor:pointer;" onclick=\'$CKE.shareClose();\' />' : '', _sd = "weixin,tsina,copy,email,cqq,qzone,renren,kaixin001,evernote,linkedin,feixin,douban,twitter,fb,ishare", _gp = function (s) {
        var a = '<div class="jiadiv_01">';
        a += '<div style="width:100%;background:#F2F2F2;border-bottom:1px solid #E5E5E5;line-height:200%;padding-left:5px;font-size:12px"><table width=100%><tr class="jt_sharetitle"><td align=left style="text-align:left;line-height:25px;font-size:14px;font-weight:bold;color:#000000;">' + _wn + '</td><td align=right style="text-align:right;">' + _wc + '</td></tr></table></div>';
        a += '<div class="jiadiv_02" style="width:100%;" id="jiathis_sers">';
        for (var k in s) {
            if (_ls[k] && !!s[k].a && !!s[k].a.split) {
                var b = k.slice(3), media = s[k].a.split(','), cu = JIATHIS_CONFIGS.custom[b] || {}, css = styles = "";
                css = (s[k].b == 'T') ? 'font-weight:bold;' : '';
                css = (cu.small) ? css + 'background:url(' + cu.small + ') no-repeat left;' : css;
                styles = css ? 'style="' + css + '"' : '';
                a += '<a href="javascript:;" onclick="jiathis_sendto(\'' + b + '\');return false;" class="jiatitle"><span class="jtico jtico_' + b + '"' + styles + '>' + media[0] + '</span></a>'
            }
        }
        if (!_hm) {
            a += '<a href="javascript:;" onclick="$CKE.center(this);return false;" class="jiatitle"><span class="jtico jtico_jiathis" >查看更多(' + _len(_ls) + ')</span></a>'
        }
        a += '<div style="clear:both"></div></div>';
        if (!_hsf) {
            a += '<div class="ckepopBottom" style="width:100%;">';
            a += '<div style="float:left;font-size:10px"><a href="' + (_lk.url ? _lk.url : JIATHIS_CONFIGS.webhost + '/help/html/what-is-jiathis') + '" class="link_01" style="color:#333333;display:none;" target="_blank">' + (_lk.name ? _lk.name : '这是什么工具?') + '</a></div>';
            a += '<div style="float:right;font-size:11px;margin:0 5px 0 0;">';
            a += '<img src="' + JIATHIS_CONFIGS.codehost + '/images/img_012.gif" align="absmiddle" border="0" />';
            a += '<a href="' + (_rk.url ? _rk.url : JIATHIS_CONFIGS.webhost) + '/index2" style="color:#333333;padding:0 3px;" class="link_01" target="_blank">' + (_rk.name ? _rk.name : 'JiaThis') + '</a>';
            a += '</div>';
            a += '<div style="clear:both"></div></div>'
        }
        a += '</div>';
        return a
    }, _len = function (o) {
        var a = 0;
        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                a++
            }
        }
        return a
    }, _mp = function (c) {
        if (c) {
            var d = c.split(',');
            for (var e in d) {
                var x = _ls[_cp + d[e]];
                if (x && !_p[_cp + d[e]]) {
                    if (g < _ln) {
                        var y = (g < _fn) ? 'T' : 'F';
                        _p[_cp + d[e]] = {a: x, b: y};
                        g++
                    } else {
                        break
                    }
                }
            }
        }
    }, _ms = function (c) {
        for (var d in c) {
            if (g < _ln) {
                var x = _ls[_cp + c[d]];
                if (x && !_p[_cp + c[d]]) {
                    _p[_cp + c[d]] = {a: x, b: "F"};
                    g++
                }
            } else {
                break
            }
        }
    };
    _mp(_sm);
    _mp(_ck);
    _ms(_sd.split(','));
    $CKE.pop.innerHTML = _gp(_p)
}, 0);