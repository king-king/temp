(function () {
    try {
        var g = jiathis_config || {}
    } catch (e) {
        var g = {}
    }
    var h = JIATHIS_CONFIGS.servicelist, _hmf = g.hmf || false, _lk = g.leftLink || {}, _rk = g.rightLink || {}, _gcp = function (s) {
        var a = jiathis_config || {};
        var b = '<div style="border:10px solid #7F7F7F; width:300px;">';
        b += '<div class="jiadiv_01" style="width:300px;">';
        b += '<div style="background:#F2F2F2;line-height:100%;height:30px;overflow:hidden;width:300px;">';
        b += '<table width="100%" style="margin:5px 0 0 0;"><tr class="jt_sharetitle" style="line-height:20px!important;"><td align="left" style="text-align:left;font-size:12px;">分享到各大网站</td><td align="right"><img src="' + JIATHIS_CONFIGS.codehost + '/images/img_exit.gif" border="0" style="margin:0 4px;cursor:pointer;" onclick="$CKE.centerClose();"/></td></tr></table>';
        b += '</div><div class="searchTxtCont">';
        b += '<div style="background:url(' + JIATHIS_CONFIGS.codehost + '/images/img_so.gif) no-repeat center;height:30px; width:281px">';
        b += '<form onsubmit="return false;">';
        b += '<input class="searchTxt" name="" type="text" onclick="this.value=\'\';this.style.color=\'#000\';" value="输入网站名或拼音缩写" onkeyup="$CKE.choose(this);" />';
        b += '</form>';
        b += '</div></div><div id="jiathis_sharelist" class="jiadiv_02" style="width:300px;height:300px;overflow-y:auto;">';
        for (var k in s) {
            if (h[k] && !!s[k] && !!s[k].split) {
                var c = k.slice(3), media = s[k].split(','), hidden_value = c + ',' + media[0] + ',' + media[1];
                var d = JIATHIS_CONFIGS.custom[c] || {};
                var f = (d.small) ? ' style="background:url(' + d.small + ') no-repeat left;"' : '';
                b += '<a href="javascript:;" onclick="jiathis_sendto(\'' + c + '\');return false;" class="jiatitle"><span class="jtico jtico_' + c + '"' + f + '>' + media[0] + '</span><input type="hidden" value="' + hidden_value + '" /></a>'
            }
        }
        b += '<div style="clear:both"></div></div>';
        if (!_hmf) {
            b += '<div class="centerBottom">';
            b += '<div style="float:left;font-size:10px;"><a href="' + (_lk.url ? _lk.url : JIATHIS_CONFIGS.webhost + '/help/html/what-is-jiathis') + '" class="link_01" style="color:#333333;display:none;" target="_blank">' + (_lk.name ? _lk.name : '这是什么工具?') + '</a></div>';
            b += '<div style="float:right;font-size:11px;margin:0 10px 0 0; height: 22px;line-height: 22px">';
            // b += '<img src="' + JIATHIS_CONFIGS.codehost + '/images/img_012.gif" align="absmiddle" border="none" />&nbsp;';
            b += '<a href="' + (_rk.url ? _rk.url : JIATHIS_CONFIGS.webhost) + '/index2" style="color:#333333;" class="link_01" target="_blank">' + (_rk.name ? _rk.name : '初页') + '</a>';
            b += '</div><div style="clear:both"></div></div>'
        }
        b += '</div>';
        return b
    };
    $CKE.centerpop.innerHTML = _gcp(h);
    $CKE.center()
})();