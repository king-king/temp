(function ( t ) {
    var e = function () {
        var i = t, a = document, r = a.documentElement, n = 0;
        return {
            getUid : function ( t ) {
                var e = ++n;
                if ( t ) {
                    var i = t.charCodeAt( t.length - 1 );
                    if ( i >= 48 && i <= 57 )t += "_";
                    return t + e
                }
                return e
            },
            viewToString : function ( t ) {
                var e, i = t;
                while ( i ) {
                    e = e ? i.id + "." + e : i.id;
                    i = i.parent
                }
                return e
            },
            copy : function ( t, e, i ) {
                for ( var a in e ) {
                    if ( !i || t.hasOwnProperty( a ) || t[a] !== undefined ) {
                        t[a] = e[a]
                    }
                }
                return t
            },
            browser : function () {
                var t = navigator.userAgent;
                var e = {
                    iphone : /iphone/i.test( t ),
                    ipad : /ipad/i.test( t ),
                    ipod : /ipod/i.test( t ),
                    ios : /iphone|ipad|ipod/i.test( t ),
                    android : /android/i.test( t ),
                    webkit : /webkit/i.test( t ),
                    chrome : /chrome/i.test( t ),
                    safari : /safari/i.test( t ),
                    firefox : /firefox/i.test( t ),
                    ie : /msie/i.test( t ),
                    opera : /opera/i.test( t ),
                    supportTouch : "ontouchstart"in i,
                    supportCanvas : a.createElement( "canvas" ).getContext != null,
                    supportStorage : false,
                    supportOrientation : "orientation"in i,
                    supportDeviceMotion : "ondevicemotion"in i
                };
                try {
                    var n = "hilo";
                    localStorage.setItem( n, n );
                    localStorage.removeItem( n );
                    e.supportStorage = true
                }
                catch ( s ) {
                }
                var o = e.jsVendor = e.webkit ? "webkit" : e.firefox ? "Moz" : e.opera ? "O" : e.ie ? "ms" : "";
                var l = e.cssVendor = "-" + o + "-";
                var h = a.createElement( "div" ), u = h.style;
                var f = u[o + "Transform"] != undefined;
                var c = u[o + "Perspective"] != undefined;
                if ( c ) {
                    h.id = "test3d";
                    u = a.createElement( "style" );
                    u.textContent = "@media (" + l + "transform-3d){#test3d{height:3px}}";
                    a.head.appendChild( u );
                    r.appendChild( h );
                    c = h.offsetHeight == 3;
                    a.head.removeChild( u );
                    r.removeChild( h )
                }
                e.supportTransform = f;
                e.supportTransform3D = c;
                return e
            }(),
            event : function () {
                var t = "ontouchstart"in i;
                return {
                    POINTER_START : t ? "touchstart" : "mousedown",
                    POINTER_MOVE : t ? "touchmove" : "mousemove",
                    POINTER_END : t ? "touchend" : "mouseup"
                }
            }(),
            align : {
                TOP_LEFT : "TL",
                TOP : "T",
                TOP_RIGHT : "TR",
                LEFT : "L",
                CENTER : "C",
                RIGHT : "R",
                BOTTOM_LEFT : "BL",
                BOTTOM : "B",
                BOTTOM_RIGHT : "BR"
            },
            getElementRect : function ( t ) {
                try {
                    var e = t.getBoundingClientRect()
                }
                catch ( a ) {
                    e = {top : t.offsetTop, left : t.offsetLeft, width : t.offsetWidth, height : t.offsetHeight}
                }
                var n = (i.pageXOffset || r.scrollLeft) - (r.clientLeft || 0);
                var s = (i.pageYOffset || r.scrollTop) - (r.clientTop || 0);
                var o = i.getComputedStyle ? getComputedStyle( t ) : t.currentStyle;
                var l = parseInt;
                var h = l( o.paddingLeft ) + l( o.borderLeftWidth ) || 0;
                var u = l( o.paddingTop ) + l( o.borderTopWidth ) || 0;
                var f = l( o.paddingRight ) + l( o.borderRightWidth ) || 0;
                var c = l( o.paddingBottom ) + l( o.borderBottomWidth ) || 0;
                return {
                    left : e.left || 0 + n || 0 + h || 0,
                    top : e.top || 0 + s || 0 + u || 0,
                    width : e.right - f - e.left - h,
                    height : e.bottom - c - e.top - u
                }
            },
            createElement : function ( t, e ) {
                var i = a.createElement( t ), r, n, s;
                for ( r in e ) {
                    n = e[r];
                    if ( r === "style" ) {
                        for ( s in n )i.style[s] = n[s]
                    }
                    else {
                        i[r] = n
                    }
                }
                return i
            },
            getElement : function ( t ) {
                return a.getElementById( t )
            },
            setElementStyleByView : function ( t ) {
                var i = t.drawable, a = i.domElement.style, r = t._stateCache || (t._stateCache = {}), n = e.browser.jsVendor, s = "px", o = false;
                if ( this.cacheStateIfChanged( t, ["visible"], r ) ) {
                    a.display = !t.visible ? "none" : ""
                }
                if ( this.cacheStateIfChanged( t, ["alpha"], r ) ) {
                    a.opacity = t.alpha
                }
                if ( !t.visible || t.alpha <= 0 )return;
                if ( this.cacheStateIfChanged( t, ["width"], r ) ) {
                    a.width = t.width + s
                }
                if ( this.cacheStateIfChanged( t, ["height"], r ) ) {
                    a.height = t.height + s
                }
                if ( this.cacheStateIfChanged( t, ["depth"], r ) ) {
                    a.zIndex = t.depth + 1
                }
                if ( o = this.cacheStateIfChanged( t, ["pivotX", "pivotY"], r ) ) {
                    a[n + "TransformOrigin"] = t.pivotX + s + " " + t.pivotY + s
                }
                if ( this.cacheStateIfChanged( t, ["x", "y", "rotation", "scaleX", "scaleY"], r ) || o ) {
                    a[n + "Transform"] = this.getTransformCSS( t )
                }
                if ( this.cacheStateIfChanged( t, ["background"], r ) ) {
                    a.backgroundColor = t.background
                }
                if ( !a.pointerEvents ) {
                    a.pointerEvents = "none"
                }
                var l = i.image;
                if ( l ) {
                    var h = l.src;
                    if ( h !== r.image ) {
                        r.image = h;
                        a.backgroundImage = "url(" + h + ")"
                    }
                    var u = i.rect;
                    if ( u ) {
                        var f = u[0], c = u[1];
                        if ( f !== r.sx ) {
                            r.sx = f;
                            a.backgroundPositionX = -f + s
                        }
                        if ( c !== r.sy ) {
                            r.sy = c;
                            a.backgroundPositionY = -c + s
                        }
                    }
                }
                var d = t.mask;
                if ( d ) {
                    var m = d.drawable.domElement.style.backgroundImage;
                    if ( m !== r.maskImage ) {
                        r.maskImage = m;
                        a[n + "MaskImage"] = m;
                        a[n + "MaskRepeat"] = "no-repeat"
                    }
                    var p = d.x, _ = d.y;
                    if ( p !== r.maskX || _ !== r.maskY ) {
                        r.maskX = p;
                        r.maskY = _;
                        a[n + "MaskPosition"] = p + s + " " + _ + s
                    }
                }
            },
            cacheStateIfChanged : function ( t, e, i ) {
                var a, r, n, s, o = false;
                for ( a = 0, r = e.length; a < r; a++ ) {
                    n = e[a];
                    s = t[n];
                    if ( s != i[n] ) {
                        i[n] = s;
                        o = true
                    }
                }
                return o
            },
            getTransformCSS : function ( t ) {
                var e = this.browser.supportTransform3D, i = e ? "3d" : "";
                return "translate" + i + "(" + (t.x - t.pivotX) + "px, " + (t.y - t.pivotY) + (e ? "px, 0px)" : "px)") + "rotate" + i + (e ? "(0, 0, 1, " : "(") + t.rotation + "deg)" + "scale" + i + "(" + t.scaleX + ", " + t.scaleY + (e ? ", 1)" : ")")
            }
        }
    }();
    var i = function () {
        var t = function ( t ) {
            t = t || {};
            var i = t.hasOwnProperty( "constructor" ) ? t.constructor : function () {
            };
            e.call( i, t );
            return i
        };
        var e = function ( t ) {
            var e = {}, a, n;
            for ( a in t ) {
                n = t[a];
                if ( i.hasOwnProperty( a ) ) {
                    i[a].call( this, n )
                }
                else {
                    e[a] = n
                }
            }
            r( this.prototype, e )
        };
        var i = {
            Extends : function ( t ) {
                var e = this.prototype, i = a( t.prototype );
                r( this, t );
                r( i, e );
                i.constructor = this;
                this.prototype = i;
                this.superclass = t.prototype
            }, Mixes : function ( t ) {
                t instanceof Array || (t = [t]);
                var e = this.prototype, i;
                while ( i = t.shift() ) {
                    r( e, i.prototype || i )
                }
            }, Statics : function ( t ) {
                r( this, t )
            }
        };
        var a = function () {
            if ( Object.__proto__ ) {
                return function ( t ) {
                    return {__proto__ : t}
                }
            }
            else {
                var t = function () {
                };
                return function ( e ) {
                    t.prototype = e;
                    return new t
                }
            }
        }();
        var r = function ( t ) {
            for ( var e = 1, i = arguments.length; e < i; e++ ) {
                var a = arguments[e], r;
                for ( var n in a ) {
                    var o = a[n];
                    if ( o && typeof o === "object" ) {
                        if ( o.value !== undefined || typeof o.get === "function" || typeof o.set === "function" ) {
                            r = r || {};
                            r[n] = o;
                            continue
                        }
                    }
                    t[n] = o
                }
                if ( r )s( t, r )
            }
            return t
        };
        try {
            var n = Object.defineProperty, s = Object.defineProperties;
            n( {}, "$", {value : 0} )
        }
        catch ( o ) {
            if ( "__defineGetter__"in Object ) {
                n = function ( t, e, i ) {
                    if ( "value"in i )t[e] = i.value;
                    if ( "get"in i )t.__defineGetter__( e, i.get );
                    if ( "set"in i )t.__defineSetter__( e, i.set );
                    return t
                };
                s = function ( t, e ) {
                    for ( var i in e ) {
                        if ( e.hasOwnProperty( i ) ) {
                            n( t, i, e[i] )
                        }
                    }
                    return t
                }
            }
        }
        return {create : t, mix : r}
    }();
    var a = {
        _listeners : null, on : function ( t, e, i ) {
            var a = this._listeners = this._listeners || {};
            var r = a[t] = a[t] || [];
            for ( var n = 0, s = r.length; n < s; n++ ) {
                var o = r[n];
                if ( o.listener === e )return
            }
            r.push( {listener : e, once : i} );
            return this
        }, off : function ( t, e ) {
            if ( arguments.length == 0 ) {
                this._listeners = null;
                return this
            }
            var i = this._listeners && this._listeners[t];
            if ( i ) {
                if ( arguments.length == 1 ) {
                    delete this._listeners[t];
                    return this
                }
                for ( var a = 0, r = i.length; a < r; a++ ) {
                    var n = i[a];
                    if ( n.listener === e ) {
                        i.splice( a, 1 );
                        if ( i.length === 0 )delete this._listeners[t];
                        break
                    }
                }
            }
            return this
        }, fire : function ( t, e ) {
            var i, a;
            if ( typeof t === "string" ) {
                a = t
            }
            else {
                i = t;
                a = t.type
            }
            var n = this._listeners;
            if ( !n )return false;
            var s = n[a];
            if ( s ) {
                s = s.slice( 0 );
                i = i || new r( a, this, e );
                if ( i._stopped )return false;
                for ( var o = 0; o < s.length; o++ ) {
                    var l = s[o];
                    l.listener.call( this, i );
                    if ( l.once )s.splice( o--, 1 )
                }
                if ( s.length == 0 )delete n[a];
                return true
            }
            return false
        }
    };
    var r = i.create( {
        constructor : function R( t, e, i ) {
            this.type = t;
            this.target = e;
            this.detail = i;
            this.timeStamp = +new Date
        }, type : null, target : null, detail : null, timeStamp : 0, stopImmediatePropagation : function () {
            this._stopped = true
        }
    } );
    var n = t.Event;
    if ( n ) {
        var s = n.prototype, o = s.stopImmediatePropagation;
        s.stopImmediatePropagation = function () {
            o && o.call( this );
            this._stopped = true
        }
    }
    var l = i.create( {
        constructor : function ( t ) {
            t = t || {};
            e.copy( this, t, true )
        }, canvas : null, stage : null, startDraw : function ( t ) {
        }, draw : function ( t ) {
        }, endDraw : function ( t ) {
        }, transform : function () {
        }, hide : function () {
        }, remove : function ( t ) {
        }, clear : function ( t, e, i, a ) {
        }, resize : function ( t, e ) {
        }
    } );
    var h = i.create( {
        Extends : l, constructor : function ( t ) {
            h.superclass.constructor.call( this, t );
            this.context = this.canvas.getContext( "2d" )
        }, context : null, startDraw : function ( t ) {
            if ( t.visible && t.alpha > 0 ) {
                if ( t === this.stage ) {
                    this.context.clearRect( 0, 0, t.width, t.height )
                }
                this.context.save();
                return true
            }
            return false
        }, draw : function ( t ) {
            var e = this.context, i = t.width, a = t.height;
            var r = t.background;
            if ( r ) {
                e.fillStyle = r;
                e.fillRect( 0, 0, i, a )
            }
            var n = t.drawable, s = n && n.image;
            if ( s ) {
                var o = n.rect, l = o[2], h = o[3], u = o[4], f = o[5];
                if ( !i && !a ) {
                    i = t.width = l;
                    a = t.height = h
                }
                if ( u || f )e.translate( u - l * .5, f - h * .5 );
                e.drawImage( s, o[0], o[1], l, h, 0, 0, i, a )
            }
        }, endDraw : function ( t ) {
            this.context.restore()
        }, transform : function ( t ) {
            var i = t.drawable;
            if ( i && i.domElement ) {
                e.setElementStyleByView( t );
                return
            }
            var a = this.context, r = t.scaleX, n = t.scaleY;
            if ( t === this.stage ) {
                var s = this.canvas.style, o = t._scaleX, l = t._scaleY;
                if ( !o && r != 1 || o && o != r ) {
                    t._scaleX = r;
                    s.width = r * t.width + "px"
                }
                if ( !l && n != 1 || l && l != n ) {
                    t._scaleY = n;
                    s.height = n * t.height + "px"
                }
            }
            else {
                var h = t.x, u = t.y, f = t.pivotX, c = t.pivotY, d = t.rotation % 360, m = t.mask;
                if ( m ) {
                    m._render( this );
                    a.clip()
                }
                var p = t.align;
                if ( p ) {
                    if ( typeof p === "function" ) {
                        t.align()
                    }
                    else {
                        var _ = t.parent;
                        if ( _ ) {
                            var v = t.width, g = t.height, y = _.width, w = _.height;
                            switch ( p ) {
                                case"TL":
                                    h = 0;
                                    u = 0;
                                    break;
                                case"T":
                                    h = y - v >> 1;
                                    u = 0;
                                    break;
                                case"TR":
                                    h = y - v;
                                    u = 0;
                                    break;
                                case"L":
                                    h = 0;
                                    u = w - g >> 1;
                                    break;
                                case"C":
                                    h = y - v >> 1;
                                    u = w - g >> 1;
                                    break;
                                case"R":
                                    h = y - v;
                                    u = w - g >> 1;
                                    break;
                                case"BL":
                                    h = 0;
                                    u = w - g;
                                    break;
                                case"B":
                                    h = y - v >> 1;
                                    u = w - g;
                                    break;
                                case"BR":
                                    h = y - v;
                                    u = w - g;
                                    break
                            }
                        }
                    }
                }
                if ( h != 0 || u != 0 )a.translate( h, u );
                if ( d != 0 )a.rotate( d * Math.PI / 180 );
                if ( r != 1 || n != 1 )a.scale( r, n );
                if ( f != 0 || c != 0 )a.translate( -f, -c )
            }
            if ( t.alpha > 0 )a.globalAlpha *= t.alpha
        }, remove : function ( t ) {
            var e = t.drawable;
            var i = e && e.domElement;
            if ( i ) {
                var a = i.parentNode;
                if ( a ) {
                    a.removeChild( i )
                }
            }
        }, clear : function ( t, e, i, a ) {
            this.context.clearRect( t, e, i, a )
        }, resize : function ( t, e ) {
            this.canvas.width = t;
            this.canvas.height = e
        }
    } );
    var u = function () {
        return i.create( {
            Extends : l, constructor : function ( t ) {
                u.superclass.constructor.call( this, t )
            }, startDraw : function ( e ) {
                var i = e.drawable = e.drawable || new c;
                i.domElement = i.domElement || t( e, i );
                return true
            }, draw : function ( t ) {
                var e = t.parent, i = t.drawable.domElement, a = i.parentNode;
                if ( e ) {
                    var r = e.drawable.domElement;
                    if ( r != a ) {
                        r.appendChild( i )
                    }
                }
                else if ( t === this.stage && !a ) {
                    i.style.overflow = "hidden";
                    this.canvas.appendChild( i )
                }
            }, transform : function ( t ) {
                e.setElementStyleByView( t );
                if ( t === this.stage ) {
                    var i = this.canvas.style, a = t._scaleX, r = t._scaleY;
                    scaleX = t.scaleX, scaleY = t.scaleY;
                    if ( !a && scaleX != 1 || a && a != scaleX ) {
                        t._scaleX = scaleX;
                        i.width = scaleX * t.width + "px"
                    }
                    if ( !r && scaleY != 1 || r && r != scaleY ) {
                        t._scaleY = scaleY;
                        i.height = scaleY * t.height + "px"
                    }
                }
            }, remove : function ( t ) {
                var e = t.drawable;
                var i = e && e.domElement;
                if ( i ) {
                    var a = i.parentNode;
                    if ( a ) {
                        a.removeChild( i )
                    }
                }
            }, hide : function ( t ) {
                var e = t.drawable && t.drawable.domElement;
                if ( e )e.style.display = "none"
            }, resize : function ( t, e ) {
                var i = this.canvas.style;
                i.width = t + "px";
                i.height = e + "px";
                if ( i.position != "absolute" ) {
                    i.position = "relative"
                }
            }
        } );
        function t( t, i ) {
            var a = t.tagName || "div", r = i.image, n = t.width || r && r.width, s = t.height || r && r.height, o = e.createElement( a ), l = o.style;
            if ( t.id )o.id = t.id;
            l.position = "absolute";
            l.left = (t.left || 0) + "px";
            l.top = (t.top || 0) + "px";
            l.width = n + "px";
            l.height = s + "px";
            if ( a == "canvas" ) {
                o.width = n;
                o.height = s;
                if ( r ) {
                    var h = o.getContext( "2d" );
                    var u = i.rect || [0, 0, n, s];
                    h.drawImage( r, u[0], u[1], u[2], u[3], t.x || 0, t.y || 0, t.width || u[2], t.height || u[3] )
                }
            }
            else {
                l.opacity = t.alpha != undefined ? t.alpha : 1;
                if ( t === this.stage || t.clipChildren )l.overflow = "hidden";
                if ( r && r.src ) {
                    l.backgroundImage = "url(" + r.src + ")";
                    var f = t.rectX || 0, c = t.rectY || 0;
                    l.backgroundPosition = -f + "px " + -c + "px"
                }
            }
            return o
        }
    }();
    var f = i.create( {
        constructor : function ( t, e, i, a, r, n ) {
            this.a = t;
            this.b = e;
            this.c = i;
            this.d = a;
            this.tx = r;
            this.ty = n
        }, concat : function ( t ) {
            var e = arguments, i = this.a, a = this.b, r = this.c, n = this.d, s = this.tx, o = this.ty;
            if ( e.length >= 6 ) {
                var l = e[0], h = e[1], u = e[2], f = e[3], c = e[4], d = e[5]
            }
            else {
                l = t.a;
                h = t.b;
                u = t.c;
                f = t.d;
                c = t.tx;
                d = t.ty
            }
            this.a = i * l + a * u;
            this.b = i * h + a * f;
            this.c = r * l + n * u;
            this.d = r * h + n * f;
            this.tx = s * l + o * u + c;
            this.ty = s * h + o * f + d;
            return this
        }, rotate : function ( t ) {
            var e = Math.sin( t ), i = Math.cos( t ), a = this.a, r = this.b, n = this.c, s = this.d, o = this.tx, l = this.ty;
            this.a = a * i - r * e;
            this.b = a * e + r * i;
            this.c = n * i - s * e;
            this.d = n * e + s * i;
            this.tx = o * i - l * e;
            this.ty = o * e + l * i;
            return this
        }, scale : function ( t, e ) {
            this.a *= t;
            this.d *= e;
            this.c *= t;
            this.b *= e;
            this.tx *= t;
            this.ty *= e;
            return this
        }, translate : function ( t, e ) {
            this.tx += t;
            this.ty += e;
            return this
        }, identity : function () {
            this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
            return this
        }, invert : function () {
            var t = this.a;
            var e = this.b;
            var i = this.c;
            var a = this.d;
            var r = this.tx;
            var n = t * a - e * i;
            this.a = a / n;
            this.b = -e / n;
            this.c = -i / n;
            this.d = t / n;
            this.tx = (i * this.ty - a * r) / n;
            this.ty = -(t * this.ty - e * r) / n;
            return this
        }, transformPoint : function ( t, e, i ) {
            var a = t.x * this.a + t.y * this.c + this.tx, r = t.x * this.b + t.y * this.d + this.ty;
            if ( e ) {
                a = a + .5 >> 0;
                r = r + .5 >> 0
            }
            if ( i )return {x : a, y : r};
            t.x = a;
            t.y = r;
            return t
        }
    } );
    var c = i.create( {
        constructor : function ( t ) {
            this.init( t )
        }, image : null, rect : null, init : function ( t ) {
            var i = this, a = i.image;
            if ( c.isDrawable( t ) ) {
                i.image = t
            }
            else {
                e.copy( i, t, true )
            }
            var r = i.image;
            if ( typeof r === "string" ) {
                if ( a && r === a.getAttribute( "src" ) ) {
                    r = i.image = a
                }
                else {
                    i.image = null;
                    var n = new Image;
                    n.onload = function () {
                        n.onload = null;
                        i.init( n )
                    };
                    n.src = r;
                    return
                }
            }
            if ( r && !i.rect )i.rect = [0, 0, r.width, r.height]
        }, Statics : {
            isDrawable : function ( t ) {
                if ( !t || !t.tagName )return false;
                var e = t.tagName.toLowerCase();
                return e === "img" || e === "canvas" || e === "video"
            }
        }
    } );
    var d = function () {
        return i.create( {
            Mixes : a,
            constructor : function ( t ) {
                t = t || {};
                this.id = this.id || t.id || e.getUid( "View" );
                e.copy( this, t, true )
            },
            id : null,
            x : 0,
            y : 0,
            width : 0,
            height : 0,
            alpha : 1,
            rotation : 0,
            visible : true,
            pivotX : 0,
            pivotY : 0,
            scaleX : 1,
            scaleY : 1,
            pointerEnabled : true,
            background : null,
            mask : null,
            align : null,
            drawable : null,
            boundsArea : null,
            parent : null,
            depth : -1,
            getStage : function () {
                var t = this, e;
                while ( e = t.parent )t = e;
                if ( t.canvas )return t;
                return null
            },
            getScaledWidth : function () {
                return this.width * this.scaleX
            },
            getScaledHeight : function () {
                return this.height * this.scaleY
            },
            addTo : function ( t, e ) {
                if ( typeof e === "number" ) {
                    t.addChildAt( this, e );
                }
                else {
                    t.addChild( this );
                }
                return this
            },
            removeFromParent : function () {
                var t = this.parent;
                if ( t )t.removeChild( this );
                return this
            },
            getBounds : function () {
                var t = this.width, e = this.height, i = this.getConcatenatedMatrix(), a = this.boundsArea || [{x : 0, y : 0}, {x : t, y : 0}, {
                        x : t,
                        y : e
                    }, {x : 0, y : e}], r = [], n, s, o, l, h, u, f;
                for ( var c = 0, d = a.length; c < d; c++ ) {
                    n = i.transformPoint( a[c], true, true );
                    s = n.x;
                    o = n.y;
                    if ( c == 0 ) {
                        l = h = s;
                        u = f = o
                    }
                    else {
                        if ( l > s ) {
                            l = s;
                        }
                        else if ( h < s )h = s;
                        if ( u > o ) {
                            u = o;
                        }
                        else if ( f < o )f = o
                    }
                    r[c] = n
                }
                r.x = l;
                r.y = u;
                r.width = h - l;
                r.height = f - u;
                return r
            },
            getConcatenatedMatrix : function ( t ) {
                var e = new f( 1, 0, 0, 1, 0, 0 );
                for ( var i = this; i != t && i.parent; i = i.parent ) {
                    var a = 1, r = 0, n = i.rotation % 360, s = i.pivotX, o = i.pivotY, l = i.scaleX, h = i.scaleY;
                    if ( n ) {
                        var u = n * Math.PI / 180;
                        a = Math.cos( u );
                        r = Math.sin( u )
                    }
                    if ( s != 0 )e.tx -= s;
                    if ( o != 0 )e.ty -= o;
                    e.concat( a * l, r * l, -r * h, a * h, i.x, i.y )
                }
                return e
            },
            hitTestPoint : function ( e, i, a ) {
                var r = this.getBounds(), n = e >= r.x && e <= r.x + r.width && i >= r.y && i <= r.y + r.height;
                if ( n && a ) {
                    n = t( e, i, r )
                }
                return n
            },
            hitTestObject : function ( t, e ) {
                var i = this.getBounds(), a = t.getBounds(), n = i.x <= a.x + a.width && a.x <= i.x + i.width && i.y <= a.y + a.height && a.y <= i.y + i.height;
                if ( n && e ) {
                    n = r( i, a )
                }
                return !!n
            },
            _render : function ( t, e ) {
                if ( (!this.onUpdate || this.onUpdate( e ) !== false) && t.startDraw( this ) ) {
                    t.transform( this );
                    this.render( t, e );
                    t.endDraw( this )
                }
            },
            _fireMouseEvent : function ( t ) {
                t.eventCurrentTarget = this;
                this.fire( t );
                if ( t.type == "mousemove" ) {
                    if ( !this.__mouseOver ) {
                        this.__mouseOver = true;
                        var i = e.copy( {}, t );
                        i.type = "mouseover";
                        this.fire( i )
                    }
                }
                else if ( t.type == "mouseout" ) {
                    this.__mouseOver = false
                }
                var a = this.parent;
                if ( !t._stopped && !t._stopPropagationed && a ) {
                    if ( t.type == "mouseout" || t.type == "touchout" ) {
                        if ( !a.hitTestPoint( t.stageX, t.stageY, true ) ) {
                            a._fireMouseEvent( t )
                        }
                    }
                    else {
                        a._fireMouseEvent( t )
                    }
                }
            },
            onUpdate : null,
            render : function ( t, e ) {
                t.draw( this )
            },
            toString : function () {
                return e.viewToString( this )
            }
        } );
        function t( t, e, i ) {
            var a = 0, r = false, n, s, o, l;
            for ( var h = 0, u = i.length; h < u; h++ ) {
                var f = i[h], c = i[(h + 1) % u];
                if ( f.y == c.y && e == f.y ) {
                    f.x > c.x ? (n = c.x, s = f.x) : (n = f.x, s = c.x);
                    if ( t >= n && t <= s ) {
                        r = true;
                        continue
                    }
                }
                f.y > c.y ? (o = c.y, l = f.y) : (o = f.y, l = c.y);
                if ( e < o || e > l )continue;
                var d = (e - f.y) * (c.x - f.x) / (c.y - f.y) + f.x;
                if ( d > t ) {
                    a++;
                }
                else if ( d == t )r = true;
                if ( f.x > t && f.y == e ) {
                    var m = i[(u + h - 1) % u];
                    if ( m.y < e && c.y > e || m.y > e && c.y < e ) {
                        a++
                    }
                }
            }
            return r || a % 2 == 1
        }

        function r( t, e ) {
            var i = n( t, e, {overlap : -Infinity, normal : {x : 0, y : 0}} );
            if ( i )return n( e, t, i );
            return false
        }

        function n( t, e, i ) {
            var a = t.length, r = e.length, n, s, o, l, h, u, f, c, d, m = {x : 0, y : 0};
            for ( var p = 0; p < a; p++ ) {
                n = t[p];
                s = t[p < a - 1 ? p + 1 : 0];
                m.x = n.y - s.y;
                m.y = s.x - n.x;
                o = Math.sqrt( m.x * m.x + m.y * m.y );
                m.x /= o;
                m.y /= o;
                l = h = t[0].x * m.x + t[0].y * m.y;
                for ( var _ = 1; _ < a; _++ ) {
                    c = t[_].x * m.x + t[_].y * m.y;
                    if ( c > h ) {
                        h = c;
                    }
                    else if ( c < l )l = c
                }
                u = f = e[0].x * m.x + e[0].y * m.y;
                for ( _ = 1; _ < r; _++ ) {
                    c = e[_].x * m.x + e[_].y * m.y;
                    if ( c > f ) {
                        f = c;
                    }
                    else if ( c < u )u = c
                }
                if ( l < u ) {
                    d = u - h;
                    m.x = -m.x;
                    m.y = -m.y
                }
                else {
                    d = l - f
                }
                if ( d >= 0 ) {
                    return false
                }
                else if ( d > i.overlap ) {
                    i.overlap = d;
                    i.normal.x = m.x;
                    i.normal.y = m.y
                }
            }
            return i
        }
    }();
    var m = i.create( {
        Extends : d, constructor : function ( t ) {
            t = t || {};
            this.id = this.id || t.id || e.getUid( "Container" );
            m.superclass.constructor.call( this, t );
            if ( this.children ) {
                this._updateChildren();
            }
            else {
                this.children = []
            }
        }, children : null, pointerChildren : true, clipChildren : false, getNumChildren : function () {
            return this.children.length
        }, addChildAt : function ( t, e ) {
            var i = this.children, a = i.length, r = t.parent;
            e = e < 0 ? 0 : e > a ? a : e;
            var n = this.getChildIndex( t );
            if ( n == e ) {
                return this
            }
            else if ( n >= 0 ) {
                i.splice( n, 1 );
                e = e == a ? a - 1 : e
            }
            else if ( r ) {
                r.removeChild( t )
            }
            i.splice( e, 0, t );
            if ( n < 0 ) {
                this._updateChildren( e )
            }
            else {
                var s = n < e ? n : e;
                var o = n < e ? e : n;
                this._updateChildren( s, o + 1 )
            }
            return this
        }, addChild : function ( t ) {
            var e = this.children.length, i = arguments;
            for ( var a = 0, r = i.length; a < r; a++ ) {
                this.addChildAt( i[a], e + a )
            }
            return this
        }, removeChildAt : function ( t ) {
            var e = this.children;
            if ( t < 0 || t >= e.length )return null;
            var i = e[t];
            if ( i ) {
                if ( !i.__renderer ) {
                    var a = i;
                    while ( a = a.parent ) {
                        if ( a.renderer ) {
                            i.__renderer = a.renderer;
                            break
                        }
                        else if ( a.__renderer ) {
                            i.__renderer = a.__renderer;
                            break
                        }
                    }
                }
                if ( i.__renderer ) {
                    i.__renderer.remove( i )
                }
                i.parent = null;
                i.depth = -1
            }
            e.splice( t, 1 );
            this._updateChildren( t );
            return i
        }, removeChild : function ( t ) {
            return this.removeChildAt( this.getChildIndex( t ) )
        }, removeChildById : function ( t ) {
            var e = this.children, i;
            for ( var a = 0, r = e.length; a < r; a++ ) {
                i = e[a];
                if ( i.id === t ) {
                    this.removeChildAt( a );
                    return i
                }
            }
            return null
        }, removeAllChildren : function () {
            while ( this.children.length )this.removeChildAt( 0 );
            return this
        }, getChildAt : function ( t ) {
            var e = this.children;
            if ( t < 0 || t >= e.length )return null;
            return e[t]
        }, getChildById : function ( t ) {
            var e = this.children, i;
            for ( var a = 0, r = e.length; a < r; a++ ) {
                i = e[a];
                if ( i.id === t )return i
            }
            return null
        }, getChildIndex : function ( t ) {
            return this.children.indexOf( t )
        }, setChildIndex : function ( t, e ) {
            var i = this.children, a = i.indexOf( t );
            if ( a >= 0 && a != e ) {
                var r = i.length;
                e = e < 0 ? 0 : e >= r ? r - 1 : e;
                i.splice( a, 1 );
                i.splice( e, 0, t );
                this._updateChildren()
            }
            return this
        }, swapChildren : function ( t, e ) {
            var i = this.children, a = this.getChildIndex( t ), r = this.getChildIndex( e );
            t.depth = r;
            i[r] = t;
            e.depth = a;
            i[a] = e
        }, swapChildrenAt : function ( t, e ) {
            var i = this.children, a = this.getChildAt( t ), r = this.getChildAt( e );
            a.depth = e;
            i[e] = a;
            r.depth = t;
            i[t] = r
        }, sortChildren : function ( t ) {
            var e = t, i = this.children;
            if ( typeof e == "string" ) {
                var a = e;
                e = function ( t, e ) {
                    return e[a] - t[a]
                }
            }
            i.sort( e );
            this._updateChildren()
        }, _updateChildren : function ( t, e ) {
            var i = this.children, a, t = t || 0, e = e || i.length;
            for ( var r = t; r < e; r++ ) {
                a = i[r];
                a.depth = r + 1;
                a.parent = this
            }
        }, contains : function ( t ) {
            while ( t = t.parent ) {
                if ( t === this ) {
                    return true
                }
            }
            return false
        }, getViewAtPoint : function ( t, e, i, a, r ) {
            var n = a ? [] : null, s = this.children, o, l;
            for ( var h = s.length - 1; h >= 0; h-- ) {
                o = s[h];
                if ( !o || !o.visible || o.alpha <= 0 || r && !o.pointerEnabled )continue;
                if ( o.children && o.children.length && !(r && !o.pointerChildren) ) {
                    l = o.getViewAtPoint( t, e, i, a, r )
                }
                if ( l ) {
                    if ( !a ) {
                        return l;
                    }
                    else if ( l.length )n = n.concat( l )
                }
                else if ( o.hitTestPoint( t, e, i ) ) {
                    if ( !a ) {
                        return o;
                    }
                    else {
                        n.push( o )
                    }
                }
            }
            return a && n.length ? n : null
        }, render : function ( t, e ) {
            m.superclass.render.call( this, t, e );
            var i = this.children.slice( 0 ), a, r, n;
            for ( a = 0, r = i.length; a < r; a++ ) {
                n = i[a];
                if ( n.parent === this )n._render( t, e )
            }
        }
    } );
    var p = i.create( {
        Extends : m, constructor : function ( t ) {
            t = t || {};
            this.id = this.id || t.id || e.getUid( "Stage" );
            p.superclass.constructor.call( this, t );
            this._initRenderer( t );
            var i = this.width, a = this.height, r = this.updateViewport();
            if ( !t.width )i = r && r.width || 320;
            if ( !t.height )a = r && r.height || 480;
            this.resize( i, a, true )
        }, canvas : null, renderer : null, paused : false, viewport : null, _initRenderer : function ( t ) {
            var i = this.canvas;
            if ( typeof i === "string" )i = e.getElement( i );
            var a = t.container;
            if ( typeof a === "string" )a = e.getElement( a );
            if ( !i ) {
                i = e.createElement( "canvas", {style : {position : "absolute"}} )
            }
            this.canvas = i;
            if ( a )a.appendChild( i );
            var r = i.getContext, n = {canvas : i, stage : this};
            this.renderer = r ? new h( n ) : new u( n )
        }, addTo : function ( t ) {
            var e = this.canvas;
            if ( e.parentNode !== t ) {
                t.appendChild( e )
            }
            return this
        }, tick : function ( t ) {
            if ( !this.paused ) {
                this._render( this.renderer, t )
            }
        }, enableDOMEvent : function ( t, e ) {
            var i = this, a = i.canvas, r = typeof t === "string" ? [t] : t, e = e !== false, n = i._domListener || (i._domListener = function ( t ) {
                    i._onDOMEvent( t )
                });
            for ( var s = 0; s < r.length; s++ ) {
                var t = r[s];
                if ( e ) {
                    a.addEventListener( t, n, false )
                }
                else {
                    a.removeEventListener( t, n )
                }
            }
            return i
        }, _onDOMEvent : function ( t ) {
            var i = t.type, a = t, r = i.indexOf( "touch" ) == 0;
            var n = t;
            if ( r ) {
                var s = t.touches, o = t.changedTouches;
                n = s && s.length ? s[0] : o && o.length ? o[0] : null
            }
            var l = n.pageX || n.clientX, h = n.pageY || n.clientY, u = this.viewport || this.updateViewport();
            a.stageX = l = (l - u.left) / this.scaleX;
            a.stageY = h = (h - u.top) / this.scaleY;
            a.stopPropagation = function () {
                this._stopPropagationed = true
            };
            var f = this.getViewAtPoint( l, h, true, false, true ) || this, c = this.canvas, d = this._eventTarget;
            var m = i === "mouseout";
            if ( d && (d != f && (!d.contains || !d.contains( f )) || m) ) {
                var p = i === "touchmove" ? "touchout" : i === "mousemove" || m || !f ? "mouseout" : null;
                if ( p ) {
                    var _ = e.copy( {}, a );
                    _.type = p;
                    _.eventTarget = d;
                    d._fireMouseEvent( _ )
                }
                a.lastEventTarget = d;
                this._eventTarget = null
            }
            if ( f && f.pointerEnabled && i !== "mouseout" ) {
                a.eventTarget = this._eventTarget = f;
                f._fireMouseEvent( a )
            }
            if ( !r ) {
                var v = f && f.pointerEnabled && f.useHandCursor ? "pointer" : "";
                c.style.cursor = v
            }
            if ( e.browser.android && i === "touchmove" ) {
                t.preventDefault()
            }
        }, updateViewport : function () {
            var t = this.canvas, i = null;
            if ( t.parentNode ) {
                i = this.viewport = e.getElementRect( t )
            }
            return i
        }, resize : function ( t, e, i ) {
            if ( i || this.width !== t || this.height !== e ) {
                this.width = t;
                this.height = e;
                this.renderer.resize( t, e );
                this.updateViewport()
            }
        }
    } );
    var _ = i.create( {
        Extends : d, constructor : function ( t ) {
            t = t || {};
            this.id = this.id || t.id || e.getUid( "Bitmap" );
            _.superclass.constructor.call( this, t );
            this.drawable = new c( t );
            if ( !this.width || !this.height ) {
                var i = this.drawable.rect;
                if ( i ) {
                    this.width = i[2];
                    this.height = i[3]
                }
            }
        }, setImage : function ( t, e ) {
            this.drawable.init( {image : t, rect : e} );
            if ( e ) {
                this.width = e[2];
                this.height = e[3]
            }
            return this
        }
    } );
    var v = i.create( {
        Extends : d,
        constructor : function ( t ) {
            t = t || {};
            this.id = this.id || t.id || e.getUid( "Sprite" );
            v.superclass.constructor.call( this, t );
            this._frames = [];
            this._frameNames = {};
            this.drawable = new c;
            if ( t.frames )this.addFrame( t.frames )
        },
        _frames : null,
        _frameNames : null,
        _frameElapsed : 0,
        _firstRender : true,
        paused : false,
        loop : true,
        timeBased : false,
        interval : 1,
        currentFrame : 0,
        getNumFrames : function () {
            return this._frames ? this._frames.length : 0
        },
        addFrame : function ( t, e ) {
            var i = e != null ? e : this._frames.length;
            if ( t instanceof Array ) {
                for ( var a = 0, r = t.length; a < r; a++ ) {
                    this.setFrame( t[a], i + a )
                }
            }
            else {
                this.setFrame( t, i )
            }
            return this
        },
        setFrame : function ( t, e ) {
            var i = this._frames, a = i.length;
            e = e < 0 ? 0 : e > a ? a : e;
            i[e] = t;
            if ( t.name )this._frameNames[t.name] = t;
            if ( e == 0 && !this.width || !this.height ) {
                this.width = t.rect[2];
                this.height = t.rect[3]
            }
            return this
        },
        getFrame : function ( t ) {
            if ( typeof t === "number" ) {
                var e = this._frames;
                if ( t < 0 || t >= e.length )return null;
                return e[t]
            }
            return this._frameNames[t]
        },
        getFrameIndex : function ( t ) {
            var e = this._frames, i = e.length, a = -1;
            if ( typeof t === "number" ) {
                a = t
            }
            else {
                var r = typeof t === "string" ? this._frameNames[t] : t;
                if ( r ) {
                    for ( var n = 0; n < i; n++ ) {
                        if ( r === e[n] ) {
                            a = n;
                            break
                        }
                    }
                }
            }
            return a
        },
        play : function () {
            this.paused = false;
            return this
        },
        stop : function () {
            this.paused = true;
            return this
        },
        "goto" : function ( t, e ) {
            var i = this._frames.length, a = this.getFrameIndex( t );
            this.currentFrame = a < 0 ? 0 : a >= i ? i - 1 : a;
            this.paused = e;
            this._firstRender = true;
            return this
        },
        _render : function ( t, e ) {
            var i = this.currentFrame, a;
            if ( this._firstRender ) {
                a = i;
                this._firstRender = false
            }
            else {
                a = this._nextFrame( e )
            }
            if ( a != i ) {
                this.currentFrame = a;
                var r = this._frames[a].callback;
                r && r.call( this )
            }
            if ( this.onEnterFrame )this.onEnterFrame( a );
            this.drawable.init( this._frames[a] );
            v.superclass._render.call( this, t, e )
        },
        _nextFrame : function ( t ) {
            var e = this._frames, i = e.length, a = this.currentFrame, r = e[a], n = r.duration || this.interval, s = this._frameElapsed;
            var o = a == 0 && !this.drawable ? 0 : s + (this.timeBased ? t : 1);
            s = this._frameElapsed = o < n ? o : 0;
            if ( r.stop || !this.loop && a >= i - 1 ) {
                this.stop()
            }
            if ( !this.paused && s == 0 ) {
                if ( r.next != null ) {
                    a = this.getFrameIndex( r.next )
                }
                else if ( a >= i - 1 ) {
                    a = 0
                }
                else if ( this.drawable ) {
                    a++
                }
            }
            return a
        },
        setFrameCallback : function ( t, e ) {
            t = this.getFrame( t );
            if ( t )t.callback = e;
            return this
        },
        onEnterFrame : null
    } );
    var g = i.create( {
        Extends : d, constructor : function ( t ) {
            t = t || {};
            this.id = this.id || t.id || e.getUid( "DOMElement" );
            g.superclass.constructor.call( this, t );
            this.drawable = new c;
            var i = this.drawable.domElement = t.element || e.createElement( "div" );
            i.id = this.id
        }, _render : function ( t, e ) {
            if ( !this.onUpdate || this.onUpdate( e ) !== false ) {
                t.transform( this );
                if ( this.visible && this.alpha > 0 ) {
                    this.render( t, e )
                }
            }
        }, render : function ( t, e ) {
            var i = t.canvas;
            if ( i.getContext ) {
                var a = this.drawable.domElement, r = this.depth, n = i.nextSibling, s;
                if ( a.parentNode )return;
                while ( n && n.nodeType != 3 ) {
                    s = parseInt( n.style.zIndex ) || 0;
                    if ( s <= 0 || s > r ) {
                        break
                    }
                    n = n.nextSibling
                }
                i.parentNode.insertBefore( this.drawable.domElement, n )
            }
            else {
                t.draw( this )
            }
        }
    } );
    var y = function () {
        var t = document.createElement( "canvas" );
        var a = t.getContext && t.getContext( "2d" );
        return i.create( {
            Extends : d,
            constructor : function ( t ) {
                t = t || {};
                this.id = this.id || t.id || e.getUid( "Graphics" );
                y.superclass.constructor.call( this, t );
                this._actions = [];
                this._cache = null
            },
            lineWidth : 1,
            lineAlpha : 1,
            lineCap : null,
            lineJoin : null,
            miterLimit : 10,
            hasStroke : false,
            strokeStyle : "0",
            hasFill : false,
            fillStyle : "0",
            fillAlpha : 0,
            lineStyle : function ( t, e, i, a, r, n ) {
                var s = this, o = s._addAction;
                o.call( s, ["lineWidth", s.lineWidth = t || 1] );
                o.call( s, ["strokeStyle", s.strokeStyle = e || "0"] );
                o.call( s, ["lineAlpha", s.lineAlpha = i || 1] );
                if ( a != undefined )o.call( s, ["lineCap", s.lineCap = a] );
                if ( r != undefined )o.call( s, ["lineJoin", s.lineJoin = r] );
                if ( n != undefined )o.call( s, ["miterLimit", s.miterLimit = n] );
                s.hasStroke = true;
                return s
            },
            beginFill : function ( t, e ) {
                var i = this, a = i._addAction;
                a.call( i, ["fillStyle", i.fillStyle = t] );
                a.call( i, ["fillAlpha", i.fillAlpha = e || 1] );
                i.hasFill = true;
                return i
            },
            endFill : function () {
                var t = this, e = t._addAction;
                if ( t.hasStroke )e.call( t, ["stroke"] );
                if ( t.hasFill )e.call( t, ["fill"] );
                return t
            },
            beginLinearGradientFill : function ( t, e, i, r, n, s ) {
                var o = this, l = a.createLinearGradient( t, e, i, r );
                for ( var h = 0, u = n.length; h < u; h++ ) {
                    l.addColorStop( s[h], n[h] )
                }
                o.hasFill = true;
                return o._addAction( ["fillStyle", o.fillStyle = l] )
            },
            beginRadialGradientFill : function ( t, e, i, r, n, s, o, l ) {
                var h = this, u = a.createRadialGradient( t, e, i, r, n, s );
                for ( var f = 0, c = o.length; f < c; f++ ) {
                    u.addColorStop( l[f], o[f] )
                }
                h.hasFill = true;
                return h._addAction( ["fillStyle", h.fillStyle = u] )
            },
            beginBitmapFill : function ( t, e ) {
                var i = this, r = a.createPattern( t, e || "" );
                i.hasFill = true;
                return i._addAction( ["fillStyle", i.fillStyle = r] )
            },
            beginPath : function () {
                return this._addAction( ["beginPath"] )
            },
            closePath : function () {
                return this._addAction( ["closePath"] )
            },
            moveTo : function ( t, e ) {
                return this._addAction( ["moveTo", t, e] )
            },
            lineTo : function ( t, e ) {
                return this._addAction( ["lineTo", t, e] )
            },
            quadraticCurveTo : function ( t, e, i, a ) {
                return this._addAction( ["quadraticCurveTo", t, e, i, a] )
            },
            bezierCurveTo : function ( t, e, i, a, r, n ) {
                return this._addAction( ["bezierCurveTo", t, e, i, a, r, n] )
            },
            drawRect : function ( t, e, i, a ) {
                return this._addAction( ["rect", t, e, i, a] )
            },
            drawRoundRectComplex : function ( t, e, i, a, r, n, s, o ) {
                var l = this, h = l._addAction;
                h.call( l, ["moveTo", t + r, e] );
                h.call( l, ["lineTo", t + i - n, e] );
                h.call( l, ["arc", t + i - n, e + n, n, -Math.PI / 2, 0, false] );
                h.call( l, ["lineTo", t + i, e + a - s] );
                h.call( l, ["arc", t + i - s, e + a - s, s, 0, Math.PI / 2, false] );
                h.call( l, ["lineTo", t + o, e + a] );
                h.call( l, ["arc", t + o, e + a - o, o, Math.PI / 2, Math.PI, false] );
                h.call( l, ["lineTo", t, e + r] );
                h.call( l, ["arc", t + r, e + r, r, Math.PI, Math.PI * 3 / 2, false] );
                return l
            },
            drawRoundRect : function ( t, e, i, a, r ) {
                return this.drawRoundRectComplex( t, e, i, a, r, r, r, r )
            },
            drawCircle : function ( t, e, i ) {
                return this._addAction( ["arc", t + i, e + i, i, 0, Math.PI * 2, 0] )
            },
            drawEllipse : function ( t, e, i, a ) {
                var r = this;
                if ( i == a )return r.drawCircle( t, e, i );
                var n = r._addAction;
                var s = i / 2, o = a / 2, l = .5522847498307933, h = l * s, u = l * o;
                t = t + s;
                e = e + o;
                n.call( r, ["moveTo", t + s, e] );
                n.call( r, ["bezierCurveTo", t + s, e - u, t + h, e - o, t, e - o] );
                n.call( r, ["bezierCurveTo", t - h, e - o, t - s, e - u, t - s, e] );
                n.call( r, ["bezierCurveTo", t - s, e + u, t - h, e + o, t, e + o] );
                n.call( r, ["bezierCurveTo", t + h, e + o, t + s, e + u, t + s, e] );
                return r
            },
            drawSVGPath : function ( t ) {
                var e = this, i = e._addAction, a = t.split( /,| (?=[a-zA-Z])/ );
                i.call( e, ["beginPath"] );
                for ( var r = 0, n = a.length; r < n; r++ ) {
                    var s = a[r], o = s[0].toUpperCase(), l = s.substring( 1 ).split( /,| / );
                    if ( l[0].length == 0 )l.shift();
                    switch ( o ) {
                        case"M":
                            i.call( e, ["moveTo", l[0], l[1]] );
                            break;
                        case"L":
                            i.call( e, ["lineTo", l[0], l[1]] );
                            break;
                        case"C":
                            i.call( e, ["bezierCurveTo", l[0], l[1], l[2], l[3], l[4], l[5]] );
                            break;
                        case"Z":
                            i.call( e, ["closePath"] );
                            break
                    }
                }
                return e
            },
            _draw : function ( t ) {
                var e = this, i = e._actions, a = i.length, r;
                t.beginPath();
                for ( r = 0; r < a; r++ ) {
                    var n = i[r], s = n[0], o = n.length > 1 ? n.slice( 1 ) : null;
                    if ( typeof t[s] == "function" ) {
                        t[s].apply( t, o );
                    }
                    else {
                        t[s] = n[1]
                    }
                }
            },
            render : function ( t, e ) {
                var i = this, a = t.canvas;
                if ( a.getContext ) {
                    i._draw( t.context )
                }
                else {
                    var r = i.drawable;
                    if ( !r.image ) {
                        r.image = i.toImage()
                    }
                    t.draw( i )
                }
            },
            cache : function ( t ) {
                var i = this, a = i._cache;
                if ( !a ) {
                    a = i._cache = e.createElement( "canvas", {width : i.width, height : i.height} );
                    i._draw( a.getContext( "2d" ) )
                }
                if ( t )a = i._cache = i.toImage();
                return a
            },
            uncache : function () {
                this._cache = null
            },
            toImage : function ( t ) {
                var i = this, a = i._cache, r = i.width, n = i.height;
                if ( !a ) {
                    a = e.createElement( "canvas", {width : r, height : n} );
                    i._draw( a.getContext( "2d" ) )
                }
                if ( !(a instanceof HTMLImageElement) ) {
                    var s = a.toDataURL( t || "image/png" );
                    a = new Image;
                    a.src = s;
                    a.width = r;
                    a.height = n
                }
                return a
            },
            clear : function () {
                var t = this;
                t._actions.length = 0;
                t._cache = null;
                t.lineWidth = 1;
                t.lineAlpha = 1;
                t.lineCap = null;
                t.lineJoin = null;
                t.miterLimit = 10;
                t.hasStroke = false;
                t.strokeStyle = "0";
                t.hasFill = false;
                t.fillStyle = "0";
                t.fillAlpha = 1;
                return t
            },
            _addAction : function ( t ) {
                var e = this;
                e._actions.push( t );
                return e
            }
        } )
    }();
    var w = i.create( {
        Extends : d,
        constructor : function ( t ) {
            t = t || {};
            this.id = this.id || t.id || e.getUid( "Text" );
            w.superclass.constructor.call( this, t );
            if ( !t.font )this.font = "12px arial";
            this._fontHeight = w.measureFontHeight( this.font )
        },
        text : null,
        color : "#000",
        textAlign : null,
        textVAlign : null,
        outline : false,
        lineSpacing : 0,
        maxWidth : 200,
        font : null,
        textWidth : 0,
        textHeight : 0,
        setFont : function ( t ) {
            var e = this;
            if ( e.font !== t ) {
                e.font = t;
                e._fontHeight = w.measureFontHeight( t )
            }
            return e
        },
        render : function ( t, e ) {
            var i = this, a = t.canvas;
            if ( a.getContext ) {
                i._draw( t.context )
            }
            else {
                var r = i.drawable;
                var n = r.domElement;
                var s = n.style;
                s.font = i.font;
                s.textAlign = i.textAlign;
                s.color = i.color;
                s.width = i.width + "px";
                s.height = i.height + "px";
                s.lineHeight = i._fontHeight + i.lineSpacing + "px";
                n.innerHTML = i.text;
                t.draw( this )
            }
        },
        _draw : function ( t ) {
            var e = this, i = e.text.toString();
            if ( !i )return;
            t.font = e.font;
            t.textAlign = e.textAlign;
            t.textBaseline = "top";
            var a = i.split( /\r\n|\r|\n|<br(?:[ \/])*>/ );
            var r = 0, n = 0;
            var s = e._fontHeight + e.lineSpacing;
            var o, l, h;
            var u = [];
            for ( o = 0, len = a.length; o < len; o++ ) {
                l = a[o];
                h = t.measureText( l ).width;
                if ( h <= e.maxWidth ) {
                    u.push( {text : l, y : n} );
                    if ( r < h )r = h;
                    n += s;
                    continue
                }
                var f = "", c = 0, d, m, p;
                for ( m = 0, wlen = l.length; m < wlen; m++ ) {
                    p = l[m];
                    d = t.measureText( f + p ).width;
                    if ( d > e.maxWidth ) {
                        u.push( {text : f, y : n} );
                        if ( r < c )r = c;
                        n += s;
                        f = p
                    }
                    else {
                        c = d;
                        f += p
                    }
                    if ( m == wlen - 1 ) {
                        u.push( {text : f, y : n} );
                        if ( f !== p && r < d )r = d;
                        n += s
                    }
                }
            }
            e.textWidth = r;
            e.textHeight = n;
            if ( !e.width )e.width = r;
            if ( !e.height )e.height = n;
            var _ = 0;
            switch ( e.textVAlign ) {
                case"middle":
                    _ = e.height - e.textHeight >> 1;
                    break;
                case"bottom":
                    _ = e.height - e.textHeight;
                    break
            }
            var v = e.background;
            if ( v ) {
                t.fillStyle = v;
                t.fillRect( 0, 0, e.width, e.height )
            }
            if ( e.outline ) {
                t.strokeStyle = e.color;
            }
            else {
                t.fillStyle = e.color;
            }
            for ( var o = 0; o < u.length; o++ ) {
                var l = u[o];
                e._drawTextLine( t, l.text, _ + l.y )
            }
        },
        _drawTextLine : function ( t, e, i ) {
            var a = this, r = 0, n = a.width;
            switch ( a.textAlign ) {
                case"center":
                    r = n >> 1;
                    break;
                case"right":
                case"end":
                    r = n;
                    break
            }
            if ( a.outline ) {
                t.strokeText( e, r, i );
            }
            else {
                t.fillText( e, r, i )
            }
        },
        Statics : {
            measureFontHeight : function ( t ) {
                var i = document.documentElement, a;
                var r = e.createElement( "div", {style : {font : t, position : "absolute"}, innerHTML : "M"} );
                i.appendChild( r );
                a = r.offsetHeight;
                i.removeChild( r );
                return a
            }
        }
    } );
    var b = i.create( {
        Extends : m, constructor : function ( t ) {
            t = t || {};
            this.id = this.id || t.id || e.getUid( "BitmapText" );
            b.superclass.constructor.call( this, t );
            if ( t.text ) {
                this.text = "";
                this.setText( t.text )
            }
            this.pointerChildren = false
        }, glyphs : null, letterSpacing : 0, text : "", textAlign : "left", setText : function ( t ) {
            var e = this, i = t.toString(), a = i.length;
            if ( e.text == i )return;
            e.text = i;
            var r, n, s, o, l = 0, h = 0, u = 0;
            for ( r = 0; r < a; r++ ) {
                n = i.charAt( r );
                s = e.glyphs[n];
                if ( s ) {
                    u = l + (l > 0 ? e.letterSpacing : 0);
                    if ( e.children[r] ) {
                        o = e.children[r];
                        o.setImage( s.image, s.rect )
                    }
                    else {
                        o = e._createBitmap( s );
                        e.addChild( o )
                    }
                    o.x = u;
                    l = u + s.rect[2];
                    h = Math.max( h, s.rect[3] )
                }
            }
            for ( r = e.children.length - 1; r >= a; r-- ) {
                e._releaseBitmap( e.children[r] );
                e.children[r].removeFromParent()
            }
            e.width = l;
            e.height = h;
            this.setTextAlign();
            return e
        }, _createBitmap : function ( t ) {
            var e;
            if ( b._pool.length ) {
                e = b._pool.pop();
                e.setImage( t.image, t.rect )
            }
            else {
                e = new _( {image : t.image, rect : t.rect} )
            }
            return e
        }, _releaseBitmap : function ( t ) {
            b._pool.push( t )
        }, setTextAlign : function ( t ) {
            this.textAlign = t || this.textAlign;
            switch ( this.textAlign ) {
                case"center":
                    this.pivotX = this.width * .5;
                    break;
                case"right":
                    this.pivotX = this.width;
                    break;
                case"left":
                default:
                    this.pivotX = 0;
                    break
            }
            return this
        }, hasGlyphs : function ( t ) {
            var e = this.glyphs;
            if ( !e )return false;
            var t = t.toString(), i = t.length, a;
            for ( a = 0; a < i; a++ ) {
                if ( !e[t.charAt( a )] )return false
            }
            return true
        }, Statics : {
            _pool : [], createGlyphs : function ( t, e, i, a ) {
                var r = t.toString();
                i = i || r.length;
                a = a || 1;
                var n = e.width / i;
                var s = e.height / a;
                var o = {};
                for ( var l = 0, h = t.length; l < h; l++ ) {
                    charStr = r.charAt( l );
                    o[charStr] = {image : e, rect : [n * (l % i), s * Math.floor( l / i ), n, s]}
                }
                return o
            }
        }
    } );
    var A = i.create( {
        Extends : d,
        constructor : function ( t ) {
            t = t || {};
            this.id = this.id || t.id || e.getUid( "Button" );
            A.superclass.constructor.call( this, t );
            this.drawable = new c( t );
            this.setState( A.UP )
        },
        upState : null,
        overState : null,
        downState : null,
        disabledState : null,
        state : null,
        enabled : true,
        useHandCursor : true,
        setEnabled : function ( t ) {
            if ( this.enabled != t ) {
                if ( !t ) {
                    this.setState( A.DISABLED )
                }
                else {
                    this.setState( A.UP )
                }
            }
            return this
        },
        setState : function ( t ) {
            if ( this.state !== t ) {
                this.state = t;
                this.pointerEnabled = this.enabled = t !== A.DISABLED;
                var i;
                switch ( t ) {
                    case A.UP:
                        i = this.upState;
                        break;
                    case A.OVER:
                        i = this.overState;
                        break;
                    case A.DOWN:
                        i = this.downState;
                        break;
                    case A.DISABLED:
                        i = this.disabledState;
                        break
                }
                if ( i ) {
                    this.drawable.init( i );
                    e.copy( this, i, true )
                }
            }
            return this
        },
        fire : function ( t, e ) {
            if ( !this.enabled )return;
            var i = typeof t === "string" ? t : t.type;
            switch ( i ) {
                case"mousedown":
                case"touchstart":
                case"touchmove":
                    this.setState( A.DOWN );
                    break;
                case"mouseover":
                    this.setState( A.OVER );
                    break;
                case"mouseup":
                    if ( this.overState ) {
                        this.setState( A.OVER );
                    }
                    else if ( this.upState )this.setState( A.UP );
                    break;
                case"touchend":
                case"touchout":
                case"mouseout":
                    this.setState( A.UP );
                    break
            }
            return A.superclass.fire.call( this, t, e )
        },
        Statics : {UP : "up", OVER : "over", DOWN : "down", DISABLED : "disabled"}
    } );
    var E = function () {
        return i.create( {
            constructor : function ( i ) {
                this._frames = t( i );
                this._sprites = e( i, this._frames )
            }, _frames : null, _sprites : null, getFrame : function ( t ) {
                var e = this._frames;
                return e && e[t]
            }, getSprite : function ( t ) {
                var e = this._sprites;
                return e && e[t]
            }, Statics : {
                createSpriteFrames : function ( t, e, i, a, r, n, s ) {
                    if ( Object.prototype.toString.call( t ) === "[object Array]" ) {
                        var e = [];
                        for ( var o = 0, l = t.length; o < l; o++ ) {
                            e = e.concat( this.createSpriteFrames.apply( this, t[o] ) )
                        }
                        return e
                    }
                    else {
                        if ( typeof e === "string" ) {
                            var h = e.split( "," );
                            e = [];
                            for ( var u = 0, f = h.length; u < f; u++ ) {
                                var c = h[u].split( "-" );
                                if ( c.length == 1 ) {
                                    e.push( parseInt( c[0] ) )
                                }
                                else {
                                    for ( var o = parseInt( c[0] ), l = parseInt( c[1] ); o <= l; o++ ) {
                                        e.push( o )
                                    }
                                }
                            }
                        }
                        var d = Math.floor( i.width / a );
                        for ( var o = 0; o < e.length; o++ ) {
                            var m = e[o];
                            e[o] = {rect : [a * (m % d), r * Math.floor( m / d ), a, r], image : i, duration : s}
                        }
                        e[0].name = t;
                        if ( n ) {
                            e[e.length - 1].next = t
                        }
                        else {
                            e[e.length - 1].stop = true
                        }
                        return e
                    }
                }
            }
        } );
        function t( t ) {
            var e = t.frames;
            if ( !e )return null;
            var i = [], a;
            if ( e instanceof Array ) {
                for ( var r = 0, n = e.length; r < n; r++ ) {
                    a = e[r];
                    i[r] = {image : t.image, rect : a}
                }
            }
            else {
                var s = e.frameWidth;
                var o = e.frameHeight;
                var l = t.width / s | 0;
                var h = t.height / o | 0;
                var u = e.numFrames || l * h;
                for ( var r = 0; r < u; r++ ) {
                    i[r] = {image : t.image, rect : [r % l * s, (r / l | 0) * o, s, o]}
                }
            }
            return i
        }

        function e( t, e ) {
            var i = t.sprites;
            if ( !i )return null;
            var n = {}, s, o, l;
            for ( var h in i ) {
                s = i[h];
                if ( r( s ) ) {
                    o = a( e[s] )
                }
                else if ( s instanceof Array ) {
                    o = [];
                    for ( var u = 0, f = s.length; u < f; u++ ) {
                        var c = s[u], d;
                        if ( r( c ) ) {
                            l = a( e[c] )
                        }
                        else {
                            d = c.rect;
                            if ( r( d ) )d = e[c.rect];
                            l = a( d, c )
                        }
                        o[u] = l
                    }
                }
                else {
                    o = [];
                    for ( var u = s.from; u <= s.to; u++ ) {
                        o[u - s.from] = a( e[u], s[u] )
                    }
                }
                n[h] = o
            }
            return n
        }

        function a( t, e ) {
            var i = {image : t.image, rect : t.rect};
            if ( e ) {
                i.name = e.name || null;
                i.duration = e.duration || 0;
                i.stop = !!e.stop;
                i.next = e.next || null
            }
            return i
        }

        function r( t ) {
            return typeof t === "number"
        }
    }();
    var T = i.create( {
        constructor : function ( t ) {
            this._targetFPS = t || 30;
            this._interval = 1e3 / this._targetFPS;
            this._tickers = []
        },
        _paused : false,
        _targetFPS : 0,
        _interval : 0,
        _intervalId : null,
        _tickers : null,
        _lastTime : 0,
        _tickCount : 0,
        _tickTime : 0,
        _measuredFPS : 0,
        start : function ( i ) {
            if ( this._intervalId )return;
            this._lastTime = +new Date;
            var a = this, r = this._interval, n = t.requestAnimationFrame || t[e.browser.jsVendor + "RequestAnimationFrame"];
            if ( i && n ) {
                var s = function () {
                    a._tick()
                };
                var o = function () {
                    a._intervalId = setTimeout( o, r );
                    n( s )
                }
            }
            else {
                o = function () {
                    a._intervalId = setTimeout( o, r );
                    a._tick()
                }
            }
            o()
        },
        stop : function () {
            clearTimeout( this._intervalId );
            this._intervalId = null;
            this._lastTime = 0
        },
        pause : function () {
            this._paused = true
        },
        resume : function () {
            this._paused = false
        },
        _tick : function () {
            if ( this._paused )return;
            var t = +new Date, e = t - this._lastTime, i = this._tickers;
            if ( ++this._tickCount >= this._targetFPS ) {
                this._measuredFPS = 1e3 / (this._tickTime / this._tickCount) + .5 >> 0;
                this._tickCount = 0;
                this._tickTime = 0
            }
            else {
                this._tickTime += t - this._lastTime
            }
            this._lastTime = t;
            for ( var a = 0, r = i.length; a < r; a++ ) {
                i[a].tick( e )
            }
        },
        getMeasuredFPS : function () {
            return this._measuredFPS
        },
        addTick : function ( t ) {
            if ( !t || typeof t.tick != "function" ) {
                throw new Error( "Ticker: The tick object must implement the tick method." )
            }
            this._tickers.push( t )
        },
        removeTick : function ( t ) {
            var e = this._tickers, i = e.indexOf( t );
            if ( i >= 0 ) {
                e.splice( i, 1 )
            }
        }
    } );
    var D = Array.prototype, L = D.slice;
    D.indexOf = D.indexOf || function ( t, e ) {
            e = e || 0;
            var i = this.length, a;
            if ( i == 0 || e >= i )return -1;
            if ( e < 0 )e = i + e;
            for ( a = e; a < i; a++ ) {
                if ( this[a] === t )return a
            }
            return -1
        };
    var x = Function.prototype;
    x.bind = x.bind || function ( t ) {
            var e = this, i = L.call( arguments, 1 ), a = function () {
            };

            function r() {
                var a = i.concat( L.call( arguments ) );
                return e.apply( this instanceof r ? this : t, a )
            }

            a.prototype = e.prototype;
            r.prototype = new a;
            return r
        };
    var S = {
        startDrag : function ( t ) {
            var i = this;
            var a;
            var t = t || [-Infinity, -Infinity, Infinity, Infinity];
            var r = {x : 0, y : 0, preX : 0, preY : 0};
            var n = t[0];
            var s = t[1];
            var o = t[2] == Infinity ? Infinity : n + t[2];
            var l = t[3] == Infinity ? Infinity : s + t[3];

            function h( t ) {
                t.stopPropagation();
                c( t );
                i.off( e.event.POINTER_START, h );
                i.fire( "dragStart", r );
                i.__dragX = i.x - r.x;
                i.__dragY = i.y - r.y;
                if ( !a ) {
                    a = this.getStage()
                }
                a.on( e.event.POINTER_MOVE, f );
                document.addEventListener( e.event.POINTER_END, u )
            }

            function u( t ) {
                document.removeEventListener( e.event.POINTER_END, u );
                a && a.off( e.event.POINTER_MOVE, f );
                i.fire( "dragEnd", r );
                i.on( e.event.POINTER_START, h )
            }

            function f( t ) {
                c( t );
                i.fire( "dragMove", r );
                var e = r.x + i.__dragX;
                var a = r.y + i.__dragY;
                i.x = Math.max( n, Math.min( o, e ) );
                i.y = Math.max( s, Math.min( l, a ) )
            }

            function c( t ) {
                r.preX = r.x;
                r.preY = r.y;
                r.x = t.stageX;
                r.y = t.stageY
            }

            function d() {
                document.removeEventListener( e.event.POINTER_END, u );
                a && a.off( e.event.POINTER_MOVE, f );
                i.off( e.event.POINTER_START, h )
            }

            i.on( e.event.POINTER_START, h );
            i.stopDrag = d
        }, stopDrag : function () {
        }
    };
    var O = function () {
        function t() {
            return +new Date
        }

        return i.create( {
            constructor : function ( t, e, i, a ) {
                var r = this;
                r.target = t;
                r._startTime = 0;
                r._seekTime = 0;
                r._pausedTime = 0;
                r._pausedStartTime = 0;
                r._reverseFlag = 1;
                r._repeatCount = 0;
                if ( arguments.length == 3 ) {
                    a = i;
                    i = e;
                    e = null
                }
                for ( var n in a )r[n] = a[n];
                r.setProps( e, i );
                if ( !a.duration && a.time ) {
                    r.duration = a.time || 0;
                    r.time = 0
                }
            },
            target : null,
            duration : 0,
            delay : 0,
            paused : false,
            loop : false,
            reverse : false,
            repeat : 0,
            repeatDelay : 0,
            ease : null,
            time : 0,
            onStart : null,
            onUpdate : null,
            onComplete : null,
            setProps : function ( t, e ) {
                var i = this, a = i.target, r = t || e, n = i._fromProps = {}, s = i._toProps = {};
                t = t || a;
                e = e || a;
                for ( var o in r ) {
                    s[o] = e[o] || 0;
                    a[o] = n[o] = t[o] || 0
                }
                return i
            },
            start : function () {
                var e = this;
                e._startTime = t() + e.delay;
                e._seekTime = 0;
                e._pausedTime = 0;
                e.paused = false;
                O.add( e );
                return e
            },
            stop : function () {
                O.remove( this );
                return this
            },
            pause : function () {
                var e = this;
                e.paused = true;
                e._pausedStartTime = t();
                return e
            },
            resume : function () {
                var e = this;
                e.paused = false;
                if ( e._pausedStartTime )e._pausedTime += t() - e._pausedStartTime;
                e._pausedStartTime = 0;
                return e
            },
            seek : function ( e, i ) {
                var a = this, r = t();
                a._startTime = r;
                a._seekTime = e;
                a._pausedTime = 0;
                if ( i !== undefined )a.paused = i;
                a._update( r, true );
                O.add( a );
                return a
            },
            link : function ( t ) {
                var e = this, i = t.delay, a = e._startTime;
                if ( typeof i === "string" ) {
                    var r = i.indexOf( "+" ) == 0, n = i.indexOf( "-" ) == 0;
                    i = r || n ? Number( i.substr( 1 ) ) * (r ? 1 : -1) : Number( i )
                }
                t.delay = i;
                t._startTime = r || n ? a + e.duration + i : a + i;
                e._next = t;
                O.remove( t );
                return e
            },
            _render : function ( t ) {
                var e = this, i = e.target, a = e._fromProps, r;
                for ( r in a )i[r] = a[r] + (e._toProps[r] - a[r]) * t
            },
            _update : function ( e, i ) {
                var a = this;
                if ( a.paused && !i )return;
                var r = e - a._startTime - a._pausedTime + a._seekTime;
                if ( r < 0 )return;
                var n = r / a.duration, s = false, o;
                n = n <= 0 ? 0 : n >= 1 ? 1 : a.ease ? a.ease( n ) : n;
                if ( a.reverse ) {
                    if ( a._reverseFlag < 0 )n = 1 - n;
                    if ( n < 1e-7 ) {
                        if ( a.repeat > 0 && a._repeatCount++ >= a.repeat || a.repeat == 0 && !a.loop ) {
                            s = true
                        }
                        else {
                            a._startTime = t();
                            a._reverseFlag *= -1
                        }
                    }
                }
                if ( a.time == 0 && (o = a.onStart) )o.call( a, a );
                a.time = r;
                a._render( n );
                (o = a.onUpdate) && o.call( a, n, a );
                if ( n >= 1 ) {
                    if ( a.reverse ) {
                        a._startTime = t();
                        a._reverseFlag *= -1
                    }
                    else if ( a.loop || a.repeat > 0 && a._repeatCount++ < a.repeat ) {
                        a._startTime = t() + a.repeatDelay
                    }
                    else {
                        s = true
                    }
                }
                var l = a._next;
                if ( l && l.time <= 0 ) {
                    var h = l._startTime;
                    if ( h > 0 && h <= e ) {
                        l._render( n );
                        l.time = r;
                        O.add( l )
                    }
                    else if ( s && (h < 0 || h > e) ) {
                        l.start()
                    }
                }
                if ( s ) {
                    (o = a.onComplete) && o.call( a, a );
                    return true
                }
            },
            Statics : {
                _tweens : [], tick : function () {
                    var e = O._tweens, i, a, r = e.length;
                    for ( a = 0; a < r; a++ ) {
                        i = e[a];
                        if ( i && i._update( t() ) ) {
                            e.splice( a, 1 );
                            a--
                        }
                    }
                    return O
                }, add : function ( t ) {
                    var e = O._tweens;
                    if ( e.indexOf( t ) == -1 )e.push( t );
                    return O
                }, remove : function ( t ) {
                    if ( t instanceof Array ) {
                        for ( var e = 0, i = t.length; e < i; e++ ) {
                            O.remove( t[e] )
                        }
                        return O
                    }
                    var a = O._tweens, e;
                    if ( t instanceof O ) {
                        e = a.indexOf( t );
                        if ( e > -1 )a.splice( e, 1 )
                    }
                    else {
                        for ( e = 0; e < a.length; e++ ) {
                            if ( a[e].target === t ) {
                                a.splice( e, 1 );
                                e--
                            }
                        }
                    }
                    return O
                }, removeAll : function () {
                    O._tweens.length = 0;
                    return O
                }, fromTo : function ( t, e, i, a ) {
                    var r = t instanceof Array;
                    t = r ? t : [t];
                    var n, s, o = a.stagger, l = [];
                    for ( s = 0; s < t.length; s++ ) {
                        n = new O( t[s], e, i, a );
                        if ( o )n.delay = (a.delay || 0) + (s * o || 0);
                        n.start();
                        l.push( n )
                    }
                    return r ? l : n
                }, to : function ( t, e, i ) {
                    return O.fromTo( t, null, e, i )
                }, from : function ( t, e, i ) {
                    return O.fromTo( t, e, null, i )
                }
            }
        } )
    }();
    var C = function () {
        function t( t, e, i, a, r ) {
            t = t || {};
            e && (t.EaseIn = e);
            i && (t.EaseOut = i);
            a && (t.EaseInOut = a);
            r && (t.EaseNone = r);
            return t
        }

        var e = t( null, null, null, null, function ( t ) {
            return t
        } );
        var i = t( null, function ( t ) {
            return t * t
        }, function ( t ) {
            return -t * (t - 2)
        }, function ( t ) {
            return (t *= 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1)
        } );
        var a = t( null, function ( t ) {
            return t * t * t
        }, function ( t ) {
            return --t * t * t + 1
        }, function ( t ) {
            return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
        } );
        var r = t( null, function ( t ) {
            return t * t * t * t
        }, function ( t ) {
            return -(--t * t * t * t - 1)
        }, function ( t ) {
            return (t *= 2) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2)
        } );
        var n = t( null, function ( t ) {
            return t * t * t * t * t
        }, function ( t ) {
            return (t = t - 1) * t * t * t * t + 1
        }, function ( t ) {
            return (t *= 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2)
        } );
        var s = Math, o = s.PI, l = o * .5, h = s.sin, u = s.cos, f = s.pow, c = s.sqrt;
        var d = t( null, function ( t ) {
            return -u( t * l ) + 1
        }, function ( t ) {
            return h( t * l )
        }, function ( t ) {
            return -.5 * (u( o * t ) - 1)
        } );
        var m = t( null, function ( t ) {
            return t == 0 ? 0 : f( 2, 10 * (t - 1) )
        }, function ( t ) {
            return t == 1 ? 1 : -f( 2, -10 * t ) + 1
        }, function ( t ) {
            if ( t == 0 || t == 1 )return t;
            if ( (t *= 2) < 1 )return .5 * f( 2, 10 * (t - 1) );
            return .5 * (-f( 2, -10 * (t - 1) ) + 2)
        } );
        var p = t( null, function ( t ) {
            return -(c( 1 - t * t ) - 1)
        }, function ( t ) {
            return c( 1 - --t * t )
        }, function ( t ) {
            if ( (t /= .5) < 1 )return -.5 * (c( 1 - t * t ) - 1);
            return .5 * (c( 1 - (t -= 2) * t ) + 1)
        } );
        var _ = t( {
            a : 1, p : .4, s : .1, config : function ( t, e ) {
                _.a = t;
                _.p = e;
                _.s = e / (2 * o) * Math.asin( 1 / t ) || 0
            }
        }, function ( t ) {
            return -(_.a * f( 2, 10 * (t -= 1) ) * h( (t - _.s) * (2 * o) / _.p ))
        }, function ( t ) {
            return _.a * f( 2, -10 * t ) * h( (t - _.s) * (2 * o) / _.p ) + 1
        }, function ( t ) {
            return (t *= 2) < 1 ? -.5 * (_.a * f( 2, 10 * (t -= 1) ) * h( (t - _.s) * (2 * o) / _.p )) : _.a * f( 2, -10 * (t -= 1) ) * h( (t - _.s) * (2 * o) / _.p ) * .5 + 1
        } );
        var v = t( {
            o : 1.70158, s : 2.59491, config : function ( t ) {
                v.o = t;
                v.s = t * 1.525
            }
        }, function ( t ) {
            return t * t * ((v.o + 1) * t - v.o)
        }, function ( t ) {
            return (t = t - 1) * t * ((v.o + 1) * t + v.o) + 1
        }, function ( t ) {
            return (t *= 2) < 1 ? .5 * (t * t * ((v.s + 1) * t - v.s)) : .5 * ((t -= 2) * t * ((v.s + 1) * t + v.s) + 2)
        } );
        var g = t( null, function ( t ) {
            return 1 - g.EaseOut( 1 - t )
        }, function ( t ) {
            if ( (t /= 1) < .36364 ) {
                return 7.5625 * t * t
            }
            else if ( t < .72727 ) {
                return 7.5625 * (t -= .54545) * t + .75
            }
            else if ( t < .90909 ) {
                return 7.5625 * (t -= .81818) * t + .9375
            }
            else {
                return 7.5625 * (t -= .95455) * t + .984375
            }
        }, function ( t ) {
            return t < .5 ? g.EaseIn( t * 2 ) * .5 : g.EaseOut( t * 2 - 1 ) * .5 + .5
        } );
        return {Linear : e, Quad : i, Cubic : a, Quart : r, Quint : n, Sine : d, Expo : m, Circ : p, Elastic : _, Back : v, Bounce : g}
    }();
    var k = i.create( {
        Mixes : a, constructor : function ( t ) {
            this._source = [];
            this.add( t )
        }, maxConnections : 2, _source : null, _loaded : 0, _connections : 0, _currentIndex : -1, add : function ( t ) {
            var e = this;
            if ( t ) {
                t = t instanceof Array ? t : [t];
                e._source = e._source.concat( t )
            }
            return e
        }, get : function ( t ) {
            if ( t ) {
                var e = this._source;
                for ( var i = 0; i < e.length; i++ ) {
                    var a = e[i];
                    if ( a.id === t || a.src === t ) {
                        return a
                    }
                }
            }
            return null
        }, getContent : function ( t ) {
            var e = this.get( t );
            return e && e.content
        }, start : function () {
            var t = this;
            t._loadNext();
            return t
        }, _loadNext : function () {
            var t = this, e = t._source, i = e.length;
            if ( t._loaded >= i ) {
                t.fire( "complete" );
                return
            }
            if ( t._currentIndex < i - 1 && t._connections < t.maxConnections ) {
                var a = ++t._currentIndex;
                var r = e[a];
                var n = t._getLoader( r );
                if ( n ) {
                    var s = n.onLoad, o = n.onError;
                    n.onLoad = function ( e ) {
                        n.onLoad = s;
                        n.onError = o;
                        var i = s && s.call( n, e ) || e.target;
                        t._onItemLoad( a, i )
                    };
                    n.onError = function ( e ) {
                        n.onLoad = s;
                        n.onError = o;
                        o && o.call( n, e );
                        t._onItemError( a, e )
                    };
                    t._connections++
                }
                t._loadNext();
                n && n.load( r )
            }
        }, _getLoader : function ( t ) {
            var e = this, i = t.loader;
            if ( i )return i;
            var a = t.type || M( t.src );
            switch ( a ) {
                case"png":
                case"jpg":
                case"jpeg":
                case"gif":
                    i = new F;
                    break;
                case"js":
                case"jsonp":
                    i = new N;
                    break
            }
            return i
        }, _onItemLoad : function ( t, e ) {
            var i = this, a = i._source[t];
            a.loaded = true;
            a.content = e;
            i._connections--;
            i._loaded++;
            i.fire( "load", a );
            i._loadNext()
        }, _onItemError : function ( t, e ) {
            var i = this, a = i._source[t];
            a.error = e;
            i._connections--;
            i._loaded++;
            i.fire( "error", a );
            i._loadNext()
        }, getSize : function ( t ) {
            var e = 0, i = this._source;
            for ( var a = 0; a < i.length; a++ ) {
                var r = i[a];
                e += (t ? r.loaded && r.size : r.size) || 0
            }
            return e
        }, getLoaded : function () {
            return this._loaded
        }, getTotal : function () {
            return this._source.length
        }
    } );

    function M( t ) {
        var e = /\/?[^/]+\.(\w+)(\?\S+)?$/i, i, a;
        if ( i = t.match( e ) ) {
            a = i[1].toLowerCase()
        }
        return a || null
    }

    var F = i.create( {
        load : function ( t ) {
            var e = this;
            var i = new Image;
            if ( t.crossOrigin ) {
                i.crossOrigin = "Anonymous"
            }
            i.onload = function () {
                e.onLoad( i )
            };
            i.onerror = i.onabort = e.onError.bind( i );
            i.src = t.src + (t.noCache ? (t.src.indexOf( "?" ) == -1 ? "?" : "&") + "t=" + +new Date : "")
        }, onLoad : function ( e ) {
            e = e || t.event;
            var i = e;
            i.onload = i.onerror = i.onabort = null;
            return i
        }, onError : function ( t ) {
            var e = t.target;
            e.onload = e.onerror = e.onabort = null;
            return t
        }
    } );
    var N = i.create( {
        load : function ( e ) {
            var i = this, a = e.src, r = e.type == "jsonp";
            if ( r ) {
                var n = e.callbackName || "callback";
                var s = e.callback || "jsonp" + ++N._count;
                var o = t;
                if ( !o[s] ) {
                    o[s] = function ( t ) {
                        delete o[s]
                    }
                }
            }
            if ( r )a += (a.indexOf( "?" ) == -1 ? "?" : "&") + n + "=" + s;
            if ( e.noCache )a += (a.indexOf( "?" ) == -1 ? "?" : "&") + "t=" + +new Date;
            var l = document.createElement( "script" );
            l.type = "text/javascript";
            l.async = true;
            l.onload = i.onLoad.bind( i );
            l.onerror = i.onError.bind( i );
            l.onreadystatechange = function () {
                if ( l.readyState == "complete" || l.readyState == "loaded" ) {
                    i.onLoad( i )
                }
            };
            l.src = a;
            if ( e.id )l.id = e.id;
            document.getElementsByTagName( "head" )[0].appendChild( l )
        }, onLoad : function ( t ) {
            var e = t.target || window.event.srcElement;
            e.onload = e.onerror = e.onreadystatechange = null;
            return e
        }, onError : function ( t ) {
            var e = t.target;
            e.onload = e.onerror = null;
            return t
        }, Statics : {_count : 0}
    } );
    var P = i.create( {
        Mixes : a,
        constructor : function ( t ) {
            e.copy( this, t, true );
            this._onAudioEvent = this._onAudioEvent.bind( this )
        },
        src : null,
        loop : false,
        autoPlay : false,
        loaded : false,
        playing : false,
        duration : 0,
        volume : 1,
        muted : false,
        _element : null,
        load : function () {
            if ( !this._element ) {
                var t = this._element = new Audio;
                t.addEventListener( "canplaythrough", this._onAudioEvent, false );
                t.addEventListener( "ended", this._onAudioEvent, false );
                t.addEventListener( "error", this._onAudioEvent, false );
                t.src = this.src;
                t.volume = this.volume;
                t.load()
            }
            return this
        },
        _onAudioEvent : function ( t ) {
            var e = t.type;
            switch ( e ) {
                case"canplaythrough":
                    t.target.removeEventListener( e, this._onAudioEvent );
                    this.loaded = true;
                    this.duration = this._element.duration;
                    this.fire( "load" );
                    if ( this.autoPlay )this._doPlay();
                    break;
                case"ended":
                    this.playing = false;
                    this.fire( "end" );
                    if ( this.loop )this._doPlay();
                    break;
                case"error":
                    this.fire( "error" );
                    break
            }
        },
        _doPlay : function () {
            if ( !this.playing ) {
                this._element.volume = this.muted ? 0 : this.volume;
                this._element.play();
                this.playing = true
            }
        },
        play : function () {
            if ( this.playing )this.stop();
            if ( !this._element ) {
                this.autoPlay = true;
                this.load()
            }
            else if ( this.loaded ) {
                this._doPlay()
            }
            return this
        },
        pause : function () {
            if ( this.playing ) {
                this._element.pause();
                this.playing = false
            }
            return this
        },
        resume : function () {
            if ( !this.playing ) {
                this._doPlay()
            }
            return this
        },
        stop : function () {
            if ( this.playing ) {
                this._element.pause();
                this._element.currentTime = 0;
                this.playing = false
            }
            return this
        },
        setVolume : function ( t ) {
            if ( this.volume != t ) {
                this.volume = t;
                this._element.volume = t
            }
            return this
        },
        setMute : function ( t ) {
            if ( this.muted != t ) {
                this.muted = t;
                this._element.volume = t ? 0 : this.volume
            }
            return this
        },
        Statics : {isSupported : t.Audio !== null}
    } );
    var B = function () {
        var r = t.AudioContext || t.webkitAudioContext;
        var n = r ? new r : null;
        return i.create( {
            Mixes : a,
            constructor : function ( t ) {
                e.copy( this, t, true );
                this._init()
            },
            src : null,
            loop : false,
            autoPlay : false,
            loaded : false,
            playing : false,
            duration : 0,
            volume : 1,
            muted : false,
            _context : null,
            _gainNode : null,
            _buffer : null,
            _audioNode : null,
            _startTime : 0,
            _offset : 0,
            _init : function () {
                this._context = n;
                this._gainNode = n.createGain ? n.createGain() : n.createGainNode();
                this._gainNode.connect( n.destination );
                this._onAudioEvent = this._onAudioEvent.bind( this );
                this._onDecodeComplete = this._onDecodeComplete.bind( this );
                this._onDecodeError = this._onDecodeError.bind( this )
            },
            load : function () {
                if ( !this._buffer ) {
                    var t = new XMLHttpRequest;
                    t.src = this.src;
                    t.open( "GET", this.src, true );
                    t.responseType = "arraybuffer";
                    t.onload = this._onAudioEvent;
                    t.onprogress = this._onAudioEvent;
                    t.onerror = this._onAudioEvent;
                    t.send();
                    this._buffer = true
                }
                return this
            },
            _onAudioEvent : function ( t ) {
                var e = t.type;
                switch ( e ) {
                    case"load":
                        var i = t.target;
                        i.onload = i.onprogress = i.onerror = null;
                        this._context.decodeAudioData( i.response, this._onDecodeComplete, this._onDecodeError );
                        i = null;
                        break;
                    case"ended":
                        this.playing = false;
                        this.fire( "end" );
                        if ( this.loop )this._doPlay();
                        break;
                    case"progress":
                        this.fire( t );
                        break;
                    case"error":
                        this.fire( t );
                        break
                }
            },
            _onDecodeComplete : function ( t ) {
                this._buffer = t;
                this.loaded = true;
                this.duration = t.duration;
                this.fire( "load" );
                if ( this.autoPlay )this._doPlay()
            },
            _onDecodeError : function () {
                this.fire( "error" )
            },
            _doPlay : function () {
                this._clearAudioNode();
                var t = this._context.createBufferSource();
                if ( !t.start ) {
                    t.start = t.noteOn;
                    t.stop = t.noteOff
                }
                t.buffer = this._buffer;
                t.onended = this._onAudioEvent;
                this._gainNode.gain.value = this.muted ? 0 : this.volume;
                t.connect( this._gainNode );
                t.start( 0, this._offset );
                this._audioNode = t;
                this._startTime = this._context.currentTime;
                this.playing = true
            },
            _clearAudioNode : function () {
                var t = this._audioNode;
                if ( t ) {
                    t.onended = null;
                    t.disconnect( this._gainNode );
                    this._audioNode = null
                }
            },
            play : function () {
                if ( this.playing )this.stop();
                if ( this.loaded ) {
                    this._doPlay()
                }
                else if ( !this._buffer ) {
                    this.autoPlay = true;
                    this.load()
                }
                return this
            },
            pause : function () {
                if ( this.playing ) {
                    this._audioNode.stop( 0 );
                    this._offset += this._context.currentTime - this._startTime;
                    this.playing = false
                }
                return this
            },
            resume : function () {
                if ( !this.playing ) {
                    this._doPlay()
                }
                return this
            },
            stop : function () {
                if ( this.playing ) {
                    this._audioNode.stop( 0 );
                    this._audioNode.disconnect();
                    this._offset = 0;
                    this.playing = false
                }
                return this
            },
            setVolume : function ( t ) {
                if ( this.volume != t ) {
                    this.volume = t;
                    this._gainNode.gain.value = t
                }
                return this
            },
            setMute : function ( t ) {
                if ( this.muted != t ) {
                    this.muted = t;
                    this._gainNode.gain.value = t ? 0 : this.volume
                }
                return this
            },
            Statics : {
                isSupported : r != null, enabled : false, enable : function () {
                    if ( !this.enabled && n ) {
                        var t = n.createBufferSource();
                        t.buffer = n.createBuffer( 1, 1, 22050 );
                        t.connect( n.destination );
                        t.start ? t.start( 0, 0, 0 ) : t.noteOn( 0, 0, 0 );
                        this.enabled = true;
                        return true
                    }
                    return this.enabled
                }
            }
        } )
    }();
    var I = {
        _audios : {}, enableAudio : function () {
            if ( B.isSupported ) {
                B.enable()
            }
        }, getAudio : function ( t, e ) {
            t = this._normalizeSource( t );
            var i = this._audios[t.src];
            if ( !i ) {
                if ( B.isSupported && !e ) {
                    i = new B( t )
                }
                else if ( P.isSupported ) {
                    i = new P( t )
                }
                this._audios[t.src] = i
            }
            return i
        }, removeAudio : function ( t ) {
            var e = typeof t === "string" ? t : t.src;
            var i = this._audios[e];
            if ( i ) {
                i.stop();
                i.off();
                this._audios[e] = null;
                delete this._audios[e]
            }
        }, _normalizeSource : function ( t ) {
            var i = {};
            if ( typeof t === "string" ) {
                i = {src : t};
            }
            else {
                e.copy( i, t );
            }
            return i
        }
    };
    e.Class = i;
    e.EventMixin = a;
    e.Renderer = l;
    e.CanvasRenderer = h;
    e.DOMRenderer = u;
    e.Matrix = f;
    e.Drawable = c;
    e.View = d;
    e.Container = m;
    e.Stage = p;
    e.Bitmap = _;
    e.Sprite = v;
    e.DOMElement = g;
    e.Graphics = y;
    e.Text = w;
    e.BitmapText = b;
    e.Button = A;
    e.TextureAtlas = E;
    e.Ticker = T;
    e.drag = S;
    e.Tween = O;
    e.Ease = C;
    e.LoadQueue = k;
    e.ImageLoader = F;
    e.ScriptLoader = N;
    e.HTMLAudio = P;
    e.WebAudio = B;
    e.WebSound = I;
    t.Hilo = e;
    if ( !t.H )t.H = e
})( window );
!function () {
    {
        var t = function () {
            function e( t ) {
                return t.id + n++
            }

            var i = ["x", "y", "scaleX", "scaleY", "rotation", "visible", "alpha"], a = i.concat( ["pivotX", "pivotY", "width", "height", "depth"] ), r = a.concat( ["text", "color", "textAlign", "outline", "lineSpacing", "font"] ), n = 0, s = {
                View : a,
                Stage : i,
                Graphics : a,
                Text : r
            };
            return Hilo.Class.create( {
                Extends : Hilo.Renderer, constructor : function ( i ) {
                    t.superclass.constructor.call( this, i ), this.stage._ADD_TO_FLASH = !0, this.stage.fid = e( this.stage ), this.stage.flashType = "Stage", this.commands = i.commands || [], this.commands.push( "create", this.stage.fid, "Stage" ), this.commands.push( "stageAddChild", this.stage.fid )
                }, startDraw : function ( t ) {
                    return t == this.stage ? !0 : (t._lastState = t._lastState || {}, t._ADD_TO_FLASH || (t._ADD_TO_FLASH = !0, t.fid = e( t ), t.flashType = t._drawTextLine ? "Text" : t.beginLinearGradientFill ? "Graphics" : t == this.stage ? "Stage" : "View", this.commands.push( "create", t.fid, t.flashType )), !0)
                }, draw : function ( t ) {
                    if ( t != this.stage ) {
                        t._lastState = t._lastState || {};
                        var e = t._lastState.parent, i = t.parent;
                        switch ( i && (e && i.fid == e.fid || this.commands.push( "addChild", i.fid, t.fid, t.depth )), t._lastState.parent = t.parent, t.flashType ) {
                            case"Graphics":
                                t.isDirty && t.flashGraphicsCommands && t.flashGraphicsCommands.length > 0 && (this.commands.push( "graphicsDraw", t.fid, t.flashGraphicsCommands.join( ";" ) ), t.isDirty = !1);
                                break;
                            case"Text":
                        }
                    }
                }, transform : function ( t ) {
                    var e = s[t.flashType], i = t._lastState = t._lastState || {};
                    if ( e ) {
                        for ( var a = 0, r = e.length; r > a; a++ ) {
                            var n = e[a], o = i[n], l = t[n];
                            i[n] = l, o != l && this.commands.push( "setProp", t.fid, n, l )
                        }
                        if ( t.drawable && t.drawable.image ) {
                            var h = t.drawable.image, u = t.drawable.rect, f = i.rect || [], c = i.image || {};
                            u && u.join( "," ) != f.join( "," ) && this.commands.push( "setProp", t.fid, "rect", u.join( "," ) ), h && h.src != c.src && this.commands.push( "setImage", t.fid, h.src ), i.rect = u, i.image = h
                        }
                        var d = t.background || "undefined";
                        "string" == typeof d && d != i.background && (this.commands.push( "setProp", t.fid, "background", d ), i.background = d)
                    }
                }, remove : function ( t ) {
                    var e = t.parent;
                    e && (this.commands.push( "removeChild", t.parent.fid, t.fid ), t._lastState && (t._lastState.parent = null))
                }
            } )
        }();
        !function () {
            function e() {
                var t = window.event, e = {
                    rawEvent : t, type : t.type, target : t.srcElememt, preventDefault : function () {
                        t.returnValue = !1
                    }, stopPropagation : function () {
                        t.cancelBubble = !0
                    }
                };
                return -1 != t.type.indexOf( "mouse" ) ? (e.clientX = t.clientX, e.clientY = t.clientY, "mouseover" == t.type ? e.relatedTarget = t.fromElement : "mouseout" == t.type && (e.relatedTarget = t.toElement)) : -1 != t.type.indexOf( "key" ) && (e.charCode = e.keyCode = t.keyCode), e
            }

            var i = document.scripts, a = i[i.length - 1], r = a.src.substring( 0, a.src.lastIndexOf( "/" ) + 1 ), n = r + "hilo.swf", s = {
                url : n,
                id : "hiloFlash",
                fps : 60,
                useFlashLoad : !0,
                width : "100%",
                height : "100%"
            }, o = {}, l = !1, h = [], u = {
                init : function ( t ) {
                    t = t || {};
                    !Hilo.browser.supportCanvas || t.forceFlash || location.search.indexOf( "forceFlash" ) > -1 ? (Hilo.isFlash = !0, this._addFlashCallback(), this._flashShim( t )) : Hilo.View.prototype.release = function () {
                        this.removeFromParent()
                    }
                }, setFps : function ( t ) {
                    this._fps != t && (this._fps = t, h.push( "setFps", t ))
                }, _flashShim : function ( i ) {
                    var a = this;
                    i = Hilo.copy( s, i || {} ), document.addEventListener = document.addEventListener || function ( t, e ) {
                            document.attachEvent( "on" + t, e )
                        }, document.removeEventListener = document.removeEventListener || function ( t, e ) {
                            document.detachEvent( "on" + t, e )
                        }, Array.prototype.indexOf = Array.prototype.indexOf || function ( t ) {
                            for ( var e = 0, i = this.length; e > i; e++ )if ( this[e] === t )return e;
                            return -1
                        }, i.useFlashLoad && (Hilo.ImageLoader.prototype.load = function ( t ) {
                        var e = this;
                        Hilo.flashLoadImage( t.src, function ( t ) {
                            e.onLoad( t.target )
                        }, function () {
                            e.onError()
                        } )
                    }), Hilo.Stage.prototype._initRenderer = function ( e ) {
                        var r = this.canvas;
                        "string" == typeof r && (r = Hilo.getElement( r )), r && r.id && (i.id = r.id);
                        var n = e.container;
                        "string" == typeof n && (n = Hilo.getElement( n )), r && r.parentNode && (n = n || r.parentNode, r.parentNode.removeChild( r )), n || (n = document.body), this.canvas = n;
                        var s = this.width, o = this.height, l = this.updateViewport();
                        e.width || (s = l && l.width || 320), e.height || (o = l && l.height || 480), a._insertSwf( Hilo.copy( i, {
                            container : n,
                            width : s * (this.scaleX || 1),
                            height : o * (this.scaleY || 1)
                        } ) );
                        var u = {canvas : n, stage : this, commands : h};
                        this.renderer = new t( u )
                    }, Hilo.Stage.prototype.addTo = function ( t ) {
                        var e = this._swf;
                        return e && e.parentNode !== t && t.appendChild( e ), this
                    };
                    var r = Hilo.Stage.prototype.enableDOMEvent;
                    Hilo.Stage.prototype.enableDOMEvent = function ( t, e ) {
                        var i = this.canvas;
                        return i.addEventListener || (i.addEventListener = function ( t, e ) {
                            i.attachEvent( "on" + t, e )
                        }, i.removeEventListener = function ( t, e ) {
                            i.detachEvent( "on" + t, e )
                        }), r.call( this, t, e )
                    };
                    var n = Hilo.Stage.prototype._onDOMEvent;
                    Hilo.Stage.prototype._onDOMEvent = function ( t ) {
                        n.call( this, t || e() )
                    }, Hilo.View.prototype.release = function () {
                        this.removeFromParent(), this.fid && h.push( "release", this.fid )
                    }, Hilo.Text.prototype.render = function ( t ) {
                        t.draw( this )
                    }, Hilo.Graphics.prototype.render = function ( t ) {
                        t.draw( this )
                    };
                    for ( var o = ["lineStyle", "beginFill", "endFill", "beginBitmapFill", "beginPath", "closePath", "moveTo", "lineTo", "quadraticCurveTo", "bezierCurveTo", "drawRect", "drawRoundRectComplex", "drawRoundRect", "drawCircle", "drawEllipse", "cache", "uncache", "clear"], l = 0; l < o.length; l++ ) {
                        var u = o[l];
                        Hilo.Graphics.prototype[u] = function ( t ) {
                            return function () {
                                var e = Array.prototype.slice.call( arguments ), i = [t].concat( e ).join( "!" );
                                return this.flashGraphicsCommands = this.flashGraphicsCommands || [], this.flashGraphicsCommands.push( i ), this.isDirty = !0, this
                            }
                        }( u )
                    }
                    Hilo.Graphics.prototype.beginRadialGradientFill = function ( t, e, i, a, r, n, s, o ) {
                        var l = ["beginRadialGradientFill", t, e, i, a, r, n, s.join( ":" ), o.join( ":" )].join( "!" );
                        return this.flashGraphicsCommands = this.flashGraphicsCommands || [], this.flashGraphicsCommands.push( l ), this.isDirty = !0, this
                    }, Hilo.Graphics.prototype.beginLinearGradientFill = function ( t, e, i, a, r, n ) {
                        var s = ["beginLinearGradientFill", t, e, i, a, r.join( ":" ), n.join( ":" )].join( "!" );
                        return this.flashGraphicsCommands = this.flashGraphicsCommands || [], this.flashGraphicsCommands.push( s ), this.isDirty = !0, this
                    }, Hilo.Graphics.prototype.drawSVGPath = function ( t ) {
                        var e = this, i = (e._addAction, t.split( /,| (?=[a-zA-Z])/ ));
                        e.beginPath();
                        for ( var a = 0, r = i.length; r > a; a++ ) {
                            var n = i[a], s = n.charAt( 0 ).toUpperCase(), o = n.substring( 1 ).split( /,| / );
                            switch ( 0 == o[0].length && o.shift(), s ) {
                                case"M":
                                    e.moveTo( o[0], o[1] );
                                    break;
                                case"L":
                                    e.lineTo( o[0], o[1] );
                                    break;
                                case"C":
                                    e.bezierCurveTo( o[0], o[1], o[2], o[3], o[4], o[5] );
                                    break;
                                case"Z":
                                    e.closePath()
                            }
                        }
                        return e
                    }, Hilo.WebSound.removeAudio = function ( t ) {
                        var e = "string" == typeof t ? t : t.src, i = this._audios[e];
                        i && (i.stop(), i.off(), i.release(), this._audios[e] = null, delete this._audios[e])
                    }, Hilo.WebAudio.isSupported = !0, Hilo.WebAudio.enabled = !0, Hilo.WebAudio.enable = function () {
                    }, Hilo.WebAudio.prototype._init = function () {
                        this.fid = Hilo.getUid( "audio" ), h.push( "audio", "create", this.fid, this.src ), this.autoPlay && this.play()
                    }, Hilo.WebAudio.prototype.load = function () {
                        return h.push( "audio", "load", this.fid ), this
                    }, Hilo.WebAudio.prototype.play = function () {
                        return h.push( "audio", "play", this.fid, this.loop ? 1 : 0 ), this
                    }, Hilo.WebAudio.prototype.pause = function () {
                        return h.push( "audio", "pause", this.fid ), this
                    }, Hilo.WebAudio.prototype.resume = function () {
                        return h.push( "audio", "resume", this.fid ), this
                    }, Hilo.WebAudio.prototype.stop = function () {
                        return h.push( "audio", "stop", this.fid ), this
                    }, Hilo.WebAudio.prototype.setVolume = function ( t ) {
                        return h.push( "audio", "setVolume", this.fid, t ), this
                    }, Hilo.WebAudio.prototype.setMute = function ( t ) {
                        return h.push( "audio", "setMute", this.fid, t ? 1 : 0 ), this
                    }, Hilo.WebAudio.prototype.release = function () {
                        return h.push( "audio", "release", this.fid ), this
                    }
                }, _insertSwf : function ( t ) {
                    var e, i = this, a = t.url, r = t.id, n = t.color || null, s = t.fps, o = t.container, l = t.width, h = t.height;
                    if ( this.setFps( s ), window.attachEvent ) {
                        var u = o.innerHTML;
                        o.innerHTML = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + location.protocol + '//fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"><param name="allowScriptAccess" value="always"><param name="flashvars" value="id=' + r + '"><param name="wmode" value="transparent"><param name="bgcolor" value="' + n + '"></object>' + u;
                        var e = o.getElementsByTagName( "object" )[0];
                        e.name = e.id = r;
                        e.movie = a
                    }
                    else {
                        e = document.createElement( "embed" ), e.setAttribute( "src", a ), e.setAttribute( "type", "application/x-shockwave-flash" ), e.setAttribute( "allowScriptAccess", "always" ), e.setAttribute( "allowFullScreen", "true" ), e.setAttribute( "bgcolor", n ), e.setAttribute( "pluginspage", "http://www.adobe.com/go/getflashplayer_cn" ), e.setAttribute( "wmode", "transparent" ), e.setAttribute( "FlashVars", "debug=0" ), o.appendChild( e );
                    }
                    return e.name = r, e.width = l, e.height = h, e.id = r, this._swf = e, Hilo.Stage.prototype.tick = function ( t ) {
                        this.paused || (this._render( this.renderer, t ), i.tick())
                    }, e
                }, tick : function () {
                    l && h.length > 0 && (this._swf.CallFunction( '<invoke name="executeCommand" returntype="javascript"><arguments><string>' + h.join( "\u221a" ) + "</string></arguments></invoke>" ), h.length = 0)
                }, _addFlashCallback : function () {
                    var t = this;
                    Hilo.__flashFireEvent = function ( e, i ) {
                        if ( e.indexOf( "key" ) > -1 && document.fireEvent ) {
                            var a = document.createEventObject();
                            a.keyCode = i, document.fireEvent( "on" + e, a )
                        }
                        else {
                            t._swf && t._swf.fireEvent && t._swf.fireEvent( "on" + e )
                        }
                    };
                    var e = t.__flashImageCache = {}, i = {};
                    Hilo.flashLoadImage = function ( t, a, r ) {
                        return e[t] ? void a( e[t] ) : (o[t] = o[t] || [], o[t].push( [a, r || a] ), void(i[t] || (i[t] = !0, h.push( "loadImage", t ))))
                    }, Hilo.__flashUnlock = function () {
                        l = !0
                    }, Hilo.__flashImageCallBack = function ( t, i, a, r ) {
                        var n = o[t];
                        if ( n && n.length > 0 ) {
                            var s = {target : {src : t, width : a, height : r, isFlash : !0, tagName : "img"}, errorCode : i};
                            0 == i && (e[t] = s);
                            for ( var l = 0, h = n.length; h > l; l++ )n[l][i]( s );
                            n.length = 0
                        }
                    }
                }
            };
            return "true" === a.getAttribute( "data-auto" ) && u.init(), Hilo.FlashAdaptor = u
        }()
    }
}();
(function () {
    var t = {
        use : function ( t ) {
            var e = t.split( "." ), i = this;
            for ( var a = 0; a < e.length; a++ ) {
                var r = e[a];
                i = i[r] || (i[r] = {})
            }
            return i
        }, extend : function ( t, e ) {
            var i = function () {
            };
            i.prototype = e.prototype;
            t.prototype = new i;
            t.prototype.constructor = t;
            t.superclass = e.prototype
        }
    };
    window.dragonBones = t
})();
(function () {
    var t = dragonBones.use( "geom" );

    function e( t, e ) {
        if ( typeof t === "undefined" ) {
            t = 0
        }
        if ( typeof e === "undefined" ) {
            e = 0
        }
        this.x = t;
        this.y = e
    }

    e.prototype.toString = function () {
        return "[Point (x=" + this.x + " y=" + this.y + ")]"
    };
    t.Point = e
})();
(function () {
    var t = dragonBones.use( "geom" );

    function e( t, e, i, a ) {
        if ( typeof t === "undefined" ) {
            t = 0
        }
        if ( typeof e === "undefined" ) {
            e = 0
        }
        if ( typeof i === "undefined" ) {
            i = 0
        }
        if ( typeof a === "undefined" ) {
            a = 0
        }
        this.x = t;
        this.y = e;
        this.width = i;
        this.height = a
    }

    t.Rectangle = e
})();
(function () {
    var t = dragonBones.use( "geom" );

    function e() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0
    }

    e.prototype.invert = function () {
        var t = this.a;
        var e = this.b;
        var i = this.c;
        var a = this.d;
        var r = this.tx;
        var n = t * a - e * i;
        this.a = a / n;
        this.b = -e / n;
        this.c = -i / n;
        this.d = t / n;
        this.tx = (i * this.ty - a * r) / n;
        this.ty = -(t * this.ty - e * r) / n
    };
    t.Matrix = e
})();
(function () {
    var t = dragonBones.use( "geom" );

    function e() {
        this.alphaMultiplier = 0;
        this.alphaOffset = 0;
        this.blueMultiplier = 0;
        this.blueOffset = 0;
        this.greenMultiplier = 0;
        this.greenOffset = 0;
        this.redMultiplier = 0;
        this.redOffset = 0
    }

    t.ColorTransform = e
})();
(function () {
    var t = dragonBones.use( "events" );

    function e( t ) {
        this.type = t
    }

    t.Event = e
})();
(function () {
    var t = dragonBones.use( "events" );
    var e = t.Event;

    function i( t ) {
        i.superclass.constructor.call( this, t )
    }

    dragonBones.extend( i, e );
    i.FADE_IN = "fadeIn";
    i.FADE_OUT = "fadeOut";
    i.START = "start";
    i.COMPLETE = "complete";
    i.LOOP_COMPLETE = "loopComplete";
    i.FADE_IN_COMPLETE = "fadeInComplete";
    i.FADE_OUT_COMPLETE = "fadeOutComplete";
    t.AnimationEvent = i
})();
(function () {
    var t = dragonBones.use( "events" );
    var e = t.Event;

    function i( t ) {
        i.superclass.constructor.call( this, t )
    }

    dragonBones.extend( i, e );
    i.Z_ORDER_UPDATED = "zOrderUpdated";
    t.ArmatureEvent = i
})();
(function () {
    var t = dragonBones.use( "events" );
    var e = t.Event;

    function i( t ) {
        i.superclass.constructor.call( this, t )
    }

    dragonBones.extend( i, e );
    i.ANIMATION_FRAME_EVENT = "animationFrameEvent";
    i.BONE_FRAME_EVENT = "boneFrameEvent";
    t.FrameEvent = i
})();
(function () {
    var t = dragonBones.use( "events" );
    var e = t.Event;

    function i( t ) {
        i.superclass.constructor.call( this, t )
    }

    dragonBones.extend( i, e );
    i.SOUND = "sound";
    i.BONE_FRAME_EVENT = "boneFrameEvent";
    t.SoundEvent = i
})();
(function () {
    var t = dragonBones.use( "events" );

    function e() {
    }

    e.prototype.hasEventListener = function ( t ) {
        if ( this._listenersMap && this._listenersMap[t] ) {
            return true
        }
        return false
    };
    e.prototype.addEventListener = function ( t, e ) {
        if ( t && e ) {
            if ( !this._listenersMap ) {
                this._listenersMap = {}
            }
            var i = this._listenersMap[t];
            if ( i ) {
                this.removeEventListener( t, e )
            }
            if ( i ) {
                i.push( e )
            }
            else {
                this._listenersMap[t] = [e]
            }
        }
    };
    e.prototype.removeEventListener = function ( t, e ) {
        if ( !this._listenersMap || !t || !e ) {
            return
        }
        var i = this._listenersMap[t];
        if ( i ) {
            var a = i.length;
            for ( var r = 0; r < a; r++ ) {
                if ( i[r] == e ) {
                    if ( a == 1 ) {
                        i.length = 0;
                        delete this._listenersMap[t]
                    }
                    else {
                        i.splice( r, 1 )
                    }
                }
            }
        }
    };
    e.prototype.removeAllEventListeners = function ( t ) {
        if ( t ) {
            delete this._listenersMap[t]
        }
        else {
            this._listenersMap = null
        }
    };
    e.prototype.dispatchEvent = function ( t ) {
        if ( t ) {
            var e = this._listenersMap[t.type];
            if ( e ) {
                t.target = this;
                var i = e.concat();
                var a = e.length;
                for ( var r = 0; r < a; r++ ) {
                    i[r]( t )
                }
            }
        }
    };
    t.EventDispatcher = e
})();
(function () {
    var t = dragonBones.use( "events" );

    function e() {
        e.superclass.constructor.call( this );
        if ( e._instance ) {
            throw new Error( "Singleton already constructed!" )
        }
    }

    dragonBones.extend( e, dragonBones.events.EventDispatcher );
    e.getInstance = function () {
        if ( !e._instance ) {
            e._instance = new e
        }
        return e._instance
    };
    t.SoundEventManager = e
})();
(function () {
    var t = dragonBones.use( "animation" );

    function e() {
        this.timeScale = 1;
        this.time = (new Date).getTime() * .001;
        this._animatableList = []
    }

    e.prototype.contains = function ( t ) {
        return this._animatableList.indexOf( t ) >= 0
    };
    e.prototype.add = function ( t ) {
        if ( t && this._animatableList.indexOf( t ) == -1 ) {
            this._animatableList.push( t )
        }
    };
    e.prototype.remove = function ( t ) {
        var e = this._animatableList.indexOf( t );
        if ( e >= 0 ) {
            this._animatableList[e] = null
        }
    };
    e.prototype.clear = function () {
        this._animatableList.length = 0
    };
    e.prototype.advanceTime = function ( t ) {
        if ( t < 0 ) {
            var e = (new Date).getTime() * .001;
            t = e - this.time;
            this.time = e
        }
        t *= this.timeScale;
        var i = this._animatableList.length;
        if ( i == 0 ) {
            return
        }
        var a = 0;
        for ( var r = 0; r < i; r++ ) {
            var n = this._animatableList[r];
            if ( n ) {
                if ( a != r ) {
                    this._animatableList[a] = n;
                    this._animatableList[r] = null
                }
                n.advanceTime( t );
                a++
            }
        }
        if ( a != r ) {
            i = this._animatableList.length;
            while ( r < i ) {
                this._animatableList[a++] = this._animatableList[r++]
            }
            this._animatableList.length = a
        }
    };
    e.clock = new e;
    t.WorldClock = e
})();
(function () {
    var t = dragonBones.use( "animation" );
    var e = dragonBones.use( "objects" );
    var i = dragonBones.use( "geom" );
    var a = dragonBones.use( "utils" );

    function r() {
        this.transform = new e.DBTransform;
        this.pivot = new i.Point;
        this._durationTransform = new e.DBTransform;
        this._durationPivot = new i.Point;
        this._durationColor = new i.ColorTransform
    }

    r._borrowObject = function () {
        if ( r._pool.length == 0 ) {
            return new r
        }
        return r._pool.pop()
    };
    r._returnObject = function ( t ) {
        if ( r._pool.indexOf( t ) < 0 ) {
            r._pool[r._pool.length] = t
        }
        t.clear()
    };
    r._clear = function () {
        var t = r._pool.length;
        while ( t-- ) {
            r._pool[t].clear()
        }
        r._pool.length = 0
    };
    r.getEaseValue = function ( t, e ) {
        if ( e > 1 ) {
            var i = .5 * (1 - Math.cos( t * Math.PI )) - t;
            e -= 1
        }
        else if ( e > 0 ) {
            i = Math.sin( t * r.HALF_PI ) - t
        }
        else if ( e < 0 ) {
            i = 1 - Math.cos( t * r.HALF_PI ) - t;
            e *= -1
        }
        return i * e + t
    };
    r.prototype.fadeIn = function ( t, e, i ) {
        this._bone = t;
        this._animationState = e;
        this._timeline = i;
        this._originTransform = this._timeline.originTransform;
        this._originPivot = this._timeline.originPivot;
        this._tweenTransform = false;
        this._tweenColor = false;
        this._totalTime = this._animationState.totalTime;
        this.transform.x = 0;
        this.transform.y = 0;
        this.transform.scaleX = 0;
        this.transform.scaleY = 0;
        this.transform.skewX = 0;
        this.transform.skewY = 0;
        this.pivot.x = 0;
        this.pivot.y = 0;
        this._durationTransform.x = 0;
        this._durationTransform.y = 0;
        this._durationTransform.scaleX = 0;
        this._durationTransform.scaleY = 0;
        this._durationTransform.skewX = 0;
        this._durationTransform.skewY = 0;
        this._durationPivot.x = 0;
        this._durationPivot.y = 0;
        this._currentFrame = null;
        switch ( this._timeline.getFrameList().length ) {
            case 0:
                this._bone._arriveAtFrame( null, this, this._animationState, false );
                this._updateState = 0;
                break;
            case 1:
                this._updateState = -1;
                break;
            default:
                this._updateState = 1;
                break
        }
    };
    r.prototype.fadeOut = function () {
        this.transform.skewX = a.TransformUtil.formatRadian( this.transform.skewX );
        this.transform.skewY = a.TransformUtil.formatRadian( this.transform.skewY )
    };
    r.prototype.update = function ( t ) {
        if ( this._updateState ) {
            if ( this._updateState > 0 ) {
                if ( this._timeline.scale == 0 ) {
                    t = 1
                }
                else {
                    t /= this._timeline.scale
                }
                if ( t == 1 ) {
                    t = .99999999
                }
                t += this._timeline.offset;
                var e = Math.floor( t );
                t -= e;
                var i = this._totalTime * t;
                var n = false;
                var s;
                while ( !this._currentFrame || i > this._currentFramePosition + this._currentFrameDuration || i < this._currentFramePosition ) {
                    if ( n ) {
                        this._bone._arriveAtFrame( this._currentFrame, this, this._animationState, true )
                    }
                    n = true;
                    if ( this._currentFrame ) {
                        s = this._timeline.getFrameList().indexOf( this._currentFrame ) + 1;
                        if ( s >= this._timeline.getFrameList().length ) {
                            s = 0
                        }
                        this._currentFrame = this._timeline.getFrameList()[s]
                    }
                    else {
                        s = 0;
                        this._currentFrame = this._timeline.getFrameList()[0]
                    }
                    this._currentFrameDuration = this._currentFrame.duration;
                    this._currentFramePosition = this._currentFrame.position
                }
                if ( n ) {
                    this.tweenActive = this._currentFrame.displayIndex >= 0;
                    s++;
                    if ( s >= this._timeline.getFrameList().length ) {
                        s = 0
                    }
                    var o = this._timeline.getFrameList()[s];
                    if ( s == 0 && this._animationState.loop && this._animationState.loopCount >= Math.abs( this._animationState.loop ) - 1 && ((this._currentFramePosition + this._currentFrameDuration) / this._totalTime + e - this._timeline.offset) * this._timeline.scale > .99999999 ) {
                        this._updateState = 0;
                        this._tweenEasing = NaN
                    }
                    else if ( this._currentFrame.displayIndex < 0 || o.displayIndex < 0 || !this._animationState.tweenEnabled ) {
                        this._tweenEasing = NaN
                    }
                    else if ( isNaN( this._animationState.clip.tweenEasing ) ) {
                        this._tweenEasing = this._currentFrame.tweenEasing
                    }
                    else {
                        this._tweenEasing = this._animationState.clip.tweenEasing
                    }
                    if ( isNaN( this._tweenEasing ) ) {
                        this._tweenTransform = false;
                        this._tweenColor = false
                    }
                    else {
                        this._durationTransform.x = o.transform.x - this._currentFrame.transform.x;
                        this._durationTransform.y = o.transform.y - this._currentFrame.transform.y;
                        this._durationTransform.skewX = o.transform.skewX - this._currentFrame.transform.skewX;
                        this._durationTransform.skewY = o.transform.skewY - this._currentFrame.transform.skewY;
                        this._durationTransform.scaleX = o.transform.scaleX - this._currentFrame.transform.scaleX;
                        this._durationTransform.scaleY = o.transform.scaleY - this._currentFrame.transform.scaleY;
                        if ( s == 0 ) {
                            this._durationTransform.skewX = a.TransformUtil.formatRadian( this._durationTransform.skewX );
                            this._durationTransform.skewY = a.TransformUtil.formatRadian( this._durationTransform.skewY )
                        }
                        this._durationPivot.x = o.pivot.x - this._currentFrame.pivot.x;
                        this._durationPivot.y = o.pivot.y - this._currentFrame.pivot.y;
                        if ( this._durationTransform.x != 0 || this._durationTransform.y != 0 || this._durationTransform.skewX != 0 || this._durationTransform.skewY != 0 || this._durationTransform.scaleX != 0 || this._durationTransform.scaleY != 0 || this._durationPivot.x != 0 || this._durationPivot.y != 0 ) {
                            this._tweenTransform = true
                        }
                        else {
                            this._tweenTransform = false
                        }
                        if ( this._currentFrame.color && o.color ) {
                            this._durationColor.alphaOffset = o.color.alphaOffset - this._currentFrame.color.alphaOffset;
                            this._durationColor.redOffset = o.color.redOffset - this._currentFrame.color.redOffset;
                            this._durationColor.greenOffset = o.color.greenOffset - this._currentFrame.color.greenOffset;
                            this._durationColor.blueOffset = o.color.blueOffset - this._currentFrame.color.blueOffset;
                            this._durationColor.alphaMultiplier = o.color.alphaMultiplier - this._currentFrame.color.alphaMultiplier;
                            this._durationColor.redMultiplier = o.color.redMultiplier - this._currentFrame.color.redMultiplier;
                            this._durationColor.greenMultiplier = o.color.greenMultiplier - this._currentFrame.color.greenMultiplier;
                            this._durationColor.blueMultiplier = o.color.blueMultiplier - this._currentFrame.color.blueMultiplier;
                            if ( this._durationColor.alphaOffset != 0 || this._durationColor.redOffset != 0 || this._durationColor.greenOffset != 0 || this._durationColor.blueOffset != 0 || this._durationColor.alphaMultiplier != 0 || this._durationColor.redMultiplier != 0 || this._durationColor.greenMultiplier != 0 || this._durationColor.blueMultiplier != 0 ) {
                                this._tweenColor = true
                            }
                            else {
                                this._tweenColor = false
                            }
                        }
                        else if ( this._currentFrame.color ) {
                            this._tweenColor = true;
                            this._durationColor.alphaOffset = -this._currentFrame.color.alphaOffset;
                            this._durationColor.redOffset = -this._currentFrame.color.redOffset;
                            this._durationColor.greenOffset = -this._currentFrame.color.greenOffset;
                            this._durationColor.blueOffset = -this._currentFrame.color.blueOffset;
                            this._durationColor.alphaMultiplier = 1 - this._currentFrame.color.alphaMultiplier;
                            this._durationColor.redMultiplier = 1 - this._currentFrame.color.redMultiplier;
                            this._durationColor.greenMultiplier = 1 - this._currentFrame.color.greenMultiplier;
                            this._durationColor.blueMultiplier = 1 - this._currentFrame.color.blueMultiplier
                        }
                        else if ( o.color ) {
                            this._tweenColor = true;
                            this._durationColor.alphaOffset = o.color.alphaOffset;
                            this._durationColor.redOffset = o.color.redOffset;
                            this._durationColor.greenOffset = o.color.greenOffset;
                            this._durationColor.blueOffset = o.color.blueOffset;
                            this._durationColor.alphaMultiplier = o.color.alphaMultiplier - 1;
                            this._durationColor.redMultiplier = o.color.redMultiplier - 1;
                            this._durationColor.greenMultiplier = o.color.greenMultiplier - 1;
                            this._durationColor.blueMultiplier = o.color.blueMultiplier - 1
                        }
                        else {
                            this._tweenColor = false
                        }
                    }
                    if ( !this._tweenTransform ) {
                        if ( this._animationState.blend ) {
                            this.transform.x = this._originTransform.x + this._currentFrame.transform.x;
                            this.transform.y = this._originTransform.y + this._currentFrame.transform.y;
                            this.transform.skewX = this._originTransform.skewX + this._currentFrame.transform.skewX;
                            this.transform.skewY = this._originTransform.skewY + this._currentFrame.transform.skewY;
                            this.transform.scaleX = this._originTransform.scaleX + this._currentFrame.transform.scaleX;
                            this.transform.scaleY = this._originTransform.scaleY + this._currentFrame.transform.scaleY;
                            this.pivot.x = this._originPivot.x + this._currentFrame.pivot.x;
                            this.pivot.y = this._originPivot.y + this._currentFrame.pivot.y
                        }
                        else {
                            this.transform.x = this._currentFrame.transform.x;
                            this.transform.y = this._currentFrame.transform.y;
                            this.transform.skewX = this._currentFrame.transform.skewX;
                            this.transform.skewY = this._currentFrame.transform.skewY;
                            this.transform.scaleX = this._currentFrame.transform.scaleX;
                            this.transform.scaleY = this._currentFrame.transform.scaleY;
                            this.pivot.x = this._currentFrame.pivot.x;
                            this.pivot.y = this._currentFrame.pivot.y
                        }
                    }
                    if ( !this._tweenColor ) {
                        if ( this._currentFrame.color ) {
                            this._bone._updateColor( this._currentFrame.color.alphaOffset, this._currentFrame.color.redOffset, this._currentFrame.color.greenOffset, this._currentFrame.color.blueOffset, this._currentFrame.color.alphaMultiplier, this._currentFrame.color.redMultiplier, this._currentFrame.color.greenMultiplier, this._currentFrame.color.blueMultiplier, true )
                        }
                        else if ( this._bone._isColorChanged ) {
                            this._bone._updateColor( 0, 0, 0, 0, 1, 1, 1, 1, false )
                        }
                    }
                    this._bone._arriveAtFrame( this._currentFrame, this, this._animationState, false )
                }
                if ( this._tweenTransform || this._tweenColor ) {
                    t = (i - this._currentFramePosition) / this._currentFrameDuration;
                    if ( this._tweenEasing ) {
                        t = r.getEaseValue( t, this._tweenEasing )
                    }
                }
                if ( this._tweenTransform ) {
                    var l = this._currentFrame.transform;
                    var h = this._currentFrame.pivot;
                    if ( this._animationState.blend ) {
                        this.transform.x = this._originTransform.x + l.x + this._durationTransform.x * t;
                        this.transform.y = this._originTransform.y + l.y + this._durationTransform.y * t;
                        this.transform.skewX = this._originTransform.skewX + l.skewX + this._durationTransform.skewX * t;
                        this.transform.skewY = this._originTransform.skewY + l.skewY + this._durationTransform.skewY * t;
                        this.transform.scaleX = this._originTransform.scaleX + l.scaleX + this._durationTransform.scaleX * t;
                        this.transform.scaleY = this._originTransform.scaleY + l.scaleY + this._durationTransform.scaleY * t;
                        this.pivot.x = this._originPivot.x + h.x + this._durationPivot.x * t;
                        this.pivot.y = this._originPivot.y + h.y + this._durationPivot.y * t
                    }
                    else {
                        this.transform.x = l.x + this._durationTransform.x * t;
                        this.transform.y = l.y + this._durationTransform.y * t;
                        this.transform.skewX = l.skewX + this._durationTransform.skewX * t;
                        this.transform.skewY = l.skewY + this._durationTransform.skewY * t;
                        this.transform.scaleX = l.scaleX + this._durationTransform.scaleX * t;
                        this.transform.scaleY = l.scaleY + this._durationTransform.scaleY * t;
                        this.pivot.x = h.x + this._durationPivot.x * t;
                        this.pivot.y = h.y + this._durationPivot.y * t
                    }
                }
                if ( this._tweenColor ) {
                    if ( this._currentFrame.color ) {
                        this._bone._updateColor( this._currentFrame.color.alphaOffset + this._durationColor.alphaOffset * t, this._currentFrame.color.redOffset + this._durationColor.redOffset * t, this._currentFrame.color.greenOffset + this._durationColor.greenOffset * t, this._currentFrame.color.blueOffset + this._durationColor.blueOffset * t, this._currentFrame.color.alphaMultiplier + this._durationColor.alphaMultiplier * t, this._currentFrame.color.redMultiplier + this._durationColor.redMultiplier * t, this._currentFrame.color.greenMultiplier + this._durationColor.greenMultiplier * t, this._currentFrame.color.blueMultiplier + this._durationColor.blueMultiplier * t, true )
                    }
                    else {
                        this._bone._updateColor( this._durationColor.alphaOffset * t, this._durationColor.redOffset * t, this._durationColor.greenOffset * t, this._durationColor.blueOffset * t, 1 + this._durationColor.alphaMultiplier * t, 1 + this._durationColor.redMultiplier * t, 1 + this._durationColor.greenMultiplier * t, 1 + this._durationColor.blueMultiplier * t, true )
                    }
                }
            }
            else {
                this._updateState = 0;
                if ( this._animationState.blend ) {
                    this.transform.copy( this._originTransform );
                    this.pivot.x = this._originPivot.x;
                    this.pivot.y = this._originPivot.y
                }
                else {
                    this.transform.x = this.transform.y = this.transform.skewX = this.transform.skewY = this.transform.scaleX = this.transform.scaleY = 0;
                    this.pivot.x = 0;
                    this.pivot.y = 0
                }
                this._currentFrame = this._timeline.getFrameList()[0];
                this.tweenActive = this._currentFrame.displayIndex >= 0;
                if ( this._currentFrame.color ) {
                    this._bone._updateColor( this._currentFrame.color.alphaOffset, this._currentFrame.color.redOffset, this._currentFrame.color.greenOffset, this._currentFrame.color.blueOffset, this._currentFrame.color.alphaMultiplier, this._currentFrame.color.redMultiplier, this._currentFrame.color.greenMultiplier, this._currentFrame.color.blueMultiplier, true )
                }
                else {
                    this._bone._updateColor( 0, 0, 0, 0, 1, 1, 1, 1, false )
                }
                this._bone._arriveAtFrame( this._currentFrame, this, this._animationState, false )
            }
        }
    };
    r.prototype.clear = function () {
        this._updateState = 0;
        this._bone = null;
        this._animationState = null;
        this._timeline = null;
        this._currentFrame = null;
        this._originTransform = null;
        this._originPivot = null
    };
    r.HALF_PI = Math.PI * .5;
    r._pool = [];
    t.TimelineState = r
})();
(function () {
    var t = dragonBones.use( "animation" );
    var e = dragonBones.use( "events" );
    var i = t.TimelineState;

    function a() {
        this.loop = 0;
        this.layer = 0;
        this._timelineStates = {}
    }

    a._borrowObject = function () {
        if ( a._pool.length == 0 ) {
            return new a
        }
        return a._pool.pop()
    };
    a._returnObject = function ( t ) {
        if ( a._pool.indexOf( t ) < 0 ) {
            a._pool[a._pool.length] = t
        }
        t.clear()
    };
    a._clear = function () {
        var t = a._pool.length;
        while ( t-- ) {
            a._pool[t].clear()
        }
        a._pool.length = 0
    };
    a.prototype.fadeIn = function ( t, e, i, a, r, n, s, o ) {
        this.layer = n;
        this.clip = e;
        this.name = this.clip.name;
        this.totalTime = this.clip.duration;
        this._armature = t;
        if ( Math.round( this.clip.duration * this.clip.frameRate ) < 2 || a == Infinity ) {
            this.timeScale = 1;
            this.currentTime = this.totalTime;
            if ( this.loop >= 0 ) {
                this.loop = 1
            }
            else {
                this.loop = -1
            }
        }
        else {
            this.timeScale = a;
            this.currentTime = 0;
            this.loop = r
        }
        this._pauseBeforeFadeInComplete = o;
        this._fadeInTime = i * this.timeScale;
        this._fadeState = 1;
        this._fadeOutBeginTime = 0;
        this._fadeOutWeight = -1;
        this._fadeWeight = 0;
        this._fadeIn = true;
        this._fadeOut = false;
        this.loopCount = -1;
        this.displayControl = s;
        this.isPlaying = true;
        this.isComplete = false;
        this.weight = 1;
        this.blend = true;
        this.enabled = true;
        this.tweenEnabled = true;
        this.updateTimelineStates()
    };
    a.prototype.fadeOut = function ( t, e ) {
        if ( typeof e === "undefined" ) {
            e = false
        }
        if ( !this._armature || this._fadeOutWeight >= 0 ) {
            return
        }
        this._fadeState = -1;
        this._fadeOutWeight = this._fadeWeight;
        this._fadeOutTime = t * this.timeScale;
        this._fadeOutBeginTime = this.currentTime;
        this._fadeOut = true;
        this.isPlaying = !e;
        this.displayControl = false;
        for ( var i = 0, a = this._timelineStates.length; i < a; i++ ) {
            this._timelineStates[i].fadeOut()
        }
        this.enabled = true
    };
    a.prototype.play = function () {
        this.isPlaying = true
    };
    a.prototype.stop = function () {
        this.isPlaying = false
    };
    a.prototype.getMixingTransform = function ( t ) {
        if ( this._mixingTransforms ) {
            return Number( this._mixingTransforms[t] )
        }
        return -1
    };
    a.prototype.addMixingTransform = function ( t, e, i ) {
        if ( typeof e === "undefined" ) {
            e = 2
        }
        if ( typeof i === "undefined" ) {
            i = true
        }
        if ( this.clip && this.clip.getTimeline( t ) ) {
            if ( !this._mixingTransforms ) {
                this._mixingTransforms = {}
            }
            if ( i ) {
                var a = this._armature._boneList.length;
                var r;
                var n;
                while ( a-- ) {
                    r = this._armature._boneList[a];
                    if ( r.name == t ) {
                        n = r
                    }
                    if ( n && (n == r || n.contains( r )) ) {
                        this._mixingTransforms[r.name] = e
                    }
                }
            }
            else {
                this._mixingTransforms[t] = e
            }
            this.updateTimelineStates()
        }
        else {
            throw new Error
        }
    };
    a.prototype.removeMixingTransform = function ( t, e ) {
        if ( typeof t === "undefined" ) {
            t = null
        }
        if ( typeof e === "undefined" ) {
            e = true
        }
        if ( t ) {
            if ( e ) {
                var i = this._armature._boneList.length;
                var a;
                var r;
                while ( i-- ) {
                    a = this._armature._boneList[i];
                    if ( a.name == t ) {
                        r = a
                    }
                    if ( r && (r == a || r.contains( a )) ) {
                        delete this._mixingTransforms[a.name]
                    }
                }
            }
            else {
                delete this._mixingTransforms[t]
            }
            for ( var n = 0, s = this._mixingTransforms.length; n < s; n++ ) {
                var o = true;
                break
            }
            if ( !o ) {
                this._mixingTransforms = null
            }
        }
        else {
            this._mixingTransforms = null
        }
        this.updateTimelineStates()
    };
    a.prototype.advanceTime = function ( t ) {
        if ( !this.enabled ) {
            return false
        }
        var i;
        var a;
        if ( this._fadeIn ) {
            this._fadeIn = false;
            if ( this._armature.hasEventListener( e.AnimationEvent.FADE_IN ) ) {
                i = new e.AnimationEvent( e.AnimationEvent.FADE_IN );
                i.animationState = this;
                this._armature._eventList.push( i )
            }
        }
        if ( this._fadeOut ) {
            this._fadeOut = false;
            if ( this._armature.hasEventListener( e.AnimationEvent.FADE_OUT ) ) {
                i = new e.AnimationEvent( e.AnimationEvent.FADE_OUT );
                i.animationState = this;
                this._armature._eventList.push( i )
            }
        }
        this.currentTime += t * this.timeScale;
        if ( this.isPlaying && !this.isComplete ) {
            var r;
            var n;
            if ( this._pauseBeforeFadeInComplete ) {
                this._pauseBeforeFadeInComplete = false;
                this.isPlaying = false;
                r = 0;
                n = Math.floor( r )
            }
            else {
                r = this.currentTime / this.totalTime;
                n = Math.floor( r );
                if ( n != this.loopCount ) {
                    if ( this.loopCount == -1 ) {
                        if ( this._armature.hasEventListener( e.AnimationEvent.START ) ) {
                            i = new e.AnimationEvent( e.AnimationEvent.START );
                            i.animationState = this;
                            this._armature._eventList.push( i )
                        }
                    }
                    this.loopCount = n;
                    if ( this.loopCount ) {
                        if ( this.loop && this.loopCount * this.loopCount >= this.loop * this.loop - 1 ) {
                            a = true;
                            r = 1;
                            n = 0;
                            if ( this._armature.hasEventListener( e.AnimationEvent.COMPLETE ) ) {
                                i = new e.AnimationEvent( e.AnimationEvent.COMPLETE );
                                i.animationState = this;
                                this._armature._eventList.push( i )
                            }
                        }
                        else {
                            if ( this._armature.hasEventListener( e.AnimationEvent.LOOP_COMPLETE ) ) {
                                i = new e.AnimationEvent( e.AnimationEvent.LOOP_COMPLETE );
                                i.animationState = this;
                                this._armature._eventList.push( i )
                            }
                        }
                    }
                }
            }
            for ( var s in this._timelineStates ) {
                this._timelineStates[s].update( r )
            }
            var o = this.clip.getFrameList();
            if ( o.length > 0 ) {
                var l = this.totalTime * (r - n);
                var h = false;
                var u;
                while ( !this._currentFrame || l > this._currentFrame.position + this._currentFrame.duration || l < this._currentFrame.position ) {
                    if ( h ) {
                        this._armature._arriveAtFrame( this._currentFrame, null, this, true )
                    }
                    h = true;
                    if ( this._currentFrame ) {
                        u = o.indexOf( this._currentFrame );
                        u++;
                        if ( u >= o.length ) {
                            u = 0
                        }
                        this._currentFrame = o[u]
                    }
                    else {
                        this._currentFrame = o[0]
                    }
                }
                if ( h ) {
                    this._armature._arriveAtFrame( this._currentFrame, null, this, false )
                }
            }
        }
        if ( this._fadeState > 0 ) {
            if ( this._fadeInTime == 0 ) {
                this._fadeWeight = 1;
                this._fadeState = 0;
                this.isPlaying = true;
                if ( this._armature.hasEventListener( e.AnimationEvent.FADE_IN_COMPLETE ) ) {
                    i = new e.AnimationEvent( e.AnimationEvent.FADE_IN_COMPLETE );
                    i.animationState = this;
                    this._armature._eventList.push( i )
                }
            }
            else {
                this._fadeWeight = this.currentTime / this._fadeInTime;
                if ( this._fadeWeight >= 1 ) {
                    this._fadeWeight = 1;
                    this._fadeState = 0;
                    if ( !this.isPlaying ) {
                        this.currentTime -= this._fadeInTime
                    }
                    this.isPlaying = true;
                    if ( this._armature.hasEventListener( e.AnimationEvent.FADE_IN_COMPLETE ) ) {
                        i = new e.AnimationEvent( e.AnimationEvent.FADE_IN_COMPLETE );
                        i.animationState = this;
                        this._armature._eventList.push( i )
                    }
                }
            }
        }
        else if ( this._fadeState < 0 ) {
            if ( this._fadeOutTime == 0 ) {
                this._fadeWeight = 0;
                this._fadeState = 0;
                if ( this._armature.hasEventListener( e.AnimationEvent.FADE_OUT_COMPLETE ) ) {
                    i = new e.AnimationEvent( e.AnimationEvent.FADE_OUT_COMPLETE );
                    i.animationState = this;
                    this._armature._eventList.push( i )
                }
                return true
            }
            else {
                this._fadeWeight = (1 - (this.currentTime - this._fadeOutBeginTime) / this._fadeOutTime) * this._fadeOutWeight;
                if ( this._fadeWeight <= 0 ) {
                    this._fadeWeight = 0;
                    this._fadeState = 0;
                    if ( this._armature.hasEventListener( e.AnimationEvent.FADE_OUT_COMPLETE ) ) {
                        i = new e.AnimationEvent( e.AnimationEvent.FADE_OUT_COMPLETE );
                        i.animationState = this;
                        this._armature._eventList.push( i )
                    }
                    return true
                }
            }
        }
        if ( a ) {
            this.isComplete = true;
            if ( this.loop < 0 ) {
                this.fadeOut( (this._fadeOutWeight || this._fadeInTime) / this.timeScale, true )
            }
        }
        return false
    };
    a.prototype.updateTimelineStates = function () {
        if ( this._mixingTransforms ) {
            for ( var t in this._timelineStates ) {
                if ( this._mixingTransforms[t] == null ) {
                    this.removeTimelineState( t )
                }
            }
            for ( t in this._mixingTransforms ) {
                if ( !this._timelineStates[t] ) {
                    this.addTimelineState( t )
                }
            }
        }
        else {
            for ( t in this.clip.getTimelines() ) {
                if ( !this._timelineStates[t] ) {
                    this.addTimelineState( t )
                }
            }
        }
    };
    a.prototype.addTimelineState = function ( t ) {
        var e = this._armature.getBone( t );
        if ( e ) {
            var a = i._borrowObject();
            var r = this.clip.getTimeline( t );
            a.fadeIn( e, this, r );
            this._timelineStates[t] = a
        }
    };
    a.prototype.removeTimelineState = function ( t ) {
        i._returnObject( this._timelineStates[t] );
        delete this._timelineStates[t]
    };
    a.prototype.clear = function () {
        this.clip = null;
        this.enabled = false;
        this._armature = null;
        this._currentFrame = null;
        this._mixingTransforms = null;
        for ( var t in this._timelineStates ) {
            this.removeTimelineState( t )
        }
    };
    a._pool = [];
    t.AnimationState = a
})();
(function () {
    var t = dragonBones.use( "animation" );
    var e = t.AnimationState;

    function i( t ) {
        this._armature = t;
        this._animationLayer = [];
        this._isPlaying = false;
        this.animationNameList = [];
        this.tweenEnabled = true;
        this.timeScale = 1
    }

    i.prototype.getLastAnimationName = function () {
        return this._lastAnimationState ? this._lastAnimationState.name : null
    };
    i.prototype.getLastAnimationState = function () {
        return this._lastAnimationState
    };
    i.prototype.getAnimationDataList = function () {
        return this._animationDataList
    };
    i.prototype.setAnimationDataList = function ( t ) {
        this._animationDataList = t;
        this.animationNameList.length = 0;
        for ( var e = 0, i = this._animationDataList.length; e < i; e++ ) {
            this.animationNameList[this.animationNameList.length] = this._animationDataList[e].name
        }
    };
    i.prototype.getIsPlaying = function () {
        return this._isPlaying && !this.getIsComplete()
    };
    i.prototype.getIsComplete = function () {
        if ( this._lastAnimationState ) {
            if ( !this._lastAnimationState.isComplete ) {
                return false
            }
            var t = this._animationLayer.length;
            while ( t-- ) {
                var e = this._animationLayer[t];
                var i = e.length;
                while ( i-- ) {
                    if ( !e[i].isComplete ) {
                        return false
                    }
                }
            }
            return true
        }
        return false
    };
    i.prototype.dispose = function () {
        if ( !this._armature ) {
            return
        }
        this.stop();
        var t = this._animationLayer.length;
        while ( t-- ) {
            var i = this._animationLayer[t];
            var a = i.length;
            while ( a-- ) {
                e._returnObject( i[a] )
            }
            i.length = 0
        }
        this._animationLayer.length = 0;
        this.animationNameList.length = 0;
        this._armature = null;
        this._animationLayer = null;
        this._animationDataList = null;
        this.animationNameList = null
    };
    i.prototype.gotoAndPlay = function ( t, a, r, n, s, o, l, h, u, f ) {
        if ( typeof a === "undefined" ) {
            a = -1
        }
        if ( typeof r === "undefined" ) {
            r = -1
        }
        if ( typeof n === "undefined" ) {
            n = NaN
        }
        if ( typeof s === "undefined" ) {
            s = 0
        }
        if ( typeof o === "undefined" ) {
            o = null
        }
        if ( typeof l === "undefined" ) {
            l = i.SAME_LAYER_AND_GROUP
        }
        if ( typeof h === "undefined" ) {
            h = true
        }
        if ( typeof u === "undefined" ) {
            u = true
        }
        if ( typeof f === "undefined" ) {
            f = true
        }
        if ( !this._animationDataList ) {
            return null
        }
        var c = this._animationDataList.length;
        var d;
        while ( c-- ) {
            if ( this._animationDataList[c].name == t ) {
                d = this._animationDataList[c];
                break
            }
        }
        if ( !d ) {
            return null
        }
        this._isPlaying = true;
        a = a < 0 ? d.fadeInTime < 0 ? .3 : d.fadeInTime : a;
        var m;
        if ( r < 0 ) {
            m = d.scale < 0 ? 1 : d.scale
        }
        else {
            m = r / d.duration
        }
        n = isNaN( n ) ? d.loop : n;
        s = this.addLayer( s );
        var p;
        var _;
        switch ( l ) {
            case i.NONE:
                break;
            case i.SAME_LAYER:
                _ = this._animationLayer[s];
                c = _.length;
                while ( c-- ) {
                    p = _[c];
                    p.fadeOut( a, u )
                }
                break;
            case i.SAME_GROUP:
                v = this._animationLayer.length;
                while ( v-- ) {
                    _ = this._animationLayer[v];
                    c = _.length;
                    while ( c-- ) {
                        p = _[c];
                        if ( p.group == o ) {
                            p.fadeOut( a, u )
                        }
                    }
                }
                break;
            case i.ALL:
                var v = this._animationLayer.length;
                while ( v-- ) {
                    _ = this._animationLayer[v];
                    c = _.length;
                    while ( c-- ) {
                        p = _[c];
                        p.fadeOut( a, u )
                    }
                }
                break;
            case i.SAME_LAYER_AND_GROUP:
            default:
                _ = this._animationLayer[s];
                c = _.length;
                while ( c-- ) {
                    p = _[c];
                    if ( p.group == o ) {
                        p.fadeOut( a, u )
                    }
                }
                break
        }
        this._lastAnimationState = e._borrowObject();
        this._lastAnimationState.group = o;
        this._lastAnimationState.tweenEnabled = this.tweenEnabled;
        this._lastAnimationState.fadeIn( this._armature, d, a, 1 / m, n, s, h, f );
        this.addState( this._lastAnimationState );
        var g = this._armature._slotList;
        var y;
        var w;
        c = g.length;
        while ( c-- ) {
            y = g[c];
            w = y.getChildArmature();
            if ( w ) {
                w.animation.gotoAndPlay( t, a )
            }
        }
        return this._lastAnimationState
    };
    i.prototype.play = function () {
        if ( !this._animationDataList || this._animationDataList.length == 0 ) {
            return
        }
        if ( !this._lastAnimationState ) {
            this.gotoAndPlay( this._animationDataList[0].name )
        }
        else if ( !this._isPlaying ) {
            this._isPlaying = true
        }
        else {
            this.gotoAndPlay( this._lastAnimationState.name )
        }
    };
    i.prototype.stop = function () {
        this._isPlaying = false
    };
    i.prototype.getState = function ( t, e ) {
        if ( typeof e === "undefined" ) {
            e = 0
        }
        var i = this._animationLayer.length;
        if ( i == 0 ) {
            return null
        }
        else if ( e >= i ) {
            e = i - 1
        }
        var a = this._animationLayer[e];
        if ( !a ) {
            return null
        }
        var r = a.length;
        while ( r-- ) {
            if ( a[r].name == t ) {
                return a[r]
            }
        }
        return null
    };
    i.prototype.hasAnimation = function ( t ) {
        var e = this._animationDataList.length;
        while ( e-- ) {
            if ( this._animationDataList[e].name == t ) {
                return true
            }
        }
        return false
    };
    i.prototype.advanceTime = function ( t ) {
        if ( !this._isPlaying ) {
            return
        }
        t *= this.timeScale;
        var e = this._armature._boneList.length;
        var i;
        var a;
        var r = e;
        var n;
        var s;
        var o;
        var l;
        var h;
        var u;
        var f;
        var c;
        var d;
        var m;
        var p;
        var _;
        var v;
        var g;
        var y;
        var w;
        var b;
        var A;
        var E;
        e--;
        while ( r-- ) {
            s = this._armature._boneList[r];
            o = s.name;
            l = 1;
            h = 0;
            u = 0;
            f = 0;
            c = 0;
            d = 0;
            m = 0;
            p = 0;
            _ = 0;
            i = this._animationLayer.length;
            while ( i-- ) {
                v = 0;
                g = this._animationLayer[i];
                n = g.length;
                for ( a = 0; a < n; a++ ) {
                    y = g[a];
                    if ( r == e ) {
                        if ( y.advanceTime( t ) ) {
                            this.removeState( y );
                            a--;
                            n--;
                            continue
                        }
                    }
                    w = y._timelineStates[o];
                    if ( w && w.tweenActive ) {
                        b = y._fadeWeight * y.weight * l;
                        A = w.transform;
                        E = w.pivot;
                        h += A.x * b;
                        u += A.y * b;
                        f += A.skewX * b;
                        c += A.skewY * b;
                        d += A.scaleX * b;
                        m += A.scaleY * b;
                        p += E.x * b;
                        _ += E.y * b;
                        v += b
                    }
                }
                if ( v >= l ) {
                    break
                }
                else {
                    l -= v
                }
            }
            A = s.tween;
            E = s._tweenPivot;
            A.x = h;
            A.y = u;
            A.skewX = f;
            A.skewY = c;
            A.scaleX = d;
            A.scaleY = m;
            E.x = p;
            E.y = _
        }
    };
    i.prototype.addLayer = function ( t ) {
        if ( t >= this._animationLayer.length ) {
            t = this._animationLayer.length;
            this._animationLayer[t] = []
        }
        return t
    };
    i.prototype.addState = function ( t ) {
        var e = this._animationLayer[t.layer];
        e.push( t )
    };
    i.prototype.removeState = function ( t ) {
        var i = t.layer;
        var a = this._animationLayer[i];
        a.splice( a.indexOf( t ), 1 );
        e._returnObject( t );
        if ( a.length == 0 && i == this._animationLayer.length - 1 ) {
            this._animationLayer.length--
        }
    };
    i.NONE = "none";
    i.SAME_LAYER = "sameLayer";
    i.SAME_GROUP = "sameGroup";
    i.SAME_LAYER_AND_GROUP = "sameLayerAndGroup";
    i.ALL = "all";
    t.Animation = i
})();
(function () {
    var t = dragonBones.use( "objects" );

    function e() {
        this.x = 0;
        this.y = 0;
        this.skewX = 0;
        this.skewY = 0;
        this.scaleX = 1;
        this.scaleY = 1
    }

    e.prototype.getRotation = function () {
        return this.skewX
    };
    e.prototype.setRotation = function ( t ) {
        this.skewX = this.skewY = t
    };
    e.prototype.copy = function ( t ) {
        this.x = t.x;
        this.y = t.y;
        this.skewX = t.skewX;
        this.skewY = t.skewY;
        this.scaleX = t.scaleX;
        this.scaleY = t.scaleY
    };
    e.prototype.toString = function () {
        return "[DBTransform (x=" + this.x + " y=" + this.y + " skewX=" + this.skewX + " skewY=" + this.skewY + " scaleX=" + this.scaleX + " scaleY=" + this.scaleY + ")]"
    };
    t.DBTransform = e
})();
(function () {
    var t = dragonBones.use( "objects" );

    function e() {
        this.position = 0;
        this.duration = 0
    }

    e.prototype.dispose = function () {
    };
    t.Frame = e
})();
(function () {
    var t = dragonBones.use( "objects" );
    var e = dragonBones.use( "geom" );
    var i = t.Frame;
    var a = t.DBTransform;

    function r() {
        r.superclass.constructor.call( this );
        this.tweenEasing = 0;
        this.tweenRotate = 0;
        this.displayIndex = 0;
        this.zOrder = NaN;
        this.visible = true;
        this.global = new a;
        this.transform = new a;
        this.pivot = new e.Point
    }

    dragonBones.extend( r, i );
    r.prototype.dispose = function () {
        _super.prototype.dispose.call( this );
        this.global = null;
        this.transform = null;
        this.pivot = null;
        this.color = null
    };
    t.TransformFrame = r
})();
(function () {
    var t = dragonBones.use( "objects" );

    function e() {
        this._frameList = [];
        this.duration = 0;
        this.scale = 1
    }

    e.prototype.getFrameList = function () {
        return this._frameList
    };
    e.prototype.dispose = function () {
        var t = this._frameList.length;
        while ( t-- ) {
            this._frameList[t].dispose()
        }
        this._frameList.length = 0;
        this._frameList = null
    };
    e.prototype.addFrame = function ( t ) {
        if ( !t ) {
            throw new Error
        }
        if ( this._frameList.indexOf( t ) < 0 ) {
            this._frameList[this._frameList.length] = t
        }
        else {
            throw new Error
        }
    };
    t.Timeline = e
})();
(function () {
    var t = dragonBones.use( "objects" );
    var e = dragonBones.use( "geom" );
    var i = t.Timeline;
    var a = t.DBTransform;

    function r() {
        r.superclass.constructor.call( this );
        this.originTransform = new a;
        this.originPivot = new e.Point;
        this.offset = 0;
        this.transformed = false
    }

    dragonBones.extend( r, i );
    r.prototype.dispose = function () {
        if ( this == r.HIDE_TIMELINE ) {
            return
        }
        _super.prototype.dispose.call( this );
        this.originTransform = null;
        this.originPivot = null
    };
    r.HIDE_TIMELINE = new r;
    t.TransformTimeline = r
})();
(function () {
    var t = dragonBones.use( "objects" );
    var e = t.Timeline;

    function i() {
        i.superclass.constructor.call( this );
        this.frameRate = 0;
        this.loop = 0;
        this.tweenEasing = NaN;
        this.fadeInTime = 0;
        this._timelines = {}
    }

    dragonBones.extend( i, e );
    i.prototype.getTimelines = function () {
        return this._timelines
    };
    i.prototype.dispose = function () {
        this.constructor.superclass.prototype.dispose.call( this );
        for ( var t in this._timelines ) {
            this._timelines[t].dispose()
        }
        this._timelines = null
    };
    i.prototype.getTimeline = function ( t ) {
        return this._timelines[t]
    };
    i.prototype.addTimeline = function ( t, e ) {
        if ( !t ) {
            throw new Error
        }
        this._timelines[e] = t
    };
    t.AnimationData = i
})();
(function () {
    var t = dragonBones.use( "objects" );
    var e = t.DBTransform;

    function i() {
        this.transform = new e
    }

    i.prototype.dispose = function () {
        this.transform = null;
        this.pivot = null
    };
    i.ARMATURE = "armature";
    i.IMAGE = "image";
    t.DisplayData = i
})();
(function () {
    var t = dragonBones.use( "objects" );

    function e() {
        this._displayDataList = [];
        this.zOrder = 0
    }

    e.prototype.getDisplayDataList = function () {
        return this._displayDataList
    };
    e.prototype.dispose = function () {
        var t = this._displayDataList.length;
        while ( t-- ) {
            this._displayDataList[t].dispose()
        }
        this._displayDataList.length = 0;
        this._displayDataList = null
    };
    e.prototype.addDisplayData = function ( t ) {
        if ( !t ) {
            throw new Error
        }
        if ( this._displayDataList.indexOf( t ) < 0 ) {
            this._displayDataList[this._displayDataList.length] = t
        }
        else {
            throw new Error
        }
    };
    e.prototype.getDisplayData = function ( t ) {
        var e = this._displayDataList.length;
        while ( e-- ) {
            if ( this._displayDataList[e].name == t ) {
                return this._displayDataList[e]
            }
        }
        return null
    };
    t.SlotData = e
})();
(function () {
    var t = dragonBones.use( "objects" );
    var e = t.DBTransform;

    function i() {
        this.length = 0;
        this.global = new e;
        this.transform = new e
    }

    i.prototype.dispose = function () {
        this.global = null;
        this.transform = null
    };
    t.BoneData = i
})();
(function () {
    var t = dragonBones.use( "objects" );

    function e() {
        this._slotDataList = []
    }

    e.prototype.getSlotDataList = function () {
        return this._slotDataList
    };
    e.prototype.dispose = function () {
        var t = this._slotDataList.length;
        while ( t-- ) {
            this._slotDataList[t].dispose()
        }
        this._slotDataList.length = 0;
        this._slotDataList = null
    };
    e.prototype.getSlotData = function ( t ) {
        var e = this._slotDataList.length;
        while ( e-- ) {
            if ( this._slotDataList[e].name == t ) {
                return this._slotDataList[e]
            }
        }
        return null
    };
    e.prototype.addSlotData = function ( t ) {
        if ( !t ) {
            throw new Error
        }
        if ( this._slotDataList.indexOf( t ) < 0 ) {
            this._slotDataList[this._slotDataList.length] = t
        }
        else {
            throw new Error
        }
    };
    t.SkinData = e
})();
(function () {
    var t = dragonBones.use( "objects" );

    function e() {
        this._boneDataList = [];
        this._skinDataList = [];
        this._animationDataList = []
    }

    e.prototype.getBoneDataList = function () {
        return this._boneDataList
    };
    e.prototype.getSkinDataList = function () {
        return this._skinDataList
    };
    e.prototype.getAnimationDataList = function () {
        return this._animationDataList
    };
    e.prototype.dispose = function () {
        var t = this._boneDataList.length;
        while ( t-- ) {
            this._boneDataList[t].dispose()
        }
        t = this._skinDataList.length;
        while ( t-- ) {
            this._skinDataList[t].dispose()
        }
        t = this._animationDataList.length;
        while ( t-- ) {
            this._animationDataList[t].dispose()
        }
        this._boneDataList.length = 0;
        this._skinDataList.length = 0;
        this._animationDataList.length = 0;
        this._boneDataList = null;
        this._skinDataList = null;
        this._animationDataList = null
    };
    e.prototype.getBoneData = function ( t ) {
        var e = this._boneDataList.length;
        while ( e-- ) {
            if ( this._boneDataList[e].name == t ) {
                return this._boneDataList[e]
            }
        }
        return null
    };
    e.prototype.getSkinData = function ( t ) {
        if ( !t ) {
            return this._skinDataList[0]
        }
        var e = this._skinDataList.length;
        while ( e-- ) {
            if ( this._skinDataList[e].name == t ) {
                return this._skinDataList[e]
            }
        }
        return null
    };
    e.prototype.getAnimationData = function ( t ) {
        var e = this._animationDataList.length;
        while ( e-- ) {
            if ( this._animationDataList[e].name == t ) {
                return this._animationDataList[e]
            }
        }
        return null
    };
    e.prototype.addBoneData = function ( t ) {
        if ( !t ) {
            throw new Error
        }
        if ( this._boneDataList.indexOf( t ) < 0 ) {
            this._boneDataList[this._boneDataList.length] = t
        }
        else {
            throw new Error
        }
    };
    e.prototype.addSkinData = function ( t ) {
        if ( !t ) {
            throw new Error
        }
        if ( this._skinDataList.indexOf( t ) < 0 ) {
            this._skinDataList[this._skinDataList.length] = t
        }
        else {
            throw new Error
        }
    };
    e.prototype.addAnimationData = function ( t ) {
        if ( !t ) {
            throw new Error
        }
        if ( this._animationDataList.indexOf( t ) < 0 ) {
            this._animationDataList[this._animationDataList.length] = t
        }
    };
    e.prototype.sortBoneDataList = function () {
        var t = this._boneDataList.length;
        if ( t == 0 ) {
            return
        }
        var e = [];
        while ( t-- ) {
            var i = this._boneDataList[t];
            var a = 0;
            var r = i;
            while ( r && r.parent ) {
                a++;
                r = this.getBoneData( r.parent )
            }
            e[t] = {level : a, boneData : i}
        }
        e.sort( this.sortBoneData );
        t = e.length;
        while ( t-- ) {
            this._boneDataList[t] = e[t].boneData
        }
    };
    e.prototype.sortBoneData = function ( t, e ) {
        return t.level > e.level ? 1 : -1
    };
    t.ArmatureData = e
})();
(function () {
    var t = dragonBones.use( "objects" );
    var e = dragonBones.use( "geom" );

    function i() {
        this._armatureDataList = [];
        this._subTexturePivots = {}
    }

    i.prototype.getArmatureNames = function () {
        var t = [];
        for ( var e in this._armatureDataList ) {
            t[t.length] = this._armatureDataList[e].name
        }
        return t
    };
    i.prototype.getArmatureDataList = function () {
        return this._armatureDataList
    };
    i.prototype.dispose = function () {
        for ( var t in this._armatureDataList ) {
            this._armatureDataList[t].dispose()
        }
        this._armatureDataList.length = 0;
        this._armatureDataList = null;
        this._subTexturePivots = null
    };
    i.prototype.getArmatureData = function ( t ) {
        var e = this._armatureDataList.length;
        while ( e-- ) {
            if ( this._armatureDataList[e].name == t ) {
                return this._armatureDataList[e]
            }
        }
        return null
    };
    i.prototype.addArmatureData = function ( t ) {
        if ( !t ) {
            throw new Error
        }
        if ( this._armatureDataList.indexOf( t ) < 0 ) {
            this._armatureDataList[this._armatureDataList.length] = t
        }
        else {
            throw new Error
        }
    };
    i.prototype.removeArmatureData = function ( t ) {
        var e = this._armatureDataList.indexOf( t );
        if ( e >= 0 ) {
            this._armatureDataList.splice( e, 1 )
        }
    };
    i.prototype.removeArmatureDataByName = function ( t ) {
        var e = this._armatureDataList.length;
        while ( e-- ) {
            if ( this._armatureDataList[e].name == t ) {
                this._armatureDataList.splice( e, 1 )
            }
        }
    };
    i.prototype.getSubTexturePivot = function ( t ) {
        return this._subTexturePivots[t]
    };
    i.prototype.addSubTexturePivot = function ( t, i, a ) {
        var r = this._subTexturePivots[a];
        if ( r ) {
            r.x = t;
            r.y = i
        }
        else {
            this._subTexturePivots[a] = r = new e.Point( t, i )
        }
        return r
    };
    i.prototype.removeSubTexturePivot = function ( t ) {
        if ( t ) {
            delete this._subTexturePivots[t]
        }
        else {
            for ( t in this._subTexturePivots ) {
                delete this._subTexturePivots[t]
            }
        }
    };
    t.SkeletonData = i
})();
(function () {
    var t = dragonBones.use( "objects" );
    var e = dragonBones.use( "utils" );
    var i = dragonBones.use( "geom" );
    var a = t.SkeletonData;
    var r = t.ArmatureData;
    var n = t.BoneData;
    var s = t.SkinData;
    var o = t.SlotData;
    var l = t.DisplayData;
    var h = t.AnimationData;
    var u = t.TransformTimeline;
    var f = t.TransformFrame;
    var c = t.Frame;

    function d() {
    }

    d.parseTextureAtlasData = function ( t, a ) {
        if ( typeof a === "undefined" ) {
            a = 1
        }
        if ( !t ) {
            throw new Error
        }
        var r = {};
        r.__name = t[e.ConstValues.A_NAME];
        var n = t[e.ConstValues.SUB_TEXTURE];
        for ( var s = 0, o = n.length; s < o; s++ ) {
            var l = n[s];
            var h = l[e.ConstValues.A_NAME];
            var u = new i.Rectangle( Number( l[e.ConstValues.A_X] ) / a, Number( l[e.ConstValues.A_Y] ) / a, Number( l[e.ConstValues.A_WIDTH] ) / a, Number( l[e.ConstValues.A_HEIGHT] ) / a );
            r[h] = u
        }
        return r
    };
    d.parseSkeletonData = function ( t ) {
        if ( !t ) {
            throw new Error
        }
        var i = Number( t[e.ConstValues.A_FRAME_RATE] );
        var r = new a;
        r.name = t[e.ConstValues.A_NAME];
        var n = t[e.ConstValues.ARMATURE];
        for ( var s = 0, o = n.length; s < o; s++ ) {
            var l = n[s];
            r.addArmatureData( d.parseArmatureData( l, r, i ) )
        }
        return r
    };
    d.parseArmatureData = function ( t, i, a ) {
        var n = new r;
        n.name = t[e.ConstValues.A_NAME];
        var s = t[e.ConstValues.BONE];
        for ( var o = 0, l = s.length; o < l; o++ ) {
            var h = s[o];
            n.addBoneData( d.parseBoneData( h ) )
        }
        var u = t[e.ConstValues.SKIN];
        for ( var o = 0, l = u.length; o < l; o++ ) {
            var f = u[o];
            n.addSkinData( d.parseSkinData( f, i ) )
        }
        e.DBDataUtil.transformArmatureData( n );
        n.sortBoneDataList();
        var c = t[e.ConstValues.ANIMATION];
        for ( var o = 0, l = c.length; o < l; o++ ) {
            var m = c[o];
            n.addAnimationData( d.parseAnimationData( m, n, a ) )
        }
        return n
    };
    d.parseBoneData = function ( t ) {
        var i = new n;
        i.name = t[e.ConstValues.A_NAME];
        i.parent = t[e.ConstValues.A_PARENT];
        i.length = Number( t[e.ConstValues.A_LENGTH] ) || 0;
        d.parseTransform( t[e.ConstValues.TRANSFORM], i.global );
        i.transform.copy( i.global );
        return i
    };
    d.parseSkinData = function ( t, i ) {
        var a = new s;
        a.name = t[e.ConstValues.A_NAME];
        var r = t[e.ConstValues.SLOT];
        for ( var n = 0, o = r.length; n < o; n++ ) {
            var l = r[n];
            a.addSlotData( d.parseSlotData( l, i ) )
        }
        return a
    };
    d.parseSlotData = function ( t, i ) {
        var a = new o;
        a.name = t[e.ConstValues.A_NAME];
        a.parent = t[e.ConstValues.A_PARENT];
        a.zOrder = Number( t[e.ConstValues.A_Z_ORDER] );
        var r = t[e.ConstValues.DISPLAY];
        for ( var n = 0, s = r.length; n < s; n++ ) {
            var l = r[n];
            a.addDisplayData( d.parseDisplayData( l, i ) )
        }
        return a
    };
    d.parseDisplayData = function ( t, i ) {
        var a = new l;
        a.name = t[e.ConstValues.A_NAME];
        a.type = t[e.ConstValues.A_TYPE];
        a.pivot = i.addSubTexturePivot( 0, 0, a.name );
        d.parseTransform( t[e.ConstValues.TRANSFORM], a.transform, a.pivot );
        return a
    };
    d.parseAnimationData = function ( t, i, a ) {
        var r = new h;
        r.name = t[e.ConstValues.A_NAME];
        r.frameRate = a;
        r.loop = Number( t[e.ConstValues.A_LOOP] ) || 0;
        r.fadeInTime = Number( t[e.ConstValues.A_FADE_IN_TIME] );
        r.duration = Number( t[e.ConstValues.A_DURATION] ) / a;
        r.scale = Number( t[e.ConstValues.A_SCALE] );
        if ( t.hasOwnProperty( e.ConstValues.A_TWEEN_EASING ) ) {
            var n = t[e.ConstValues.A_TWEEN_EASING];
            if ( n == undefined || n == null ) {
                r.tweenEasing = NaN
            }
            else {
                r.tweenEasing = Number( n )
            }
        }
        else {
            r.tweenEasing = NaN
        }
        d.parseTimeline( t, r, d.parseMainFrame, a );
        var s;
        var o;
        var l = t[e.ConstValues.TIMELINE];
        for ( var u = 0, f = l.length; u < f; u++ ) {
            var c = l[u];
            s = d.parseTransformTimeline( c, r.duration, a );
            o = c[e.ConstValues.A_NAME];
            r.addTimeline( s, o )
        }
        e.DBDataUtil.addHideTimeline( r, i );
        e.DBDataUtil.transformAnimationData( r, i );
        return r
    };
    d.parseTimeline = function ( t, i, a, r ) {
        var n = 0;
        var s;
        var o = t[e.ConstValues.FRAME] || [];
        for ( var l = 0, h = o.length; l < h; l++ ) {
            var u = o[l];
            s = a( u, r );
            s.position = n;
            i.addFrame( s );
            n += s.duration
        }
        if ( s ) {
            s.duration = i.duration - s.position
        }
    };
    d.parseTransformTimeline = function ( t, i, a ) {
        var r = new u;
        r.duration = i;
        d.parseTimeline( t, r, d.parseTransformFrame, a );
        r.scale = Number( t[e.ConstValues.A_SCALE] );
        r.offset = Number( t[e.ConstValues.A_OFFSET] );
        return r
    };
    d.parseFrame = function ( t, i, a ) {
        i.duration = Number( t[e.ConstValues.A_DURATION] ) / a;
        i.action = t[e.ConstValues.A_ACTION];
        i.event = t[e.ConstValues.A_EVENT];
        i.sound = t[e.ConstValues.A_SOUND]
    };
    d.parseMainFrame = function ( t, e ) {
        var i = new c;
        d.parseFrame( t, i, e );
        return i
    };
    d.parseTransformFrame = function ( t, a ) {
        var r = new f;
        d.parseFrame( t, r, a );
        r.visible = Number( t[e.ConstValues.A_HIDE] ) != 1;
        if ( t.hasOwnProperty( e.ConstValues.A_TWEEN_EASING ) ) {
            var n = t[e.ConstValues.A_TWEEN_EASING];
            if ( n == undefined || n == null ) {
                r.tweenEasing = NaN
            }
            else {
                r.tweenEasing = Number( n )
            }
        }
        else {
            r.tweenEasing = 0
        }
        r.tweenRotate = Number( t[e.ConstValues.A_TWEEN_ROTATE] ) || 0;
        r.displayIndex = Number( t[e.ConstValues.A_DISPLAY_INDEX] ) || 0;
        r.zOrder = Number( t[e.ConstValues.A_Z_ORDER] ) || 0;
        d.parseTransform( t[e.ConstValues.TRANSFORM], r.global, r.pivot );
        r.transform.copy( r.global );
        var s = t[e.ConstValues.COLOR_TRANSFORM];
        if ( s ) {
            r.color = new i.ColorTransform;
            r.color.alphaOffset = Number( s[e.ConstValues.A_ALPHA_OFFSET] );
            r.color.redOffset = Number( s[e.ConstValues.A_RED_OFFSET] );
            r.color.greenOffset = Number( s[e.ConstValues.A_GREEN_OFFSET] );
            r.color.blueOffset = Number( s[e.ConstValues.A_BLUE_OFFSET] );
            r.color.alphaMultiplier = Number( s[e.ConstValues.A_ALPHA_MULTIPLIER] ) * .01;
            r.color.redMultiplier = Number( s[e.ConstValues.A_RED_MULTIPLIER] ) * .01;
            r.color.greenMultiplier = Number( s[e.ConstValues.A_GREEN_MULTIPLIER] ) * .01;
            r.color.blueMultiplier = Number( s[e.ConstValues.A_BLUE_MULTIPLIER] ) * .01
        }
        return r
    };
    d.parseTransform = function ( t, i, a ) {
        if ( typeof a === "undefined" ) {
            a = null
        }
        if ( t ) {
            if ( i ) {
                i.x = Number( t[e.ConstValues.A_X] );
                i.y = Number( t[e.ConstValues.A_Y] );
                i.skewX = Number( t[e.ConstValues.A_SKEW_X] ) * e.ConstValues.ANGLE_TO_RADIAN;
                i.skewY = Number( t[e.ConstValues.A_SKEW_Y] ) * e.ConstValues.ANGLE_TO_RADIAN;
                i.scaleX = Number( t[e.ConstValues.A_SCALE_X] );
                i.scaleY = Number( t[e.ConstValues.A_SCALE_Y] )
            }
            if ( a ) {
                a.x = Number( t[e.ConstValues.A_PIVOT_X] );
                a.y = Number( t[e.ConstValues.A_PIVOT_Y] )
            }
        }
    };
    t.DataParser = d
})();
(function () {
    var t = dragonBones.use( "factorys" );
    var e = dragonBones.use( "objects" );

    function i() {
        i.superclass.constructor.call( this );
        this._dataDic = {};
        this._textureAtlasDic = {};
        this._textureAtlasLoadingDic = {}
    }

    dragonBones.extend( i, dragonBones.events.EventDispatcher );
    i.prototype.getSkeletonData = function ( t ) {
        return this._dataDic[t]
    };
    i.prototype.addSkeletonData = function ( t, e ) {
        if ( !t ) {
            throw new Error
        }
        e = e || t.name;
        if ( !e ) {
            throw new Error( "Unnamed data!" )
        }
        if ( this._dataDic[e] ) {
        }
        this._dataDic[e] = t
    };
    i.prototype.removeSkeletonData = function ( t ) {
        delete this._dataDic[t]
    };
    i.prototype.getTextureAtlas = function ( t ) {
        return this._textureAtlasDic[t]
    };
    i.prototype.addTextureAtlas = function ( t, e ) {
        if ( !t ) {
            throw new Error
        }
        e = e || t.name;
        if ( !e ) {
            throw new Error( "Unnamed data!" )
        }
        if ( this._textureAtlasDic[e] ) {
        }
        this._textureAtlasDic[e] = t
    };
    i.prototype.removeTextureAtlas = function ( t ) {
        delete this._textureAtlasDic[t]
    };
    i.prototype.dispose = function ( t ) {
        if ( typeof t === "undefined" ) {
            t = true
        }
        if ( t ) {
            for ( var e in this._dataDic ) {
                this._dataDic[e].dispose()
            }
            for ( var e in this._textureAtlasDic ) {
                this._textureAtlasDic[e].dispose()
            }
        }
        this._dataDic = null;
        this._textureAtlasDic = null;
        this._textureAtlasLoadingDic = null;
        this._currentDataName = null;
        this._currentTextureAtlasName = null
    };
    i.prototype.buildArmature = function ( t, i, a, r, n ) {
        if ( a ) {
            var s = this._dataDic[a];
            if ( s ) {
                var o = s.getArmatureData( t )
            }
        }
        else {
            for ( a in this._dataDic ) {
                s = this._dataDic[a];
                o = s.getArmatureData( t );
                if ( o ) {
                    break
                }
            }
        }
        if ( !o ) {
            return null
        }
        this._currentDataName = a;
        this._currentTextureAtlasName = r || a;
        var l = this._generateArmature();
        l.name = t;
        var h;
        var u;
        var f = o.getBoneDataList();
        for ( var c = 0, d = f.length; c < d; c++ ) {
            u = f[c];
            h = new dragonBones.Bone;
            h.name = u.name;
            h.origin.copy( u.transform );
            if ( o.getBoneData( u.parent ) ) {
                l.addChild( h, u.parent )
            }
            else {
                l.addChild( h, null )
            }
        }
        if ( i && i != t ) {
            var m = s.getArmatureData( i );
            if ( !m ) {
                for ( a in this._dataDic ) {
                    s = this._dataDic[a];
                    m = s.getArmatureData( i );
                    if ( m ) {
                        break
                    }
                }
            }
        }
        if ( m ) {
            l.animation.setAnimationDataList( m.getAnimationDataList() )
        }
        else {
            l.animation.setAnimationDataList( o.getAnimationDataList() )
        }
        var p = o.getSkinData( n );
        if ( !p ) {
            throw new Error
        }
        var _;
        var v;
        var g;
        var y;
        var w = [];
        var b;
        var A = p.getSlotDataList();
        var E;
        for ( var c = 0, d = A.length; c < d; c++ ) {
            b = A[c];
            h = l.getBone( b.parent );
            if ( !h ) {
                continue
            }
            E = b.getDisplayDataList();
            _ = this._generateSlot();
            _.name = b.name;
            _._originZOrder = b.zOrder;
            _._dislayDataList = E;
            w.length = 0;
            y = E.length;
            while ( y-- ) {
                v = E[y];
                switch ( v.type ) {
                    case e.DisplayData.ARMATURE:
                        g = this.buildArmature( v.name, null, this._currentDataName, this._currentTextureAtlasName, null );
                        if ( g ) {
                            w[y] = g
                        }
                        break;
                    case e.DisplayData.IMAGE:
                    default:
                        w[y] = this._generateDisplay( this._textureAtlasDic[this._currentTextureAtlasName], v.name, v.pivot.x, v.pivot.y );
                        break
                }
            }
            _.setDisplayList( w );
            _._changeDisplay( 0 );
            h.addChild( _ )
        }
        l._slotsZOrderChanged = true;
        l.advanceTime( 0 );
        return l
    };
    i.prototype.getTextureDisplay = function ( t, e, i, a ) {
        if ( e ) {
            var r = this._textureAtlasDic[e]
        }
        if ( !r && !e ) {
            for ( e in this._textureAtlasDic ) {
                r = this._textureAtlasDic[e];
                if ( r.getRegion( t ) ) {
                    break
                }
                r = null
            }
        }
        if ( r ) {
            if ( isNaN( i ) || isNaN( a ) ) {
                var n = this._dataDic[e];
                if ( n ) {
                    var s = n.getSubTexturePivot( t );
                    if ( s ) {
                        i = s.x;
                        a = s.y
                    }
                }
            }
            return this._generateDisplay( r, t, i, a )
        }
        return null
    };
    i.prototype._generateArmature = function () {
        return null
    };
    i.prototype._generateSlot = function () {
        return null
    };
    i.prototype._generateDisplay = function ( t, e, i, a ) {
        return null
    };
    t.BaseFactory = i
})();
(function () {
    var t = dragonBones.use( "utils" );

    function e() {
    }

    e.ANGLE_TO_RADIAN = Math.PI / 180;
    e.DRAGON_BONES = "dragonBones";
    e.ARMATURE = "armature";
    e.SKIN = "skin";
    e.BONE = "bone";
    e.SLOT = "slot";
    e.DISPLAY = "display";
    e.ANIMATION = "animation";
    e.TIMELINE = "timeline";
    e.FRAME = "frame";
    e.TRANSFORM = "transform";
    e.COLOR_TRANSFORM = "colorTransform";
    e.TEXTURE_ATLAS = "TextureAtlas";
    e.SUB_TEXTURE = "SubTexture";
    e.A_VERSION = "version";
    e.A_IMAGE_PATH = "imagePath";
    e.A_FRAME_RATE = "frameRate";
    e.A_NAME = "name";
    e.A_PARENT = "parent";
    e.A_LENGTH = "length";
    e.A_TYPE = "type";
    e.A_FADE_IN_TIME = "fadeInTime";
    e.A_DURATION = "duration";
    e.A_SCALE = "scale";
    e.A_OFFSET = "offset";
    e.A_LOOP = "loop";
    e.A_EVENT = "event";
    e.A_SOUND = "sound";
    e.A_ACTION = "action";
    e.A_HIDE = "hide";
    e.A_TWEEN_EASING = "tweenEasing";
    e.A_TWEEN_ROTATE = "tweenRotate";
    e.A_DISPLAY_INDEX = "displayIndex";
    e.A_Z_ORDER = "z";
    e.A_WIDTH = "width";
    e.A_HEIGHT = "height";
    e.A_X = "x";
    e.A_Y = "y";
    e.A_SKEW_X = "skX";
    e.A_SKEW_Y = "skY";
    e.A_SCALE_X = "scX";
    e.A_SCALE_Y = "scY";
    e.A_PIVOT_X = "pX";
    e.A_PIVOT_Y = "pY";
    e.A_ALPHA_OFFSET = "aO";
    e.A_RED_OFFSET = "rO";
    e.A_GREEN_OFFSET = "gO";
    e.A_BLUE_OFFSET = "bO";
    e.A_ALPHA_MULTIPLIER = "aM";
    e.A_RED_MULTIPLIER = "rM";
    e.A_GREEN_MULTIPLIER = "gM";
    e.A_BLUE_MULTIPLIER = "bM";
    t.ConstValues = e
})();
(function () {
    var t = dragonBones.use( "utils" );
    var e = dragonBones.use( "geom" );

    function i() {
    }

    i.transformPointWithParent = function ( t, e ) {
        var a = i._helpMatrix;
        i.transformToMatrix( e, a );
        a.invert();
        var r = t.x;
        var n = t.y;
        t.x = a.a * r + a.c * n + a.tx;
        t.y = a.d * n + a.b * r + a.ty;
        t.skewX = i.formatRadian( t.skewX - e.skewX );
        t.skewY = i.formatRadian( t.skewY - e.skewY )
    };
    i.transformToMatrix = function ( t, e ) {
        e.a = t.scaleX * Math.cos( t.skewY );
        e.b = t.scaleX * Math.sin( t.skewY );
        e.c = -t.scaleY * Math.sin( t.skewX );
        e.d = t.scaleY * Math.cos( t.skewX );
        e.tx = t.x;
        e.ty = t.y
    };
    i.formatRadian = function ( t ) {
        t %= i.DOUBLE_PI;
        if ( t > Math.PI ) {
            t -= i.DOUBLE_PI
        }
        if ( t < -Math.PI ) {
            t += i.DOUBLE_PI
        }
        return t
    };
    i.DOUBLE_PI = Math.PI * 2;
    i._helpMatrix = new e.Matrix;
    t.TransformUtil = i
})();
(function () {
    var t = dragonBones.use( "utils" );
    var e = dragonBones.use( "objects" );
    var i = t.TransformUtil;

    function a() {
    }

    a.transformArmatureData = function ( t ) {
        var e = t.getBoneDataList();
        var a = e.length;
        var r;
        var n;
        while ( a-- ) {
            r = e[a];
            if ( r.parent ) {
                n = t.getBoneData( r.parent );
                if ( n ) {
                    r.transform.copy( r.global );
                    i.transformPointWithParent( r.transform, n.global )
                }
            }
        }
    };
    a.transformArmatureDataAnimations = function ( t ) {
        var e = t.getAnimationDataList();
        var i = e.length;
        while ( i-- ) {
            a.transformAnimationData( e[i], t )
        }
    };
    a.transformAnimationData = function ( t, e ) {
        var r = e.getSkinData( null );
        var n = e.getBoneDataList();
        var s = r.getSlotDataList();
        var o = n.length;
        var l;
        var h;
        var u;
        var f;
        var c;
        var d;
        var m;
        var p;
        var _;
        var v;
        var g;
        while ( o-- ) {
            l = n[o];
            h = t.getTimeline( l.name );
            if ( !h ) {
                continue
            }
            u = null;
            for ( var y in s ) {
                u = s[y];
                if ( u.parent == l.name ) {
                    break
                }
            }
            c = l.parent ? t.getTimeline( l.parent ) : null;
            d = h.getFrameList();
            m = null;
            p = null;
            _ = null;
            g = d.length;
            for ( var w = 0; w < g; w++ ) {
                v = d[w];
                if ( c ) {
                    a._helpTransform1.copy( v.global );
                    a.getTimelineTransform( c, v.position, a._helpTransform2 );
                    i.transformPointWithParent( a._helpTransform1, a._helpTransform2 );
                    v.transform.copy( a._helpTransform1 )
                }
                else {
                    v.transform.copy( v.global )
                }
                v.transform.x -= l.transform.x;
                v.transform.y -= l.transform.y;
                v.transform.skewX -= l.transform.skewX;
                v.transform.skewY -= l.transform.skewY;
                v.transform.scaleX -= l.transform.scaleX;
                v.transform.scaleY -= l.transform.scaleY;
                if ( !h.transformed ) {
                    if ( u ) {
                        v.zOrder -= u.zOrder
                    }
                }
                if ( !m ) {
                    m = h.originTransform;
                    m.copy( v.transform );
                    m.skewX = i.formatRadian( m.skewX );
                    m.skewY = i.formatRadian( m.skewY );
                    p = h.originPivot;
                    p.x = v.pivot.x;
                    p.y = v.pivot.y
                }
                v.transform.x -= m.x;
                v.transform.y -= m.y;
                v.transform.skewX = i.formatRadian( v.transform.skewX - m.skewX );
                v.transform.skewY = i.formatRadian( v.transform.skewY - m.skewY );
                v.transform.scaleX -= m.scaleX;
                v.transform.scaleY -= m.scaleY;
                if ( !h.transformed ) {
                    v.pivot.x -= p.x;
                    v.pivot.y -= p.y
                }
                if ( _ ) {
                    var b = v.transform.skewX - _.transform.skewX;
                    if ( _.tweenRotate ) {
                        if ( _.tweenRotate > 0 ) {
                            if ( b < 0 ) {
                                v.transform.skewX += Math.PI * 2;
                                v.transform.skewY += Math.PI * 2
                            }
                            if ( _.tweenRotate > 1 ) {
                                v.transform.skewX += Math.PI * 2 * (_.tweenRotate - 1);
                                v.transform.skewY += Math.PI * 2 * (_.tweenRotate - 1)
                            }
                        }
                        else {
                            if ( b > 0 ) {
                                v.transform.skewX -= Math.PI * 2;
                                v.transform.skewY -= Math.PI * 2
                            }
                            if ( _.tweenRotate < 1 ) {
                                v.transform.skewX += Math.PI * 2 * (_.tweenRotate + 1);
                                v.transform.skewY += Math.PI * 2 * (_.tweenRotate + 1)
                            }
                        }
                    }
                    else {
                        v.transform.skewX = _.transform.skewX + i.formatRadian( v.transform.skewX - _.transform.skewX );
                        v.transform.skewY = _.transform.skewY + i.formatRadian( v.transform.skewY - _.transform.skewY )
                    }
                }
                _ = v
            }
            h.transformed = true
        }
    };
    a.getTimelineTransform = function ( t, e, a ) {
        var r = t.getFrameList();
        var n = r.length;
        var s;
        var o;
        var l;
        var h;
        while ( n-- ) {
            s = r[n];
            if ( s.position <= e && s.position + s.duration > e ) {
                o = s.tweenEasing;
                if ( n == r.length - 1 || isNaN( o ) || e == s.position ) {
                    a.copy( s.global )
                }
                else {
                    l = (e - s.position) / s.duration;
                    if ( o ) {
                        l = animation.TimelineState.getEaseValue( l, o )
                    }
                    h = r[n + 1];
                    a.x = s.global.x + (h.global.x - s.global.x) * l;
                    a.y = s.global.y + (h.global.y - s.global.y) * l;
                    a.skewX = i.formatRadian( s.global.skewX + (h.global.skewX - s.global.skewX) * l );
                    a.skewY = i.formatRadian( s.global.skewY + (h.global.skewY - s.global.skewY) * l );
                    a.scaleX = s.global.scaleX + (h.global.scaleX - s.global.scaleX) * l;
                    a.scaleY = s.global.scaleY + (h.global.scaleY - s.global.scaleY) * l
                }
                break
            }
        }
    };
    a.addHideTimeline = function ( t, i ) {
        var a = i.getBoneDataList();
        var r = a.length;
        var n;
        var s;
        while ( r-- ) {
            n = a[r];
            s = n.name;
            if ( !t.getTimeline( s ) ) {
                t.addTimeline( e.TransformTimeline.HIDE_TIMELINE, s )
            }
        }
    };
    a._helpTransform1 = new e.DBTransform;
    a._helpTransform2 = new e.DBTransform;
    t.DBDataUtil = a
})();
(function () {
    var t = dragonBones.use( "objects" );
    var e = dragonBones.use( "geom" );

    function i() {
        this.global = new t.DBTransform;
        this.origin = new t.DBTransform;
        this.offset = new t.DBTransform;
        this.tween = new t.DBTransform;
        this.tween.scaleX = this.tween.scaleY = 0;
        this._globalTransformMatrix = new e.Matrix;
        this._visible = true;
        this._isColorChanged = false;
        this._isDisplayOnStage = false;
        this._scaleType = 0;
        this.fixedRotation = false
    }

    i.prototype.getVisible = function () {
        return this._visible
    };
    i.prototype.setVisible = function ( t ) {
        this._visible = t
    };
    i.prototype._setParent = function ( t ) {
        this.parent = t
    };
    i.prototype._setArmature = function ( t ) {
        if ( this.armature ) {
            this.armature._removeDBObject( this )
        }
        this.armature = t;
        if ( this.armature ) {
            this.armature._addDBObject( this )
        }
    };
    i.prototype.dispose = function () {
        this.parent = null;
        this.armature = null;
        this.global = null;
        this.origin = null;
        this.offset = null;
        this.tween = null;
        this._globalTransformMatrix = null
    };
    i.prototype._update = function () {
        this.global.scaleX = (this.origin.scaleX + this.tween.scaleX) * this.offset.scaleX;
        this.global.scaleY = (this.origin.scaleY + this.tween.scaleY) * this.offset.scaleY;
        if ( this.parent ) {
            var t = this.origin.x + this.offset.x + this.tween.x;
            var e = this.origin.y + this.offset.y + this.tween.y;
            var i = this.parent._globalTransformMatrix;
            this._globalTransformMatrix.tx = this.global.x = i.a * t + i.c * e + i.tx;
            this._globalTransformMatrix.ty = this.global.y = i.d * e + i.b * t + i.ty;
            if ( this.fixedRotation ) {
                this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX;
                this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY
            }
            else {
                this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX + this.parent.global.skewX;
                this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY + this.parent.global.skewY
            }
            if ( this.parent.scaleMode >= this._scaleType ) {
                this.global.scaleX *= this.parent.global.scaleX;
                this.global.scaleY *= this.parent.global.scaleY
            }
        }
        else {
            this._globalTransformMatrix.tx = this.global.x = this.origin.x + this.offset.x + this.tween.x;
            this._globalTransformMatrix.ty = this.global.y = this.origin.y + this.offset.y + this.tween.y;
            this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX;
            this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY
        }
        this._globalTransformMatrix.a = this.global.scaleX * Math.cos( this.global.skewY );
        this._globalTransformMatrix.b = this.global.scaleX * Math.sin( this.global.skewY );
        this._globalTransformMatrix.c = -this.global.scaleY * Math.sin( this.global.skewX );
        this._globalTransformMatrix.d = this.global.scaleY * Math.cos( this.global.skewX )
    };
    dragonBones.DBObject = i
})();
(function () {
    function t( e ) {
        t.superclass.constructor.call( this );
        this._displayBridge = e;
        this._displayList = [];
        this._displayIndex = -1;
        this._scaleType = 1;
        this._originZOrder = 0;
        this._tweenZorder = 0;
        this._offsetZOrder = 0;
        this._isDisplayOnStage = false;
        this._isHideDisplay = false
    }

    dragonBones.extend( t, dragonBones.DBObject );
    t.prototype.getZOrder = function () {
        return this._originZOrder + this._tweenZorder + this._offsetZOrder
    };
    t.prototype.setZOrder = function ( t ) {
        if ( this.getZOrder() != t ) {
            this._offsetZOrder = t - this._originZOrder - this._tweenZorder;
            if ( this.armature ) {
                this.armature._slotsZOrderChanged = true
            }
        }
    };
    t.prototype.getDisplay = function () {
        var t = this._displayList[this._displayIndex];
        if ( t instanceof dragonBones.Armature ) {
            return t.getDisplay()
        }
        return t
    };
    t.prototype.setDisplay = function ( t ) {
        this._displayList[this._displayIndex] = t;
        this._setDisplay( t )
    };
    t.prototype.getChildArmature = function () {
        var t = this._displayList[this._displayIndex];
        if ( t instanceof dragonBones.Armature ) {
            return t
        }
        return null
    };
    t.prototype.setChildArmature = function ( t ) {
        this._displayList[this._displayIndex] = t;
        if ( t ) {
            this._setDisplay( t.getDisplay() )
        }
    };
    t.prototype.getDisplayList = function () {
        return this._displayList
    };
    t.prototype.setDisplayList = function ( t ) {
        if ( !t ) {
            throw new Error
        }
        var e = this._displayList.length = t.length;
        while ( e-- ) {
            this._displayList[e] = t[e]
        }
        if ( this._displayIndex >= 0 ) {
            var i = this._displayIndex;
            this._displayIndex = -1;
            this._changeDisplay( i )
        }
    };
    t.prototype._setDisplay = function ( t ) {
        if ( this._displayBridge.getDisplay() ) {
            this._displayBridge.setDisplay( t )
        }
        else {
            this._displayBridge.setDisplay( t );
            if ( this.armature ) {
                this._displayBridge.addDisplay( this.armature.getDisplay(), -1 );
                this.armature._slotsZOrderChanged = true
            }
        }
        this.updateChildArmatureAnimation();
        if ( !this._isHideDisplay && this._displayBridge.getDisplay() ) {
            this._isDisplayOnStage = true
        }
        else {
            this._isDisplayOnStage = false
        }
    };
    t.prototype._changeDisplay = function ( t ) {
        if ( t < 0 ) {
            if ( !this._isHideDisplay ) {
                this._isHideDisplay = true;
                this._displayBridge.removeDisplay();
                this.updateChildArmatureAnimation()
            }
        }
        else {
            if ( this._isHideDisplay ) {
                this._isHideDisplay = false;
                var e = true;
                if ( this.armature ) {
                    this._displayBridge.addDisplay( this.armature.getDisplay(), -1 );
                    this.armature._slotsZOrderChanged = true
                }
            }
            var i = this._displayList.length;
            if ( t >= i && i > 0 ) {
                t = i - 1
            }
            if ( this._displayIndex != t ) {
                this._displayIndex = t;
                var a = this._displayList[this._displayIndex];
                if ( a instanceof dragonBones.Armature ) {
                    this._setDisplay( a.getDisplay() )
                }
                else {
                    this._setDisplay( a )
                }
                if ( this._dislayDataList && this._displayIndex < this._dislayDataList.length ) {
                    this.origin.copy( this._dislayDataList[this._displayIndex].transform )
                }
            }
            else if ( e ) {
                this.updateChildArmatureAnimation()
            }
        }
        if ( !this._isHideDisplay && this._displayBridge.getDisplay() ) {
            this._isDisplayOnStage = true
        }
        else {
            this._isDisplayOnStage = false
        }
    };
    t.prototype.setVisible = function ( t ) {
        if ( t != this._visible ) {
            this._visible = t;
            this._updateVisible( this._visible )
        }
    };
    t.prototype._setArmature = function ( e ) {
        t.superclass._setArmature.call( this, e );
        if ( this.armature ) {
            this.armature._slotsZOrderChanged = true;
            this._displayBridge.addDisplay( this.armature.getDisplay(), -1 )
        }
        else {
            this._displayBridge.removeDisplay()
        }
    };
    t.prototype.dispose = function () {
        if ( !this._displayBridge ) {
            return
        }
        t.superclass.dispose.call( this );
        this._displayBridge.dispose();
        this._displayList.length = 0;
        this._displayBridge = null;
        this._displayList = null;
        this._dislayDataList = null
    };
    t.prototype._update = function () {
        t.superclass._update.call( this );
        if ( this._isDisplayOnStage ) {
            var e = this.parent._tweenPivot.x;
            var i = this.parent._tweenPivot.y;
            if ( e || i ) {
                var a = this.parent._globalTransformMatrix;
                this._globalTransformMatrix.tx += a.a * e + a.c * i;
                this._globalTransformMatrix.ty += a.b * e + a.d * i
            }
            this._displayBridge.updateTransform( this._globalTransformMatrix, this.global )
        }
    };
    t.prototype._updateVisible = function ( t ) {
        this._displayBridge.setVisible( this.parent.getVisible() && this._visible && t )
    };
    t.prototype.updateChildArmatureAnimation = function () {
        var t = this.getChildArmature();
        if ( t ) {
            if ( this._isHideDisplay ) {
                t.animation.stop();
                t.animation._lastAnimationState = null
            }
            else {
                var e = this.armature ? this.armature.animation.getLastAnimationName() : null;
                if ( e && t.animation.hasAnimation( e ) ) {
                    t.animation.gotoAndPlay( e )
                }
                else {
                    t.animation.play()
                }
            }
        }
    };
    dragonBones.Slot = t
})();
(function () {
    var t = dragonBones.use( "geom" );
    var e = dragonBones.use( "events" );
    var i = dragonBones.Slot;

    function a() {
        a.superclass.constructor.call( this );
        this._children = [];
        this._scaleType = 2;
        this._tweenPivot = new t.Point;
        this.scaleMode = 1
    }

    dragonBones.extend( a, dragonBones.DBObject );
    a.prototype.setVisible = function ( t ) {
        if ( this._visible != t ) {
            this._visible = t;
            var e = this._children.length;
            while ( e-- ) {
                var a = this._children[e];
                if ( a instanceof i ) {
                    a._updateVisible( this._visible )
                }
            }
        }
    };
    a.prototype._setArmature = function ( t ) {
        a.superclass._setArmature.call( this, t );
        var e = this._children.length;
        while ( e-- ) {
            this._children[e]._setArmature( this.armature )
        }
    };
    a.prototype.dispose = function () {
        if ( !this._children ) {
            return
        }
        a.superclass.dispose.call( this );
        var t = this._children.length;
        while ( t-- ) {
            this._children[t].dispose()
        }
        this._children.length = 0;
        this._children = null;
        this._tweenPivot = null;
        this.slot = null
    };
    a.prototype.contains = function ( t ) {
        if ( !t ) {
            throw new Error
        }
        if ( t == this ) {
            return false
        }
        var e = t;
        while ( !(e == this || e == null) ) {
            e = e.parent
        }
        return e == this
    };
    a.prototype.addChild = function ( t ) {
        if ( !t ) {
            throw new Error
        }
        if ( t == this || t instanceof a && t.contains( this ) ) {
            throw new Error( "An Bone cannot be added as a child to itself or one of its children (or children's children, etc.)" )
        }
        if ( t.parent ) {
            t.parent.removeChild( t )
        }
        this._children[this._children.length] = t;
        t._setParent( this );
        t._setArmature( this.armature );
        if ( !this.slot && t instanceof i ) {
            this.slot = t
        }
    };
    a.prototype.removeChild = function ( t ) {
        if ( !t ) {
            throw new Error
        }
        var e = this._children.indexOf( t );
        if ( e >= 0 ) {
            this._children.splice( e, 1 );
            t._setParent( null );
            t._setArmature( null );
            if ( t == this.slot ) {
                this.slot = null
            }
        }
        else {
            throw new Error
        }
    };
    a.prototype.getSlots = function () {
        var t = [];
        var e = this._children.length;
        while ( e-- ) {
            if ( this._children[e]instanceof i ) {
                t.unshift( this._children[e] )
            }
        }
        return t
    };
    a.prototype._arriveAtFrame = function ( t, r, n, s ) {
        if ( t ) {
            var o = n.getMixingTransform( name );
            if ( n.displayControl && (o == 2 || o == -1) ) {
                if ( !this.displayController || this.displayController == n.name ) {
                    var l = t;
                    if ( this.slot ) {
                        var h = l.displayIndex;
                        if ( h >= 0 ) {
                            if ( !isNaN( l.zOrder ) && l.zOrder != this.slot._tweenZorder ) {
                                this.slot._tweenZorder = l.zOrder;
                                this.armature._slotsZOrderChanged = true
                            }
                        }
                        this.slot._changeDisplay( h );
                        this.slot._updateVisible( l.visible )
                    }
                }
            }
            if ( t.event && this.armature.hasEventListener( e.FrameEvent.BONE_FRAME_EVENT ) ) {
                var u = new e.FrameEvent( e.FrameEvent.BONE_FRAME_EVENT );
                u.bone = this;
                u.animationState = n;
                u.frameLabel = t.event;
                this.armature._eventList.push( u )
            }
            if ( t.sound && a._soundManager.hasEventListener( e.SoundEvent.SOUND ) ) {
                var f = new e.SoundEvent( e.SoundEvent.SOUND );
                f.armature = this.armature;
                f.animationState = n;
                f.sound = t.sound;
                a._soundManager.dispatchEvent( f )
            }
            if ( t.action ) {
                for ( var c = 0, d = this._children.length; c < d; c++ ) {
                    if ( this._children[c]instanceof i ) {
                        var m = this._children[c].getChildArmature();
                        if ( m ) {
                            m.animation.gotoAndPlay( t.action )
                        }
                    }
                }
            }
        }
        else {
            if ( this.slot ) {
                this.slot._changeDisplay( -1 )
            }
        }
    };
    a.prototype._updateColor = function ( t, e, i, a, r, n, s, o, l ) {
        if ( l || this._isColorChanged ) {
            this.slot._displayBridge.updateColor( t, e, i, a, r, n, s, o )
        }
        this._isColorChanged = l
    };
    a._soundManager = e.SoundEventManager.getInstance();
    dragonBones.Bone = a
})();
(function () {
    var t = dragonBones.use( "animation" );
    var e = dragonBones.use( "events" );
    var i = dragonBones.Slot;
    var a = dragonBones.Bone;

    function r( e ) {
        r.superclass.constructor.call( this );
        this.animation = new t.Animation( this );
        this._display = e;
        this._slotsZOrderChanged = false;
        this._slotList = [];
        this._boneList = [];
        this._eventList = []
    }

    dragonBones.extend( r, e.EventDispatcher );
    r.prototype.getDisplay = function () {
        return this._display
    };
    r.prototype.dispose = function () {
        if ( !this.animation ) {
            return
        }
        this.animation.dispose();
        var t = this._slotList.length;
        while ( t-- ) {
            this._slotList[t].dispose()
        }
        t = this._boneList.length;
        while ( t-- ) {
            this._boneList[t].dispose()
        }
        this._slotList.length = 0;
        this._boneList.length = 0;
        this._eventList.length = 0;
        this._slotList = null;
        this._boneList = null;
        this._eventList = null;
        this._display = null;
        this.animation = null
    };
    r.prototype.advanceTime = function ( t ) {
        this.animation.advanceTime( t );
        t *= this.animation.timeScale;
        var i = this._boneList.length;
        while ( i-- ) {
            this._boneList[i]._update()
        }
        i = this._slotList.length;
        var a;
        while ( i-- ) {
            a = this._slotList[i];
            a._update();
            if ( a._isDisplayOnStage ) {
                var r = a.getChildArmature();
                if ( r ) {
                    r.advanceTime( t )
                }
            }
        }
        if ( this._slotsZOrderChanged ) {
            this.updateSlotsZOrder();
            if ( this.hasEventListener( e.ArmatureEvent.Z_ORDER_UPDATED ) ) {
                this.dispatchEvent( new e.ArmatureEvent( e.ArmatureEvent.Z_ORDER_UPDATED ) )
            }
        }
        if ( this._eventList.length ) {
            var n = this._eventList.length;
            for ( i = 0; i < n; i++ ) {
                this.dispatchEvent( this._eventList[i] )
            }
            this._eventList.length = 0
        }
    };
    r.prototype.getSlots = function ( t ) {
        if ( typeof t === "undefined" ) {
            t = true
        }
        return t ? this._slotList.concat() : this._slotList
    };
    r.prototype.getBones = function ( t ) {
        if ( typeof t === "undefined" ) {
            t = true
        }
        return t ? this._boneList.concat() : this._boneList
    };
    r.prototype.getSlot = function ( t ) {
        var e = this._slotList.length;
        while ( e-- ) {
            if ( this._slotList[e].name == t ) {
                return this._slotList[e]
            }
        }
        return null
    };
    r.prototype.getSlotByDisplay = function ( t ) {
        if ( t ) {
            var e = this._slotList.length;
            while ( e-- ) {
                if ( this._slotList[e].getDisplay() == t ) {
                    return this._slotList[e]
                }
            }
        }
        return null
    };
    r.prototype.removeSlot = function ( t ) {
        if ( !t ) {
            throw new Error
        }
        if ( this._slotList.indexOf( t ) >= 0 ) {
            t.parent.removeChild( t )
        }
        else {
            throw new Error
        }
    };
    r.prototype.removeSlotByName = function ( t ) {
        if ( !t ) {
            return
        }
        var e = this.getSlot( t );
        if ( e ) {
            this.removeSlot( e )
        }
    };
    r.prototype.getBone = function ( t ) {
        var e = this._boneList.length;
        while ( e-- ) {
            if ( this._boneList[e].name == t ) {
                return this._boneList[e]
            }
        }
        return null
    };
    r.prototype.getBoneByDisplay = function ( t ) {
        var e = this.getSlotByDisplay( t );
        return e ? e.parent : null
    };
    r.prototype.removeBone = function ( t ) {
        if ( !t ) {
            throw new Error
        }
        if ( this._boneList.indexOf( t ) >= 0 ) {
            if ( t.parent ) {
                t.parent.removeChild( t )
            }
            else {
                t._setArmature( null )
            }
        }
        else {
            throw new Error
        }
    };
    r.prototype.removeBoneByName = function ( t ) {
        if ( !t ) {
            return
        }
        var e = this.getBone( t );
        if ( e ) {
            this.removeBone( e )
        }
    };
    r.prototype.addChild = function ( t, e ) {
        if ( !t ) {
            throw new Error
        }
        if ( e ) {
            var i = this.getBone( e );
            if ( i ) {
                i.addChild( t )
            }
            else {
                throw new Error
            }
        }
        else {
            if ( t.parent ) {
                t.parent.removeChild( t )
            }
            t._setArmature( this )
        }
    };
    r.prototype.updateSlotsZOrder = function () {
        this._slotList.sort( this.sortSlot );
        var t = this._slotList.length;
        var e;
        while ( t-- ) {
            e = this._slotList[t];
            if ( e._isDisplayOnStage ) {
                e._displayBridge.addDisplay( this._display, -1 )
            }
        }
        this._slotsZOrderChanged = false
    };
    r.prototype._addDBObject = function ( t ) {
        if ( t instanceof i ) {
            var e = t;
            if ( this._slotList.indexOf( e ) < 0 ) {
                this._slotList[this._slotList.length] = e
            }
        }
        else if ( t instanceof a ) {
            var r = t;
            if ( this._boneList.indexOf( r ) < 0 ) {
                this._boneList[this._boneList.length] = r;
                this._sortBoneList()
            }
        }
    };
    r.prototype._removeDBObject = function ( t ) {
        if ( t instanceof i ) {
            var e = t;
            var r = this._slotList.indexOf( e );
            if ( r >= 0 ) {
                this._slotList.splice( r, 1 )
            }
        }
        else if ( t instanceof a ) {
            var n = t;
            r = this._boneList.indexOf( n );
            if ( r >= 0 ) {
                this._boneList.splice( r, 1 )
            }
        }
    };
    r.prototype._sortBoneList = function () {
        var t = this._boneList.length;
        if ( t == 0 ) {
            return
        }
        var e = [];
        var i;
        var a;
        var r;
        while ( t-- ) {
            i = 0;
            a = this._boneList[t];
            r = a;
            while ( r ) {
                i++;
                r = r.parent
            }
            e[t] = {level : i, bone : a}
        }
        e.sort( this.sortBone );
        t = e.length;
        while ( t-- ) {
            this._boneList[t] = e[t].bone
        }
    };
    r.prototype._arriveAtFrame = function ( t, i, a, n ) {
        if ( t.event && this.hasEventListener( e.FrameEvent.ANIMATION_FRAME_EVENT ) ) {
            var s = new e.FrameEvent( e.FrameEvent.ANIMATION_FRAME_EVENT );
            s.animationState = a;
            s.frameLabel = t.event;
            this._eventList.push( s )
        }
        if ( t.sound && r._soundManager.hasEventListener( e.SoundEvent.SOUND ) ) {
            var o = new e.SoundEvent( e.SoundEvent.SOUND );
            o.armature = this;
            o.animationState = a;
            o.sound = t.sound;
            r._soundManager.dispatchEvent( o )
        }
        if ( t.action ) {
            if ( a.isPlaying ) {
                this.animation.gotoAndPlay( t.action )
            }
        }
    };
    r.prototype.sortSlot = function ( t, e ) {
        return t.getZOrder() < e.getZOrder() ? 1 : -1
    };
    r.prototype.sortBone = function ( t, e ) {
        return t.level < e.level ? 1 : -1
    };
    r._soundManager = e.SoundEventManager.getInstance();
    dragonBones.Armature = r
})();
(function () {
    var t = dragonBones.use( "display" );
    var e = dragonBones.use( "textures" );
    var i = dragonBones.use( "factorys" );

    function a() {
    }

    a.prototype.getVisible = function () {
        return this._display ? this._display.visible : false
    };
    a.prototype.setVisible = function ( t ) {
        if ( this._display ) {
            this._display.visible = t
        }
    };
    a.prototype.getDisplay = function () {
        return this._display
    };
    a.prototype.setDisplay = function ( t ) {
        if ( this._display == t ) {
            return
        }
        if ( this._display ) {
            var e = this._display.parent;
            if ( e ) {
                var i = this._display.parent.getChildIndex( this._display )
            }
            this.removeDisplay()
        }
        this._display = t;
        this.addDisplay( e, i )
    };
    a.prototype.dispose = function () {
        this._display = null
    };
    a.prototype.updateTransform = function ( t, e ) {
        this._display.x = t.tx;
        this._display.y = t.ty;
        this._display.rotation = e.skewX.toFixed( 4 ) * a.RADIAN_TO_ANGLE;
        this._display.scaleX = e.scaleX;
        this._display.scaleY = e.scaleY
    };
    a.prototype.updateColor = function ( t, e, i, a, r, n, s, o ) {
        if ( this._display ) {
            this._display.alpha = r
        }
    };
    a.prototype.addDisplay = function ( t, e ) {
        var i = t;
        if ( i && this._display ) {
            if ( e < 0 ) {
                i.addChild( this._display )
            }
            else {
                i.addChildAt( this._display, Math.min( e, i.getNumChildren() ) )
            }
        }
    };
    a.prototype.removeDisplay = function () {
        if ( this._display && this._display.parent ) {
            this._display.parent.removeChild( this._display )
        }
    };
    a.RADIAN_TO_ANGLE = 180 / Math.PI;
    t.HiloDisplayBridge = a;
    function r( t, e, i ) {
        if ( typeof i === "undefined" ) {
            i = 1
        }
        this._regions = {};
        this.image = t;
        this.scale = i;
        this.parseData( e )
    }

    r.prototype.dispose = function () {
        this.image = null;
        this._regions = null
    };
    r.prototype.getRegion = function ( t ) {
        return this._regions[t]
    };
    r.prototype.parseData = function ( t ) {
        var e = dragonBones.objects.DataParser.parseTextureAtlasData( t, this.scale );
        this.name = e.__name;
        delete e.__name;
        for ( var i in e ) {
            this._regions[i] = e[i]
        }
    };
    e.HiloTextureAtlas = r;
    function n() {
        n.superclass.constructor.call( this )
    }

    dragonBones.extend( n, i.BaseFactory );
    n.prototype._generateArmature = function () {
        var t = new dragonBones.Armature( new Hilo.Container );
        return t
    };
    n.prototype._generateSlot = function () {
        var e = new dragonBones.Slot( new t.HiloDisplayBridge );
        return e
    };
    n.prototype._generateDisplay = function ( t, e, i, a ) {
        var r = t.getRegion( e );
        if ( r ) {
            var n = new Hilo.Bitmap( {
                image : t.image,
                pivotX : i,
                pivotY : a,
                rect : [r.x, r.y, r.width, r.height],
                scaleX : 1 / t.scale,
                scaleY : 1 / t.scale
            } )
        }
        return n
    };
    n._helpMatrix = new Hilo.Matrix( 1, 0, 0, 1, 0, 0 );
    i.HiloFactory = n
})();