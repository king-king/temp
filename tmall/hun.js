KISSY.add( "mv/bg", function ( t, e, i, r ) {
    var a = Hilo.Container;
    var n = Hilo.Bitmap;
    var s = Hilo.Graphics;
    var o = Hilo.Tween;
    var l = Hilo.View;
    var h = "1";
    var u = "0";
    var f = {
        isElevenOver : false, _elevensObjs : [],
        reset : function () {
            this.isElevenOver = false;
            for ( var t = 0, e = this._elevensObjs.length; t < e; t++ ) {
                this._elevensObjs[t].background = this._elevensObjs[t].endColor
            }
        },
        init : function ( t ) {
            this.stage = t;
            var e = this.container = new a( {id : "bg"} );
            this.stage.addChildAt( e, 0 );
            var s = this.bgContainer = new a( {width : i.game.width, height : i.game.height} ).addTo( e );
            this.board = new n( {
                image : r.get( "borad_1" ),
                pivotX : r.get( "borad_1" ).width * .5,
                x : i.game.width * .5,
                y : i.game.height - r.get( "borad_1" ).height
            } );
            e.addChild( this.board );
            this.kv = this.cv = new n( {
                image : r.get( "kv" ),
                pivotX : r.get( "kv" ).width * .5,
                x : i.game.width * .5,
                y : 2,
                scaleX : .8,
                scaleY : .8
            } );
            e.addChild( this.kv )
        },
        setBoard : function ( t ) {
            this.board.setImage( r.get( "borad_" + t ) )
        },
        createCircle : function () {
            this._destory();
            this.setBoard( u );
            var t = this.bgContainer;
            t.background = "#271E4C";
            var e = 300;
            if ( i.mobile ) {
                var a = window.cccc = new n( {pivotX : r.get( "bg0" ).width * .5, image : r.get( "bg0" ), x : i.game.width * .5, y : e - 430} );
                t.addChild( a )
            }
            else {
                var s = .2;
                var o = .1;
                var l = .025;
                var a = new n( {
                    image : r.get( "bg-circle0" ),
                    pivotX : r.get( "bg-circle0" ).width * .5,
                    pivotY : r.get( "bg-circle0" ).height * .5,
                    x : i.game.width * .5,
                    y : e
                } );
                t.addChildAt( a, 0 );
                a.onUpdate = function () {
                    this.rotation += s
                };
                var a = new n( {
                    image : r.get( "bg-circle1" ),
                    pivotX : r.get( "bg-circle1" ).width * .5,
                    pivotY : r.get( "bg-circle1" ).height * .5,
                    x : i.game.width * .5,
                    y : e
                } );
                t.addChildAt( a, 0 );
                a.onUpdate = function () {
                    this.rotation += o
                };
                var a = new n( {
                    image : r.get( "bg-circle2" ),
                    pivotX : r.get( "bg-circle2" ).width * .5,
                    pivotY : r.get( "bg-circle2" ).height * .5,
                    x : i.game.width * .5,
                    y : e
                } );
                t.addChildAt( a, 0 );
                a.onUpdate = function () {
                    this.rotation += l
                };
                for ( var h = 0; h < 4; h++ ) {
                    var f = 10;
                    var c = .4;
                    var d = new n( {
                        pivotX : r.get( "bg-circle3" ).width * .5,
                        pivotY : r.get( "bg-circle3" ).height * .5,
                        x : a.x,
                        y : a.y,
                        scaleX : c,
                        scaleY : c,
                        alpha : 1,
                        image : r.get( "bg-circle3" )
                    } );
                    t.addChild( d );
                    this._moveObject( d, {scaleX : 1, scaleY : 1, rotation : 10, alpha : 0}, {
                        duration : 1e3, delay : h * 200, onUpdate : function () {
                            this.rotation_old++;
                            this.rotation++
                        }
                    } )
                }
            }
        },
        createEleven : function () {
            var t = this;
            this._destory();
            this.setBoard( h );
            var e = this.bgContainer;
            var i = "#e13e53";
            var r = "#ff3e8d";
            var a = "#ffed43";
            e.background = i;
            var n = 24;
            var s = 9;
            var o = 40;
            var u = 40;
            var f = 4;

            function c() {
                return Math.random() > .8 ? r : Math.random() > .4 ? a : i
            }

            var d = [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [0, 6], [2, 6]];
            var p = [];
            var m = 3;
            for ( var _ = 0, v = d.length; _ < v; _++ ) {
                var g = d[_];
                p.push( [g[0] + 0 + m, g[1] + 1] );
                p.push( [g[0] + 4 + m, g[1] + 1] );
                p.push( [g[0] + 11 + m, g[1] + 1] );
                p.push( [g[0] + 15 + m, g[1] + 1] )
            }
            p.push( [d[9][0] + 7 + 3, d[9][1] - 1] );
            this._elevensObjs = [];
            for ( var _ = 0, v = n * s; _ < v; _++ ) {
                var y = new l( {background : c(), x : 15 + o * (_ % n), y : u * Math.floor( _ / n ), width : o - f, height : u - f} );
                this._elevensObjs.push( y );
                y.t = 0;
                y.onUpdate = function () {
                    y.t++;
                    if ( y.t > 10 ) {
                        y.t = 0;
                        this.background = c();
                        if ( t.isElevenOver ) {
                            if ( this.background == this.endColor ) {
                                this.onUpdate = null
                            }
                        }
                    }
                };
                e.addChild( y );
                var w = false;
                for ( var b = 0; b < p.length; b++ ) {
                    var g = p[b];
                    if ( g[0] == _ % n && g[1] == Math.floor( _ / n ) ) {
                        w = true;
                        y.endColor = a;
                        break
                    }
                }
                y.endColor = w ? a : i
            }
        },
        createRects : function () {
            this._destory();
            this.setBoard( u );
            this._createRect( {noClear : true, y : 200, w : 60, h : 60, bgColor : "#4C919E", fontColor : "#382F66", bg : "#4C919E"} );
            this._createRect( {noClear : true, x : 300, y : 350, w : 30, h : 30, fontColor : "#F73C60", bgColor : "rgba(96, 214, 215, 1)"} );
            this._createRect( {noClear : true, x : 670, y : 350, fontColor : "#F84D71", bgColor : "rgba(96, 214, 215, 1)", w : 20, h : 20} )
        },
        createRect2 : function () {
            this._destory();
            this.setBoard( h );
            var t = this.bgContainer;
            t.background = "#FFCE00";
            for ( var e = 0; e < 5; e++ ) {
                var r = 99;
                var a = 40;
                var n = 1;
                var s = new l( {
                    pivotX : r * .5,
                    pivotY : a * .5,
                    width : r,
                    height : a,
                    x : i.game.width * .5,
                    y : i.game.height * .5,
                    scaleX : n,
                    scaleY : n,
                    background : "#FFF"
                } );
                t.addChildAt( s, 0 );
                this._moveObject( s, {scaleX : 11, scaleY : 11, alpha : 0}, {duration : 2e3, delay : e * 400} )
            }
        },
        _createRect : function ( t ) {
            t = t || {};
            !t.noClear && this._destory();
            var e = t.w || 40;
            var r = t.h || 40;
            var n = t.x || i.game.width * .5;
            var s = t.y || i.game.height * .5;
            var o = 1;
            var h = this.bgContainer;
            if ( t.bg ) {
                h.background = t.bg
            }
            var u = e * 15;
            var f = r * 15;
            var c = 45;
            var d = new a( {width : u, height : f, pivotX : u * .5, pivotY : f * .5, x : n, y : s, rotation : c} );
            h.addChild( d );
            for ( var p = 0; p < 6; p++ ) {
                var m = new l( {
                    pivotX : e * .5,
                    pivotY : r * .5,
                    width : e,
                    height : r,
                    scaleX : o,
                    scaleY : o,
                    background : t.fontColor || "#FFF",
                    alpha : 1,
                    x : u * .5,
                    y : f * .5,
                    rotation : c
                } );
                d.addChildAt( m, 1 );
                this._moveObject( m, {scaleX : 15, scaleY : 15, rotation : 0, alpha : 0}, {
                    duration : 2e3, delay : p * 400, onUpdate : function () {
                    }
                } )
            }
        },
        _moveObject : function ( t, e, i ) {
            i = i || {};
            t._t = 0;
            t._delay = i.delay || 0;
            t._duration = i.duration || 1e3;
            t._onComplete = i.onComplete || null;
            t._onUpdate = i.onUpdate || null;
            t._props = e;
            t._moveStart = false;
            var r = 1 / t._duration;
            for ( var a in e ) {
                t[a + "_v"] = (e[a] - t[a]) * r;
                t[a + "_old"] = t[a]
            }
            t.onUpdate = function ( t ) {
                t = t > 100 ? 0 : t;
                this._t += t;
                if ( this._moveStart ) {
                    for ( var e in this._props ) {
                        this[e] += this[e + "_v"] * t
                    }
                    this._onUpdate && this._onUpdate( t );
                    if ( this._t >= this._duration ) {
                        this._onComplete && this._onComplete();
                        this._t = this._t - this._duration;
                        for ( var e in this._props ) {
                            this[e] = this[e + "_old"]
                        }
                    }
                }
                else if ( this._t >= this._delay ) {
                    this._moveStart = true;
                    this._t -= this._delay + t;
                    this.onUpdate( t )
                }
            };
            var n = 30;
            while ( n-- ) {
                t.onUpdate( 33 )
            }
        },
        _destory : function () {
            this.bgContainer.removeAllChildren()
        }
    };
    return f
}, {requires : ["mv/mediator", "mv/config", "mv/resource"]} );
KISSY.add( "mv/mediator", function ( t, e ) {
    var i = t.mix( {}, e.Target );
    return i
}, {requires : ["event"]} );
KISSY.add( "mv/model", function ( t, e, i, r, a ) {
    var n = [];
    var s = {
        getAvatars : function ( i ) {
            var r = this;
            e( {
                type : "get",
                dataType : "jsonp",
                data : {num : a.peopleNum - 1, ua : window.getUA && window.getUA()},
                url : a.url.info,
                complete : function ( e ) {
                    if ( e && e.data && e.data && e.data.length && e.data[0].status == 1 ) {
                        n = e.data;
                        for ( var r = 0, s = n.length; r < s; r++ ) {
                            n[r].src = n[r].avatar
                        }
                    }
                    var l = spokesmanCfg.mvData.avatars;
                    for ( var r = 0, s = l.length; r < s; r++ ) {
                        l[r] = {src : l[r]}
                    }
                    var h = a.peopleNum - n.length;
                    if ( h > 0 ) {
                        n = n.concat( o( l, h ) )
                    }
                    t.each( n, function ( t, e ) {
                        t.id = "head" + e
                    } );
                    i( n )
                }
            } )
        }, getLoadResource : function () {
            var t = [];
            for ( var e = 0, i = n.length; e < i; e++ ) {
                var r = n[e];
                t.push( {id : "avatar" + e, src : r.avatar} )
            }
            return t
        }, getUserinfo : function () {
            return n
        }
    };

    function o( t, e ) {
        var i = [];
        for ( var r = 0; r < e; r++ ) {
            var a = t.splice( Math.floor( Math.random() * t.length ), 1 )[0];
            i.push( a )
        }
        return i
    }

    return s
}, {requires : ["io", "mv/mediator", "mv/utils", "mv/config"]} );
KISSY.add( "mv/fps", function ( t, e ) {
    var i;
    var r;
    var a;
    var n = {
        num : 0, tick : function () {
            i++
        }, start : function () {
            i = 0;
            a = a || e.create( '<div style="position:absolute;z-index:99999999;top:20px;left:10px;height:24px;line-height:24px;color:#fff;background:#aaa;"></div>' );
            document.body.appendChild( a );
            r = setInterval( function () {
                a.innerHTML = "fps:" + i;
                i = 0
            }, 1e3 )
        }, stop : function () {
            clearInterval( r )
        }
    };
    return n
}, {requires : ["dom"]} );
KISSY.add( "mv/resource", function ( t, e, i, r, a, n ) {
    var s = Hilo.LoadQueue;
    var o = Hilo.ImageLoader;
    var l, h, u;
    var f = [{id : "textureData", src : "/img/mv/man/texture.js"}, {id : "skeletonData", src : "/img/mv/man/skeleton.js"}, {
        id : "borad_0",
        src : "/img/mv/borad_0.png"
    }, {id : "borad_1", src : "/img/mv/borad_1.png"}, {id : "kv", src : "/img/mv/kv.png"}];
    var c = {
        1 : {src : "/img/mv/jiake.png"},
        2 : {src : "/img/mv/weijin.png"},
        3 : {src : "/img/mv/pengke.png"},
        4 : {src : "/img/mv/jihewen.png", needZ : false},
        5 : {src : "/img/mv/denglongxiu.png", needZ : true},
        6 : {src : "/img/mv/bodian.png", needZ : true}
    };
    var d = {p0 : null, p1 : null, p2 : null, p3 : null, p4 : null, p5 : null};
    var p = [{id : "bg-circle0", src : "/img/mv/bg-circle0.png"}, {id : "bg-circle1", src : "/img/mv/bg-circle1.png"}, {
        id : "bg-circle2",
        src : "/img/mv/bg-circle2.png"
    }, {id : "bg-circle3", src : "/img/mv/bg-circle3.png"}];
    var m = [{id : "bg0", src : "/img/mv/bg0.jpg"}];
    if ( a.mobile ) {
        f = f.concat( m )
    }
    else {
        f = f.concat( p )
    }
    var _ = {};
    var v = {borad_0 : true, bg0 : true, p0 : true, p1 : true, p2 : true, p3 : true, p4 : true, p5 : true};
    var g = a.path + "/sound/";
    var y = window.res = {
        isAudioLoaded : false, isImgLoaded : false, _isInit : false, init : function () {
            this._isInit = true;
            for ( var t = 0; t < a.peopleNum; t++ ) {
                var e = "p" + t;
                f.push( {id : e, src : d[e].src} )
            }
            if ( a.toBlob ) {
                l = document.createElement( "canvas" );
                h = l.getContext( "2d" );
                u = window.URL || window.webkitURL
            }
            for ( var t = 0, i = f.length; t < i; t++ ) {
                if ( !f[t].noPrePath ) {
                    f[t].src = a.path + f[t].src;
                    if ( a.randomTag ) {
                        f[t].src += "?t=" + (new Date).getTime()
                    }
                }
                if ( v[f[t].id] ) {
                    f[t].crossOrigin = true
                }
            }
        }, loadAudio : function () {
            var t = this;
            var e = this.audio = Hilo.WebSound.getAudio( {src : g + "song2.mp3", loop : false, autoPlay : false}, !Hilo.isFlash );
            _.audio = e;
            e.on( "load", function () {
                if ( !t.isAudioLoaded ) {
                    t.isAudioLoaded = true;
                    t.onLoadComplete()
                }
            } );
            e.load()
        }, setTextures : function ( t ) {
            t = parseInt( t ) || 0;
            var e = [1, 2, 3, 4, 5, 6];
            var i = e.indexOf( t );
            if ( i > -1 ) {
                e.splice( i, 1 );
                e.unshift( t )
            }
            var r = {};
            for ( var a = 0; a < 5; a++ ) {
                d["p" + a] = c[e[a]]
            }
        }, load : function () {
            if ( !this._isInit ) {
                this.init()
            }
            i.fire( "gameLoadStart" );
            var e = this;
            e.loadAudio();
            var r = this.queue = new s;
            r.add( f );
            r.on( "complete", function () {
                var i = [];
                for ( var s = 0; s < f.length; s++ ) {
                    var o = f[s].id;
                    _[o] = r.getContent( o );
                    if ( a.toBlob && v[o] && !a.isCanvas ) {
                        _[o].src = n.getBlobUrl( _[o] )
                    }
                }
                _.textureData = mvTexture;
                _.skeletonData = mvSkeleton;
                var l = ["p0", "p1", "p2", "p3", "p4"];
                t.each( l, function ( t, i ) {
                    if ( i < a.peopleNum ) {
                        var r = _.factory = new dragonBones.factorys.HiloFactory;
                        r.addSkeletonData( dragonBones.objects.DataParser.parseSkeletonData( mvSkeleton ) );
                        r.addTextureAtlas( new dragonBones.textures.HiloTextureAtlas( e.get( t ), mvTexture ) );
                        _["factory" + t] = r
                    }
                } );
                e.isImgLoaded = true;
                e.onLoadComplete();
                setTimeout( function () {
                    e.audio.fire( "load" )
                }, 1e3 )
            } );
            r.on( "load", function ( t ) {
                i.fire( "gameLoaded", {num : r._loaded / (r._source.length + 1)} )
            } );
            r.start()
        }, onLoadComplete : function () {
            if ( this.isAudioLoaded && this.isImgLoaded ) {
                setTimeout( function () {
                    i.fire( "gameLoaded", {num : 1} )
                }, 1e3 );
                setTimeout( function () {
                    i.fire( "gameLoadComplete" )
                }, 1500 )
            }
        }, get : function ( t ) {
            return _[t]
        }, add : function ( t ) {
            f = f.concat( t )
        }, getNeedZ : function ( t ) {
            return d[t].needZ
        }
    };
    return y
}, {requires : ["io", "mv/mediator", "mv/model", "mv/config", "mv/utils"]} );
KISSY.add( "mv/config", function ( t, e, i ) {
    var r = 990;
    var a = 400;
    var n = i.getUrlKey() || {};
    var s = 1;
    var o = (t.UA.mobile || /Android/i.test( navigator.userAgent )) && !t.UA.ipad;
    var l = o ? false : true;
    if ( o ) {
        s = e.width( "#mvContainer" ) / r
    }
    var h;
    var u = false;
    if ( n.daily == 1 ) {
        h = "http://latour.daily.tmall.net/avatar/"
    }
    else if ( n.mock == 1 ) {
        u = true;
        h = "http://groups.demo.taobao.net/tm/spokesman/demo/data/mock/mv/"
    }
    else {
        h = "http://latour.tmall.com/avatar/"
    }
    var f = {
        init : function ( t ) {
            t = t || {};
            if ( t.autoplay ) {
                this.autoplay = true
            }
            if ( t.fullscreen && this.mobile ) {
                this.fullscreen = true
            }
        },
        url : {share : h + "shareAvatar." + (u ? "php" : "do"), info : h + "getUsersInfo." + (u ? "php" : "do")},
        path : spokesmanCfg.path,
        urlKey : n,
        game : {isCanvas : l, width : r, height : a, scale : s},
        mobile : o,
        peopleNum : 5,
        toBlob : false
    };
    if ( f.mobile ) {
        if ( n.alertError ) {
            window.onerror = function ( t, e, i ) {
                alert( t );
                alert( e );
                alert( i )
            }
        }
        window.Blob = window.Blob || window.webkitBlob;
        window.URL = window.URL || window.webkitURL;
        f.toBlob = window.URL && window.Blob && window.atob && window.Uint8Array && window.ArrayBuffer;
        f.peopleNum = 1;
        if ( t.UA.ios ) {
            f.peopleNum = 3;
            if ( t.UA.ios < 7 ) {
                f.toBlob = false;
                f.peopleNum = 1
            }
            if ( Ali.appinfo.name == "taobao" ) {
                f.randomTag = true
            }
        }
        else {
            f.toBlob = false
        }
    }
    else {
        if ( t.UA.firefox || t.UA.ie ) {
            f.game.isCanvas = true
        }
    }
    if ( n.canvas !== undefined ) {
        f.game.isCanvas = n.canvas == 1
    }
    if ( n.autoplay !== undefined ) {
        f.autoplay = n.autoplay == 1
    }
    if ( n.toBlob !== undefined ) {
        f.toBlob = n.toBlob == 1
    }
    if ( n.peopleNum !== undefined ) {
        f.peopleNum = parseInt( n.peopleNum )
    }
    if ( n.fullscreen !== undefined && f.mobile ) {
        f.fullscreen = n.fullscreen == 1
    }
    if ( n.randomTag !== undefined ) {
        f.randomTag = n.randomTag == 1
    }
    return f
}, {requires : ["dom", "mv/utils"]} );
KISSY.add( "mv/timeline", function ( t, e ) {
    var i = t.mix( {
        _index : 0, _tasks : [], _time : 0, _curTask : null, _nextTask : null, _isPlay : false, tick : function ( t ) {
            if ( this._isPlay ) {
                this._time += t * .001;
                if ( this._nextTask && this._nextTask.time <= this._time ) {
                    this._runNextTask()
                }
            }
        }, addTask : function ( e ) {
            e = t.isArray( e ) ? e : [e];
            this._tasks = this._tasks.concat( e )
        }, start : function ( t ) {
            this.stop();
            this._time = t || 0;
            this._isPlay = true;
            this.tick( 0 )
        }, stop : function () {
            this._stopCurTask();
            this._isPlay = false;
            this._index = -1;
            this._time = 0;
            this._nextTask = this._tasks[0]
        }, pause : function () {
            this._isPlay = false
        }, resume : function () {
            this._isPlay = true
        }, resetTask : function () {
            this._tasks = [];
            this.stop()
        }, _runNextTask : function () {
            this._stopCurTask();
            this._index++;
            this._curTask = this._tasks[this._index];
            this._nextTask = this._tasks[this._index + 1];
            if ( this._curTask ) {
                if ( this._curTask.start( this._time ) ) {
                    this.stop();
                    this.fire( "end" )
                }
            }
        }, _stopCurTask : function () {
            this._curTask && this._curTask.stop && this._curTask.stop()
        }
    }, e.Target );
    return i
}, {requires : ["event"]} );
KISSY.add( "mv/role", function ( t, e ) {
    var i = Hilo.Bitmap;
    var a = t.augment( function () {
        this.armature = null;
        this.display = null;
        this.animation = null;
        this.head = null;
        this.armatureDict = {}
    }, {
        createArmature : function ( t, i ) {
            var a = e.get( "factory" + t );
            var r = a.buildArmature( "man" );
            r.getDisplay().onUpdate = function ( t ) {
                t *= .001;
                r.advanceTime( t )
            };
            this.armatureDict[t] = r;
            return r
        }, getArmature : function ( t ) {
            return this.armatureDict[t]
        }, setArmature : function ( t ) {
            if ( this.armatureName != t ) {
                var e = this.display;
                this.armatureName = t;
                this.armature = this.getArmature( t );
                this.display = this.armature.getDisplay();
                this.animation = this.armature.animation;
                if ( e ) {
                    this.cloneDisplayProps( this.display, e )
                }
            }
        }, play : function ( t, e, i, a, r, n, s, o, l, h ) {
            this.animation.gotoAndPlay( t, e, i, a, r, n, s, o, l, h )
        }, setHead : function ( t, e ) {
            if ( t ) {
                e = e || [0, 0, t.width, t.height];
                if ( !this.head ) {
                    var a = this.armature.getSlot( "head.png" );
                    var r = a.getDisplay();
                    r.x = 0;
                    r.y = 0;
                    r.rotation = 0;
                    var n = new Hilo.Container;
                    a.setDisplay( n );
                    this.head = new i( {image : t, rect : e} );
                    this.cloneDisplayProps( this.head, r );
                    this.head.scaleX = this.head.scaleY = .45;
                    this.head.x = -21;
                    this.head.y = -40;
                    n.addChild( this.head );
                    n.addChild( r )
                }
                else {
                    this.head.visible = true;
                    this.head.setImage( t, e )
                }
            }
            else if ( this.head ) {
                this.head.visible = false
            }
        }, setDisplayProps : function ( e ) {
            t.mix( this.display, e )
        }, cloneDisplayProps : function ( e, i ) {
            t.mix( e, i, true, ["x", "y", "scaleX", "scaleY", "rotation", "alpha", "visible", "pivotX", "pivotY"] )
        }
    } );
    return a
}, {requires : ["mv/resource"]} );
KISSY.add( "mv/task", function ( t, e, i ) {
    var a = Hilo.Tween;
    var r = Hilo.Bitmap;
    var n = Hilo.Ease;
    var s;
    var o;
    var l;
    var h;
    var u = {
        getTasks : function () {
            var t = [
                {
                    time : -111,
                    start : function () {
                        h.createRect2();
                        f( [0, 1, 2], function ( t ) {
                            t.display.addTo( o )
                        } );
                        o.x = o.startX;
                        o.scaleX = o.scaleY = 1;
                        o.y = o.startY;
                        f( [0, 1, 2, 3, 4], function ( t, i ) {
                            t.x = t.startX;
                            t.y = t.startY;
                            t.setHead( e.get( "head" + i ) );
                            t.animation.stop()
                        } )
                    }
                }];
            var i = [
                {
                    time : .6,
                    start : function () {
                        e.get( "audio" ).play()
                    }
                },
                {
                    time : .65,
                    start : function () {
                        f( [0, 1, 2, 3, 4], "C" )
                    }
                },
                {
                    time : 2.5,
                    start : function () {
                        o.scaleX = o.scaleY = 4;
                        o.x = o.startX - 80;
                        a.to( o, {scaleX : 3, scaleY : 3}, {duration : 300, ease : n.Quart.EaseOut} )
                    }
                },
                {
                    time : 4.5,
                    start : function () {
                        o.x = o.startX;
                        o.scaleX = o.scaleY = 2;
                        a.to( o, {scaleX : 1, scaleY : 1}, {duration : 300, ease : n.Quart.EaseOut} );
                        f( [3, 4], function ( t ) {
                            t.display.addTo( o )
                        } );
                        f( [0, 1, 2, 3, 4], function ( t ) {
                            t.display.x -= 39;
                            t.play( "F" )
                        } )
                    }
                },
                {
                    time : 5.5,
                    start : function () {
                        h.kv.visible = false;
                        o.scaleX = o.scaleY = 4
                    }
                },
                {
                    time : 5.7,
                    start : function () {
                        h.createCircle();
                        o.scaleX = o.scaleY = 4;
                        a.to( o, {scaleX : 1.5, scaleY : 1.5, y : o.startY - 100}, {duration : 300, ease : n.Quart.EaseOut} )
                    }
                },
                {
                    time : 6.4,
                    start : function () {
                        f( [0, 1, 2, 3, 4], "H" )
                    }
                },
                {
                    time : 14,
                    start : function () {
                        f( [0, 1, 2, 3, 4], "G" );
                        a.to( o, {scaleX : 1, scaleY : 1, y : o.startY}, {duration : 5e3} )
                    }
                },
                {
                    time : 22,
                    start : function () {
                        o.scaleX = o.scaleY = 1.5;
                        o.y = o.startY - 100;
                        o.x = o.startX + 50;
                        f( [0, 1, 2, 3, 4], "L" );
                        h.createRects()
                    }
                },
                {
                    time : 24,
                    start : function () {
                        o.scaleX = o.scaleY = 1;
                        o.y = o.startY;
                        o.x = o.startX
                    }
                },
                {
                    time : 24.2,
                    start : function () {
                        o.scaleX = o.scaleY = 3
                    }
                },
                {
                    time : 24.4,
                    start : function () {
                        o.scaleX = o.scaleY = 1
                    }
                },
                {
                    time : 24.6,
                    start : function () {
                        o.scaleX = o.scaleY = 3
                    }
                },
                {
                    time : 24.8,
                    start : function () {
                        o.scaleX = o.scaleY = 1
                    }
                },
                {
                    time : 25,
                    start : function () {
                        o.scaleX = o.scaleY = 3
                    }
                },
                {
                    time : 25.2,
                    start : function () {
                        o.scaleX = o.scaleY = 1
                    }
                },
                {
                    time : 28.2,
                    start : function () {
                        o.scaleX = o.scaleY = 3
                    }
                },
                {
                    time : 28.4, start : function () {
                    o.scaleX = o.scaleY = 1
                }
                }, {
                    time : 28.6, start : function () {
                        o.scaleX = o.scaleY = 3
                    }
                }, {
                    time : 28.8, start : function () {
                        o.scaleX = o.scaleY = 1
                    }
                }, {
                    time : 29, start : function () {
                        o.scaleX = o.scaleY = 3
                    }
                }, {
                    time : 29.2, start : function () {
                        h.createRect2();
                        f( [0, 1, 2, 3, 4], function ( t ) {
                            t.play( "M", 0 )
                        } );
                        o.scaleX = o.scaleY = 1
                    }
                }, {
                    time : 32, start : function () {
                        o.scaleX = o.scaleY = 3
                    }
                }, {
                    time : 32.2, start : function () {
                        o.scaleX = o.scaleY = 1
                    }
                }, {
                    time : 32.4, start : function () {
                        o.scaleX = o.scaleY = 3
                    }
                }, {
                    time : 32.6, start : function () {
                        o.scaleX = o.scaleY = 1
                    }
                }, {
                    time : 32.8, start : function () {
                        o.scaleX = o.scaleY = 3
                    }
                }, {
                    time : 33, start : function () {
                        o.scaleX = o.scaleY = 1
                    }
                }, {
                    time : 34, start : function () {
                        h.createEleven();
                        f( [0, 1, 2, 3, 4], function ( t ) {
                            t.display.x += 39;
                            t.play( "L" )
                        } );
                        o.scaleX = o.scaleY = 2;
                        a.to( o, {scaleX : 1, scaleY : 1}, {duration : 300, ease : n.Quart.EaseOut} )
                    }
                }, {
                    time : 40.5, start : function () {
                        o.scaleX = o.scaleY = 1.5;
                        o.y = o.startY - 100
                    }
                }, {
                    time : 40.7, start : function () {
                        o.x = o.startX + 100
                    }
                }, {
                    time : 40.9, start : function () {
                        o.x = o.startX - 100
                    }
                }, {
                    time : 41.1, start : function () {
                        o.x = o.startX + 100
                    }
                }, {
                    time : 41.3, start : function () {
                        o.x = o.startX - 100
                    }
                }, {
                    time : 41.5, start : function () {
                        o.x = o.startX;
                        o.scaleX = o.scaleY = 1;
                        o.y = o.startY
                    }
                }, {
                    time : 42, start : function () {
                        h.isElevenOver = true
                    }
                }, {
                    time : 45, start : function () {
                        f( [0, 1, 2, 3, 4], "Mzhuan" )
                    }
                }, {
                    time : 50, start : function () {
                        h.reset();
                        return true
                    }
                }];
            return t.concat( i )
        }, init : function ( t ) {
            l = t;
            o = l.scene;
            s = l.players;
            h = l.bg
        }, reset : function () {
            o && a.remove( o );
            h.kv.visible = true;
            s[3] && s[3].display.removeFromParent();
            s[4] && s[4].display.removeFromParent()
        }
    };

    function f( e, a, r ) {
        for ( var n = 0, o = e.length; n < o; n++ ) {
            var l = e[n];
            if ( l >= i.peopleNum ) {
                continue
            }
            if ( t.isFunction( a ) ) {
                a( s[l], n )
            }
            else {
                s[l].play( a || "C", r || .3 )
            }
        }
    }

    function c( t, i ) {
        t.setHead( i ? e.get( "head" ) : null )
    }

    return u
}, {requires : ["mv/resource", "mv/config"]} );
KISSY.add( "mv/loading", function ( t, e, i, r ) {
    var a = i.get( ".mv-loading" );
    var n = i.get( ".num", a );
    i.css( a, "top", r.mobile ? "50%" : "320px" );
    if ( !r.mobile ) {
        i.css( a, "marginLeft", "-10%" );
        i.css( a, "width", "20%" )
    }
    var s = .01;
    var o = .001;
    var l = .8;
    var h = 50;
    var u = window.ll = {
        bindEvent : function () {
            var t = this;
            e.on( "gameLoadStart", function () {
                t.start()
            } );
            e.on( "gameLoaded", function ( e ) {
                t.loaded( e.num )
            } );
            e.on( "gameLoadComplete", function () {
                t.end()
            } )
        }, start : function () {
            var t = this;
            clearInterval( t.interval );
            t.interval = setInterval( function () {
                t.loaded( t.num + o );
                if ( t.num > l ) {
                    clearInterval( t.interval )
                }
            }, 100 );
            i.show( a );
            t.num = 0;
            t.loaded( s )
        }, loaded : function ( t ) {
            t = t || 0;
            if ( t >= 1 ) {
                this.end();
                return
            }
            if ( t < this.num ) {
                t = this.num
            }
            this.setNum( t )
        }, end : function () {
            var t = this;
            t.setNum( 1 );
            clearInterval( t.interval );
            clearTimeout( t.timeout );
            t.timeout = setTimeout( function () {
                i.hide( a )
            }, h )
        }, setNum : function ( t ) {
            if ( this.num != t ) {
                this.num = t;
                n.style.width = this.num * 100 + "%"
            }
        }
    };
    u.bindEvent();
    return u
}, {requires : ["mv/mediator", "dom", "mv/config"]} );
KISSY.add( "mv/control", function ( t, e, i, r ) {
    var a = "mv-shareBtn";
    var n = "mv-playBtn";
    var s = "mv-stopBtn";
    var o = "mv-fullscreenBtn";
    var l = "mv-miniBtn";
    var h = "mv-returnBtn";
    var u = "mv-bigPlayBtn";
    var f = {
        init : function ( t ) {
            this.uiElem = e.get( "#mv-ui" );
            this.shareBtn = e.get( ".mv-shareBtn" );
            this.playBtn = e.get( ".mv-playBtn" );
            this.fullscreenBtn = e.get( ".mv-fullscreenBtn" );
            this.returnBtn = e.get( ".mv-returnBtn" );
            this.bigPlayBtn = e.get( ".mv-bigPlayBtn" );
            this.mvContainer = e.get( "#mvContainer" );
            this.parentNode = this.mvContainer.parentNode;
            if ( r.mobile ) {
                e.show( this.shareBtn );
                e.show( this.fullscreenBtn );
                e.addClass( this.uiElem, "mobile" );
                this._miniContainer()
            }
            else {
                e.css( "#mvContainer", {width : "990px", height : "400px"} )
            }
            e.show( this.playBtn );
            e.show( this.uiElem );
            this.main = t;
            this.stage = t.stage;
            this.ticker = t.ticker;
            if ( r.fullscreen ) {
                this.setScreen( true );
                e.hide( this.fullscreenBtn )
            }
        }, setScreen : function ( e ) {
            var i = this;
            if ( !e ) {
                i.parentNode.appendChild( i.mvContainer );
                if ( !t.UA.ios ) {
                    Ali.showTitle()
                }
                i._miniScreen()
            }
            else {
                document.body.appendChild( i.mvContainer );
                if ( !t.UA.ios ) {
                    Ali.hideTitle()
                }
                window.onresize = function () {
                    if ( i.isFullscreen ) {
                        i._fullScreen()
                    }
                };
                i._fullScreen()
            }
            i.setFullsreenBtn( !e )
        }, _miniContainer : function () {
            var t = r.game.width * r.game.scale;
            var i = r.game.height * r.game.scale;
            e.css( "#gameContainer", {width : t, height : i} );
            e.css( "#mvContainer", {width : t, height : i} )
        }, _miniScreen : function () {
            this.isFullscreen = false;
            this._miniContainer();
            this.stage.scaleX = this.stage.scaleY = r.game.scale;
            this.stage.y = this.stage.x = this.stage.pivotX = 0;
            e.css( this.uiElem, {top : 0 + "px", height : "100%"} );
            e.css( "#mvContainer", {position : "relative", top : "0px", left : "0px", webkitTransform : "", webkitTransformOrigin : ""} );
            e.css( "#gameContainer", {zIndex : 0} );
            this.stage.tick( 0 )
        }, _fullScreen : function () {
            this.isFullscreen = true;
            e.css( "#mvContainer", {
                position : "absolute",
                top : "0px",
                left : "100%",
                webkitTransform : "rotate(90deg)",
                webkitTransformOrigin : "top left"
            } );
            e.css( "#gameContainer", {zIndex : -1, position : "absolute"} );
            var t = e.viewportWidth() - 20;
            var i = e.viewportHeight();
            var a = t / r.game.height;
            this.stage.scaleX = this.stage.scaleY = a;
            this.stage.pivotX = r.game.width * .5;
            this.stage.x = i * .5;
            this.stage.y = -(r.game.height * a - e.viewportWidth()) * .5;
            e.css( "#gameContainer", {width : t, height : i} );
            e.css( "#mvContainer", {width : e.viewportHeight(), height : e.viewportWidth()} );
            e.css( this.uiElem, {top : this.stage.y + "px", height : t + "px"} );
            this.stage.tick( 0 )
        }, setFullsreenBtn : function ( t ) {
            e.removeClass( this.fullscreenBtn, l, o );
            e.addClass( this.fullscreenBtn, t ? o : l );
            if ( t ) {
                e.hide( this.returnBtn )
            }
            else {
                e.show( this.returnBtn )
            }
        }, setPlayBtn : function ( t ) {
            this.playBtn.className = "mv-btn";
            e.addClass( this.playBtn, t ? n : s );
            if ( t ) {
                e.show( this.bigPlayBtn )
            }
            else {
                e.hide( this.bigPlayBtn )
            }
        }
    };
    if ( r.mobile ) {
        document.addEventListener( "touchstart", function ( t ) {
            if ( f.isFullscreen ) {
            }
        } )
    }
    return f
}, {requires : ["dom", "event", "mv/config"]} );
KISSY.add( "mv/utils", function ( t, e, i ) {
    var a = "";
    if ( window.TB && TB.Global && TB.Global.loginStatusReady ) {
        TB.Global.loginStatusReady( function ( t ) {
            a = t && t.tbToken
        } )
    }
    var r = {
        getToken : function ( t ) {
            if ( a ) {
                t( a );
                return
            }
            return new e( {
                timeout : 7,
                type : "get",
                url : "http://tmm.taobao.com/cookies.do?keys=_tb_token_",
                dataType : "jsonp"
            } ).then( function ( e ) {
                    e = e[0];
                    a = e && e["_tb_token_"] || "";
                    t( a )
                }, function () {
                    t( "" )
                } )
        }, login : function ( e, i, a ) {
            e = e || {};
            if ( t.UA.mobile ) {
                t.use( "mui/login-m", function ( t, r ) {
                    r.show( {
                        success : function () {
                            i && i()
                        }, failure : function () {
                            a && a()
                        }, isCheck : e.isCheck, needRedirect : e.needRedirect
                    } )
                } )
            }
            else {
                t.use( "mui/minilogin", function ( t, r ) {
                    r.show( function () {
                        i && i()
                    }, {
                        check : e.isCheck, needRedirect : e.needRedirect, closeCallback : function () {
                            a && a()
                        }
                    } )
                } )
            }
        }, getUrlKey : function ( e ) {
            if ( !e ) {
                return t.unparam( location.search.substring( 1 ) )
            }
            return t.unparam( location.search.substring( 1 ) )[e]
        }, getBlobUrl : function ( t ) {
            if ( !this.canvas ) {
                this.canvas = document.createElement( "canvas" );
                this.ctx = this.canvas.getContext( "2d" )
            }
            this.canvas.width = t.width;
            this.canvas.height = t.height;
            this.ctx.drawImage( t, 0, 0 );
            var e = this.canvas.toDataURL();
            e = e.split( "," );
            var i = atob( e[1] );
            var a = i.length;
            var r = new ArrayBuffer( a );
            var n = new Uint8Array( r );
            for ( var s = 0; s < a; s++ ) {
                n[s] = i.charCodeAt( s )
            }
            var o = new Blob( [n], {type : e[0].split( ":" )[1].split( ";" )[0]} );
            return URL.createObjectURL( o )
        }, share : function () {
            var e = this;
            if ( this.hasShareM ) {
                i()
            }
            else {
                t.getScript( spokesmanCfg.path + "/lib/share-m.js", i )
            }
            function i() {
                a( spokesmanCfg.mvData.share.img )
            }

            function a( i ) {
                t.use( "mui/share-m", function ( t, a ) {
                    if ( !e._mShare ) {
                        e._mShare = new a( {
                            comment : spokesmanCfg.mvData.share.text,
                            picList : [i],
                            url : spokesmanCfg.mvData.share.link,
                            title : spokesmanCfg.mvData.share.title
                        } )
                    }
                    e._mShare.popup()
                } )
            }

            r.sendLog( "hyj.19.10" )
        }, sendLog : function ( t ) {
            var e = new Image;
            var i = "_logimg_" + Math.random();
            window[i] = e;
            e.onload = e.onerror = function () {
                window[i] = null
            };
            var a = "http://gm.mmstat.com/" + t + "?uv=1&ts=" + (new Date).getTime();
            e.src = a;
            e = null;
            return a
        }
    };
    r.merge = function () {
        var e = {};
        var i = [].slice.call( arguments );
        for ( var a = 0, n; n = i[a]; a += 1 ) {
            for ( var s in n ) {
                var o = n[s];
                if ( n.hasOwnProperty( s ) && o !== null && o !== undefined && o !== "" ) {
                    if ( t.isObject( o ) && t.isObject( e[s] ) ) {
                        e[s] = r.merge( e[s], o )
                    }
                    else {
                        e[s] = o
                    }
                }
            }
        }
        return e
    };
    r.randomSort = function ( t ) {
        var e = t.length;
        var i = Math.ceil( e / 2 );
        for ( var a = 0; a <= i; a += 1 ) {
            var r = Math.floor( Math.random() * e );
            if ( r !== a ) {
                var n = t[r];
                t[r] = t[a];
                t[a] = n
            }
        }
        return t
    };
    var n = null;
    r.loading = {
        init : function () {
            if ( n ) {
                return
            }
            n = i.get( "#tmall-avatar-loading" )
        }, show : function () {
            r.loading.init();
            i.show( n )
        }, hide : function () {
            i.hide( n )
        }
    };
    return r
}, {requires : ["io", "dom"]} );
/**
 * Created by WQ on 2015/5/26.
 */
