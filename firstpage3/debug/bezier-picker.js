/**
 * Created by WQ on 2015/5/21.
 */


library( function () {
    var object = imports( "object" ),
        $ = imports( "element" ),
        css = imports( "css" ),
        pointer = imports( "pointer" ),
        math = imports( "math" );

    imports( "../../src/platform" );


    function Picker( arg ) {
        var wrapper = $( "div", {
            classList : "bezier-picker",
            css : {
                width : arg.size + "px",
                height : arg.size + "px",
                position : "relative"
            }
        } );

        var canvasW = arg.size - arg.pointR * 2,
            dh = arg.size / 2 << 0,
            canvasH = arg.size + dh * 2,
            canvas = Canvas( canvasW, canvasH ),
            gc = canvas.context;
        wrapper.appendChild( canvas );
        css( canvas, {
            width : canvasW + "px",
            height : canvasH + "px",
            position : "absolute",
            left : arg.pointR + "px",
            top : -dh + "px"
        } );

        // 生成四个点
        $( "div", {
            css : {
                width : arg.pointR * 2 + "px",
                height : arg.pointR * 2 + "px",
                "border-radius" : arg.pointR * 2 + "px",
                border : "1px solid rgba(0,0,0,.3)",
                outline : "none",
                position : "absolute",
                bottom : "0",
                left : "0",
                background : "white",
                "box-sizing" : "border-box"
            }
        }, wrapper );

        $( "div", {
            css : {
                width : arg.pointR * 2 + "px",
                height : arg.pointR * 2 + "px",
                "border-radius" : arg.pointR * 2 + "px",
                border : "1px solid rgba(0,0,0,.3)",
                outline : "none",
                position : "absolute",
                top : 0,
                right : 0,
                background : "white",
                "box-sizing" : "border-box"
            }
        }, wrapper );

        var p1 = $( "div", {
            classList : "p1",
            css : {
                width : arg.pointR * 2 + "px",
                height : arg.pointR * 2 + "px",
                "border-radius" : arg.pointR * 2 + "px",
                border : "1px solid white",
                outline : "none",
                position : "absolute",
                bottom : 0,
                left : 0,
                background : "#f08",
                "box-sizing" : "border-box",
                cursor : "pointer"
            }
        }, wrapper );

        var p2 = $( "div", {
            classList : "p2",
            css : {
                width : arg.pointR * 2 + "px",
                height : arg.pointR * 2 + "px",
                "border-radius" : arg.pointR * 2 + "px",
                border : "1px solid white",
                outline : "none",
                position : "absolute",
                top : 0,
                right : 0,
                background : "#0ab",
                "box-sizing" : "border-box",
                cursor : "pointer"
            }
        }, wrapper );

        function Line( x0, y0, x1, y1, color, width ) {
            gc.save();
            gc.beginPath();
            gc.moveTo( x0, y0 );
            gc.lineTo( x1, y1 );
            gc.lineWidth = width;
            gc.strokeStyle = color;
            gc.stroke();
            gc.restore();
        }

        function bezierLine( color, p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y ) {
            gc.save();
            gc.beginPath();
            gc.moveTo( p0x, p0y );
            gc.lineWidth = 4;
            gc.bezierCurveTo( p1x, p1y, p2x, p2y, p3x, p3y );
            gc.strokeStyle = color;
            gc.stroke();
            gc.restore();
        }

        function fixed2( num ) {
            return (num * 100 << 0) / 100;
        }

        function isInRange( n, min, max ) {
            return n >= min && n <= max;
        }

        gc.fillStyle = "#9C27B0";
        gc.fillRect( 0, dh + arg.pointR, canvasW, canvasW );


        var y0 = dh + arg.size - arg.pointR;
        var y1 = dh + arg.pointR;
        var x0 = arg.size - arg.pointR * 2;

        function redraw( Data ) {
            gc.clearRect( 0, 0, canvasW, canvasH );
            gc.fillStyle = "#9C27B0";
            gc.fillRect( 0, dh + arg.pointR, canvasW, canvasW );
            var isP1 = isInRange( y0 + p1y, y1, y0 );
            var isP2 = isInRange( y1 + p2y, y1, y0 );
            Line( 0, y0, p1x, y0 + p1y, isP1 && isP2 ? "white" : "#EE8A11", 2 );
            Line( x0, y1, x0 + p2x, y1 + p2y, isP1 && isP2 ? "white" : "#EE8A11", 2 );
            bezierLine( isP1 && isP2 ? "white" : "#EE8A11", 0, y0, p1x, y0 + p1y, x0 + p2x, y1 + p2y, x0, y1 );
            var data = [fixed2( p1x / x0 ), fixed2( -p1y / x0 ), fixed2( (x0 + p2x) / x0 ), fixed2( (x0 - p2y) / x0 )];
            arg.onChange && arg.onChange( Data ? Data : data );
            wrapper.data = Data ? Data : data;
        }

        var p1x = 0, p1y = 0, p2x = 0, p2y = 0;

        pointer.onPointerDown( p1, function ( event ) {
            event.preventDefault();
            pointer.onMoveUp( {
                onMove : function ( event ) {
                    p1x = math.range( p1x + event.dX, 0, x0 );
                    p1y = math.range( p1y + event.dY, -dh - canvasW + arg.pointR, dh + arg.pointR );
                    css( p1, {
                        "-webkit-transform" : "translate3d(" + p1x + "px," + p1y + "px,0)"
                    } );
                    redraw();
                }
            } );
        } );

        pointer.onPointerDown( p2, function ( event ) {
            event.preventDefault();
            pointer.onMoveUp( {
                onMove : function ( event ) {
                    p2x = math.range( p2x + event.dX, -x0, 0 );
                    p2y = math.range( p2y + event.dY, -dh - arg.pointR, dh + canvasW - arg.pointR );
                    css( p2, {
                        "-webkit-transform" : "translate3d(" + p2x + "px," + p2y + "px,0)"
                    } );
                    redraw();
                }
            } );
        } );

        return object.insert( wrapper, {
            reset : function ( points ) {
                points[0] = math.range( points[0], 0, 1 );
                points[2] = math.range( points[2], 0, 1 );
                p1x = x0 * points[0];
                p1y = -x0 * points[1];
                p2x = x0 * points[2] - x0;
                p2y = x0 - x0 * points[3];
                css( p1, {
                    "-webkit-transform" : "translate3d(" + p1x + "px," + p1y + "px,0)"
                } );
                css( p2, {
                    "-webkit-transform" : "translate3d(" + p2x + "px," + p2y + "px,0)"
                } );
                redraw( points );
            }
        } );
    }

    module.exports = Picker;

} );