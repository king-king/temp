window.onload = function () {
    // 移动端检测
    if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test( navigator.userAgent ) || window.self !== window.top ) {
        var script, scriptCode;
        try {
            if ( window.firstpageVersion ) {
                window.localResource = JSON.parse( localStorage.getItem( "resource" ) || JSON.stringify( {
                        list : []
                    } ) );
            }
        }
        catch ( e ) {
        }

        setTimeout( function () {
            if ( window.localResource && localResource.version === window.firstpageVersion && ( scriptCode = localStorage.getItem( "script" ) ) ) {
                ( new Function( "return " + scriptCode ) )()();
                window.runFirstPage();
            }
            else {
                script = document.head.appendChild( document.createElement( "script" ) );
                script.onload = function () {
                    window.runFirstPage();
                    script.onload = null;
                };
                script.src = window.contentPath + "firstpage.min.js";
            }
        }, 0 );
    }
    else {
        // 如果是pc端 ……

        with ( document )0[(getElementsByTagName( 'head' )[0] || body).appendChild( createElement( 'style' ) ).innerHTML = "body,html{ height:100%; overflow : hidden; }"];
        var iframe = document.createElement( "iframe" ), url = "/Work/IndexPC?id=10321387&qrUrl=http://" + window.location.host + "/10321387";
        iframe.src = encodeURI( url );
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.style.border = "none";
        document.body.appendChild( iframe );
    }
};