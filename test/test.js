/**
 *
 * Created by WQ on 2015/4/24.
 */

(function () {
    var rules = [{
        count : 1000,
        probability : 128,
        disease : "精神性疲劳炎",
        judge : "一星"
    }, {
        count : 2000,
        probability : 158,
        disease : "骂人抓狂症",
        judge : "二星"
    }, {
        count : 3000,
        probability : 169,
        disease : "脑细胞抽筋",
        judge : "三星"
    }, {
        count : 4000,
        probability : 220,
        disease : "脑洞堵塞症",
        judge : "四星"
    }, {
        count : 5000,
        probability : 260,
        disease : "智商坏死症",
        judge : "五星"
    }];
    var job;
    var name;
    var textView = document.querySelector( ".text-view" );

    function genCode( str ) {
        var args = str.split( ";" );
        job = args.length != 2 ? "程序猿" : args[0].slice( 1 );
        name = args.length != 2 ? "李大力" : args[1];
        var code = 0;
        for ( var i = 0; i < str.length; i++ ) {
            code += str.charCodeAt( i );
        }
        return rules[code % rules.length];
    }

    function setResultView( hash ) {
        var code = genCode( hash );
        textView.innerHTML = "经苦力专家评估：<p><span>" + job + "</span>岗位苦力<span>" +
            name + "</span>先生，兢兢业业！每日工作量=搬砖<span>" + code.count + "</span>块,<span>"
            + code.disease + "</span>发病率高达<span>" + code.probability +
            "</span>。特被评为<span>" + code.judge + "</span>劳模，特批五一7天假";
    }

    setResultView( location.hash );
})();