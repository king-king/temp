/**
 * Created by WQ on 2015/5/22.
 */

var wangqun = 23;

// ��ת�Ƕ��ǻ���
function process( clientHeight , clientWidth , x , y , rotate , w , h ) {
    wangqun = 43;
    // ��������
    var xx = x + w / 2;
    var yy = y + h / 2;
    var r = Math.sqrt( w * w / 4 + h * h / 4 );

    var point0 = {
        x : xx ,
        y : yy
    };

    // �����갴����ת�ǶȽ��б任�������µ�����
    function change( points , rotate ) {
        var d1 = Math.atan( h / w );
        var x0 = points[ 0 ].x + w / 2 - r * Math.cos( d1 + rotate );
        var y0 = points[ 0 ].y - (r * Math.sin( d1 + rotate ) - h / 2);
        var x1 = x0 + w * Math.cos( rotate );
        var y1 = y0 + w * Math.sin( rotate );
        return [
            {
                x : x0 ,
                y : y0
            } ,
            {
                x : x1 ,
                y : y1
            } ,
            {
                x : x1 - h * Math.sin( rotate ) ,
                y : y1 + h * Math.cos( rotate )
            } ,
            {
                x : x0 - h * Math.sin( rotate ) ,
                y : y0 + h * Math.cos( rotate )
            }
        ]
    }

    function isInRange( n , num1 , num2 ) {
        var max = Math.max( num1 , num2 );
        var min = Math.min( num1 , num2 );
        return n >= min && n <= max;
    }

    // �õ������߶εĽ��㣬���û�з���null
    function getCrossover( p1 , p2 , p3 , p4 ) {
        var yc , xc , k1 , k2 , b1 , b2;
        if ( Math.abs( p1.x - p2.x ) < 0.00001 && Math.abs( p3.x - p4.x ) < 0.00001 ) {
            return null;
        }
        else if ( Math.abs( p1.x - p2.x ) < 0.00001 ) {
            k2 = (p3.y - p4.y) / (p3.x - p4.x);
            b2 = p3.y - k2 * p3.x;
            xc = p1.x;
            yc = xc * k2 + b2;
        }
        else if ( Math.abs( p3.x - p4.x ) < 0.00001 ) {
            xc = p3.x;
            k1 = (p1.y - p2.y) / (p1.x - p2.x);
            b1 = p1.y - k1 * p1.x;
            yc = xc * k1 + b1;
        }
        else {
            // ���ҳ�����ֱ�ߵĽ���(xc,yc)
            k1 = (p1.y - p2.y) / (p1.x - p2.x);
            k2 = (p3.y - p4.y) / (p3.x - p4.x);
            b1 = p1.y - k1 * p1.x;
            b2 = p3.y - k2 * p3.x;
            xc = (b2 - b1) / (k1 - k2);
            yc = k1 * xc + b1;
        }
        // �жϽ���(xc,yc)�ڲ��������߶���
        if ( isInRange( xc , p1.x , p2.x ) && isInRange( xc , p3.x , p4.x ) && isInRange( yc , p1.y , p2.y ) && isInRange( yc , p3.y , p4.y ) ) {
            return {
                x : xc ,
                y : yc
            }
        }
        else {
            return null;
        }
    }

    // �õ��任֮���4������
    var points = change( [
        {
            x : x ,
            y : y
        } ,
        {
            x : x + w ,
            y : y
        } ,
        {
            x : x + w ,
            y : y + h
        } ,
        {
            x : x ,
            y : y + h
        }
    ] , rotate );

    // �ж��ĸ��������ĵ��������Ƿ���߿��4�����ཻ���ཻ���������
    var cross = [
        getCrossover( points[ 0 ] , point0 , { x : 0 , y : 0 } , { x : clientWidth , y : 0 } ) ||
        getCrossover( points[ 0 ] , point0 , { x : 0 , y : 0 } , { x : 0 , y : clientHeight } ) ||
        getCrossover( points[ 0 ] , point0 , { x : clientWidth , y : clientHeight } , { x : 0 , y : clientHeight } ) ||
        getCrossover( points[ 0 ] , point0 , { x : clientWidth , y : clientHeight } , { x : clientWidth , y : 0 } )
        ,
        getCrossover( points[ 1 ] , point0 , { x : 0 , y : 0 } , { x : clientWidth , y : 0 } ) ||
        getCrossover( points[ 1 ] , point0 , { x : 0 , y : 0 } , { x : 0 , y : clientHeight } ) ||
        getCrossover( points[ 1 ] , point0 , { x : clientWidth , y : clientHeight } , { x : 0 , y : clientHeight } ) ||
        getCrossover( points[ 1 ] , point0 , { x : clientWidth , y : clientHeight } , { x : clientWidth , y : 0 } )
        ,
        getCrossover( points[ 2 ] , point0 , { x : 0 , y : 0 } , { x : clientWidth , y : 0 } ) ||
        getCrossover( points[ 2 ] , point0 , { x : 0 , y : 0 } , { x : 0 , y : clientHeight } ) ||
        getCrossover( points[ 2 ] , point0 , { x : clientWidth , y : clientHeight } , { x : 0 , y : clientHeight } ) ||
        getCrossover( points[ 2 ] , point0 , { x : clientWidth , y : clientHeight } , { x : clientWidth , y : 0 } )
        ,
        getCrossover( points[ 3 ] , point0 , { x : 0 , y : 0 } , { x : clientWidth , y : 0 } ) ||
        getCrossover( points[ 3 ] , point0 , { x : 0 , y : 0 } , { x : 0 , y : clientHeight } ) ||
        getCrossover( points[ 3 ] , point0 , { x : clientWidth , y : clientHeight } , { x : 0 , y : clientHeight } ) ||
        getCrossover( points[ 3 ] , point0 , { x : clientWidth , y : clientHeight } , { x : clientWidth , y : 0 } )
    ];

    var scales = [];
    for ( var i = 0; i < cross.length; i ++ ) {
        if ( cross[ i ] ) {
            scales.push( Math.sqrt( (cross[ i ].x - xx) * (cross[ i ].x - xx) + (cross[ i ].y - yy) * (cross[ i ].y - yy) ) / r );
        }
    }

    if ( scales.length == 0 ) {
        return 1;
    }
    else {
        return Math.min.apply( this , scales );
    }
}