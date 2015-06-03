(function () {


    Node.prototype.css = function ( style ) {
        var el = this;
        for ( var key in style ) {
            el.style.setProperty( key, style[key], null );
        }
    };

    Node.prototype.bindEvent = function ( type, listener, useCapture ) {
        var el = this;
        el.addEventListener( type, listener, useCapture );
        return {
            remove : function () {
                el.removeEventListener( type, listener, useCapture );
            }
        }
    };

    Node.prototype.onDrag = function ( arg ) {
        var el = this;
        el.bindEvent( "mousedown", function ( e1 ) {
            var lastx = e1.pageX, lasty = e1.pageY;
            var mh = document.bindEvent( "mousemove", function ( e2 ) {
                arg.onMove && arg.onMove( {
                    dx : e2.pageX - lastx,
                    dy : e2.pageY - lasty
                } );
                lastx = e2.pageX;
                lasty = e2.pageY;
            }, false );

            var eh = document.bindEvent( "mouseup", function () {
                mh.remove();
                eh.remove();
            }, false );

        }, false );
    };


})();