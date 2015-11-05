/**
 * 3d-css
 * Created by WQ on 2015/11/2.
 * =============================================================
 */

(function () {

    function eye() {
        return [
            [ 1 , 0 , 0 , 0 ] ,
            [ 0 , 1 , 0 , 0 ] ,
            [ 0 , 0 , 1 , 0 ] ,
            [ 0 , 0 , 0 , 1 ]
        ]
    }

    function translate3dM( x , y , z ) {
        return [
            [ 1 , 0 , 0 , x ] ,
            [ 0 , 1 , 0 , y ] ,
            [ 0 , 0 , 1 , z ] ,
            [ 0 , 0 , 0 , 1 ]
        ]
    }

    function rotate3dM( x , y , z , a ) {
        a = a * Math.PI / 180;
        var cosa = Math.cos( a ) , sina = Math.sin( a );

        var r = Math.sqrt( x * x + y * y + z * z );
        x /= r;
        y /= r;
        z /= r;

        return [
            [ 1 + (1 - cosa) * ( x * x - 1 ) , z * sina + x * y * (1 - cosa) , -y * sina + x * z * (1 - cosa) , 0 ] ,
            [ -z * sina + x * y * (1 - cosa) , 1 + (1 - cosa) * (y * y - 1) , x * sina + y * z * (1 - cosa) , 0 ] ,
            [ y * sina + x * z * (1 - cosa) , -x * sina + y * z * (1 - cosa) , 1 + (1 - cosa) * (z * z - 1) , 0 ] ,
            [ 0 , 0 , 0 , 1 ]
        ]
    }

    Array.prototype.matrixStringify = function () {
        var marix = this;
        var nmatrix = [];
        for ( var c = 0; c < marix.length; c++ ) {
            nmatrix[ c ] = [];
            for ( var r = 0; r < marix[ c ].length; r++ ) {
                nmatrix[ c ][ r ] = marix[ r ][ c ];
            }
        }
        return nmatrix.join();
    };

    function combine() {
        var result = [
            [ 1 , 0 , 0 , 0 ] ,
            [ 0 , 1 , 0 , 0 ] ,
            [ 0 , 0 , 1 , 0 ] ,
            [ 0 , 0 , 0 , 1 ]
        ];
        for ( var i = 0; i < arguments.length; i++ ) {
            result = mul( result , arguments[ i ] );
        }
        return result;
    }

    function mul( m1 , m2 ) {
        if ( m1[ 0 ].length == undefined ) {
            return [
                m1[ 0 ] * m2[ 0 ][ 0 ] + m1[ 1 ] * m2[ 0 ][ 1 ] + m1[ 2 ] * m2[ 0 ][ 2 ] + m1[ 3 ] * m2[ 0 ][ 3 ] ,
                m1[ 0 ] * m2[ 1 ][ 0 ] + m1[ 1 ] * m2[ 1 ][ 1 ] + m1[ 2 ] * m2[ 1 ][ 2 ] + m1[ 3 ] * m2[ 1 ][ 3 ] ,
                m1[ 0 ] * m2[ 2 ][ 0 ] + m1[ 1 ] * m2[ 2 ][ 1 ] + m1[ 2 ] * m2[ 2 ][ 2 ] + m1[ 3 ] * m2[ 2 ][ 3 ] ,
                1
            ];
        } else {
            var re = [];
            for ( var r = 0; r < m1.length; r++ ) {
                re[ r ] = [];
                for ( var c = 0; c < m1[ r ].length; c++ ) {
                    re[ r ][ c ] = 0;
                    for ( var k = 0; k < m1.length; k++ ) {
                        re[ r ][ c ] += m1[ r ][ k ] * m2[ k ][ c ];
                    }
                }
            }
            return re;
        }
    }

    // matrix:4*4,vector:1*4
    function decompose3d( matrix , vector ) {
        return [
            matrix[ 0 ][ 0 ] * vector[ 0 ] + matrix[ 0 ][ 1 ] * vector[ 1 ] + matrix[ 0 ][ 2 ] * vector[ 2 ] + matrix[ 0 ][ 3 ] * vector[ 3 ] ,
            matrix[ 1 ][ 0 ] * vector[ 0 ] + matrix[ 1 ][ 1 ] * vector[ 1 ] + matrix[ 1 ][ 2 ] * vector[ 2 ] + matrix[ 1 ][ 3 ] * vector[ 3 ] ,
            matrix[ 2 ][ 0 ] * vector[ 0 ] + matrix[ 2 ][ 1 ] * vector[ 1 ] + matrix[ 2 ][ 2 ] * vector[ 2 ] + matrix[ 2 ][ 3 ] * vector[ 3 ] ,
            1
        ]
    }

    function origin3d( transformation , x , y , z ) {
        return combine( translate3dM( x , y , z ) , transformation , translate3dM( -x , -y , -z ) );
    }

    window._3d = {
        eye : eye ,
        translate3dM : translate3dM ,
        rotate3dM : rotate3dM ,
        mul : mul ,
        combine : combine ,
        decompose3d : decompose3d ,
        origin3d : origin3d
    }
})();

/**  data.js
 * Created by WQ on 2015/11/2.
 * ====================================================
 */
// api
var querySelector = document.querySelector.bind( document );

// dom
var cubeWrapper = querySelector( ".cube-wrapper" );
var canvas = document.querySelector( "canvas" );
var gc = canvas.getContext( "2d" );
var head = querySelector( ".head" );

gc.lineWidth = 5;
gc.strokeStyle = "black";

// 缓存或存储
// 每次转动，都要知晓要转动那些block，可以缓存起来
var blocksCache = {
    x : [] , y : [] , z : []
};

var Actions = [];

// data
var Axis = {
    x : [ 1 , 0 , 0 , 1 ] ,
    y : [ 0 , 1 , 0 , 1 ] ,
    z : [ 0 , 0 , 1 , 1 ]
};

var Blocks = [];

var initPos = [
    [ [ -150 , -150 ] , [ -50 , -150 ] , [ 50 , -150 ] ] ,
    [ [ -150 , -50 ] , [ -50 , -50 ] , [ 50 , -50 ] ] ,
    [ [ -150 , 50 ] , [ -50 , 50 ] , [ 50 , 50 ] ]
];

var initOrigin = [
    [ [ 100 , 100 , -150 ] , [ 0 , 100 , -150 ] , [ -100 , 100 , -150 ] ] ,
    [ [ 100 , 0 , -150 ] , [ 0 , 0 , -150 ] , [ -100 , 0 , -150 ] ] ,
    [ [ 100 , -100 , -150 ] , [ 0 , -100 , -150 ] , [ -100 , -100 , -150 ] ]
];

var floorNum = 3;

var sixFaces = {
    front : {
        transform : (function () {
            return _3d.eye();
        })() ,
        elements : []
    } ,
    left : {
        transform : (function () {
            return _3d.rotate3dM( 0 , 1 , 0 , 90 );
        })() ,
        elements : []
    } ,
    right : {
        transform : (function () {
            return _3d.rotate3dM( 0 , 1 , 0 , 270 );
        })() ,
        elements : []
    } ,
    back : {
        transform : (function () {
            return _3d.rotate3dM( 0 , 1 , 0 , -180 );
        })() ,
        elements : []
    } ,
    up : {
        transform : (function () {
            return _3d.rotate3dM( 1 , 0 , 0 , -90 );
        })() ,
        elements : []
    } ,
    bottom : {
        transform : (function () {
            return _3d.rotate3dM( 1 , 0 , 0 , -270 );
        })() ,
        elements : []
    }
};

var rotateData = {
    y : {
        'face' : {
            front : {
                rowOrCol : "row" ,
                posFlag : 1 ,
                colorFlag : 1 ,
                index : 0
            } ,
            right : {
                rowOrCol : "row" ,
                posFlag : 1 ,
                colorFlag : 1 ,
                index : 1
            } ,
            back : {
                rowOrCol : "row" ,
                posFlag : 1 ,
                colorFlag : 1 ,
                index : 2
            } ,
            left : {
                rowOrCol : "row" ,
                posFlag : 1 ,
                colorFlag : 1 ,
                index : 3
            }
        } ,
        'up' : { 'face' : 'bottom' , 'rotateDegree' : 0 } ,
        'bottom' : { 'face' : 'up' , 'rotateDegree' : 2 }
    } ,
    x : {
        'face' : {
            up : {
                rowOrCol : "col" ,
                posFlag : 1 ,
                colorFlag : -1 ,
                index : 0
            } ,
            back : {
                rowOrCol : "col" ,
                posFlag : -1 ,
                colorFlag : 1 ,
                index : 1
            } ,
            bottom : {
                rowOrCol : "col" ,
                posFlag : 1 ,
                colorFlag : -1 ,
                index : 2
            } ,
            front : {
                rowOrCol : "col" ,
                posFlag : 1 ,
                colorFlag : -1 ,
                index : 3
            }
        } ,
        'up' : { 'face' : 'right' , 'rotateDegree' : 0 } ,
        'bottom' : { 'face' : 'left' , 'rotateDegree' : 0 }
    } ,
    z : {
        'face' : {
            up : {
                rowOrCol : "row" ,
                posFlag : 1 ,
                colorFlag : 1 ,
                index : 0
            } ,
            right : {
                rowOrCol : "col" ,
                posFlag : -1 ,
                colorFlag : 1 ,
                index : 1
            } ,
            bottom : {
                rowOrCol : "row" ,
                posFlag : -1 ,
                colorFlag : -1 ,
                index : 2
            } ,
            left : {
                rowOrCol : "col" ,
                posFlag : 1 ,
                colorFlag : -1 ,
                index : 3
            }
        } ,
        'up' : { 'face' : 'front' , 'rotateDegree' : 0 } ,
        'bottom' : { 'face' : 'back' , 'rotateDegree' : 0 }
    }
};

/**顺时针为正
 [ 1 , 2 , 3 ]
 [ 4 , 5 , 6 ]
 [ 7 , 8 , 9 ]

 [
 [[0,0],[0,1],[0,2]],
 [[1,0],[1,1],[1,2]],
 [[2,0],[2,1],[2,2]]
 ]

 ------------------------------------------
 （90  & -270）
 [ 7 , 4 , 1 ]
 [ 8 , 5 , 2 ]
 [ 9 , 6 , 3 ]

 [
 [[2,0],[1,0],[0,0]],
 [[2,1],[1,1],[0,1]],
 [[2,2],[1,2],[0,2]]
 ]

 ------------------------------------------
 （180  & -180）
 [ 9 , 8 , 7 ]
 [ 6 , 5 , 4 ]
 [ 3 , 2 , 1 ]

 [
 [[2,2],[2,1],[2,0]],
 [[1,2],[1,1],[1,0]],
 [[0,2],[0,1],[0,0]]
 ]

 ------------------------------------------

 ( 270  & -90 )
 [ 3 , 6 , 9]
 [ 2 , 5 , 8 ]
 [ 1 , 4 , 7 ]

 [
 [[0,2],[1,2],[2,2]],
 [[0,1],[1,1],[2,1]],
 [[0,0],[1,0],[2,0]]
 ]
 * */
// 原本想用程序计算二维数组的旋转问题，但是由于目前并没有做高阶魔方的打算，所以实现预计算，以数据的形式存储起来

var rotate3_3Arr = {
    1 : [
        [ [ 2 , 0 ] , [ 1 , 0 ] , [ 0 , 0 ] ] ,
        [ [ 2 , 1 ] , [ 1 , 1 ] , [ 0 , 1 ] ] ,
        [ [ 2 , 2 ] , [ 1 , 2 ] , [ 0 , 2 ] ]
    ] ,
    2 : [
        [ [ 2 , 2 ] , [ 2 , 1 ] , [ 2 , 0 ] ] ,
        [ [ 1 , 2 ] , [ 1 , 1 ] , [ 1 , 0 ] ] ,
        [ [ 0 , 2 ] , [ 0 , 1 ] , [ 0 , 0 ] ]
    ] ,
    3 : [
        [ [ 0 , 2 ] , [ 1 , 2 ] , [ 2 , 2 ] ] ,
        [ [ 0 , 1 ] , [ 1 , 1 ] , [ 2 , 1 ] ] ,
        [ [ 0 , 0 ] , [ 1 , 0 ] , [ 2 , 0 ] ]
    ]
};

/**  tools
 * Created by WQ on 2015/10/13.
 * ====================================================
 */
function loop( count , func ) {
    for ( var i = 0; i < count; i++ ) {
        func( i );
    }
}

function loopArray( arr , func ) {
    for ( var i = 0; i < arr.length; i++ ) {
        func( arr[ i ] , i );
    }
}

function loopObj( obj , func ) {
    for ( var key in obj ) {
        func( key , obj[ key ] );
    }
}

function element( tag , arg , parent ) {
    var el = document.createElement( tag );
    for ( var key in arg ) {
        switch ( key ) {
            case "classList":
                loopArray( arg.classList , function ( klass ) {
                    el.classList.add( klass );
                } );
                break;
            default :
                el[ key ] = arg[ key ];
        }
    }
    parent && parent.appendChild( el );
    return el;
}

function css( el , styles ) {
    loopObj( styles , function ( key , value ) {
        el.style.setProperty( key , value )
    } );
}

function addEventListener( el , type , listener , useCapture ) {
    el.addEventListener( type , listener , useCapture );
    return {
        remove : function () {
            el.removeEventListener( type , listener , useCapture );
        }
    }
}

function Drag( el , listener ) {
    var preX , preY;
    addEventListener( el , "mousedown" , function ( de ) {
        if ( de.which == 2 ) {
            return;
        }
        var isStart = false;
        listener.onTap && listener.onTap( de );
        preX = de.pageX;
        preY = de.pageY;
        var mHandle = addEventListener( document , "mousemove" , function ( me ) {
            if ( isStart || Math.abs( me.pageX - preX ) + Math.abs( me.pageY - preY ) > 3 ) {
                !isStart && listener.onStart && listener.onStart( me.pageX - preX , me.pageY - preY );
                isStart = true;
                listener.onDrag && listener.onDrag( me.pageX - preX , me.pageY - preY , me.pageX - de.pageX , me.pageY - de.pageY );
                preX = me.pageX;
                preY = me.pageY;
            }
        } );

        var uHandle = addEventListener( document , "mouseup" , function ( ue ) {
            isStart && listener.onUp && listener.onUp( ue.pageX - de.pageX , ue.pageY = de.pageY );
            mHandle.remove();
            uHandle.remove();
        } );
    } , false );
}


function frameAnimate( arg ) {
    var startTime = new Date();
    var f = 50 / 3;
    var d = arg.to - arg.from;
    var percent;

    function frame() {
        var currentTime = new Date();
        if ( currentTime - startTime >= arg.duration ) {
            arg.onChange && arg.onChange( arg.to );
            arg.onEnd && arg.onEnd();
        } else {
            percent = (currentTime - startTime ) / arg.duration;
            arg.onChange && arg.onChange( arg.from + percent * d );
            setTimeout( arguments.callee , f );
        }
    }

    frame();
}

// 顺序执行
function serialTask( tasks , callback ) {
    var index = 0;
    tasks[ index ] && tasks[ index ]( function () {
        ++index == tasks.length ? callback() : tasks[ index ]( arguments.callee );
    } );
}

function requestAnimate( keyframe ) {
    var id;

    function f() {
        keyframe();
        clearTimeout( id );
        id = setTimeout( arguments.callee , 20 );
    }

    f();
    return {
        destroy : function () {
            clearTimeout( id );
        }
    }
}
/**  tools
 *    Created by WQ on 2015/11/2.
 * ====================================================
 */

function Block( type , row , col ) {
    var el = element( "div" , {
        classList : [ "block" , type ] ,
        innerHTML : "<div class='block-inner'></div>" ,
        type : type
    } , cubeWrapper );
    Blocks.push( el );
    css( el , {
        "margin-left" : initPos[ row ][ col ][ 0 ] + "px" ,
        "margin-top" : initPos[ row ][ col ][ 1 ] + "px"
    } );
    el.origin = initOrigin[ row ][ col ];
    /**
     *最复杂的一点，就是给每个block附上旋转的数据以及旋转的操作
     * 每个block只可能绕着两个轴来旋转，找出这两个点，给它附上一个独一无二的标记
     */
    var rowDir = {} , colDir = {};
    loopObj( rotateData , function ( axis , value ) {
        if ( value.face[ type ] ) {
            if ( value.face[ type ].rowOrCol == "row" ) {
                rowDir.axis = axis;
                rowDir.posFlag = value.face[ type ].posFlag;
            } else {
                colDir.axis = axis;
                colDir.posFlag = value.face[ type ].posFlag;
            }
        }
    } );
    el[ colDir.axis ] = colDir.posFlag == 1 ? col : floorNum - 1 - col;
    el[ rowDir.axis ] = rowDir.posFlag == 1 ? row : floorNum - 1 - row;
    el.setAttribute( colDir.axis , el[ colDir.axis ] + "" );
    el.setAttribute( rowDir.axis , el[ rowDir.axis ] + "" );

    Drag( el , {
        onTap : function ( e ) {
            e.stopPropagation();
            el.currentDegree = 0;
        } ,
        onStart : function ( dx , dy ) {
            // 在这里判断到底是围绕哪个轴旋转
            var col = Axis[ colDir.axis ] , row = Axis[ rowDir.axis ];
            el.currentAxis = Math.abs( col[ 0 ] * dx + col[ 1 ] * dy ) < Math.abs( row[ 0 ] * dx + row[ 1 ] * dy ) ? colDir.axis : rowDir.axis;
            el.currentFloorNum = el[ el.currentAxis ];
            // 先找缓存，如果缓存没有则getBlocks
            !blocksCache[ el.currentAxis ][ el.currentFloorNum ] && ( blocksCache[ el.currentAxis ][ el.currentFloorNum ] = getBlocks( el.currentAxis , el[ el.currentAxis ] ) );
        } ,
        onDrag : function ( dx , dy , sx , sy ) {
            var degree = -sx * Axis[ el.currentAxis ][ 1 ] + sy * Axis[ el.currentAxis ][ 0 ];
            el.currentDegree = degree;
            rotateFloor( el.currentAxis , el.currentFloorNum , degree , blocksCache[ el.currentAxis ][ el.currentFloorNum ] , true );
        } ,
        onUp : function () {
            var rotateNum;// rotateNum表示将要旋转的90度的倍数
            if ( Math.abs( el.currentDegree % 90 ) < 10 ) {
                // 如果旋转的角度太小，则恢复到原位置，也就是0
                rotateNum = el.currentDegree < 0 ? Math.ceil( el.currentDegree / 90 ) : Math.floor( el.currentDegree / 90 );
            } else {
                rotateNum = el.currentDegree < 0 ? Math.floor( el.currentDegree / 90 ) : Math.ceil( el.currentDegree / 90 );
            }
            // rotateNum为0，不记录
            rotateNum && Actions.push( {
                axis : el.currentAxis ,
                floorNum : el.currentFloorNum ,
                rotateNum : rotateNum
            } );
            head.innerText = Actions.length;
            document.body.classList.add( "lock" );
            rotateFloorAction( el.currentAxis , el.currentFloorNum , el.currentDegree , rotateNum , function ( isWin ) {
                !isWin && document.body.classList.remove( "lock" );
            } );
        }
    } );

    return el;
}

function getBlocks( axis , num ) {
    var blocks = [];
    // 先根据轴axis确认面是rotateData[ axis ].face
    loopObj( rotateData[ axis ].face , function ( face ) {
        loopArray( sixFaces[ face ].elements , function ( block ) {
            if ( block[ axis ] == num ) {
                blocks.push( block );
            }
        } );
    } );
    num == 0 && (blocks = blocks.concat( sixFaces[ rotateData[ axis ].bottom.face ].elements ));
    num == floorNum - 1 && (blocks = blocks.concat( sixFaces[ rotateData[ axis ].up.face ].elements ));
    return blocks;
}

function rotateFloor( axis , num , degree , blocks , nacc ) {
    // nacc为true的时候表示不需要累加
    !blocks && (blocks = getBlocks( axis , num ) );
    var t_matrix = _3d.rotate3dM( Axis[ axis ][ 0 ] , Axis[ axis ][ 1 ] , Axis[ axis ][ 2 ] , degree );
    loopArray( blocks , function ( block ) {
        var matrix = _3d.combine( t_matrix , block.matrix );
        !nacc && (block.matrix = matrix);
        css( block , {
            "-webkit-transform" : "matrix3d(" +
            _3d.origin3d( matrix , block.origin[ 0 ] , block.origin[ 1 ] , block.origin[ 2 ] ).matrixStringify() + ")"
        } );
    } );
}

function rotateFloorAction( axis , floorNum , fromDegree , rotateNum , callback , duration ) {
    !blocksCache[ axis ][ floorNum ] && ( blocksCache[ axis ][ floorNum ] = getBlocks( axis , floorNum ) );
    var toDegree = rotateNum * 90;
    frameAnimate( {
        from : fromDegree ,
        to : toDegree ,
        duration : duration || 100 ,
        onChange : function ( degree ) {
            rotateFloor( axis , floorNum , degree , blocksCache[ axis ][ floorNum ] , true );
        } ,
        onEnd : function () {
            /**
             * 1.把位置复原
             * 2.改变涂色
             * 3.检测是否赢了
             **/
                // 1
            resetPos( blocksCache[ axis ][ floorNum ] , axis , floorNum );
            // 2.todo 这里要进行另外一项复杂的颜色变换
            rotateNum % 4 && setColor( axis , floorNum , rotateNum % 4 );
            // 3 判断是否成功，成功会自动弹出提示
            callback && callback( checkWin() );
        }
    } );
}

function resetPos( blocks , axis , floorNum ) {
    loopArray( blocks , function ( block ) {
        css( block , {
            "-webkit-transform" : "matrix3d(" +
            _3d.origin3d( block.matrix , block.origin[ 0 ] , block.origin[ 1 ] , block.origin[ 2 ] ).matrixStringify() + ")"
        } )
    } );
}

function initCube() {
    // 首先3坐标轴要恢复
    Axis.x = [ 1 , 0 , 0 , 1 ];
    Axis.y = [ 0 , 1 , 0 , 1 ];
    Axis.z = [ 0 , 0 , 1 , 1 ];
    // 如果sixFaces里面有数据，也就是说有dom元素，则只需要重新摆放即可，否则需要生成
    loopObj( sixFaces , function ( type , face ) {
        loop( floorNum , function ( row ) {
            loop( floorNum , function ( col ) {
                var el;
                var index = row * floorNum + col;
                if ( face.elements[ index ] ) {
                    el = face.elements[ index ];
                    // 恢复颜色
                    el.className = "block " + type;
                    el.type = type;
                } else {
                    face.elements[ index ] = el = Block( type , row , col );
                }
                // 摆放位置
                el.matrix = face.transform;
                css( el , {
                    "-webkit-transform" : "matrix3d(" +
                    _3d.origin3d( el.matrix , el.origin[ 0 ] , el.origin[ 1 ] , el.origin[ 2 ] ).matrixStringify() + ")"
                } );
            } );
        } )
    } );
}

function drawAxis() {
    gc.clearRect( 0 , 0 , 600 , 600 );
    gc.beginPath();
    gc.moveTo( 300 , 300 );
    gc.lineTo( -Axis.y[ 0 ] * 100 + 300 , -Axis.y[ 1 ] * 100 + 300 );
    gc.moveTo( 300 , 300 );
    gc.lineTo( -Axis.x[ 0 ] * 100 + 300 , -Axis.x[ 1 ] * 100 + 300 );
    gc.moveTo( 300 , 300 );
    gc.lineTo( -Axis.z[ 0 ] * 100 + 300 , -Axis.z[ 1 ] * 100 + 300 );
    gc.stroke();
}

function rotateCube( t_matrix ) {
    // x轴和y轴z轴
    Axis.y = _3d.mul( Axis.y , t_matrix );
    Axis.x = _3d.mul( Axis.x , t_matrix );
    Axis.z = _3d.mul( Axis.z , t_matrix );
    //drawAxis();
    loopArray( Blocks , function ( block ) {
        block.matrix = _3d.combine( t_matrix , block.matrix );
        block.style.transform = "matrix3d(" + _3d.origin3d( block.matrix , block.origin[ 0 ] , block.origin[ 1 ] , block.origin[ 2 ] ).matrixStringify() + ")";
    } );
}

// aixs 旋转轴、floorNum旋转的层数、count是90度的倍数
function setColor( axis , num , count ) {
    // 根据旋转来染色、4个面和底或顶（如果有的话）开处理
    var ring = [];
    var types = [];
    // 获取环形数据
    loopObj( rotateData[ axis ].face , function ( type , arg ) {
        //  这个面的全部元素：sixFaces[type].elements
        var blocks = arg.rowOrCol == "col" ? getCol( type , arg.posFlag == 1 ? num : floorNum - 1 - num ) : getRow( type , arg.posFlag == 1 ? num : floorNum - 1 - num );
        arg.colorFlag == -1 && blocks.els.reverse();
        arg.colorFlag == -1 && blocks.types.reverse();
        ring[ arg.index ] = blocks.els;
        types[ arg.index ] = blocks.types;
    } );
    // todo:这里需要测试一下，不行就取负
    //count < 0 && types.reverse();
    count = (count + 4) % 4;
    loop( Math.abs( count ) , function () {
        types.push( types.shift() );
    } );
    loopArray( ring , function ( blocks , i ) {
        // 换色
        loopArray( blocks , function ( block , j ) {
            block.type = types[ i ][ j ];
            block.className = "block " + block.type;
        } );
    } );

    // 给顶或底(如果有的话)染色
    var oneFaceBlocks;
    var flag = 1;
    if ( num == 0 ) {
        oneFaceBlocks = sixFaces[ rotateData[ axis ].bottom.face ].elements;
    } else if ( num == floorNum - 1 ) {
        oneFaceBlocks = sixFaces[ rotateData[ axis ].up.face ].elements;
        flag = -1;
    }
    oneFaceBlocks && setOneFaceTypes3_3( oneFaceBlocks , (flag * count + 4) % 4 );

}

function getCol( faceType , colNum ) {
    var col = { els : [] , types : [] };
    loop( floorNum , function ( row ) {
        var block = sixFaces[ faceType ].elements[ row * floorNum + colNum ];
        col.els.push( block );
        col.types.push( block.type );
    } );
    return col;
}

function getRow( faceType , rowNum ) {
    var row = { els : [] , types : [] };
    loop( floorNum , function ( col ) {
        var block = sixFaces[ faceType ].elements[ rowNum * floorNum + col ];
        row.els.push( block );
        row.types.push( block.type );
    } );
    return row;
}

// 得到一个3*3面旋转之后的type数组
function setOneFaceTypes3_3( Blocks , count ) {
    // Blocks是一个一维数组，要提取出type并以1维数组返回
    var posData = rotate3_3Arr[ count ];
    var types = [];
    loop( 3 , function ( row ) {
        loop( 3 , function ( col ) {
            types[ 3 * row + col ] = Blocks[ 3 * posData[ row ][ col ][ 0 ] + posData[ row ][ col ][ 1 ] ].type;
        } );
    } );
    loopArray( Blocks , function ( block , i ) {
        block.type = types[ i ];
        block.className = "block " + types[ i ];
    } );
}

// 检测赢了没有，赢的规则是同色了
function checkWin() {
    for ( var face in sixFaces ) {
        var len = sixFaces[ face ].elements.length;
        var zero = sixFaces[ face ].elements[ 0 ].type;
        for ( var i = 1; i < len; i++ ) {
            if ( sixFaces[ face ].elements[ i ].type != zero ) {
                return false;
            }
        }
    }
    // 能到这一步，说明已经成功了
    element( "div" , {
        classList : [ "win-board" ] ,
        innerText : "WIN~!!"
    } , document.body );
    return true;
}

/**
 * 开始处理函数
 *  ===========================================================
 * **/
(function () {
    initCube();

    // 随机旋转10次
    var randomAction = new Array( 10 );
    var axis = [ "x" , "y" , "z" ] , floorNums = [ 0 , 1 , 2 ];
    var isEasy = location.hash == "#easy";

    function randomGet( arr ) {
        return arr[ (( Math.random() * 100) << 0) % arr.length ];
    }

    loopArray( randomAction , function ( action , i ) {
        randomAction[ i ] = function ( done ) {
            var ax = randomGet( axis ) ,
                floorNum = randomGet( floorNums );
            isEasy && Actions.push( {
                axis : ax ,
                floorNum : floorNum ,
                rotateNum : 1
            } );
            isEasy && (head.innerText = Actions.length);

            rotateFloorAction( ax , floorNum , 0 , 1 , function ( iswin ) {
                if ( iswin && i != randomAction.length - 1 ) {
                    document.body.classList.remove( "lock" );
                    var winBorder = querySelector( ".win-board" );
                    winBorder && winBorder.parentNode && winBorder.parentNode.removeChild( winBorder );
                }
                done();
            } , 400 );
        }
    } );

    var animate = requestAnimate( function () {
        rotateCube( _3d.rotate3dM( 1 , -1 , 0 , 1 ) )
    } );

    var startBtn = querySelector( ".start-btn" );
    startBtn.onclick = function () {
        animate.destroy();
        startBtn.parentNode.removeChild( startBtn );
        document.body.classList.add( "lock" );
        serialTask( randomAction , function () {
            document.body.classList.remove( "lock" );
        } );
    };

    Drag( cubeWrapper , {
        onDrag : function ( dx , dy ) {
            if ( dx || dy ) {
                var s = ( Math.abs( dx ) + Math.abs( dy )) / 3.5;
                var t_matrix = _3d.rotate3dM( dy , -dx , 0 , s );
                rotateCube( t_matrix );
            }
        }
    } );

    // 点击滚轮，自动撤销上次操作
    document.body.onclick = function ( e ) {
        if ( e.which == 2 ) {
            var action = Actions.pop();
            head.innerText = Actions.length;
            action && rotateFloorAction( action.axis , action.floorNum , 0 , -action.rotateNum , function () {
            } );
        }
    }
})();


