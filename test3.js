(function () {
    window.onerror = function () {
        console.log( "err", arguments )
    };
    !(/AppleWebKit/).test( navigator.userAgent ) && document.body.classList.add( "not-webkit" );
    var onTap = fp.onTap, loop = fp.loop, loopArray = fp.loopArray, loopObj = fp.loopObj, CSS = fp.CSS, element = fp.element;
    window.color = {"background" : "#FFFFFF"};
    var MB = 1024 * 1024;
    var KB = 1024;
    var querySelector = document.querySelector.bind( document );
    var querySelectorAll = document.querySelectorAll.bind( document );
    var systemTemPlate = makeTemplate();
    var addPageBtn = querySelector( ".edit-page-add-page-btn" );
    var addPageSettingPage = querySelector( ".edit-page-add-page-setting-page" );
    addPageSettingPage.isLoadTemplate = false;
    var editPageLeft = querySelector( ".edit-page-left" );
    var previewPage = querySelector( ".preview-page" );
    var onDrag = fp.onDrag;
    var translate = fp.translate;
    var onLTap = fp.onLTap;
    var scaleAndRotate = fp.scaleAndRotate;
    var scaleTheObj = fp.scale;
    var insertCSSRules = fp.insertCSSRules;
    var notSupportList = {40 : true, 43 : true, 44 : true, 52 : true, 31 : true, 32 : true, 60 : true};

    function staticImgSrc( src ) {
        return ((contentPath || virtualPath) + "/Content/" + src).toLowerCase()
    }

    function makeTemplate() {
        var template = querySelector( "#template" );
        document.body.removeChild( template );
        var make = function ( selector ) {
            try {
                var node = template.querySelector( selector )
            }
            catch ( e ) {
                console.log( e )
            }
            var newNode = node.cloneNode( true );
            return newNode
        };
        return {make : make}
    }

    function openInnerPage( page ) {
        page.classList.remove( "hide" )
    }

    function closeInnerPage( page ) {
        page.classList.add( "hide" )
    }

    function openSlidePage( page ) {
        var border = querySelector( ".edit-page-slide-page-border" );
        if ( border.querySelector( ".slide-out.slide-page" ) ) {
            border.querySelector( ".slide-out.slide-page" ).classList.remove( "slide-out" )
        }
        page.classList.add( "slide-out" );
        border.classList.add( "slide-out" );
        querySelector( ".edit-page-pre-page-btn" ).classList.add( "hide" );
        querySelector( ".edit-page-next-page-btn" ).classList.add( "hide" );
        addPageBtn.classList.add( "hide" );
        addPageSettingPage.classList.add( "hide" )
    }

    function closeSlidePage( page ) {
        page.classList.remove( "slide-out" );
        querySelector( ".edit-page-slide-page-border" ).classList.remove( "slide-out" );
        if ( !querySelector( ".edit-page-slide-page-border .slide-out" ) ) {
            querySelector( ".edit-page-pre-page-btn" ).classList.remove( "hide" );
            querySelector( ".edit-page-next-page-btn" ).classList.remove( "hide" );
            addPageBtn.classList.remove( "hide" )
        }
    }

    function closeAllSlidePage() {
        addPageBtn.classList.remove( "hide" );
        querySelector( ".edit-page-slide-page-border " ).classList.contains( "slide-out" ) && querySelector( ".edit-page-slide-page-border " ).classList.remove( "slide-out" );
        querySelector( ".slide-page.slide-out" ) && querySelector( ".slide-page.slide-out" ).classList.remove( "slide-out" );
        querySelector( ".edit-page-pre-page-btn" ).classList.remove( "hide" );
        querySelector( ".edit-page-next-page-btn" ).classList.remove( "hide" )
    }

    function closeAllPages() {
        if ( addPageBtn.classList.contains( "hide" ) ) {
            addPageBtn.classList.remove( "hide" );
            addPageSettingPage.classList.add( "hide" )
        }
        closeAllSlidePage();
        loopArray( querySelectorAll( ".setting-page" ), function ( page ) {
            page.classList.add( "hide" )
        } )
    }

    var editPageRightBottom = querySelector( ".edit-page-right" );
    editPageRightBottom.onclick = function ( e ) {
        if ( e.srcElement == editPageRightBottom ) {
            closeAllPages()
        }
    };
    function presetAddPage() {
        addPageSettingPage.addEventListener( "mouseover", function () {
            addPageSettingPage.classList.add( "top" )
        }, false );
        addPageSettingPage.addEventListener( "mouseout", function () {
            addPageSettingPage.classList.remove( "top" )
        }, false );
        onTap( addPageSettingPage.querySelector( ".close-add-page-setting-page-btn" ), function () {
            addPageBtn.classList.remove( "hide" );
            closeInnerPage( addPageSettingPage )
        } );
        addPageSettingPage.querySelector( ".close-add-page-setting-page-btn2" ).onclick = function () {
            addPageBtn.classList.remove( "hide" );
            closeInnerPage( addPageSettingPage )
        }
    }

    function slidePageEditBgImg() {
        var openBtn = querySelector( ".edit-page-edit-bgimg-btn" );
        var updateImgBtn = querySelector( ".slide-edit-bgimg-updata-btn" );
        var updateImgTips = querySelector( ".slide-edit-bgimg-updata-tips" );
        var fileInput = querySelector( ".slide-page-edit-bgimg .cropit-image-input" );
        var page = querySelector( ".slide-page-edit-bgimg" );
        var saveBtn = page.querySelector( ".slide-edit-bgimg-save-btn" );
        updateImgBtn.onmouseover = function () {
            updateImgTips.classList.remove( "hide" )
        };
        updateImgBtn.onmouseout = function () {
            updateImgTips.classList.add( "hide" )
        };
        page.addEventListener( "mouseover", function () {
            page.classList.add( "top" )
        }, false );
        page.addEventListener( "mouseout", function () {
            page.classList.remove( "top" )
        }, false );
        $( ".slide-page-edit-bgimg .crop-img-border" ).cropit();
        updateImgBtn.onclick = function () {
            fileInput.click()
        };
        querySelector( ".close-slide-page-edit-bgimg" ).onclick = function () {
            closeSlidePage( page )
        };
        openBtn.onclick = function () {
            page.classList.contains( "slide-out" ) ? closeSlidePage( page ) : openSlidePage( page )
        };
        saveBtn.onclick = function () {
            var pageData = page.pageData;
            var mediaData = page.mediaData;
            var mediaAtrr = JSON.parse( mediaData.Attributes );
            var crop = $( ".slide-page-edit-bgimg .crop-img-border" ).cropit( "cropInfo" );
            var inputFile = page.querySelector( ".cropit-image-input" );
            if ( inputFile.files.length == 0 ) {
                fp.message( {text : "请选择更换的图片"} );
                return
            }
            if ( inputFile.files[0].size > 4 * MB ) {
                fp.message( {text : "图片不能超过4MB"} );
                return
            }
            var parms = {
                "omid" : mediaData.ID,
                "pid" : pageData.Guid,
                "attr" : mediaData.Attributes,
                Zoom : crop.zoom * mediaAtrr.W / 256,
                OffsetX : Math.abs( crop.offset.x ) * mediaAtrr.W / 256,
                OffsetY : Math.abs( crop.offset.y ) * mediaAtrr.W / 256,
                Width : mediaAtrr.W,
                Height : mediaAtrr.H,
                Shape : mediaAtrr.Shape || 0,
                Scale : 2,
                HasBorder : mediaAtrr.HasBorder,
                BorderWidth : mediaAtrr.BorderWidth,
                BorderColor : mediaAtrr.BorderColor,
                CornerRadius : mediaAtrr.CornerRadius
            };
            var fd = new window.FormData();
            loopObj( parms, function ( key, value ) {
                fd.append( key, value )
            } );
            fd.append( "blob-fileName", inputFile.files[0].name );
            fd.append( "imgFile", inputFile.files[0], inputFile.files[0].name );
            fp.message( {text : "正在保存"} );
            page.querySelector( ".cropit-image-preview" ).style.backgroundImage = null;
            page.querySelector( "form.input-file" ).reset();
            closeSlidePage( page );
            fpInvokeAPI.saveImageConfig( {
                data : fd, success : function ( data ) {
                    if ( data.code == 200 ) {
                        fp.message( {text : "保存完毕"} );
                        var curLi = null;
                        var lis = document.querySelectorAll( "li.page-list.show" );
                        for ( var j = 0; j < lis.length; j++ ) {
                            if ( lis[j].pageData.Guid == parms.pid ) {
                                curLi = lis[j];
                                break
                            }
                        }
                        if ( curLi == null ) {
                            return
                        }
                        for ( var i = 0; i < curLi.pageData.Medias.length; i++ ) {
                            if ( curLi.pageData.Medias[i].ID == data.data.PrimaryId ) {
                                curLi.pageData.Medias[i].Guid = data.data.Guid;
                                curLi.pageData.Medias[i].ID = data.data.PrimaryId;
                                curLi.pageData.Medias[i].Uri = data.data.Url;
                                fp.message( {text : "正在生成新页面，请稍等"} );
                                var newPage = makePage( curLi.pageData, function () {
                                    curLi.removeChild( curLi.querySelector( ".page" ) );
                                    curLi.appendChild( newPage );
                                    if ( querySelector( "li.page-list.select" ).pageData.Id == curLi.pageData.Id ) {
                                        mappingToScreen( newPage )
                                    }
                                } );
                                break
                            }
                        }
                    }
                }
            } )
        }
    }

    function slidePageEditWord() {
        var page = querySelector( ".slide-page-edit-word" );
        var text = querySelector( ".slide-page-edit-word .edit-word-text" );
        var wordCount = querySelector( ".slide-page-edit-word .edit-text-word-count" );
        var vernier = querySelector( ".edit-word-font-family-vernier" );
        var saveBtn = page.querySelector( ".edit-word-save-btn" );
        page.addEventListener( "mouseover", function () {
            page.classList.add( "top" )
        }, false );
        page.addEventListener( "mouseout", function () {
            page.classList.remove( "top" )
        }, false );
        text.onkeyup = getWordCount;
        text.onkeydown = getWordCount;
        function getWordCount() {
            var enterCount = 0;
            for ( var i = 0; i < text.value.length; i++ ) {
                if ( text.value[i] == "\n" ) {
                    enterCount += 1
                }
            }
            var count = text.value.length + enterCount;
            wordCount.innerHTML = (count > 10 ? 10 : count) + "/" + 10
        }

        var trays = page.querySelectorAll( ".tray" );
        loopArray( page.querySelectorAll( ".edit-page-edit-word-btn" ), function ( btn, i ) {
            btn.index = i;
            btn.onclick = function () {
                var curSelect = page.querySelector( ".edit-page-edit-word-btn.select" );
                if ( curSelect && curSelect.index == i ) {
                    curSelect.classList.remove( "select" );
                    trays[curSelect.index].classList.add( "hide" )
                }
                else {
                    if ( curSelect && curSelect.index != i ) {
                        curSelect.classList.remove( "select" );
                        trays[curSelect.index].classList.add( "hide" );
                        btn.classList.add( "select" );
                        trays[i].classList.remove( "hide" )
                    }
                    else {
                        btn.classList.add( "select" );
                        trays[i].classList.remove( "hide" )
                    }
                }
            }
        } );
        var colors = ["#000000", "#8b8b8b", "#ffffff", "#c3e5a8", "#88cb55", "#578c2e", "#eff6ad", "#deec5f", "#fefbb0", "#fdf666", "#f2e933", "#fbde9d", "#f8c042", "#c68c1f", "#fad19c", "#f6a43f", "#f8b79d", "#f46f40", "#cc3c16", "#f6a3a0", "#f24a47", "#a211d", "#84143f", "#ee91b3", "#da1c68", "#84143f", "#d87bfb", "#651a8c", "#ac34eb", "#651a8c", "#a077fa", "#4a2ee2", "#2a1680", "#99b8fc", "#3373f9", "#1f43c9", "#89defb", "#48bbf9", "#2c7aa2"];
        var selectColorBorder = page.querySelector( ".edit-page-edit-word-select-color-tray" );
        var selectedColorItem = page.querySelector( ".edit-page-selected-color" );
        loopArray( colors, function ( color, i ) {
            var colorBox = element( "div", {classList : "edit-color-box"}, selectColorBorder );
            var colorItem = element( "div", {classList : "edit-color-item"}, colorBox );
            colorItem.style.backgroundColor = colors[i];
            colorBox.onclick = function () {
                selectedColorItem.fpColor = colors[i];
                selectedColorItem.style.backgroundColor = colors[i];
                var cur = selectColorBorder.querySelector( ".select" );
                cur && cur.classList.remove( "select" );
                colorBox.classList.add( "select" )
            }
        } );
        page.selectColor = function ( color ) {
            selectedColorItem.fpColor = color;
            selectedColorItem.style.backgroundColor = color
        };
        var fontFamily = ["Champagne & Limousines", "Arial", "Verdana", "Times New Roman", "Impact", "Chalkduster", "FZLanTingHeiS-UL-GB", "FZJunHeiS-EL-GB", "ZHSRXT-GBK", "FZLanTingKanHei-R-GBK", "Microsoft YaHei Light", "FZLanTingHeiS-B-GB", "FZZhengHeiS-M-GB", "FZPinShangHeiS-R-GB", "SimSun", "KaiTi", "FZFengYaSongS-GB", "造字工房朗宋（非商用）常规体", "汉仪菱心体简", "DFPLiJinHeiW8-GB", "DFPWaWaW5-GB", "FZJingLeiS-R-GB", "HanziPen SC", "FZHanJian-R-GB", "叶根友刀锋黑草", "叶根友毛笔行书", "书体坊禚效锋行草体", "lixukexingshu"];
        var familyBorder = page.querySelector( ".edit-page-edit-word-select-family-tray .border" );
        var selectedFaimily = page.querySelector( ".edit-page-edit-word-btn img" );
        loopArray( fontFamily, function ( ff, i ) {
            if ( i == 6 ) {
                return
            }
            var border = element( "div", {classList : "edit-font-family-item"}, familyBorder );
            border.fpFontFamily = fontFamily[i];
            CSS( border, {
                "background" : "url(" + staticImgSrc( "image/font-family-" + (i + 1) + ".png" ) + ") no-repeat",
                "background-size" : "64px auto"
            } );
            border.onclick = function () {
                var cur = familyBorder.querySelector( ".select" );
                cur && cur.classList.remove( "select" );
                border.classList.add( "select" );
                selectedFaimily.src = staticImgSrc( "image/font-family-" + (i + 1) + ".png" );
                selectedFaimily.fpFamily = fontFamily[i]
            }
        } );
        page.selectFontFamily = function ( curFontFamily ) {
            for ( var i = 0; i < fontFamily.length; i++ ) {
                if ( curFontFamily == fontFamily[i] ) {
                    selectedFaimily.src = staticImgSrc( "image/font-family-" + (i + 1) + ".png" );
                    selectedFaimily.fpFamily = fontFamily[i];
                    break
                }
            }
        };
        var animations = [{"name" : "左飞入", "id" : "fly-into-left"}, {"name" : "右飞入", "id" : "fly-into-right"}, {
            "name" : "上飞入",
            "id" : "fly-into-top"
        }, {"name" : "下飞入", "id" : "fly-into-bottom"}, {"name" : "左浮现", "id" : "emerge-left"}, {
            "name" : "右浮现",
            "id" : "emerge-right"
        }, {"name" : "上浮现", "id" : "emerge-top"}, {"name" : "下浮现", "id" : "emerge-bottom"}, {"name" : "从小变大", "id" : "scale"}, {
            "name" : "淡入",
            "id" : "fade-in"
        }, {"name" : "回旋", "id" : "circle-round"}, {"name" : "远近翻转", "id" : "round-from-far-and-near"}, {
            "name" : "曲线向上",
            "id" : "curve-up"
        }, {"name" : "缩小", "id" : "shrink"}, {"name" : "落下抖动", "id" : "fall-down-and-shake"}, {"name" : "闪烁", "id" : "flash"}, {
            "name" : "抖动",
            "id" : "shake"
        }, {"name" : "弹性", "id" : "bounce-in"}, {"name" : "上弹入", "id" : "bounce-in-down"}, {"name" : "下弹入", "id" : "bounce-in-up"}, {
            "name" : "左弹入",
            "id" : "bounce-in-left"
        }, {"name" : "右弹入", "id" : "bounce-in-right"}, {"name" : "挂摆", "id" : "swing"}, {"name" : "果冻", "id" : "rubber-band"}, {
            "name" : "得瑟",
            "id" : "tada"
        }, {"name" : "钟摆", "id" : "wobble"}];
        var selectedAnimationItem = page.querySelector( ".edit-page-edit-word-btn .selected-animation" );
        var animationBorder = page.querySelector( ".edit-page-edit-word-select-animation-tray .border" );
        loopArray( animations, function ( animation, i ) {
            var item = element( "div", {classList : "edit-word-word-animation"}, animationBorder );
            item.innerHTML = animations[i]["name"];
            item.onclick = function () {
                selectedAnimationItem.innerHTML = animations[i]["name"];
                selectedAnimationItem.fpAnimation = animations[i]["id"];
                var cur = page.querySelector( ".edit-word-word-animation.select" );
                cur && cur.classList.remove( "select" );
                item.classList.add( "select" )
            }
        } );
        page.selectFontAnimation = function ( fontAnimation ) {
            for ( var i = 0; i < animations.length; i++ ) {
                if ( fontAnimation == animations[i].id ) {
                    selectedAnimationItem.innerHTML = animations[i].name;
                    selectedAnimationItem.fpAnimation = animations[i].id;
                    break
                }
            }
        };
        page.fillText = function ( textWord ) {
            text.value = "";
            text.value = textWord || "";
            textWord ? (wordCount.innerHTML = textWord.length > 200 ? "200/200" : textWord.length + "/200") : (wordCount.innerHTML = "0/200")
        };
        querySelector( ".close-edit-word-page-btn" ).onclick = function () {
            closeSlidePage( page )
        };
        saveBtn.onclick = function () {
            var mediaAttr = JSON.parse( page.textInfo.Attributes );
            var sendData = {
                model : {
                    "Guid" : page.textInfo.Guid,
                    "Text" : text.value,
                    "ID" : page.textInfo.ID,
                    "Category" : page.textInfo.Category,
                    "ActionLink" : page.textInfo.ActionLink,
                    "LayoutId" : page.pageData.LayoutId,
                    "Animation" : selectedAnimationItem.fpAnimation,
                    "Color" : selectedColorItem.fpColor,
                    "FontFamily" : selectedFaimily.fpFamily
                }, pid : page.pageData.Guid
            };
            var curLi;
            var lis = document.querySelectorAll( "li.page-list.show" );
            for ( var i = 0; i < lis.length; i++ ) {
                if ( sendData.pid == lis[i].pageData.Guid ) {
                    curLi = lis[i];
                    break
                }
            }
            if ( curLi.pageData.Layout == "custom" ) {
                sendData["customenable"] = true
            }
            loopObj( mediaAttr, function ( key, value ) {
                if ( !sendData.model[key] ) {
                    sendData.model[key] = value
                }
            } );
            fp.message( {text : "正在保存"} );
            fpInvokeAPI.saveTextConfig( sendData, function ( data ) {
                if ( data.code == 200 ) {
                    fp.message( {text : "修改成功，正在努力渲染"} );
                    var curLi = null;
                    var lis = document.querySelectorAll( "li.page-list.show" );
                    for ( var i = 0; i < lis.length; i++ ) {
                        if ( sendData.pid == lis[i].pageData.Guid ) {
                            curLi = lis[i];
                            break
                        }
                    }
                    if ( curLi == null ) {
                        return
                    }
                    for ( var me = 0; me < curLi.pageData.Medias.length; me++ ) {
                        if ( data.data.PrimaryId == curLi.pageData.Medias[me].ID ) {
                            var attr = JSON.parse( curLi.pageData.Medias[me].Attributes );
                            attr.Color = sendData.model.Color;
                            attr.Animation = sendData.model.Animation;
                            attr.FontFamily = sendData.model.FontFamily;
                            curLi.pageData.Medias[me].Attributes = JSON.stringify( attr );
                            curLi.pageData.Medias[me].Uri = data.data.Url;
                            curLi.pageData.Medias[me].Text = data.data.Text;
                            curLi.pageData.Medias[me].ID = data.data.ID;
                            curLi.pageData.Medias[me].Guid = data.data.Guid;
                            var newPage = makePage( curLi.pageData, function () {
                                curLi.removeChild( curLi.querySelector( ".page" ) );
                                curLi.appendChild( newPage );
                                mappingToScreen( newPage )
                            } );
                            break
                        }
                    }
                }
                else {
                    fp.message( {text : "修改失败，请重新操作"} )
                }
            } );
            closeSlidePage( page )
        }
    }

    function saveMedia( media, pageData, callback ) {
        var mediaAtrr = JSON.parse( media.Attributes );
        var sendData = {
            "model" : {
                "Guid" : media.Guid,
                "ID" : media.ID,
                "Text" : media.Text,
                "Category" : media.Category,
                "ActionLink" : media.ActionLink,
                "LayoutId" : pageData.LayoutId,
                "Url" : media.Uri
            }, "pid" : pageData.Guid
        };
        for ( var p in mediaAtrr ) {
            if ( !sendData.model[p] ) {
                sendData.model[p] = mediaAtrr[p]
            }
        }
        fp.message( {text : "正在保存"} );
        fpInvokeAPI.saveTextConfig( sendData, function ( data ) {
            callback( data )
        } )
    }

    function slidePageMap() {
        var page = querySelector( ".slide-page-edit-map" );
        var saveBtn = page.querySelector( ".edit-map-save-btn" );
        var searchBtn = page.querySelector( ".edit-map-search-btn" );
        var searchAddress = page.querySelector( ".edit-map-address" );
        querySelector( ".close-edit-map-page-btn" ).onclick = function () {
            closeSlidePage( page )
        };
        onTap( page.querySelector( ".edit-map-search-btn" ), function () {
        } );
        var map = new BMap.Map( "map" );
        var myGeo = new BMap.Geocoder();
        var point = new BMap.Point( 123, 111 );
        map.enableScrollWheelZoom( true );
        map.addEventListener( "dragend", function () {
            if ( !page.markerPoint ) {
                return
            }
            var center = map.getCenter();
            page.markerPoint.setPosition( center );
            openWindow( center )
        } );
        function openWindow( point ) {
            myGeo.getLocation( point, function ( result ) {
                if ( result ) {
                    var infowindow = new BMap.InfoWindow( result.address );
                    map.openInfoWindow( infowindow, point )
                }
            } )
        }

        new BMap.LocalCity().get( function ( result ) {
            point = new BMap.Point( 121.462056, 31.25592 );
            map.centerAndZoom( point, 15 );
            page.markerPoint = new BMap.Marker( point );
            page.markerPoint.enableDragging();
            setTimeout( function () {
                page.querySelector( ".BMap_Marker" ).addEventListener( "mousedown", function ( e ) {
                    e.stopPropagation()
                }, false )
            }, 100 );
            map.addOverlay( page.markerPoint );
            page.markerPoint.addEventListener( "dragend", function SetCenter() {
                var position = page.markerPoint.getPosition();
                map.panTo( position )
            } );
            page.setMapPosition = function ( point ) {
                page.markerPoint.setPosition( point );
                map.centerAndZoom( point, 15 )
            }
        } );
        searchBtn.onclick = function () {
            var local = new BMap.LocalSearch( map, {
                renderOptions : {map : map}, onSearchComplete : function ( result ) {
                    var poi = result.getPoi( 0 );
                    if ( poi && page.markerPoint ) {
                        page.markerPoint.setPosition( poi.point );
                        page.markerPoint.searchTitle = poi.title;
                        page.markerPoint.enableDragging()
                    }
                }
            } );
            local.search( searchAddress.value )
        };
        saveBtn.onclick = function () {
            closeSlidePage( page );
            var edPoint = page.markerPoint.getPosition();
            myGeo.getLocation( new BMap.Point( edPoint.lng, edPoint.lat ), function ( result ) {
                page.mapMediaInfo.Text = edPoint.lng + "$" + edPoint.lat + "$" + result.address + "$" + result.address;
                saveMedia( page.mapMediaInfo, page.pageData, function ( data ) {
                    if ( data.code == 200 ) {
                        fp.message( {text : "保存成功"} );
                        var curLi = null;
                        var lis = document.querySelectorAll( "li.page-list.show" );
                        for ( var i = 0; i < lis.length; i++ ) {
                            if ( page.pageData.Guid == lis[i].pageData.Guid ) {
                                curLi = lis[i];
                                break
                            }
                        }
                        if ( curLi == null ) {
                            return
                        }
                        for ( var me = 0; me < curLi.pageData.Medias.length; me++ ) {
                            if ( data.data.PrimaryId == curLi.pageData.Medias[me].ID ) {
                                curLi.pageData.Medias[me].Text = data.data.Text;
                                var newPage = makePage( curLi.pageData, function () {
                                    curLi.removeChild( curLi.querySelector( ".page" ) );
                                    curLi.appendChild( newPage );
                                    mappingToScreen( newPage )
                                } );
                                break
                            }
                        }
                    }
                    else {
                        fp.message( {text : "保存失败"} )
                    }
                } )
            } )
        }
    }

    function slidePageVideo() {
        var page = querySelector( ".slide-page-edit-video" );
        var tipsBtn = page.querySelector( ".edit-video-tips-btn" );
        var detailBorder = page.querySelector( ".edit-video-detail-border" );
        var saveBtn = page.querySelector( ".edit-video-save-btn" );
        var keyCode = page.querySelector( ".edit-video-text" );
        querySelector( ".close-edit-video-page-btn" ).onclick = function () {
            closeSlidePage( page )
        };
        onTap( tipsBtn, function () {
            tipsBtn.classList.toggle( "show-more" );
            detailBorder.classList.toggle( "show-more" )
        } );
        keyCode.on( "mousedown", function () {
            if ( keyCode.value == "请输入视频的通用代码" ) {
                keyCode.value = ""
            }
        } );
        var imgs = page.querySelectorAll( ".edit-video-detail-img" );
        var btns = page.querySelectorAll( ".edit-video-detail .btn" );
        var curIndex = 0;
        btns[curIndex].classList.add( "select" );
        loopArray( btns, function ( btn, i ) {
            onTap( btn, function () {
                if ( i != curIndex ) {
                    btns[curIndex].classList.remove( "select" );
                    imgs[curIndex].classList.add( "hide" );
                    btns[i].classList.add( "select" );
                    imgs[i].classList.remove( "hide" );
                    curIndex = i
                }
            } )
        } );
        saveBtn.onclick = function () {
            if ( !(/^<iframe/).test( keyCode.value ) ) {
                fp.message( {text : "请输入正确的视频通用代码"} );
                return
            }
            closeSlidePage( page );
            page.videoMediaInfo.Text = encodeURIComponent( keyCode.value );
            page.videoMediaInfo.ActionLink = "";
            fp.message( {text : "正在保存"} );
            saveMedia( page.videoMediaInfo, page.pageData, function ( data ) {
                if ( data.code == 200 ) {
                    fp.message( {text : "保存成功"} )
                }
                else {
                    fp.message( {text : "保存失败"} )
                }
            } )
        }
    }

    function slidePageAnchor() {
        var page = querySelector( ".slide-page-edit-anchor" );
        var position = page.querySelector( ".edit-anchor-position" );
        var saveBtn = page.querySelector( ".edit-anchor-save-btn" );
        var link = page.querySelector( ".edit-anchor-text" );
        onTap( page.querySelector( ".close-edit-anchor-page-btn" ), function () {
            closeSlidePage( page )
        } );
        link.on( "mousedown", function () {
            if ( link.value == "请输入要打开的链接" ) {
                link.value = ""
            }
        } );
        saveBtn.onclick = function () {
            if ( !(/^https?:/).test( link.value ) ) {
                fp.message( {text : "请输入一个合法的链接"} );
                return
            }
            closeSlidePage( page );
            page.linkMediaInfo.ActionLink = link.value;
            page.linkMediaInfo.Text = encodeURIComponent( position.value );
            saveMedia( page.linkMediaInfo, page.pageData, function ( data ) {
                if ( data.code == 200 ) {
                    fp.message( {text : "保存成功"} )
                }
                else {
                    fp.message( {text : "保存失败"} )
                }
            } )
        }
    }

    function slidePageMultiImage() {
        var page = querySelector( ".slide-page-edit-multi-img" );
        var border = page.querySelector( ".edit-multi-img-border" );
        var leftBtn = page.querySelector( ".edit-multi-img-left" );
        var rightBtn = page.querySelector( ".edit-multi-img-right" );
        var uploadBtn = page.querySelector( ".edit-multi-img-input-icon" );
        var closeBtn = page.querySelector( ".close-edit-multi-img-page-btn" );
        var formate = page.querySelector( ".edit-multi-img-editor form" );
        var inputFile = page.querySelector( ".cropit-image-input" );
        var preview = page.querySelector( ".cropit-image-preview" );
        var imageEditor = page.querySelector( ".edit-multi-img-editor" );
        var saveImgBtn = page.querySelector( ".edit-multi-img-save-btn" );
        var saveBtn = page.querySelector( ".edit-multi-img-btn" );
        $( ".edit-multi-img-border" ).sortable( {
            axis : "x", stop : function () {
                var sendDate = {id : null, ids : []};
                loopArray( page.pageData.Medias, function ( m ) {
                    if ( m.Category == 8 ) {
                        sendDate.id = m.ID
                    }
                } );
                var items = page.querySelectorAll( ".edit-multi-img-item" );
                loopArray( items, function ( item, i ) {
                    sendDate.ids.push( item.imageMedia.ID );
                    item.querySelector( ".edit-multi-img-item-count" ).innerHTML = i + 1
                } );
                fpInvokeAPI.toSortMultiImage( sendDate, function ( data ) {
                } )
            }
        } );
        saveBtn.onclick = function () {
            closeSlidePage( page );
            var curLi = null;
            var lis = document.querySelectorAll( "li.page-list.show" );
            for ( var i = 0; i < lis.length; i++ ) {
                if ( page.pageData.Guid == lis[i].pageData.Guid ) {
                    curLi = lis[i];
                    break
                }
            }
            if ( curLi ) {
                var imgs = page.querySelectorAll( ".edit-multi-img-item" );
                var len = imgs.length;
                var tem;
                switch ( page.pageData.Layout ) {
                    case "MutipleImage04":
                        tem = curLi.pageData.Medias[5];
                        curLi.pageData.Medias = curLi.pageData.Medias.slice( 0, 5 );
                        break;
                    case "MutipleImage01":
                        tem = curLi.pageData.Medias[1];
                        curLi.pageData.Medias = curLi.pageData.Medias.slice( 0, 1 );
                        break;
                    case "valentine-02":
                        tem = curLi.pageData.Medias[3];
                        curLi.pageData.Medias = curLi.pageData.Medias.slice( 0, 3 );
                        break
                }
                loop( len, function ( i ) {
                    var cur = JSON.parse( JSON.stringify( tem ) );
                    cur.Guid = imgs[i].imageMedia.Guid;
                    cur.ID = imgs[i].imageMedia.ID;
                    cur.Uri = imgs[i].imageMedia.Uri;
                    curLi.pageData.Medias.push( cur )
                } );
                var newPage = makePage( curLi.pageData, function () {
                    curLi.removeChild( curLi.querySelector( ".page" ) );
                    curLi.appendChild( newPage );
                    if ( curLi.classList.contains( "select" ) ) {
                        mappingToScreen( newPage )
                    }
                } )
            }
        };
        closeBtn.onclick = function () {
            closeSlidePage( page )
        };
        uploadBtn.onclick = function () {
            if ( page.querySelectorAll( ".edit-multi-img-item" ).length >= 20 ) {
                fp.message( {text : "一个多图版式最多上传20张图片"} )
            }
            else {
                page.querySelector( ".cropit-image-input" ).click()
            }
        };
        imageEditor.on( "mouseover", function () {
            imageEditor.classList.add( "can-save" )
        } );
        imageEditor.on( "mouseleave", function () {
            imageEditor.classList.remove( "can-save" )
        } );
        saveImgBtn.onclick = function () {
            if ( inputFile.isNeedCreat ) {
                preview.style.backgroundImage = "";
                saveImage( 0, {o : $( ".edit-multi-img-editor" ).cropit( "cropInfo" )}, function ( data ) {
                    if ( data.code != 200 ) {
                        fp.message( {text : "图片添加失败"} )
                    }
                    else {
                        inputFile.isNeedCreat = false;
                        CSS( border, {width : (border.querySelectorAll( ".edit-multi-img-item" ).length + 1) * 120 + "px"} );
                        data.data.Uri = data.data.Url;
                        makeImgItem( data.data, border.querySelectorAll( ".edit-multi-img-item" ).length );
                        border.querySelector( ".edit-multi-img-item.select" ) && border.querySelector( ".edit-multi-img-item.select" ).classList.remove( "select" );
                        var items = border.querySelectorAll( ".edit-multi-img-item" );
                        items[items.length - 1].classList.add( "select" );
                        border.curIndex = items.length - 3;
                        $( ".edit-multi-img-editor" ).cropit( "destroy" );
                        $( ".edit-multi-img-editor" ).cropit( {imageState : {src : data.data.Url}} );
                        if ( items.length > 3 ) {
                            CSS( border, {"-webkit-transform" : "translate3d(" + (-108 * border.curIndex) + "px,0,0)"} )
                        }
                    }
                    formate.reset()
                } )
            }
            else {
                var curItem = border.querySelector( ".edit-multi-img-item.select" );
                curItem.classList.add( "loading" );
                preview.style.backgroundImage = "";
                saveImage( curItem.imageMedia.ID, {
                    o : $( ".edit-multi-img-editor" ).cropit( "cropInfo" ),
                    imgUrl : curItem.imageMedia.Uri
                }, function ( data ) {
                    if ( data.code == 200 ) {
                        fp.message( {text : "图片修改成功"} );
                        curItem.classList.remove( "loading" );
                        $( ".edit-multi-img-editor" ).cropit( "destroy" );
                        $( ".edit-multi-img-editor" ).cropit( {imageState : {src : data.data.Url}} );
                        border.querySelector( ".edit-multi-img-item.select" ).classList.remove( "select" );
                        curItem.classList.add( "select" );
                        curItem.imageMedia.Uri = data.data.Url;
                        curItem.querySelector( ".edit-multi-img-item-image-wrapper" ).style.backgroundImage = "url(" + data.data.Url + ")"
                    }
                    else {
                        fp.message( {text : "图片修改失败"} )
                    }
                } )
            }
        };
        function saveImage( mediaGuid, info, callback ) {
            var parms = {
                "omid" : mediaGuid,
                "pid" : page.pageData.Guid,
                Zoom : info.o ? 0.5 * info.o.zoom / 0.3 : 0.5,
                OffsetX : info.o ? -info.o.offset.x * 0.5 / 0.3 : 0,
                OffsetY : info.o ? -info.o.offset.y * 0.5 / 0.3 : 0,
                Scale : 2,
                isRichMedia : true
            };
            var fd = new window.FormData();
            loopObj( parms, function ( key, value ) {
                fd.append( key, value )
            } );
            if ( info && info.imgUrl ) {
                fd.append( "imgUrl", info.imgUrl )
            }
            else {
                fd.append( "blob-fileName", inputFile.files[0].name );
                fd.append( "imgFile", inputFile.files[0], inputFile.files[0].name )
            }
            var size = {width : null, height : null};
            for ( var i = 0; i < page.pageData.Medias.length; i++ ) {
                if ( page.pageData.Medias[i].Category == 8 ) {
                    var attr = JSON.parse( page.pageData.Medias[i].Attributes );
                    size.width = attr.W;
                    size.height = attr.H;
                    break
                }
            }
            if ( size.height ) {
                fd.append( "Width", size.width );
                fd.append( "Height", size.height )
            }
            fpInvokeAPI.saveImageConfig( {
                data : fd, success : function ( data ) {
                    callback( data )
                }
            } )
        }

        inputFile.onchange = function () {
            imageEditor.classList.add( "can-save" );
            inputFile.isNeedCreat = true
        };
        function makeImgItem( image, i, style ) {
            var itemBorder = element( "div", {"classList" : "edit-multi-img-item"}, border );
            element( "div", {"classList" : "edit-multi-img-item-loading-icon"}, itemBorder );
            itemBorder.imageMedia = image;
            if ( i == 0 ) {
                $( ".edit-multi-img-editor" ).cropit( "destroy" );
                $( ".edit-multi-img-editor" ).cropit( {imageState : {src : image.Uri}} );
                itemBorder.classList.add( "select" )
            }
            var count = element( "div", {"classList" : "edit-multi-img-item-count"}, itemBorder );
            count.innerHTML = i + 1;
            var deleteBtn = element( "div", {"classList" : "edit-multi-img-item-delete"}, itemBorder );
            var imageWrapper = element( "div", {"classList" : "edit-multi-img-item-image-wrapper"}, itemBorder );
            CSS( imageWrapper, {
                "background-image" : "url(" + image.Uri + ")",
                "background-repeat" : "no-repeat",
                "background-position" : "0 0",
                "background-size" : "88px auto"
            } );
            if ( style ) {
                var s = style.backgroundSize.split( "px" );
                var w = parseInt( s[0] );
                CSS( imageWrapper, {"background-position" : style.backgroundPosition, "background-size" : w * 88 / 192 + "px auto"} )
            }
            deleteBtn.onclick = function ( e ) {
                e.stopPropagation();
                if ( border.querySelectorAll( ".edit-multi-img-item" ).length == 1 ) {
                    fp.message( {text : "多图中需要至少有一张图"} )
                }
                else {
                    border.removeChild( itemBorder );
                    var leftItems = border.querySelectorAll( ".edit-multi-img-item" );
                    var deleteIndex = parseInt( itemBorder.querySelector( ".edit-multi-img-item-count" ).innerHTML ) - 1;
                    var curItem;
                    if ( leftItems[deleteIndex] ) {
                        curItem = leftItems[deleteIndex]
                    }
                    else {
                        curItem = leftItems[deleteIndex - 1]
                    }
                    if ( itemBorder.classList.contains( "select" ) ) {
                        curItem.classList.add( "select" );
                        $( ".edit-multi-img-editor" ).cropit( "destroy" );
                        $( ".edit-multi-img-editor" ).cropit( {imageState : {src : curItem.querySelector( ".edit-multi-img-item-image-wrapper" ).style.backgroundImage.slice( 4, -1 )}} )
                    }
                    loopArray( leftItems, function ( item, i ) {
                        item.querySelector( ".edit-multi-img-item-count" ).innerHTML = i + 1
                    } );
                    image.ID && fpInvokeAPI.deleteImageFromMultiImages( {pid : page.pageData.Guid, mid : image.ID}, function ( d ) {
                    } )
                }
            };
            onTap( imageWrapper, function () {
                inputFile.isNeedCreat = false;
                preview.classList.remove( "hide" );
                var curItem = border.querySelector( ".edit-multi-img-item.select" );
                curItem && curItem.classList.remove( "select" );
                $( ".edit-multi-img-editor" ).cropit( "destroy" );
                $( ".edit-multi-img-editor" ).cropit( {imageState : {src : itemBorder.imageMedia.Uri}} );
                itemBorder.classList.add( "select" )
            } );
            return itemBorder
        }

        border.left = 0;
        border.curIndex = 0;
        page.init = function ( pageInfo ) {
            var imageMedias = pageInfo.pageData.Layout == "MutipleImage04" ? pageInfo.imgMediaInfo.slice( 3 ) : pageInfo.imgMediaInfo;
            switch ( pageInfo.pageData.Layout ) {
                case "MutipleImage04":
                    imageMedias = pageInfo.imgMediaInfo.slice( 3 );
                    break;
                case "MutipleImage01":
                    imageMedias = pageInfo.imgMediaInfo;
                    break;
                case "valentine-02":
                    imageMedias = pageInfo.imgMediaInfo.slice( 1 );
                    break
            }
            if ( pageInfo.pageData.Layout == "valentine-02" ) {
                insertCSSRules( {
                    ".edit-multi-img-window" : {height : "95px"},
                    ".edit-page-slide-page-border .edit-multi-img-editor .cropit-image-preview" : {height : "192px"},
                    ".edit-multi-img-item-image-wrapper" : {height : "88px"},
                    ".edit-multi-img-right" : {top : "110px"},
                    ".edit-multi-img-left" : {top : "142px"}
                } )
            }
            else {
                insertCSSRules( {
                    ".edit-multi-img-window" : {height : "141px"},
                    ".edit-page-slide-page-border .edit-multi-img-editor .cropit-image-preview" : {height : "302px"},
                    ".edit-multi-img-item-image-wrapper" : {height : "134px"},
                    ".edit-multi-img-right" : {top : "135px"},
                    ".edit-multi-img-left" : {top : "165px"}
                } )
            }
            page.pageData = pageInfo.pageData;
            border.innerHTML = "";
            page.imageMedias = imageMedias;
            CSS( border, {width : imageMedias.length * 120 + "px"} );
            loopArray( imageMedias, function ( image, i ) {
                makeImgItem( image, i )
            } )
        };
        leftBtn.onclick = function () {
            if ( border.curIndex > 0 ) {
                border.curIndex -= 1;
                CSS( border, {"-webkit-transform" : "translate3d(" + (-108 * border.curIndex) + "px,0,0)"} )
            }
        };
        rightBtn.onclick = function () {
            if ( border.curIndex + 2 < page.querySelectorAll( ".edit-multi-img-item" ).length - 1 ) {
                border.curIndex += 1;
                CSS( border, {"-webkit-transform" : "translate3d(" + (-108 * border.curIndex) + "px,0,0)"} )
            }
        }
    }

    function saveUserConfig( isMusic, callback ) {
        var crop = $( ".edit-setting-page .crop-img-border" ).cropit( "cropInfo" );
        var inputFile = querySelector( ".edit-setting-page .crop-img-border .cropit-image-input" );
        var fd = new FormData();
        if ( !isMusic && inputFile.files.length != 0 ) {
            fd.append( "blob-fileName", inputFile.files[0].name );
            fd.append( "logo-thumbnail", inputFile.files[0], inputFile.files[0].name )
        }
        loopObj( {
            "Id" : window.workId,
            "Title" : querySelector( ".edit-setting-title textarea" ).value,
            "Description" : querySelector( ".edit-description textarea" ).value,
            "Thumbnail" : querySelector( ".edit-page-theme-thumbnail img" ).src,
            "Switch" : querySelector( ".edit-setting-page .page-turning-animation" ).value,
            "Mode" : querySelector( ".edit-setting-page .page-turning-gesture" ).value,
            "BackgroundMusic" : !isMusic ? querySelector( ".edit-music-make-sure" ).musicUrl : querySelector( ".edit-music-page .select.item .name" ).music.url,
            "Zoom" : crop.zoom,
            "OffsetX" : Math.abs( crop.offset.x ),
            "OffsetY" : Math.abs( crop.offset.y ),
            "Width" : 100,
            "Height" : 100,
            "Scale" : 2,
            "WorkVisibility" : arguments[2] || 11,
            "CustomCopyrightEnable" : (function () {
                var value = querySelector( ".edit-setting-page .page-turning-signature" ).value;
                var isOpen = querySelector( ".edit-setting-switch-hot" ).classList.contains( "close" );
                if ( value == "default" ) {
                    return 0
                }
                else {
                    if ( value == "custom" && isOpen ) {
                        return 1
                    }
                    else {
                        return 2
                    }
                }
            })()
        }, function ( key, value ) {
            fd.append( key, value )
        } );
        fpInvokeAPI.saveConfig( {data : fd, success : callback} )
    }

    function pageEditMusic() {
        var openBtn = querySelector( ".edit-page-music-setting-btn" );
        var closeBtn = querySelector( ".close-edit-music-page" );
        var page = querySelector( ".edit-music-page" );
        var systemMusicBtn = querySelector( ".edit-music-system-music-list-btn" );
        var userMusicBtn = querySelector( ".edit-music-user-music-list-btn" );
        var systemList = querySelector( ".edit-music-system-music-list" );
        var userList = querySelector( ".edit-music-user-music-list" );
        var inputMusicFile = querySelector( ".edit-music-user-music-list .edit-music-user-file-up" );
        var updateMusicBtn = querySelector( ".edit-music-user-music-list .update-music" );
        var audio = querySelector( ".edit-music-page audio" );
        var saveMusicBtn = querySelector( ".edit-music-make-sure" );
        querySelector( ".close-edit-music-page-hide-btn" ).onclick = function () {
            page.classList.add( "hide" )
        };
        page.addEventListener( "mouseover", function () {
            page.classList.add( "top" )
        }, false );
        page.addEventListener( "mouseout", function () {
            page.classList.remove( "top" )
        }, false );
        saveMusicBtn.onclick = function () {
            if ( page.querySelector( ".select.item" ) ) {
                saveMusicBtn.musicUrl = page.querySelector( ".select.item .name" ).music.url;
                fp.message( {text : "正在保存设置"} );
                saveUserConfig( true, function ( data ) {
                    page.classList.add( "hide" );
                    data.code == 200 && fp.message( {text : "保存成功"} )
                } )
            }
            else {
                fp.message( {text : "请选一首喜欢的音乐"} )
            }
        };
        openBtn.onclick = function () {
            page.classList.remove( "hide" )
        };
        var curSwitch = systemMusicBtn;
        curSwitch.classList.add( "select" );
        systemMusicBtn.onclick = function () {
            if ( curSwitch != systemMusicBtn ) {
                curSwitch.classList.remove( "select" );
                curSwitch = systemMusicBtn;
                curSwitch.classList.add( "select" );
                systemList.classList.add( "select" );
                userList.classList.remove( "select" )
            }
        };
        userMusicBtn.isLoadData = false;
        userMusicBtn.onclick = function () {
            if ( curSwitch != userMusicBtn ) {
                curSwitch.classList.remove( "select" );
                curSwitch = userMusicBtn;
                curSwitch.classList.add( "select" );
                systemList.classList.remove( "select" );
                if ( !userMusicBtn.isLoadData ) {
                    var container = userList.querySelector( ".music-list" );
                    userList.classList.add( "select" );
                    container.classList.add( "loading" );
                    fpInvokeAPI.getMusicListByCategory( "custom", function ( data ) {
                        container.classList.remove( "loading" );
                        if ( data.code == 200 ) {
                            userMusicBtn.isLoadData = true;
                            loopArray( data.data, function ( music, i ) {
                                var item = systemTemPlate.make( ".user-music-item" );
                                var name = item.querySelector( ".name" );
                                var btn = item.querySelector( ".btn" );
                                item.musicName = music.Name + ".mp3";
                                name.innerHTML = music.Name;
                                name.music = {Id : music.Id, url : music.Url, MusicType : music.MusicType};
                                onTap( name, function () {
                                    page.querySelector( ".item.select" ) && page.querySelector( ".item.select" ).classList.remove( "select" );
                                    name.parentNode.classList.add( "select" )
                                } );
                                onTap( btn, function () {
                                    if ( !btn.classList.contains( "play" ) ) {
                                        page.querySelector( ".play.btn" ) && page.querySelector( ".play.btn" ).classList.remove( "play" );
                                        btn.classList.add( "play" );
                                        audio.src = name.music.url;
                                        audio.play()
                                    }
                                    else {
                                        btn.classList.remove( "play" );
                                        audio.pause()
                                    }
                                } );
                                container.appendChild( item )
                            } )
                        }
                    } )
                }
            }
        };
        closeBtn.onclick = function () {
            page.classList.add( "hide" )
        };
        updateMusicBtn.onclick = function () {
            inputMusicFile.click()
        };
        inputMusicFile.onchange = function () {
            if ( inputMusicFile.files.length == 0 ) {
                return
            }
            var musicName = inputMusicFile.files[0].name;
            var musicLastModified = inputMusicFile.files[0].lastModified;
            var musicSize = inputMusicFile.files[0].size;
            if ( musicSize > 4 * MB ) {
                alert( "音乐文件不能超过4MB~" );
                return
            }
            var userMusicItems = userList.querySelectorAll( ".user-music-item" );
            var isLive = false;
            if ( userMusicItems.length != 0 ) {
                for ( var i = 0; i < userMusicItems.length; i++ ) {
                    if ( userMusicItems[i].musicName == musicName ) {
                        alert( "同一首音乐只能上传一次哟~!" );
                        isLive = true;
                        break
                    }
                }
                if ( !isLive ) {
                    processUpload( inputMusicFile.files[0] )
                }
            }
            else {
                processUpload( inputMusicFile.files[0] )
            }
            function processUpload( file ) {
                var fd = new FormData();
                fd.append( "blob-fileName", file.name );
                fd.append( "MyFile", file, file.name );
                var item = systemTemPlate.make( ".user-music-item" );
                item.classList.add( "loading" );
                item.musicName = file.name;
                var name = item.querySelector( ".name" );
                name.innerHTML = file.name.substring( 0, file.name.indexOf( "." ) );
                var list = querySelector( ".edit-music-user-music-list  .music-list" );
                list.insertBefore( item, list.querySelector( ".user-music-item" ) );
                var btn = item.querySelector( ".btn" );
                var syncxhr = null;
                var uploadxhr = null;
                onTap( btn, function () {
                    if ( item.classList.contains( "loading" ) ) {
                        syncxhr && syncxhr.abort();
                        uploadxhr && uploadxhr.abort();
                        list.removeChild( item )
                    }
                    else {
                        if ( !btn.classList.contains( "play" ) ) {
                            page.querySelector( ".play.btn" ) && page.querySelector( ".play.btn" ).classList.remove( "play" );
                            btn.classList.add( "play" );
                            audio.src = name.music.url;
                            audio.play()
                        }
                        else {
                            btn.classList.remove( "play" );
                            audio.pause()
                        }
                    }
                } );
                uploadxhr = fpInvokeAPI.uploadUserMusic( {
                    data : fd, success : function ( data ) {
                        item.url = data.data.Url;
                        syncxhr = fpInvokeAPI.syncUploadMusic( {FileName : data.data.FileName, Url : data.data.Url}, function ( syndata ) {
                            if ( syndata.code == 200 ) {
                                CSS( item.querySelector( ".already-progress" ), {width : "100%"} );
                                setTimeout( function () {
                                    item.classList.remove( "loading" );
                                    name.music = {Id : data.data.ID, url : data.data.Url, MusicType : 2};
                                    onTap( name, function () {
                                        var cur = page.querySelector( ".item.select" );
                                        cur && cur.classList.remove( "select" );
                                        item.classList.add( "select" )
                                    } )
                                }, 1000 )
                            }
                        } )
                    }, progress : function ( e ) {
                        CSS( item.querySelector( ".already-progress" ), {width : e.loaded / e.total * 100 * 0.8 + "%"} )
                    }
                } )
            }
        }
    }

    function editSetting() {
        var page = querySelector( ".edit-setting-page" );
        var changeThBtn = querySelector( ".virtual-input-file-btn" );
        var fileInput = querySelector( ".edit-setting-page .cropit-image-input" );
        var title = querySelector( ".edit-setting-page .edit-setting-title textarea" );
        var description = querySelector( ".edit-setting-page .edit-description textarea" );
        var descriptionCount = querySelector( ".edit-setting-page .edit-description .count" );
        var titleCount = querySelector( ".edit-setting-page .edit-setting-title .count" );
        var moreBtn = querySelector( ".edit-setting-page .more" );
        var moreBorder = querySelector( ".edit-setting-more-option-border" );
        var hotSwitch = querySelector( ".edit-setting-switch-hot" );
        var publicitySwitch = querySelector( ".edit-setting-switch-publicity" );
        var recommendSwitch = querySelector( ".edit-setting-switch-recommend" );
        var closePageBtn = querySelector( ".close-edit-setting-page" );
        var openPageBtn = querySelector( ".edit-page-theme-setting-btn" );
        var makeSureBtn = querySelector( ".edit-setting-make-sure" );
        var number = 11;
        var signature = page.querySelector( ".page-turning-signature" );
        var signatureWord = page.querySelector( ".shut-down-remen" );
        hotSwitch.classList.add( "not-visible" );
        signatureWord.classList.add( "not-visible" );
        signature.onchange = function () {
            if ( signature.selectedOptions[0].value == "custom" ) {
                hotSwitch.classList.remove( "not-visible" );
                signatureWord.classList.remove( "not-visible" )
            }
            else {
                hotSwitch.classList.add( "not-visible" );
                signatureWord.classList.add( "not-visible" )
            }
        };
        $( ".edit-setting-page .crop-img-border" ).cropit();
        page.addEventListener( "mouseover", function () {
            page.classList.add( "top" )
        }, false );
        page.addEventListener( "mouseout", function () {
            page.classList.remove( "top" )
        }, false );
        querySelector( ".close-edit-setting-page-hide-btn" ).onclick = function () {
            page.classList.add( "hide" )
        };
        changeThBtn.onclick = function () {
            fileInput.click()
        };
        title.onkeyup = function () {
            setWordCount( title, titleCount, 32 )
        };
        title.onkeydown = function () {
            setWordCount( title, titleCount, 32 )
        };
        function setWordCount( textarea, wordCountSpan, maxLength ) {
            var enterCount = 0;
            for ( var i = 0; i < textarea.value.length; i++ ) {
                if ( textarea.value[i] == "\n" ) {
                    enterCount += 1
                }
            }
            var count = textarea.value.length + enterCount;
            wordCountSpan.innerHTML = (count > maxLength ? maxLength : count) + "/" + maxLength
        }

        description.addEventListener( "keydown", function ( e ) {
            descriptionCount.innerHTML = this.value.length == 1 && e.keyCode == 8 ? 2 : this.value.length + "/" + this.maxLength
        }, false );
        moreBtn.onclick = function () {
            querySelector( ".edit-setting-page .triangle" ).classList.toggle( "show-more" );
            moreBorder.classList.toggle( "show-more" )
        };
        hotSwitch.onclick = function () {
            this.classList.toggle( "close" )
        };
        publicitySwitch.onclick = function () {
            if ( !publicitySwitch.classList.contains( "close" ) ) {
                recommendSwitch.classList.add( "close" );
                number = 2
            }
            else {
                number = 1
            }
            publicitySwitch.classList.toggle( "close" )
        };
        recommendSwitch.onclick = function () {
            if ( recommendSwitch.classList.contains( "close" ) ) {
                publicitySwitch.classList.remove( "close" );
                number = 11
            }
            else {
                number = 12
            }
            this.classList.toggle( "close" )
        };
        closePageBtn.onclick = function () {
            page.classList.add( "hide" )
        };
        openPageBtn.onclick = function () {
            page.classList.remove( "hide" )
        };
        makeSureBtn.onclick = function () {
            fp.message( {text : "正在保存您的配置"} );
            saveUserConfig( false, function ( data ) {
                if ( data.code == 200 ) {
                    fp.message( {text : "保存成功"} );
                    querySelector( ".edit-page-theme-thumbnail img" ).src = data.data;
                    querySelector( ".edit-page-theme-title" ).innerHTML = querySelector( ".edit-setting-title textarea" ).value
                }
                page.classList.add( "hide" )
            }, number )
        }
    }

    function presetPreviewPage() {
        var backBtn = previewPage.querySelector( ".preview-page-back-btn" );
        var iframe = previewPage.querySelector( "iframe" );
        iframe.onload = function () {
            try {
                iframe.contentDocument.querySelector( ".preview-page" ).parentNode.removeChild( iframe.contentDocument.querySelector( ".preview-page" ) )
            }
            catch ( e ) {
            }
        };
        backBtn.onclick = function () {
            previewPage.classList.remove( "show" );
            iframe.src = ""
        };
        querySelector( ".edit-page-preview.edit-page-icon" ).onclick = function () {
            previewPage.classList.add( "show" );
            iframe.src = virtualPath + "/" + workId
        };
        querySelector( ".preview-page-pre-page" ).onclick = function () {
            iframe.contentWindow.jumpPage( iframe.contentWindow.curPageIndex - 1 )
        };
        querySelector( ".preview-page-next-page" ).onclick = function () {
            iframe.contentWindow.jumpPage( iframe.contentWindow.curPageIndex + 1 )
        }
    }

    presetPreviewPage();
    editSetting();
    pageEditMusic();
    slidePageEditWord();
    slidePageEditBgImg();
    slidePageMap();
    slidePageVideo();
    slidePageAnchor();
    slidePageMultiImage();
    presetAddPage();
    function loadTemplate() {
        var wall = querySelector( ".edit-add-page-template-wall" );
        var makeSure = querySelector( ".edit-page-add-page-setting-page .edit-add-page-btn" );
        addPageSettingPage.classList.add( "loading" );
        fpInvokeAPI.getAllTemplate( function ( data ) {
            addPageSettingPage.isLoadTemplate = true;
            addPageSettingPage.classList.remove( "loading" );
            loopArray( data.data, function ( template, i ) {
                if ( template.State == 1 && !notSupportList[template.ID] ) {
                    var ne = systemTemPlate.make( ".template-item-border" );
                    var thumbnail = ne.querySelector( ".template-thumbnail" );
                    CSS( thumbnail, {"background" : "url(" + template.Thumbnail + ")", "background-size" : "cover"} );
                    ne.querySelector( ".template-description" ).innerHTML = template.Description;
                    wall.appendChild( ne );
                    onTap( thumbnail, function () {
                        wall.curselect && wall.curselect.classList.remove( "select" );
                        thumbnail.classList.add( "select" );
                        wall.curselect = thumbnail;
                        fp.message( {text : "正在添加新页面"} );
                        fpInvokeAPI.addPage( template.ID, function ( data ) {
                            if ( data.code == 200 ) {
                                fp.message( {text : "添加成功"} );
                                var li = appendOnePage( data.data, document.querySelectorAll( ".thumbnail-page-list li.show" ).length + 1, function ( page ) {
                                    mappingToScreen( page )
                                } );
                                var pageListBorder = querySelector( ".edit-page-left ul" );
                                pageListBorder.scrollTop = pageListBorder.querySelectorAll( "li.show" ).length * 154 - pageListBorder.offsetHeight;
                                pageListBorder.querySelector( "li.select" ) && pageListBorder.querySelector( "li.select" ).classList.remove( "select" );
                                li.classList.add( "select" )
                            }
                        } )
                    } )
                }
            } )
        } )
    }

    onTap( addPageBtn, function () {
        addPageBtn.classList.add( "hide" );
        openInnerPage( addPageSettingPage );
        if ( addPageSettingPage.isLoadTemplate == false ) {
            loadTemplate()
        }
    } );
    function makePage( data, callback ) {
        function getPosition( p ) {
            switch ( p ) {
                case "上":
                    return "top";
                case "中":
                    return "middle";
                case "下":
                    return "bottom"
            }
            return "middle"
        }

        function hexToRgb( hex ) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
            return result ? {r : parseInt( result[1], 16 ), g : parseInt( result[2], 16 ), b : parseInt( result[3], 16 )} : null
        }

        var modeName, imgArr = [], textArr = [], videoArr = [], imageinfo = [], location = [], actionlinks = [], position = [], signup = {};
        var imgMediaInfo = [];
        var textMediaInfo = [];
        var videoMediaInfo = [];
        var linkMediaInfo = [];
        var mapMediaInfo = [];
        loopArray( data.Medias, function ( media ) {
            var attr = JSON.parse( media.Attributes );
            switch ( media.Category ) {
                case 1:
                case 56:
                    media.Text && textArr.push( media.Text );
                    media.Text && textMediaInfo.push( media );
                    break;
                case 2:
                case 7:
                case 9:
                case 11:
                case 57:
                case 58:
                    if ( media.Category == 57 ) {
                        if ( data.Layout == "custom" ) {
                            imgMediaInfo.push( media );
                            if ( media.Uri ) {
                                imgArr.push( media.Uri )
                            }
                            else {
                                if ( attr.Alpha ) {
                                    var rgb = hexToRgb( attr.Color );
                                    imgArr.push( "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + attr.Alpha + ")" )
                                }
                                else {
                                    imgArr.push( attr.Color )
                                }
                            }
                        }
                    }
                    else {
                        if ( media.Uri ) {
                            media.Uri && imgArr.push( media.Uri )
                        }
                        else {
                            imgArr.push( virtualPath + "/content/image/texteditspace.png" )
                        }
                        imgMediaInfo.push( media )
                    }
                    if ( data.Layout == "custom" ) {
                        attr && imageinfo.push( {
                            x : attr.X,
                            y : attr.Y,
                            animation : attr.Animation,
                            width : attr.W,
                            height : attr.H,
                            rotate : attr.R,
                            maskRadius : attr.BorderRadius,
                            "animation-delay" : attr.AnimationDelay,
                            "animation-duration" : attr.AnimationDuration
                        } )
                    }
                    if ( media.Category == 11 ) {
                        media.Text && position.push( getPosition( media.Text ) );
                        signup.formId = "";
                        signup.template = "{}"
                    }
                    break;
                case 5:
                    media.ActionLink && videoArr.push( media.ActionLink );
                    media.ActionLink && videoMediaInfo.push( media );
                    break;
                case 3:
                    if ( media.Text ) {
                        var loc = media.Text.split( "$" );
                        location.push( {lng : loc[0], lat : loc[1], name : loc[2], address : loc[3]} );
                        mapMediaInfo.push( media )
                    }
                    break;
                case 6:
                    media.Text && position.push( getPosition( media.Text ) );
                    media.ActionLink && actionlinks.push( media.ActionLink );
                    media.Text && linkMediaInfo.push( media );
                    break
            }
        } );
        modeName = data.Layout;
        var page = ppt.layoutPage( {
            label : modeName,
            image : imgArr,
            text : textArr,
            video : videoArr,
            imageinfo : imageinfo,
            location : location,
            position : position
        }, callback );
        page.pageInfo = {
            imageInfo : imageinfo,
            textInfo : textArr,
            imgMediaInfo : imgMediaInfo,
            textMediaInfo : textMediaInfo,
            videoMediaInfo : videoMediaInfo,
            linkMediaInfo : linkMediaInfo,
            mapMediaInfo : mapMediaInfo,
            pageData : data
        };
        if ( notSupportList[data.LayoutId] ) {
            var notSupportImage = new Image();
            notSupportImage.classList.add( "not-surppot-image" );
            notSupportImage.src = staticImgSrc( "image/not-surppot.png" );
            page.appendChild( notSupportImage )
        }
        return page
    }

    function appendOnePage( pageData, i, renderFinishedCallBack ) {
        var pageListBorder = querySelector( ".edit-page-left ul" );
        var li = systemTemPlate.make( ".page-list" );
        var page = makePage( pageData, function () {
            page.pageInfo.pageData = pageData;
            renderFinishedCallBack && renderFinishedCallBack( page );
            onTap( li, function () {
                pageListBorder.querySelector( "li.select" ).classList.remove( "select" );
                li.classList.add( "select" );
                mappingToScreen( li.querySelector( ".page" ) );
                closeAllSlidePage()
            } )
        } );
        li.appendChild( page );
        li.classList.add( "show" );
        var deleteBtn = li.querySelector( ".delete-btn" );
        li.Guid = pageData.Guid;
        deleteBtn.Guid = pageData.Guid;
        deleteBtn.Id = pageData.Id;
        li.pageData = pageData;
        onTap( deleteBtn, function () {
            if ( confirm( "确认要删除该页面么？" ) ) {
                fpInvokeAPI.deletePage( deleteBtn.Guid, function ( data ) {
                } );
                li.classList.add( "hide" );
                li.classList.remove( "show" );
                loopArray( pageListBorder.querySelectorAll( "li.show" ), function ( li, i ) {
                    li.querySelector( ".thumbnail-page-list-item-num span" ).innerHTML = i + 1
                } );
                if ( pageListBorder.querySelectorAll( "li" ).length == pageListBorder.querySelectorAll( "li.hide" ).length ) {
                    var screen = querySelector( ".edit-page-phone-screen" );
                    screen.innerHTML = "";
                    addPageBtn.classList.add( "hide" );
                    openInnerPage( addPageSettingPage );
                    if ( addPageSettingPage.isLoadTemplate == false ) {
                        loadTemplate()
                    }
                }
                else {
                    var next = pageViewJumpTo( 1, true );
                    if ( next.el == null ) {
                        next = pageViewJumpTo( -1, true )
                    }
                    mappingToScreen( next.el.querySelector( ".page" ) )
                }
            }
        } );
        li.querySelector( "span" ).innerHTML = i;
        pageListBorder.appendChild( li );
        return li
    }

    var screenMessageTimeId;
    var screenMessage = function ( text ) {
        clearTimeout( screenMessageTimeId );
        var screen = querySelector( ".edit-page-phone-screen" );
        var messageBox = screen.querySelector( ".edit-page-screen-message-box" );
        if ( !messageBox ) {
            messageBox = element( "div", {classList : "edit-page-screen-message-box"}, screen )
        }
        setTimeout( function () {
            messageBox.classList.add( "show" )
        }, 10 );
        messageBox.innerHTML = text;
        screenMessageTimeId = setTimeout( function () {
            clearTimeout( screenMessageTimeId );
            messageBox.classList.remove( "show" )
        }, 1500 )
    };

    function mappingToScreen( page ) {
        if ( querySelector( "li.page-list.select" ).pageData.Id != page.pageInfo.pageData.Id ) {
            return
        }
        var editWordPage = querySelector( ".slide-page-edit-word" );
        var editImagePage = querySelector( ".slide-page-edit-bgimg" );
        var editVideoPage = querySelector( ".slide-page-edit-video" );
        var editLinkPage = querySelector( ".slide-page-edit-anchor" );
        var editMapPage = querySelector( ".slide-page-edit-map" );
        var editMultiImagePage = querySelector( ".slide-page-edit-multi-img" );

        function getPageCo( el ) {
            var x = 0;
            var y = 0;
            while ( true ) {
                if ( el.classList.contains( "page" ) ) {
                    break
                }
                x += el.x;
                y += el.y;
                el = el.parentNode
            }
            return {x : x, y : y}
        }

        function initSlideWordPage( info, media ) {
            editWordPage.textInfo = media;
            editWordPage.selectColor( info.Color );
            editWordPage.selectFontAnimation( info.Animation );
            editWordPage.selectFontFamily( info.FontFamily );
            editWordPage.fillText( media.Text )
        }

        function saveTextConfig( media, pageData, callback ) {
            var mediaAttr = JSON.parse( media.Attributes );
            var sendData = {
                model : {
                    "Guid" : media.Guid,
                    "Text" : media.Text,
                    "ID" : media.ID,
                    "Category" : media.Category,
                    "ActionLink" : media.ActionLink,
                    "LayoutId" : pageData.LayoutId
                }, pid : pageData.Guid, customenable : true
            };
            loopObj( mediaAttr, function ( key, value ) {
                if ( !sendData.model[key] ) {
                    sendData.model[key] = value
                }
            } );
            fpInvokeAPI.saveTextConfig( sendData, callback )
        }

        var screen = querySelector( ".edit-page-phone-screen" );
        var bigPage = page.cloneNode( true );
        var sCanvas = page.querySelectorAll( "canvas" );
        if ( sCanvas.length != 0 ) {
            var bCanvas = bigPage.querySelectorAll( "canvas" );
            loopArray( sCanvas, function ( s, i ) {
                bCanvas[i].getContext( "2d" ).drawImage( s, 0, 0 )
            } )
        }
        bigPage.pageInfo = page.pageInfo;
        var newPlugs = bigPage.querySelectorAll( ".layout-component-from-data" );
        var virtualLayer = element( "div", {classList : "virtual-layer"}, null );
        if ( !notSupportList[page.pageInfo.pageData.LayoutId] ) {
            var curLi = null;
            var lis = document.querySelectorAll( "li.page-list.show" );
            for ( var n = 0; n < lis.length; n++ ) {
                if ( page.pageInfo.pageData.Guid == lis[n].pageData.Guid ) {
                    curLi = lis[n];
                    break
                }
            }
            var bigPagePlugs = bigPage.querySelectorAll( ".layout-component-from-data" );
            var pagePlugs = curLi.querySelectorAll( ".layout-component-from-data" );
            loopArray( page.querySelectorAll( ".layout-component-from-data" ), function ( plug, i ) {
                newPlugs[i].dataSource = plug.dataSource;
                var editableObj = element( "div", {classList : "virtual-layer-editable-obj"}, virtualLayer );
                var info = null;
                if ( plug.dataSource.from == "image" ) {
                    info = JSON.parse( page.pageInfo.imgMediaInfo[plug.dataSource.index].Attributes );
                    if ( page.pageInfo.imgMediaInfo[plug.dataSource.index].Category == 57 ) {
                        return
                    }
                    else {
                        if ( page.pageInfo.imgMediaInfo[plug.dataSource.index].Category == 7 ) {
                            var dragObj = element( "div", {classList : "virtual-layer-editable-drag-obj"}, editableObj );
                            dragObj.wx = editableObj.wx;
                            dragObj.wy = editableObj.wy;
                            dragObj.ww = editableObj.ww;
                            dragObj.wh = editableObj.wh;
                            dragObj.wr = editableObj.wr;
                            onTap( dragObj, function () {
                                if ( editableObj.classList.contains( "select" ) ) {
                                    closeAllSlidePage()
                                }
                                else {
                                    virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                                    editWordPage.pageData = page.pageInfo.pageData;
                                    initSlideWordPage( info, page.pageInfo.imgMediaInfo[plug.dataSource.index] );
                                    querySelector( ".slide-page-edit-word" ).classList.remove( "pure-word" );
                                    openSlidePage( querySelector( ".slide-page-edit-word" ) )
                                }
                                editableObj.classList.toggle( "select" )
                            } );
                            var liMediaData = null;
                            if ( curLi ) {
                                for ( n = 0; n < curLi.pageData.Medias.length; n++ ) {
                                    if ( curLi.pageData.Medias[n].ID == page.pageInfo.imgMediaInfo[plug.dataSource.index].ID ) {
                                        liMediaData = curLi.pageData.Medias[n];
                                        break
                                    }
                                }
                            }
                            if ( page.pageInfo.pageData.AllowCustom ) {
                                editableObj.onmouseover = function () {
                                    fp.message( {text : "按住可以拖拽"} )
                                };
                                var scaleAndRotateBasicPoint = element( "img", {
                                    classList : "scale-rotate-basic-point",
                                    src : staticImgSrc( "image/scale-rotate-basic-point.png" )
                                }, editableObj );
                                var scalePoint = element( "img", {
                                    classList : "scale-basic-point",
                                    src : staticImgSrc( "image/scale-basic-point.png" )
                                }, editableObj );
                                onDrag( dragObj, {
                                    end : function ( pos ) {
                                        editableObj.wx = (editableObj.wx || 0) + pos.dx;
                                        editableObj.wy = (editableObj.wy || 0) + pos.dy;
                                        var Attributes = JSON.parse( page.pageInfo.imgMediaInfo[plug.dataSource.index].Attributes );
                                        if ( editableObj.wscale < 1 ) {
                                            Attributes.X = (editableObj.wx + editableObj.ww * (1 - editableObj.wscale) / 2) << 0;
                                            Attributes.Y = (editableObj.wy + editableObj.wh * (1 - editableObj.wscale) / 2) << 0
                                        }
                                        else {
                                            Attributes.X = (editableObj.wx - editableObj.ww * (editableObj.wscale - 1) / 2) << 0;
                                            Attributes.Y = (editableObj.wy - editableObj.wh * (editableObj.wscale - 1) / 2) << 0
                                        }
                                        liMediaData.Attributes = page.pageInfo.imgMediaInfo[plug.dataSource.index].Attributes = JSON.stringify( Attributes );
                                        saveTextConfig( page.pageInfo.imgMediaInfo[plug.dataSource.index], page.pageInfo.pageData, function ( a ) {
                                        } );
                                        curLi.pageData.Layout = "custom"
                                    }, move : function ( pos ) {
                                        translate( editableObj, (editableObj.wx || 0) + pos.dx, (editableObj.wy || 0) + pos.dy, editableObj.wscale, editableObj.wrotate );
                                        translate( bigPagePlugs[i], (editableObj.wx || 0) + pos.dx, (editableObj.wy || 0) + pos.dy, editableObj.wscale, editableObj.wrotate );
                                        !pagePlugs[i] && (pagePlugs[i] = curLi.querySelectorAll( ".layout-component-from-data" )[i]);
                                        pagePlugs[i] && translate( pagePlugs[i], (editableObj.wx || 0) + pos.dx, (editableObj.wy || 0) + pos.dy, editableObj.wscale, editableObj.wrotate )
                                    }
                                } );
                                onLTap( dragObj, function () {
                                    if ( !editableObj.classList.contains( "select" ) ) {
                                        closeAllSlidePage();
                                        virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" )
                                    }
                                    editableObj.classList.toggle( "select" )
                                } );
                                setTimeout( function () {
                                    function syncMove( obj ) {
                                        plug.wscale = obj.scale;
                                        plug.wrotate = obj.rotate * 2 * Math.PI / 360;
                                        translate( editableObj, editableObj.wx, editableObj.wy, obj.scale, obj.rotate );
                                        translate( bigPagePlugs[i], editableObj.wx, editableObj.wy, obj.scale, obj.rotate );
                                        !pagePlugs[i] && (pagePlugs[i] = curLi.querySelectorAll( ".layout-component-from-data" )[i]);
                                        pagePlugs[i] && translate( pagePlugs[i], editableObj.wx, editableObj.wy, obj.scale, obj.rotate )
                                    }

                                    function syncEnd() {
                                        var Attributes = JSON.parse( page.pageInfo.imgMediaInfo[plug.dataSource.index].Attributes );
                                        if ( editableObj.wscale < 1 ) {
                                            Attributes.X = (editableObj.wx + editableObj.ww * (1 - editableObj.wscale) / 2) << 0;
                                            Attributes.Y = (editableObj.wy + editableObj.wh * (1 - editableObj.wscale) / 2) << 0
                                        }
                                        else {
                                            Attributes.X = (editableObj.wx - editableObj.ww * (editableObj.wscale - 1) / 2) << 0;
                                            Attributes.Y = (editableObj.wy - editableObj.wh * (editableObj.wscale - 1) / 2) << 0
                                        }
                                        Attributes.R = editableObj.wrotate * 2 * Math.PI / 360;
                                        Attributes.W = editableObj.ww * editableObj.wscale << 0;
                                        Attributes.H = editableObj.wh * editableObj.wscale << 0;
                                        liMediaData.Attributes = page.pageInfo.imgMediaInfo[plug.dataSource.index].Attributes = JSON.stringify( Attributes );
                                        saveTextConfig( page.pageInfo.imgMediaInfo[plug.dataSource.index], page.pageInfo.pageData, function ( a ) {
                                        } );
                                        curLi.pageData.Layout = "custom"
                                    }

                                    scaleAndRotate( scaleAndRotateBasicPoint, 0, editableObj.offsetHeight / 2, {
                                        move : function ( obj ) {
                                            syncMove( obj )
                                        }, end : syncEnd
                                    } );
                                    scaleTheObj( scalePoint, editableObj.offsetWidth / 2, -editableObj.offsetHeight / 2, {
                                        move : function ( obj ) {
                                            syncMove( obj )
                                        }, end : syncEnd
                                    } )
                                }, 0 )
                            }
                        }
                        else {
                            onTap( editableObj, function () {
                                if ( editableObj.classList.contains( "select" ) ) {
                                    editableObj.classList.remove( "select" );
                                    closeAllSlidePage()
                                }
                                else {
                                    virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                                    editableObj.classList.add( "select" );
                                    editImagePage.pageData = page.pageInfo.pageData;
                                    editImagePage.mediaData = page.pageInfo.imgMediaInfo[plug.dataSource.index];
                                    CSS( editImagePage.querySelector( ".cropit-image-preview" ), {
                                        height : 256 * info.H / info.W + "px",
                                        "margin-top" : -128 * info.H / info.W + "px"
                                    } );
                                    $( ".slide-page-edit-bgimg .crop-img-border" ).cropit( "destroy" );
                                    $( ".slide-page-edit-bgimg .crop-img-border" ).cropit( {imageState : {src : page.pageInfo.imgMediaInfo[plug.dataSource.index].Uri}} );
                                    openSlidePage( querySelector( ".slide-page-edit-bgimg" ) );
                                    setTimeout( function () {
                                        querySelector( ".slide-page-edit-bgimg input.cropit-image-zoom-input.edit-bgimg-range" ).disabled = "disabled"
                                    }, 0 )
                                }
                            } )
                        }
                    }
                }
                else {
                    if ( plug.dataSource.from == "text" ) {
                        info = JSON.parse( page.pageInfo.textMediaInfo[plug.dataSource.index].Attributes );
                        onTap( editableObj, function () {
                            if ( editableObj.classList.contains( "select" ) ) {
                                editableObj.classList.remove( "select" );
                                closeAllSlidePage()
                            }
                            else {
                                virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                                editableObj.classList.add( "select" );
                                editWordPage.pageData = page.pageInfo.pageData;
                                initSlideWordPage( info, page.pageInfo.textMediaInfo[plug.dataSource.index] );
                                editWordPage.classList.add( "pure-word" );
                                openSlidePage( editWordPage )
                            }
                        } )
                    }
                    else {
                        if ( plug.dataSource.from == "video" ) {
                            info = JSON.parse( page.pageInfo.videoMediaInfo[plug.dataSource.index].Attributes );
                            onTap( editableObj, function () {
                                if ( editableObj.classList.contains( "select" ) ) {
                                    editableObj.classList.remove( "select" );
                                    closeAllSlidePage()
                                }
                                else {
                                    virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                                    editableObj.classList.add( "select" );
                                    querySelector( ".edit-video-text" ).value = "请输入视频的通用代码";
                                    editVideoPage.pageData = page.pageInfo.pageData;
                                    editVideoPage.videoMediaInfo = page.pageInfo.videoMediaInfo[plug.dataSource.index];
                                    openSlidePage( editVideoPage )
                                }
                            } )
                        }
                        else {
                            if ( plug.dataSource.from == "link" ) {
                                info = JSON.parse( page.pageInfo.linkMediaInfo[plug.dataSource.index].Attributes );
                                onTap( editableObj, function () {
                                    if ( editableObj.classList.contains( "select" ) ) {
                                        editableObj.classList.remove( "select" );
                                        closeAllSlidePage()
                                    }
                                    else {
                                        virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                                        editableObj.classList.add( "select" );
                                        editLinkPage.pageData = page.pageInfo.pageData;
                                        editLinkPage.linkMediaInfo = page.pageInfo.linkMediaInfo[plug.dataSource.index];
                                        openSlidePage( editLinkPage )
                                    }
                                } )
                            }
                            else {
                                if ( plug.dataSource.from == "map" ) {
                                    info = JSON.parse( page.pageInfo.mapMediaInfo[plug.dataSource.index].Attributes );
                                    onTap( editableObj, function () {
                                        if ( editableObj.classList.contains( "select" ) ) {
                                            editableObj.classList.remove( "select" );
                                            closeAllSlidePage()
                                        }
                                        else {
                                            virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                                            editableObj.classList.add( "select" );
                                            editMapPage.pageData = page.pageInfo.pageData;
                                            editMapPage.mapMediaInfo = page.pageInfo.mapMediaInfo[plug.dataSource.index];
                                            var locationInfo = editMapPage.mapMediaInfo.Text.split( "$" );
                                            if ( (/^[\d|.]+$/).test( locationInfo[0] ) && (/^[\d|.]+$/).test( locationInfo[1] ) ) {
                                                editMapPage.setMapPosition( new BMap.Point( locationInfo[0], locationInfo[1] ) )
                                            }
                                            openSlidePage( editMapPage )
                                        }
                                    } )
                                }
                                else {
                                    if ( plug.dataSource.from == "multi-image" ) {
                                        function setMultiImage( Layout ) {
                                            var width = Layout == "MutipleImage04" ? 224 : 280;
                                            var height = Layout == "MutipleImage04" ? 289 : 450;
                                            var X = Layout == "MutipleImage04" ? 48 : 20;
                                            var Y = Layout == "MutipleImage04" ? 169 : 29;
                                            switch ( Layout ) {
                                                case "MutipleImage04":
                                                    width = 224;
                                                    height = 289;
                                                    X = 48;
                                                    Y = 169;
                                                    break;
                                                case "MutipleImage01":
                                                    width = 280;
                                                    height = 450;
                                                    X = 20;
                                                    Y = 29;
                                                    break;
                                                case "valentine-02":
                                                    width = 217;
                                                    height = 225;
                                                    X = 50;
                                                    Y = 25;
                                                    break
                                            }
                                            info = {W : 280, H : 450};
                                            setTimeout( function () {
                                                CSS( editableObj, {
                                                    width : width + "px",
                                                    height : height + "px",
                                                    "-webkit-transform" : "translate3d(" + X + "px," + Y + "px,0) scale(1) rotateZ(0deg)"
                                                } );
                                                editableObj.wx = 280;
                                                editableObj.wy = 450;
                                                editableObj.ww = 20;
                                                editableObj.wh = 29
                                            }, 0 )
                                        }

                                        setMultiImage( page.pageInfo.pageData.Layout );
                                        onTap( editableObj, function () {
                                            if ( editableObj.classList.contains( "select" ) ) {
                                                editableObj.classList.remove( "select" );
                                                closeAllSlidePage()
                                            }
                                            else {
                                                virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                                                editableObj.classList.add( "select" );
                                                openSlidePage( editMultiImagePage );
                                                editMultiImagePage.init( page.pageInfo )
                                            }
                                        } )
                                    }
                                }
                            }
                        }
                    }
                }
                if ( info.W == 320 && info.H == 504 ) {
                    info && CSS( editableObj, {
                        width : info.W - 2 + "px",
                        height : info.H - 2 + "px",
                        left : info.X + "px",
                        top : info.Y + "px",
                        "-webkit-transform" : "scale(" + plug.wscale + ") rotateZ(" + (plug.wrotate * 360 / (2 * Math.PI)) + "deg)",
                        "z-index" : 1
                    } )
                }
                else {
                    info && CSS( editableObj, {
                        width : (plug.offsetWidth || info.W) - 2 + "px",
                        height : (plug.offsetHeight || info.H) - 2 + "px",
                        "-webkit-transform" : "translate3d(" + getPageCo( plug ).x + "px," + getPageCo( plug ).y + "px,0) scale(" + (plug.wscale || 1) + ") rotateZ(" + (plug.wrotate || plug.rotate * 360 / (2 * Math.PI) || 0) + "deg)",
                        "z-index" : 2
                    } );
                    editableObj.wx = getPageCo( plug ).x;
                    editableObj.wy = getPageCo( plug ).y;
                    editableObj.ww = (plug.offsetWidth || info.W) - 2;
                    editableObj.wh = (plug.offsetHeight || info.H) - 2;
                    editableObj.wrotate = plug.wrotate || (info.R ? info.R * 360 / (2 * Math.PI) : 0);
                    editableObj.wscale = plug.wscale || info.scale || 1
                }
            } )
        }
        screen.innerHTML = "";
        screen.appendChild( virtualLayer );
        screen.appendChild( bigPage )
    }

    function initPageView() {
        fpInvokeAPI.getPageData( function ( data ) {
            editPageLeft.classList.remove( "loading" );
            if ( data.code != 200 ) {
                alert( "网络或服务器有问题，请稍后再试" );
                return
            }
            if ( data.data ) {
                data.data.Title && (querySelector( ".edit-setting-title textarea" ).value = data.data.Title);
                data.data.Description && (querySelector( ".edit-description textarea" ).value = data.data.Description);
                data.data.Thumbnail && (querySelector( ".edit-setting-page .default-thumbnail" ).src = data.data.Thumbnail);
                data.data.Switch && (querySelector( ".edit-setting-page .page-turning-animation" ).value = data.data.Switch);
                data.data.Mode && (querySelector( ".edit-setting-page .page-turning-gesture" ).value = data.data.Mode);
                data.data.Title && (querySelector( ".edit-page-phone-content-border .edit-page-theme-title" ).innerHTML = data.data.Title);
                querySelector( ".edit-music-make-sure" ).musicUrl = data.data.BackgroundMusic;
                querySelector( ".edit-page-theme-thumbnail img" ).src = data.data.Thumbnail;
                querySelector( ".preview-page-share-thumbnail" ).src = data.data.Thumbnail;
                querySelector( ".preview-page-descrption" ).innerHTML = data.data.Description;
                querySelector( ".preview-page-share-title" ).innerHTML = data.data.Title;
                var switcher = querySelector( ".edit-setting-page .page-turning-animation" );
                if ( data.data.Mode && data.data.Mode == "push" ) {
                    switcher.disabled = true;
                    switcher.style.color = "#cfcfcf"
                }
                else {
                    switcher.disabled = false;
                    switcher.style.color = "#626262"
                }
                var publicitySwitch = querySelector( ".edit-setting-switch-publicity" );
                var recommendSwitch = querySelector( ".edit-setting-switch-recommend" );
                switch ( data.data.WorkVisibility ) {
                    case 2:
                        publicitySwitch.classList.add( "close" );
                        recommendSwitch.classList.add( "close" );
                        break;
                    case 11:
                        publicitySwitch.classList.remove( "close" );
                        recommendSwitch.classList.remove( "close" );
                        break;
                    case 12:
                        publicitySwitch.classList.remove( "close" );
                        recommendSwitch.classList.add( "close" );
                        break
                }
            }
            if ( data.data.PageItems.length == 0 ) {
                querySelector( ".edit-page-phone-content-border" ).classList.remove( "loading" );
                addPageBtn.classList.add( "hide" );
                openInnerPage( addPageSettingPage );
                if ( addPageSettingPage.isLoadTemplate == false ) {
                    loadTemplate()
                }
            }
            else {
                var screen = querySelector( ".edit-page-phone-screen" );
                loopArray( data.data.PageItems, function ( pagedata, i ) {
                    var li = appendOnePage( pagedata, i + 1 );
                    if ( i == 0 ) {
                        li.classList.add( "select" );
                        var page = makePage( pagedata, function () {
                            querySelector( ".edit-page-phone-content-border" ).classList.remove( "loading" );
                            page.pageInfo.pageData = pagedata;
                            mappingToScreen( page )
                        } );
                        screen.appendChild( page )
                    }
                } )
            }
            window.customCopyright = data.data.CustomCopyright;
            querySelector( ".edit-setting-page .page-turning-gesture" ).onchange = function () {
                var val = this.value, switcher = querySelector( ".edit-setting-page .page-turning-animation" );
                if ( val == "push" ) {
                    switcher.disabled = true;
                    switcher.style.color = "#cfcfcf"
                }
                else {
                    switcher.disabled = false;
                    switcher.style.color = "#626262"
                }
            }
        } )
    }

    function pageViewJumpTo( step, isNotMove ) {
        var pageListBorder = querySelector( ".edit-page-left ul" );
        var cur = pageListBorder.querySelector( "li.select" );
        if ( !cur ) {
            return
        }
        var ds = 0;
        var next = null;
        if ( step == 1 ) {
            while ( cur.nextElementSibling ) {
                if ( !cur.nextElementSibling.classList.contains( "hide" ) ) {
                    next = cur.nextElementSibling;
                    break
                }
                ds++;
                cur = cur.nextElementSibling
            }
        }
        else {
            while ( cur.previousElementSibling ) {
                if ( !cur.previousElementSibling.classList.contains( "hide" ) ) {
                    next = cur.previousElementSibling;
                    break
                }
                ds++;
                cur = cur.previousElementSibling
            }
        }
        if ( next != null ) {
            pageListBorder.querySelector( "li.select" ).classList.remove( "select" );
            next.classList.add( "select" );
            if ( isNotMove != true && document.querySelectorAll( ".edit-page-left ul li.show" ).length * 154 > pageListBorder.offsetHeight ) {
                var count = Math.floor( pageListBorder.offsetHeight / 154 );
                var curIndex = parseInt( next.querySelector( ".thumbnail-page-list-item-num span" ).innerHTML );
                if ( (curIndex - 1) * 154 > pageListBorder.scrollTop + pageListBorder.offsetHeight || (curIndex - 1) * 154 < pageListBorder.scrollTop ) {
                    if ( step == 1 ) {
                        pageListBorder.scrollTop = (curIndex - 1) * 154
                    }
                    else {
                        if ( curIndex <= count ) {
                            pageListBorder.scrollTop = 0
                        }
                        else {
                            pageListBorder.scrollTop = curIndex * 154 - pageListBorder.offsetHeight
                        }
                    }
                }
            }
            return {el : next, ds : ds}
        }
        else {
            return {el : null, ds : null}
        }
    }

    onTap( querySelector( ".edit-page-pre-page-btn" ), function () {
        var li = pageViewJumpTo( -1 );
        if ( li.el != null ) {
            mappingToScreen( li.el.querySelector( ".page" ) )
        }
        else {
            fp.message( {text : "已经是第一页"} )
        }
        closeAllSlidePage()
    } );
    onTap( querySelector( ".edit-page-next-page-btn" ), function () {
        var li = pageViewJumpTo( 1 );
        if ( li.el != null ) {
            mappingToScreen( li.el.querySelector( ".page" ) )
        }
        else {
            fp.message( {text : "已经是最后一页"} )
        }
        closeAllSlidePage()
    } );
    var weixinTips = querySelector( ".edit-page-weixin-tip" );
    var weixinTipsImg = querySelector( ".edit-page-weixin-tip-img" );
    weixinTips.onmouseover = function () {
        weixinTipsImg.classList.remove( "hide" )
    };
    weixinTips.onmouseout = function () {
        weixinTipsImg.classList.add( "hide" )
    };
    function preLoadingMusic() {
        var page = querySelector( ".edit-music-page" );
        var musicListCache = [];
        var musicListBorder = querySelector( ".edit-music-system-music-list .music-list" );
        var audio = querySelector( ".edit-music-page audio" );
        var systemMusicList = querySelector( ".edit-music-system-music-list" );
        var cats = [];
        var musicCategoryBorder = querySelector( ".edit-music-page .edit-music-system-class" );
        audio.addEventListener( "ended", function () {
            var playBtn = page.querySelector( ".play.btn" );
            playBtn && playBtn.classList.remove( "play" )
        }, false );
        audio.addEventListener( "error", function () {
            alert( "对不起，该音乐暂时无法播放" );
            var playBtn = page.querySelector( ".play.btn" );
            playBtn && playBtn.classList.remove( "play" )
        }, false );
        fpInvokeAPI.getMusicCategory( function ( data ) {
            musicCategoryBorder.classList.remove( "loading" );
            if ( data.code == 200 ) {
                loopArray( data.data, function ( cat ) {
                    cat != "自定义" && cats.push( cat )
                } );
                loopArray( cats, function ( Category, i ) {
                    var catBtn = element( "div", {"classList" : "btn"}, musicCategoryBorder );
                    catBtn.innerHTML = Category;
                    catBtn.isGetList = false;
                    catBtn.onclick = function () {
                        var curSelectCat = musicCategoryBorder.querySelector( "div.select" );
                        curSelectCat && curSelectCat.classList.remove( "select" );
                        catBtn.classList.add( "select" );
                        var curListPage = systemMusicList.querySelector( ".music-list .inner-music-list.show" );
                        if ( curListPage ) {
                            curListPage.classList.remove( "show" );
                            curListPage.classList.add( "hide" )
                        }
                        if ( !musicListCache[i] ) {
                            var musicList = element( "div", {"classList" : ["inner-music-list", "loading", "show", "cat-" + i]}, systemMusicList );
                            element( "div", {"classList" : ["loading-icon", "edit-page-icon"]}, musicList );
                            musicListCache[i] = musicList;
                            musicListBorder.appendChild( musicListCache[i] );
                            fpInvokeAPI.getMusicListByCategory( Category, function ( data ) {
                                if ( data.code == 200 ) {
                                    catBtn.isGetList = true;
                                    var list = musicListBorder.querySelector( ".inner-music-list.cat-" + i );
                                    list.classList.remove( "loading" );
                                    musicListCache[i].classList.remove( "loading" );
                                    loopArray( data.data, function ( music ) {
                                        var item = systemTemPlate.make( ".system-music-item" );
                                        var name = item.querySelector( ".name" );
                                        var playBtn = item.querySelector( ".btn" );
                                        name.innerHTML = music.Name;
                                        name.music = {Id : music.Id, url : music.Url, MusicType : music.MusicType};
                                        onTap( name, function () {
                                            var curSelectItem = page.querySelector( ".item.select" );
                                            curSelectItem && curSelectItem.classList.remove( "select" );
                                            name.parentNode.classList.add( "select" )
                                        } );
                                        onTap( playBtn, function () {
                                            if ( !playBtn.classList.contains( "play" ) ) {
                                                var curPlayBtn = page.querySelector( ".play.btn" );
                                                curPlayBtn && curPlayBtn.classList.remove( "play" );
                                                playBtn.classList.add( "play" );
                                                audio.src = name.music.url;
                                                audio.play()
                                            }
                                            else {
                                                playBtn.classList.remove( "play" );
                                                audio.pause()
                                            }
                                        } );
                                        list.appendChild( item )
                                    } )
                                }
                            } )
                        }
                        else {
                            systemMusicList.querySelector( ".music-list .inner-music-list.cat-" + i ).classList.remove( "hide" );
                            systemMusicList.querySelector( ".music-list .inner-music-list.cat-" + i ).classList.add( "show" )
                        }
                    };
                    i == 0 && catBtn.click()
                } )
            }
        } )
    }

    function initUserSetting() {
        fpInvokeAPI.getUserSetting( function ( data ) {
            if ( data.data ) {
                window.usersetting = data;
                var optionItem = $( "<option>" ).val( "custom" ).html( data.data.Author ).appendTo( $( ".edit-setting-page .page-turning-signature" ) );
                if ( window.customCopyright && window.customCopyright == true ) {
                    optionItem.prop( "selected", "selected" )
                }
            }
        } )
    }

    function init() {
        ppt.initial( {
            width : 320, height : 504, contentSrc : function ( src ) {
                return window.contentPath + "/content/" + src.toLowerCase()
            }
        } );
        initPageView();
        initUserSetting();
        preLoadingMusic()
    }

    init()
})();

