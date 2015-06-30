/**
 * Created by Json on 2015/1/4.
 */

(function () {
    window.onerror = function () {
        console.log( "err", arguments )
    };
    !(/AppleWebKit/).test( navigator.userAgent ) && document.body.classList.add( "not-webkit" );
    var onTap = fp.onTap,
        loop = fp.loop,
        loopArray = fp.loopArray,
        loopObj = fp.loopObj,
        CSS = fp.CSS,
        element = fp.element;

    window.color = {"background" : "#FFFFFF"};

    var MB = 1024 * 1024;
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
    var notSupportList = {
        //21 : true, // 外链接
        //39 : true, // 多图
        40 : true, // 联系页
        //41 : true, // 地图页
        //42 : true, // 视频页
        43 : true, // 报名页
        44 : true, // 涂抹
        52 : true, // 情书
        31 : true, // 文图010
        32 : true, // 文图010
        60 : true // 多行：可调灰底
        //63 : true  // 文字多图
    };

    function staticImgSrc( src ) {
        return ((contentPath || virtualPath) + "/Content/" + src).toLowerCase();
    }

    function makeTemplate() {
        var template = querySelector( "#template" );
        document.body.removeChild( template );
        var make = function ( selector ) {
            try {
                var node = template.querySelector( selector );
            }
            catch ( e ) {
                console.log( e );
            }
            var newNode = node.cloneNode( true );
            return newNode;
        };
        return {
            make : make
        }
    }

    function openInnerPage( page ) {
        page.classList.remove( "hide" );
    }

    function closeInnerPage( page ) {
        page.classList.add( "hide" );
    }

    function openSlidePage( page ) {
        var border = querySelector( ".edit-page-slide-page-border" );
        if ( border.querySelector( ".slide-out.slide-page" ) ) {
            // 如果当前已经有一个页面是滑出状态，则关闭该页面
            border.querySelector( ".slide-out.slide-page" ).classList.remove( "slide-out" );
        }
        page.classList.add( "slide-out" );
        border.classList.add( "slide-out" );
        querySelector( ".edit-page-pre-page-btn" ).classList.add( "hide" );
        querySelector( ".edit-page-next-page-btn" ).classList.add( "hide" );
        addPageBtn.classList.add( "hide" );
        addPageSettingPage.classList.add( "hide" );
    }

    function closeSlidePage( page ) {
        page.classList.remove( "slide-out" );
        querySelector( ".edit-page-slide-page-border" ).classList.remove( "slide-out" );
        if ( !querySelector( ".edit-page-slide-page-border .slide-out" ) ) {
            querySelector( ".edit-page-pre-page-btn" ).classList.remove( "hide" );
            querySelector( ".edit-page-next-page-btn" ).classList.remove( "hide" );
            addPageBtn.classList.remove( "hide" );
        }
    }

    function closeAllSlidePage() {
        addPageBtn.classList.remove( "hide" );
        // 如果当前编辑图片或编辑文字页面是打开状态，则切换页面时候要关闭这两个页面（当然，以后可能会更多的页面，比如编辑地图页面等）
        querySelector( ".edit-page-slide-page-border " ).classList.contains( "slide-out" ) && querySelector( ".edit-page-slide-page-border " ).classList.remove( "slide-out" );
        querySelector( ".slide-page.slide-out" ) && querySelector( ".slide-page.slide-out" ).classList.remove( "slide-out" );
        querySelector( ".edit-page-pre-page-btn" ).classList.remove( "hide" );
        querySelector( ".edit-page-next-page-btn" ).classList.remove( "hide" );
    }

    function closeAllPages() {
        if ( addPageBtn.classList.contains( "hide" ) ) {
            addPageBtn.classList.remove( "hide" );
            addPageSettingPage.classList.add( "hide" );
        }
        closeAllSlidePage();
        loopArray( querySelectorAll( ".setting-page" ), function ( page ) {
            page.classList.add( "hide" );
        } );
    }

    var editPageRightBottom = querySelector( ".edit-page-right" );
    editPageRightBottom.onclick = function ( e ) {
        if ( e.srcElement == editPageRightBottom ) {
            closeAllPages();
        }
    };

    // 添加新页面
    function presetAddPage() {
        addPageSettingPage.addEventListener( "mouseover", function () {
            addPageSettingPage.classList.add( "top" );
        }, false );
        addPageSettingPage.addEventListener( "mouseout", function () {
            addPageSettingPage.classList.remove( "top" );
        }, false );
        // 关闭页面
        onTap( addPageSettingPage.querySelector( ".close-add-page-setting-page-btn" ), function () {
            addPageBtn.classList.remove( "hide" );
            closeInnerPage( addPageSettingPage );
        } );
        addPageSettingPage.querySelector( ".close-add-page-setting-page-btn2" ).onclick = function () {
            addPageBtn.classList.remove( "hide" );
            closeInnerPage( addPageSettingPage );
        };
    }

    // 编辑图片 包括页面的弹出、关闭以及一切与此有关的操作
    function slidePageEditBgImg() {
        var openBtn = querySelector( ".edit-page-edit-bgimg-btn" ),
        // 编辑背景图片页面
            updateImgBtn = querySelector( ".slide-edit-bgimg-updata-btn" ),
            updateImgTips = querySelector( ".slide-edit-bgimg-updata-tips" ),
            fileInput = querySelector( ".slide-page-edit-bgimg .cropit-image-input" ),
            page = querySelector( ".slide-page-edit-bgimg" ),
            saveBtn = page.querySelector( ".slide-edit-bgimg-save-btn" );

        updateImgBtn.onmouseover = function () {
            updateImgTips.classList.remove( "hide" );
        };
        updateImgBtn.onmouseout = function () {
            updateImgTips.classList.add( "hide" );
        };
        page.addEventListener( "mouseover", function () {
            page.classList.add( "top" );
        }, false );
        page.addEventListener( "mouseout", function () {
            page.classList.remove( "top" );
        }, false );
        $( ".slide-page-edit-bgimg .crop-img-border" ).cropit();
        updateImgBtn.onclick = function () {
            fileInput.click();
        };
        querySelector( ".close-slide-page-edit-bgimg" ).onclick = function () {
            closeSlidePage( page );
        };
        openBtn.onclick = function () {
            page.classList.contains( "slide-out" ) ? closeSlidePage( page ) : openSlidePage( page );
        };
        saveBtn.onclick = function () {
            var pageData = page.pageData,
                mediaData = page.mediaData,
                mediaAtrr = JSON.parse( mediaData.Attributes ),
                crop = $( '.slide-page-edit-bgimg .crop-img-border' ).cropit( "cropInfo" ),
                inputFile = page.querySelector( ".cropit-image-input" );

            if ( inputFile.files.length == 0 ) {
                fp.message( {
                    text : "请选择更换的图片"
                } );
                return;
            }
            if ( inputFile.files[0].size > 4 * MB ) {
                fp.message( {
                    text : "图片不能超过4MB"
                } );
                return;
            }
            // 保存對圖片的修改
            var parameter = {
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
            loopObj( parameter, function ( key, value ) {
                fd.append( key, value );
            } );
            fd.append( "blob-fileName", inputFile.files[0].name );
            fd.append( "imgFile", inputFile.files[0], inputFile.files[0].name );
            fp.message( {
                text : "正在保存"
            } );
            page.querySelector( ".cropit-image-preview" ).style.backgroundImage = null;
            // 清空input[file]，允许两次上传同一张图片
            page.querySelector( "form.input-file" ).reset();
            closeSlidePage( page );
            fpInvokeAPI.saveImageConfig( {
                data : fd,
                success : function ( data ) {
                    if ( data.code == 200 ) {
                        fp.message( {
                            text : "保存完毕"
                        } );
                        var curLi = null;
                        var lis = document.querySelectorAll( "li.page-list.show" );
                        for ( var j = 0; j < lis.length; j++ ) {
                            if ( lis[j].pageData.Guid == parameter.pid ) {
                                curLi = lis[j];
                                break;
                            }
                        }
                        if ( curLi == null ) {
                            return;
                        }
                        // 更新这个页面的数据
                        for ( var i = 0; i < curLi.pageData.Medias.length; i++ ) {
                            if ( curLi.pageData.Medias[i].ID == data.data.PrimaryId ) {
                                //  找到了被修改的组件
                                //  由于此处只是修改了图片内容，位置什么的信息并没有修改，所以只需要替换图片组建的url即可
                                curLi.pageData.Medias[i].Guid = data.data.Guid;
                                curLi.pageData.Medias[i].ID = data.data.PrimaryId;
                                curLi.pageData.Medias[i].Uri = data.data.Url;
                                // 生成新的页面
                                fp.message( {
                                    text : "正在生成新页面，请稍等"
                                } );
                                var newPage = makePage( curLi.pageData, function () {
                                    curLi.removeChild( curLi.querySelector( ".page" ) );
                                    curLi.appendChild( newPage );
                                    // 是否映射到主屏幕，这要依据当前选中的li，假如用户已经等不及渲染（渲染比较慢）
                                    //　这时候用户可能会换看其他的页面，这时候就不能做映射到主屏幕的操作了，所以要判断
                                    if ( querySelector( "li.page-list.select" ).pageData.Id == curLi.pageData.Id ) {
                                        mappingToScreen( newPage );
                                    }
                                } );
                                break;
                            }
                        }
                    }
                }
            } );
        }
    }

    // 编辑文字
    function slidePageEditWord() {
        var page = querySelector( ".slide-page-edit-word" );
        var text = querySelector( ".slide-page-edit-word .edit-word-text" );
        var wordCount = querySelector( ".slide-page-edit-word .edit-text-word-count" );
        var vernier = querySelector( ".edit-word-font-family-vernier" );
        var saveBtn = page.querySelector( ".edit-word-save-btn" );
        page.addEventListener( "mouseover", function () {
            page.classList.add( "top" );
        }, false );
        page.addEventListener( "mouseout", function () {
            page.classList.remove( "top" );
        }, false );
        text.onkeyup = getWordCount;
        text.onkeydown = getWordCount;
        function getWordCount() {
            // 对回车做特殊处理，当成两个字符
            var enterCount = 0;
            for ( var i = 0; i < text.value.length; i++ ) {
                if ( text.value[i] == "\n" ) {
                    enterCount += 1;
                }
            }
            var count = text.value.length + enterCount;
            wordCount.innerHTML = (count > 10 ? 10 : count) + "/" + 10;
        }

        var trays = page.querySelectorAll( ".tray" );
        loopArray( page.querySelectorAll( ".edit-page-edit-word-btn" ), function ( btn, i ) {
            btn.index = i;
            btn.onclick = function () {
                var curSelect = page.querySelector( ".edit-page-edit-word-btn.select" );
                if ( curSelect && curSelect.index == i ) {
                    // 点击一个打开的选项，则关闭
                    curSelect.classList.remove( "select" );
                    trays[curSelect.index].classList.add( "hide" );
                }
                else if ( curSelect && curSelect.index != i ) {
                    // 当前有打开的，但是不是点击的，则将当前打开的关闭，并打开点击的。
                    curSelect.classList.remove( "select" );
                    trays[curSelect.index].classList.add( "hide" );
                    btn.classList.add( "select" );
                    trays[i].classList.remove( "hide" );
                }
                else {
                    // 目前没有选中的，则将点击的打开
                    btn.classList.add( "select" );
                    trays[i].classList.remove( "hide" );
                }
            }
        } );

        // 颜色
        var colors = ["#000000", "#8b8b8b", "#ffffff", "#c3e5a8", "#88cb55", "#578c2e",
            "#eff6ad", "#deec5f", "#fefbb0", "#fdf666", "#f2e933", "#fbde9d", "#f8c042",
            "#c68c1f", "#fad19c", "#f6a43f", "#f8b79d", "#f46f40", "#cc3c16", "#f6a3a0",
            "#f24a47", "#a211d", "#84143f", "#ee91b3", "#da1c68", "#84143f", "#d87bfb",
            "#651a8c", "#ac34eb", "#651a8c", "#a077fa", "#4a2ee2", "#2a1680", "#99b8fc",
            "#3373f9", "#1f43c9", "#89defb", "#48bbf9", "#2c7aa2"];

        var selectColorBorder = page.querySelector( ".edit-page-edit-word-select-color-tray" );
        var selectedColorItem = page.querySelector( ".edit-page-selected-color" );
        // 在顔色框中生成顔色块
        loopArray( colors, function ( color, i ) {
            var colorBox = element( "div", {classList : "edit-color-box"}, selectColorBorder );
            var colorItem = element( "div", {classList : "edit-color-item"}, colorBox );
            colorItem.style.backgroundColor = colors[i];
            colorBox.onclick = function () {
                selectedColorItem.fpColor = colors[i];
                selectedColorItem.style.backgroundColor = colors[i];
                var cur = selectColorBorder.querySelector( ".select" );
                cur && cur.classList.remove( "select" );
                colorBox.classList.add( "select" );
            }
        } );

        /*
         这个函数的作用就是根据给的颜色值，遍历一遍颜色选择器，如果遍历到了，就把该颜色选择器选中，这个函数用在初始化上
         刚进入这个页面的时候，如果这个作品被编辑过，就应该会有文字的颜色等信息，这时候打开文字编辑页面需要设定一个初始
         值，这个函数就是干这个用的。如果给定的颜色为null，或者遍历一遍之后没有发现匹配的，就不选择了。老作品在数据库中
         没有字体等数据
         */
        page.selectColor = function ( color ) {
            selectedColorItem.fpColor = color;
            selectedColorItem.style.backgroundColor = color;
        };

        var fontFamily = ["Champagne & Limousines", "Arial", "Verdana", "Times New Roman",
            "Impact", "Chalkduster", "FZLanTingHeiS-UL-GB", "FZJunHeiS-EL-GB",
            "ZHSRXT-GBK", "FZLanTingKanHei-R-GBK", "Microsoft YaHei Light",
            "FZLanTingHeiS-B-GB", "FZZhengHeiS-M-GB", "FZPinShangHeiS-R-GB",
            "SimSun", "KaiTi", "FZFengYaSongS-GB", "造字工房朗宋（非商用）常规体",
            "汉仪菱心体简", "DFPLiJinHeiW8-GB", "DFPWaWaW5-GB", "FZJingLeiS-R-GB",
            "HanziPen SC", "FZHanJian-R-GB", "叶根友刀锋黑草", "叶根友毛笔行书",
            "书体坊禚效锋行草体", "lixukexingshu"];

        var familyBorder = page.querySelector( ".edit-page-edit-word-select-family-tray .border" );
        // 生成字体块
        var selectedFaimily = page.querySelector( ".edit-page-edit-word-btn img" );
        loopArray( fontFamily, function ( ff, i ) {
            if ( i == 6 ) {
                return;
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
                selectedFaimily.fpFamily = fontFamily[i];
            }
        } );

        page.selectFontFamily = function ( curFontFamily ) {
            for ( var i = 0; i < fontFamily.length; i++ ) {
                if ( curFontFamily == fontFamily[i] ) {
                    selectedFaimily.src = staticImgSrc( "image/font-family-" + (i + 1) + ".png" );
                    selectedFaimily.fpFamily = fontFamily[i];
                    break;
                }
            }
        };


        //动画
        var animations = [
            {
                "name" : "左飞入",
                "id" : "fly-into-left"
            },
            {
                "name" : "右飞入",
                "id" : "fly-into-right"
            },
            {
                "name" : "上飞入",
                "id" : "fly-into-top"
            },
            {
                "name" : "下飞入",
                "id" : "fly-into-bottom"
            },
            {
                "name" : "左浮现",
                "id" : "emerge-left"
            },
            {
                "name" : "右浮现",
                "id" : "emerge-right"
            },
            {
                "name" : "上浮现",
                "id" : "emerge-top"
            },
            {
                "name" : "下浮现",
                "id" : "emerge-bottom"
            },
            {
                "name" : "从小变大",
                "id" : "scale"
            },
            {
                "name" : "淡入",
                "id" : "fade-in"
            },
            {
                "name" : "回旋",
                "id" : "circle-round"
            },
            {
                "name" : "远近翻转",
                "id" : "round-from-far-and-near"
            },
            {
                "name" : "曲线向上",
                "id" : "curve-up"
            },
            {
                "name" : "缩小",
                "id" : "shrink"
            },
            {
                "name" : "落下抖动",
                "id" : "fall-down-and-shake"
            },
            {
                "name" : "闪烁",
                "id" : "flash"
            },
            {
                "name" : "抖动",
                "id" : "shake"
            },
            {
                "name" : "弹性",
                "id" : "bounce-in"
            },
            {
                "name" : "上弹入",
                "id" : "bounce-in-down"
            },
            {
                "name" : "下弹入",
                "id" : "bounce-in-up"
            },
            {
                "name" : "左弹入",
                "id" : "bounce-in-left"
            },
            {
                "name" : "右弹入",
                "id" : "bounce-in-right"
            },
            {
                "name" : "挂摆",
                "id" : "swing"
            },
            {
                "name" : "果冻",
                "id" : "rubber-band"
            },
            {
                "name" : "得瑟",
                "id" : "tada"
            },
            {
                "name" : "钟摆",
                "id" : "wobble"
            }
        ];
        var selectedAnimationItem = page.querySelector( ".edit-page-edit-word-btn .selected-animation" );
        var animationBorder = page.querySelector( ".edit-page-edit-word-select-animation-tray .border" );
        // 生成出现方式
        loopArray( animations, function ( animation, i ) {
            var item = element( "div", {
                classList : "edit-word-word-animation"
            }, animationBorder );
            item.innerHTML = animations[i]["name"];
            item.onclick = function () {
                selectedAnimationItem.innerHTML = animations[i]["name"];
                selectedAnimationItem.fpAnimation = animations[i]["id"];
                var cur = page.querySelector( ".edit-word-word-animation.select" );
                cur && cur.classList.remove( "select" );
                item.classList.add( "select" );
            }

        } );

        page.selectFontAnimation = function ( fontAnimation ) {
            for ( var i = 0; i < animations.length; i++ ) {
                if ( fontAnimation == animations[i].id ) {
                    selectedAnimationItem.innerHTML = animations[i].name;
                    selectedAnimationItem.fpAnimation = animations[i].id;
                    break;
                }
            }
        };
        //
        page.fillText = function ( textWord ) {
            text.value = "";
            text.value = textWord || "";//　被ios端编辑过的作品，可能对文字传图片的这类没有Text字段，没有的话就赋一个空字符串就好了
            textWord ? (wordCount.innerHTML = textWord.length > 200 ? "200/200" : textWord.length + "/200") : (wordCount.innerHTML = "0/200");
        };

        //关闭页面
        querySelector( ".close-edit-word-page-btn" ).onclick = function () {
            closeSlidePage( page );
        };

        // 保存文字配置
        saveBtn.onclick = function () {
            var mediaAttr = JSON.parse( page.textInfo.Attributes );
            var sendData = {
                model : {
                    "Guid" : page.textInfo.Guid,// 部件的guid
                    "Text" : text.value,
                    "ID" : page.textInfo.ID,// 部件的id
                    "Category" : page.textInfo.Category,
                    "ActionLink" : page.textInfo.ActionLink,
                    "LayoutId" : page.pageData.LayoutId,
                    "Animation" : selectedAnimationItem.fpAnimation,
                    "Color" : selectedColorItem.fpColor,
                    "FontFamily" : selectedFaimily.fpFamily
                },
                pid : page.pageData.Guid// page的id
            };

            // model["customenable"];
            //if ( sendData.model.Animation != mediaAttr.Animation ) {
            //	sendData["customenable"] = true;
            //}
            var curLi;
            var lis = document.querySelectorAll( "li.page-list.show" );
            for ( var i = 0; i < lis.length; i++ ) {
                if ( sendData.pid == lis[i].pageData.Guid ) {
                    curLi = lis[i];
                    break;
                }
            }
            if ( curLi.pageData.Layout == "custom" ) {
                sendData["customenable"] = true;
            }
            loopObj( mediaAttr, function ( key, value ) {
                if ( !sendData.model[key] ) {
                    // 如果data.model中没有这项数据，则采用textinfo.Attributes中的
                    sendData.model[key] = value;
                }
            } );
            fp.message( {
                text : "正在保存"
            } );
            fpInvokeAPI.saveTextConfig( sendData, function ( data ) {
                if ( data.code == 200 ) {
                    // 如果修改成功，需要修改页面，以便最新的页面能够实时显示出来
                    fp.message( {
                        text : "修改成功，正在努力渲染"
                    } );
                    var curLi = null;
                    // 需要重新遍歷一遍
                    var lis = document.querySelectorAll( "li.page-list.show" );
                    for ( var i = 0; i < lis.length; i++ ) {
                        if ( sendData.pid == lis[i].pageData.Guid ) {
                            curLi = lis[i];
                            break;
                        }
                    }
                    if ( curLi == null ) {
                        // 如果没有在show的li中找到匹配的li，说明页面已经被删掉了，不进行后续更新数据的操作
                        return;
                    }
                    for ( var me = 0; me < curLi.pageData.Medias.length; me++ ) {
                        // 寻找匹配的组件
                        if ( data.data.PrimaryId == curLi.pageData.Medias[me].ID ) {
                            // 找到了，更新页面组件数据
                            var attr = JSON.parse( curLi.pageData.Medias[me].Attributes );
                            attr.Color = sendData.model.Color;
                            attr.Animation = sendData.model.Animation;
                            attr.FontFamily = sendData.model.FontFamily;
                            curLi.pageData.Medias[me].Attributes = JSON.stringify( attr );
                            curLi.pageData.Medias[me].Uri = data.data.Url;
                            curLi.pageData.Medias[me].Text = data.data.Text;
                            curLi.pageData.Medias[me].ID = data.data.ID;
                            curLi.pageData.Medias[me].Guid = data.data.Guid;
                            // 生成新的页面
                            var newPage = makePage( curLi.pageData, function () {
                                curLi.removeChild( curLi.querySelector( ".page" ) );
                                curLi.appendChild( newPage );
                                mappingToScreen( newPage );
                            } );
                            break;
                        }
                    }
                }
                else {
                    fp.message( {
                        text : "修改失败，请重新操作"
                    } );
                }
            } );
            closeSlidePage( page );
        };
    }

    // 保存部件，调用textBatch接口。
    // 初页web版中大多数部件的保存都调用这个接口，由于历史原因早期的文字保存没有调用这个接口，后期重构这是一个改进点。
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
            },
            "pid" : pageData.Guid
        };
        for ( var p in mediaAtrr ) {
            if ( !sendData.model[p] ) {
                sendData.model[p] = mediaAtrr[p];
            }
        }
        fp.message( {
            text : "正在保存"
        } );
        fpInvokeAPI.saveTextConfig( sendData, function ( data ) {
            callback( data );
        } );
    }

    // 编辑地图
    function slidePageMap() {
        var page = querySelector( ".slide-page-edit-map" );
        var saveBtn = page.querySelector( ".edit-map-save-btn" );
        var searchBtn = page.querySelector( ".edit-map-search-btn" );
        var searchAddress = page.querySelector( ".edit-map-address" );
        //关闭页面
        querySelector( ".close-edit-map-page-btn" ).onclick = function () {
            closeSlidePage( page );
        };
        onTap( page.querySelector( ".edit-map-search-btn" ), function () {

        } );
        var map = new BMap.Map( "map" );    // 创建Map实例
        var myGeo = new BMap.Geocoder();
        var point = new BMap.Point( 123, 111 );
        map.enableScrollWheelZoom( true );     //开启鼠标滚轮缩放

        map.addEventListener( "dragend", function () {
            if ( !page.markerPoint ) {
                return;
            }
            var center = map.getCenter();
            page.markerPoint.setPosition( center );
            openWindow( center );
        } );
        function openWindow( point ) {
            myGeo.getLocation( point, function ( result ) {
                if ( result ) {
                    var infowindow = new BMap.InfoWindow( result.address );
                    map.openInfoWindow( infowindow, point ); //开启信息窗口
                }
            } );
        }

        new BMap.LocalCity().get( function ( result ) {
            point = new BMap.Point( 121.462056, 31.25592 );
            map.centerAndZoom( point, 15 );  // 初始化地图,设置中心点坐标和地图级别
            page.markerPoint = new BMap.Marker( point );        // 创建标注
            page.markerPoint.enableDragging();
            setTimeout( function () {
                page.querySelector( ".BMap_Marker" ).addEventListener( "mousedown", function ( e ) {
                    e.stopPropagation();
                }, false );
            }, 100 );
            map.addOverlay( page.markerPoint );
            page.markerPoint.addEventListener( "dragend", function SetCenter() {
                var position = page.markerPoint.getPosition();
                map.panTo( position );
            } );
            page.setMapPosition = function ( point ) {
                page.markerPoint.setPosition( point );
                map.centerAndZoom( point, 15 );
            }
        } );

        // 点击搜索按钮，搜索地址
        searchBtn.onclick = function () {
            var local = new BMap.LocalSearch( map, {
                renderOptions : {map : map},
                onSearchComplete : function ( result ) {
                    var poi = result.getPoi( 0 );
                    if ( poi && page.markerPoint ) {
                        page.markerPoint.setPosition( poi.point );
                        page.markerPoint.searchTitle = poi.title;
                        page.markerPoint.enableDragging();
                    }
                }
            } );
            local.search( searchAddress.value );
        };

        // 点击保存按钮
        saveBtn.onclick = function () {
            closeSlidePage( page );
            var edPoint = page.markerPoint.getPosition();
            myGeo.getLocation( new BMap.Point( edPoint.lng, edPoint.lat ), function ( result ) {
                page.mapMediaInfo.Text = edPoint.lng + '$' + edPoint.lat + '$' + result.address + '$' + result.address;
                saveMedia( page.mapMediaInfo, page.pageData, function ( data ) {
                    if ( data.code == 200 ) {
                        fp.message( {
                            text : "保存成功"
                        } );
                        var curLi = null;
                        // 需要重新遍歷一遍
                        var lis = document.querySelectorAll( "li.page-list.show" );
                        for ( var i = 0; i < lis.length; i++ ) {
                            if ( page.pageData.Guid == lis[i].pageData.Guid ) {
                                curLi = lis[i];
                                break;
                            }
                        }
                        if ( curLi == null ) {
                            // 如果没有在show的li中找到匹配的li，说明页面已经被删掉了，不进行后续更新数据的操作
                            return;
                        }
                        for ( var me = 0; me < curLi.pageData.Medias.length; me++ ) {
                            // 寻找匹配的组件
                            if ( data.data.PrimaryId == curLi.pageData.Medias[me].ID ) {
                                // 找到了，更新页面组件数据
                                curLi.pageData.Medias[me].Text = data.data.Text;
                                // 生成新的页面
                                var newPage = makePage( curLi.pageData, function () {
                                    curLi.removeChild( curLi.querySelector( ".page" ) );
                                    curLi.appendChild( newPage );
                                    mappingToScreen( newPage );
                                } );
                                break;
                            }
                        }
                    }
                    else {
                        fp.message( {
                            text : "保存失败"
                        } );
                    }
                } );
            } );
        }
    }

    // 编辑视频
    function slidePageVideo() {
        var page = querySelector( ".slide-page-edit-video" );
        var tipsBtn = page.querySelector( ".edit-video-tips-btn" );
        var detailBorder = page.querySelector( ".edit-video-detail-border" );
        var saveBtn = page.querySelector( ".edit-video-save-btn" );
        var keyCode = page.querySelector( ".edit-video-text" );
        //关闭页面
        querySelector( ".close-edit-video-page-btn" ).onclick = function () {
            closeSlidePage( page );
        };
        onTap( tipsBtn, function () {
            tipsBtn.classList.toggle( "show-more" );
            detailBorder.classList.toggle( "show-more" );
        } );
        keyCode.on( "mousedown", function () {
            if ( keyCode.value == "请输入视频的通用代码" ) {
                keyCode.value = "";
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
                    curIndex = i;
                }
            } );
        } );
        saveBtn.onclick = function () {
            if ( !(/^<iframe/).test( keyCode.value ) ) {
                fp.message( {
                    text : "请输入正确的视频通用代码"
                } );
                return;
            }
            closeSlidePage( page );
            page.videoMediaInfo.Text = encodeURIComponent( keyCode.value );
            page.videoMediaInfo.ActionLink = "";
            fp.message( {
                text : "正在保存"
            } );
            saveMedia( page.videoMediaInfo, page.pageData, function ( data ) {
                if ( data.code == 200 ) {
                    // 视频比较特殊的一点是，修改完之后看不到区别，除非进入预览，所以就不更新数据了
                    fp.message( {
                        text : "保存成功"
                    } );
                }
                else {
                    fp.message( {
                        text : "保存失败"
                    } );
                }
            } );
        }
    }

    // 编辑链接
    function slidePageAnchor() {
        var page = querySelector( ".slide-page-edit-anchor" );
        var position = page.querySelector( ".edit-anchor-position" );
        var saveBtn = page.querySelector( ".edit-anchor-save-btn" );
        var link = page.querySelector( ".edit-anchor-text" );
        onTap( page.querySelector( ".close-edit-anchor-page-btn" ), function () {
            closeSlidePage( page );
        } );
        link.on( "mousedown", function () {
            if ( link.value == "请输入要打开的链接" ) {
                link.value = "";
            }
        } );
        saveBtn.onclick = function () {
            if ( !(/^https?:/).test( link.value ) ) {
                fp.message( {
                    text : "请输入一个合法的链接"
                } );
                return;
            }
            closeSlidePage( page );
            page.linkMediaInfo.ActionLink = link.value;
            page.linkMediaInfo.Text = encodeURIComponent( position.value );
            saveMedia( page.linkMediaInfo, page.pageData, function ( data ) {
                if ( data.code == 200 ) {
                    // 视频比较特殊的一点是，修改完之后看不到区别，除非进入预览，所以就不更新数据了
                    fp.message( {
                        text : "保存成功"
                    } );
                }
                else {
                    fp.message( {
                        text : "保存失败"
                    } );
                }
            } );
        }
    }

    // 编辑多图
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
            axis : "x",
            stop : function () {
                var sendDate = {
                    id : null,
                    ids : []
                };
                loopArray( page.pageData.Medias, function ( m ) {
                    if ( m.Category == 8 ) {
                        sendDate.id = m.ID;
                    }
                } );
                var items = page.querySelectorAll( ".edit-multi-img-item" );
                loopArray( items, function ( item, i ) {
                    sendDate.ids.push( item.imageMedia.ID );
                    item.querySelector( ".edit-multi-img-item-count" ).innerHTML = i + 1;
                } );
                fpInvokeAPI.toSortMultiImage( sendDate, function ( data ) {
                    //console.log( data )
                } );
            }
        } );

        saveBtn.onclick = function () {
            closeSlidePage( page );
            // 更新li上的数据，重新渲染主屏上的影像
            var curLi = null;
            // 需要重新遍歷一遍
            var lis = document.querySelectorAll( "li.page-list.show" );
            for ( var i = 0; i < lis.length; i++ ) {
                if ( page.pageData.Guid == lis[i].pageData.Guid ) {
                    curLi = lis[i];
                    break;
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
                        break;
                }
                loop( len, function ( i ) {
                    var cur = JSON.parse( JSON.stringify( tem ) );
                    cur.Guid = imgs[i].imageMedia.Guid;
                    cur.ID = imgs[i].imageMedia.ID;
                    cur.Uri = imgs[i].imageMedia.Uri;
                    curLi.pageData.Medias.push( cur );
                } );
                //生成新的页面
                var newPage = makePage( curLi.pageData, function () {
                    curLi.removeChild( curLi.querySelector( ".page" ) );
                    curLi.appendChild( newPage );
                    if ( curLi.classList.contains( "select" ) ) {
                        mappingToScreen( newPage );
                    }
                } );
            }
        };
        closeBtn.onclick = function () {
            closeSlidePage( page );
        };
        uploadBtn.onclick = function () {
            if ( page.querySelectorAll( ".edit-multi-img-item" ).length >= 20 ) {
                fp.message( {
                    text : "一个多图版式最多上传20张图片"
                } );
            }
            else {
                page.querySelector( ".cropit-image-input" ).click();
            }
        };
        imageEditor.on( "mouseover", function () {
            imageEditor.classList.add( 'can-save' );
        } );
        imageEditor.on( "mouseleave", function () {
            imageEditor.classList.remove( 'can-save' );
        } );

        // 保存对图片的编辑
        saveImgBtn.onclick = function () {
            if ( inputFile.isNeedCreat ) {
                // 这次保存是在创建图片
                preview.style.backgroundImage = "";
                saveImage( 0, {
                    o : $( '.edit-multi-img-editor' ).cropit( "cropInfo" )
                }, function ( data ) {
                    if ( data.code != 200 ) {
                        fp.message( {
                            text : "图片添加失败"
                        } );
                    }
                    else {
                        inputFile.isNeedCreat = false;
                        CSS( border, {
                            width : (border.querySelectorAll( ".edit-multi-img-item" ).length + 1) * 120 + "px"
                        } );
                        data.data.Uri = data.data.Url;
                        makeImgItem( data.data, border.querySelectorAll( ".edit-multi-img-item" ).length );
                        border.querySelector( ".edit-multi-img-item.select" ) && border.querySelector( ".edit-multi-img-item.select" ).classList.remove( "select" );
                        var items = border.querySelectorAll( ".edit-multi-img-item" );
                        items[items.length - 1].classList.add( "select" );
                        border.curIndex = items.length - 3;
                        $( '.edit-multi-img-editor' ).cropit( "destroy" );
                        $( '.edit-multi-img-editor' ).cropit( {
                            imageState : {
                                src : data.data.Url
                            }
                        } );
                        if ( items.length > 3 ) {
                            CSS( border, {
                                "-webkit-transform" : "translate3d(" + (-108 * border.curIndex) + "px,0,0)"
                            } );
                        }
                    }
                    formate.reset();
                } );
            }
            else {
                // 修改圖片
                var curItem = border.querySelector( ".edit-multi-img-item.select" );
                curItem.classList.add( "loading" );
                preview.style.backgroundImage = "";
                saveImage( curItem.imageMedia.ID, {
                    o : $( '.edit-multi-img-editor' ).cropit( "cropInfo" ),
                    imgUrl : curItem.imageMedia.Uri
                }, function ( data ) {
                    if ( data.code == 200 ) {
                        fp.message( {
                            text : "图片修改成功"
                        } );
                        curItem.classList.remove( "loading" );
                        $( '.edit-multi-img-editor' ).cropit( "destroy" );
                        $( '.edit-multi-img-editor' ).cropit( {
                            imageState : {
                                src : data.data.Url
                            }
                        } );
                        border.querySelector( ".edit-multi-img-item.select" ).classList.remove( "select" );
                        curItem.classList.add( "select" );
                        curItem.imageMedia.Uri = data.data.Url;
                        curItem.querySelector( ".edit-multi-img-item-image-wrapper" ).style.backgroundImage = "url(" + data.data.Url + ")"
                    }
                    else {
                        fp.message( {
                            text : "图片修改失败"
                        } );
                    }
                } );
            }
        };

        // 多图编辑
        function saveImage( mediaGuid, info, callback ) {
            // 这个接口挺复杂，所有编辑单张图片的地方都用到了这个接口，有好几种用途：
            // ①isRichMedia是true，在编辑多图时候使用
            // ②omid为0表示多图新建一张图片 （add）
            // ③如果根据图片的url修改图片剪裁，则添加imgUrl字段，表示修改 （update）
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
                fd.append( key, value );
            } );
            if ( info && info.imgUrl ) {
                fd.append( "imgUrl", info.imgUrl );
            }
            else {
                fd.append( "blob-fileName", inputFile.files[0].name );
                fd.append( "imgFile", inputFile.files[0], inputFile.files[0].name );
            }
            var size = {width : null, height : null};
            for ( var i = 0; i < page.pageData.Medias.length; i++ ) {
                if ( page.pageData.Medias[i].Category == 8 ) {
                    var attr = JSON.parse( page.pageData.Medias[i].Attributes );
                    size.width = attr.W;
                    size.height = attr.H;
                    break;
                }
            }
            if ( size.height ) {
                fd.append( "Width", size.width );
                fd.append( "Height", size.height );
            }

            // 设置
            fpInvokeAPI.saveImageConfig( {
                data : fd,
                success : function ( data ) {
                    callback( data );
                }
            } );
        }

        inputFile.onchange = function () {
            imageEditor.classList.add( 'can-save' );
            // 点击添加图片按钮，并不意味着服务器上就已经有这张图片了，上传这张图片需要用户自己点击保存后才行。
            // 那么同一个保存按钮，可能调用创建图片的接口，也有可能调用修改图片的接口（其实只是参数不同）
            //　每次change事件被触发，就表明又选中了一张图片，就需要搞一个变量，表示是在创建
            inputFile.isNeedCreat = true;
        };

        function makeImgItem( image, i, style ) {
            var itemBorder = element( "div", {
                "classList" : "edit-multi-img-item"
            }, border );
            element( "div", {
                "classList" : "edit-multi-img-item-loading-icon"
            }, itemBorder );
            itemBorder.imageMedia = image;
            if ( i == 0 ) {
                $( '.edit-multi-img-editor' ).cropit( "destroy" );
                $( '.edit-multi-img-editor' ).cropit( {
                    imageState : {
                        src : image.Uri
                    }
                } );
                itemBorder.classList.add( "select" );
            }
            var count = element( "div", {
                "classList" : "edit-multi-img-item-count"
            }, itemBorder );
            count.innerHTML = i + 1;
            var deleteBtn = element( "div", {
                "classList" : "edit-multi-img-item-delete"
            }, itemBorder );
            var imageWrapper = element( "div", {
                "classList" : "edit-multi-img-item-image-wrapper"
            }, itemBorder );
            CSS( imageWrapper, {
                "background-image" : "url(" + image.Uri + ")",
                "background-repeat" : "no-repeat",
                "background-position" : "0 0",
                "background-size" : "88px auto"
            } );
            if ( style ) {
                var s = style.backgroundSize.split( "px" );
                var w = parseInt( s[0] );
                CSS( imageWrapper, {
                    "background-position" : style.backgroundPosition,
                    "background-size" : w * 88 / 192 + "px auto"
                } );
            }
            deleteBtn.onclick = function ( e ) {
                e.stopPropagation();
                if ( border.querySelectorAll( ".edit-multi-img-item" ).length == 1 ) {
                    fp.message( {
                        text : "多图中需要至少有一张图"
                    } );
                }
                else {
                    // 执行删除,首先删除数据
                    border.removeChild( itemBorder );
                    var leftItems = border.querySelectorAll( ".edit-multi-img-item" );
                    var deleteIndex = parseInt( itemBorder.querySelector( ".edit-multi-img-item-count" ).innerHTML ) - 1;
                    var curItem;
                    if ( leftItems[deleteIndex] ) {
                        curItem = leftItems[deleteIndex];
                    }
                    else {
                        curItem = leftItems[deleteIndex - 1];
                    }
                    if ( itemBorder.classList.contains( "select" ) ) {
                        curItem.classList.add( "select" );
                        $( '.edit-multi-img-editor' ).cropit( "destroy" );
                        $( '.edit-multi-img-editor' ).cropit( {
                                imageState : {
                                    src : curItem.querySelector( ".edit-multi-img-item-image-wrapper" ).style.backgroundImage.slice( 4, -1 )
                                }
                            }
                        )
                    }
                    loopArray( leftItems, function ( item, i ) {
                        item.querySelector( ".edit-multi-img-item-count" ).innerHTML = i + 1;
                    } );
                    // 像后台发送删除该图片的请求
                    image.ID && fpInvokeAPI.deleteImageFromMultiImages( {
                        pid : page.pageData.Guid,
                        mid : image.ID
                    }, function ( d ) {
                    } );
                }
            };
            onTap( imageWrapper, function () {
                inputFile.isNeedCreat = false;
                preview.classList.remove( "hide" );
                var curItem = border.querySelector( ".edit-multi-img-item.select" );
                curItem && curItem.classList.remove( "select" );
                $( '.edit-multi-img-editor' ).cropit( "destroy" );
                $( '.edit-multi-img-editor' ).cropit( {
                    imageState : {
                        src : itemBorder.imageMedia.Uri
                    }
                } );
                itemBorder.classList.add( "select" );
            } );
            return itemBorder;
        }

        border.left = 0;
        border.curIndex = 0;
        // 编辑多图页面有一个初始化方法，每次在mappingToScreen方法中打开多图页的时候都会调用这个方法。
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
                    break;
            }
            if ( pageInfo.pageData.Layout == "valentine-02" ) {
                // 因为这个版式的多图尺寸是正方形，所以需要特殊对待编辑页面的图片剪裁形状
                insertCSSRules( {
                        ".edit-multi-img-window" : {
                            height : "95px"
                        },
                        ".edit-page-slide-page-border .edit-multi-img-editor .cropit-image-preview" : {
                            height : "192px"
                        },
                        ".edit-multi-img-item-image-wrapper" : {
                            height : "88px"
                        },
                        ".edit-multi-img-right" : {
                            top : "110px"
                        },
                        ".edit-multi-img-left" : {
                            top : "142px"
                        }
                    }
                );
            }
            else {
                insertCSSRules( {
                    ".edit-multi-img-window" : {
                        height : "141px"
                    },
                    ".edit-page-slide-page-border .edit-multi-img-editor .cropit-image-preview" : {
                        height : "302px"
                    },
                    ".edit-multi-img-item-image-wrapper" : {
                        height : "134px"
                    },
                    ".edit-multi-img-right" : {
                        top : "135px"
                    },
                    ".edit-multi-img-left" : {
                        top : "165px"
                    }
                } );
            }
            page.pageData = pageInfo.pageData;
            border.innerHTML = "";
            page.imageMedias = imageMedias;
            CSS( border, {
                width : imageMedias.length * 120 + "px"
            } );
            loopArray( imageMedias, function ( image, i ) {
                makeImgItem( image, i );
            } );
        };
        leftBtn.onclick = function () {
            if ( border.curIndex > 0 ) {
                border.curIndex -= 1;
                CSS( border, {
                    "-webkit-transform" : "translate3d(" + (-108 * border.curIndex) + "px,0,0)"
                } );
            }
        };
        rightBtn.onclick = function () {
            if ( border.curIndex + 2 < page.querySelectorAll( ".edit-multi-img-item" ).length - 1 ) {
                border.curIndex += 1;
                CSS( border, {
                    "-webkit-transform" : "translate3d(" + (-108 * border.curIndex) + "px,0,0)"
                } );
            }
        }
    }

    // 用戶保存设置的时候调用这个函数，音乐和个人配置都要使用.配置音乐的话isMusic为true
    function saveUserConfig( isMusic, callback ) {
        var crop = $( ".edit-setting-page .crop-img-border" ).cropit( "cropInfo" );
        var inputFile = querySelector( ".edit-setting-page .crop-img-border .cropit-image-input" );
        var fd = new FormData();
        if ( !isMusic && inputFile.files.length != 0 ) {
            // 添加头像文件，在这里不会验证文件大小是否超过限制，应该在调用这个函数之前就验证
            fd.append( "blob-fileName", inputFile.files[0].name );
            fd.append( "logo-thumbnail", inputFile.files[0], inputFile.files[0].name );
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
            "WorkVisibility" : arguments[2] || 11/*(function () {
             /* 这个字段与公开&推荐有关
             2---->不公开&不推荐
             11---->公开&推荐
             12---->公开&不推荐
             if (publicitySwitch.classList.contains("close") && recommendSwitch.classList.contains("close")) {
             // 不公开&不推荐
             number = 2;
             }
             else if ( !publicitySwitch.classList.contains( "close" ) && !recommendSwitch.classList.contains( "close" ) ) {
             // 公开&推荐
             number = 11;
             }
             else if ( !publicitySwitch.classList.contains( "close" ) && recommendSwitch.classList.contains( "close" ) ) {
             // 公开&不推荐
             number = 12;
             }
             *
             return number;
             })()*/,
            "CustomCopyrightEnable" : (function () {
                // 0自己的署名、1公众账号的署名、2公众账号署名+关闭热门初页栏目
                var value = querySelector( ".edit-setting-page .page-turning-signature" ).value;
                var isOpen = querySelector( ".edit-setting-switch-hot" ).classList.contains( "close" );
                if ( value == "default" ) {
                    // 如果是个人账号，则没什么好说的，直接返回0
                    return 0;
                }
                else if ( value == "custom" && isOpen ) {
                    return 1;
                }
                else {
                    //  使用的是公众账号，并且关闭了热门初页栏
                    return 2;
                }
            })()
        }, function ( key, value ) {
            fd.append( key, value );
        } );
        fpInvokeAPI.saveConfig( {
            data : fd,
            success : callback
        } );
    }

// 编辑音乐
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
            page.classList.add( "hide" );
        };
        page.addEventListener( "mouseover", function () {
            page.classList.add( "top" );
        }, false );
        page.addEventListener( "mouseout", function () {
            page.classList.remove( "top" );
        }, false );
        // 保存音乐设置
        saveMusicBtn.onclick = function () {
            if ( page.querySelector( ".select.item" ) ) {
                // 如果存在被选中的音乐
                saveMusicBtn.musicUrl = page.querySelector( ".select.item .name" ).music.url;
                // 首先组织数据
                fp.message( {
                    text : "正在保存设置"
                } );
                saveUserConfig( true, function ( data ) {
                    // todo 此处可以添加音乐保存是否成功的提示
                    page.classList.add( "hide" );
                    data.code == 200 && fp.message( {
                        text : "保存成功"
                    } );
                } );
            }
            else {
                fp.message( {
                    text : "请选一首喜欢的音乐"
                } );
            }
        };
        openBtn.onclick = function () {
            page.classList.remove( "hide" );
        };
        var curSwitch = systemMusicBtn;
        curSwitch.classList.add( "select" );
        systemMusicBtn.onclick = function () {
            if ( curSwitch != systemMusicBtn ) {
                curSwitch.classList.remove( "select" );
                curSwitch = systemMusicBtn;
                curSwitch.classList.add( "select" );
                // 切出系统音乐列表
                systemList.classList.add( "select" );
                userList.classList.remove( "select" );
            }
        };
        userMusicBtn.isLoadData = false;
        userMusicBtn.onclick = function () {
            if ( curSwitch != userMusicBtn ) {
                curSwitch.classList.remove( "select" );
                curSwitch = userMusicBtn;
                curSwitch.classList.add( "select" );
                // 切出用戶音乐列表
                systemList.classList.remove( "select" );
                if ( !userMusicBtn.isLoadData ) {
                    var container = userList.querySelector( ".music-list" );
                    userList.classList.add( "select" );
                    container.classList.add( "loading" );
                    // 如果还没有加载过数据，先加载数据
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
                                name.music = {
                                    Id : music.Id,
                                    url : music.Url,
                                    MusicType : music.MusicType
                                };
                                onTap( name, function () {
                                    // 选中音乐
                                    // 先去掉已经选择的
                                    page.querySelector( ".item.select" ) && page.querySelector( ".item.select" ).classList.remove( "select" );
                                    name.parentNode.classList.add( "select" );
                                } );
                                onTap( btn, function () {
                                    if ( !btn.classList.contains( "play" ) ) {
                                        // 沒播放，則進行播放
                                        //　如果此时还有其他音乐在播放，修改对方的播放图标
                                        page.querySelector( ".play.btn" ) && page.querySelector( ".play.btn" ).classList.remove( "play" );
                                        btn.classList.add( "play" );
                                        audio.src = name.music.url;
                                        audio.play();
                                    }
                                    else {
                                        // 正在播放，則暫停
                                        btn.classList.remove( "play" );
                                        audio.pause();
                                    }
                                } );
                                container.appendChild( item );
                            } );
                        }
                    } );
                }
            }
        };
        closeBtn.onclick = function () {
            page.classList.add( "hide" );
        };
        // 用户上传音乐按钮
        updateMusicBtn.onclick = function () {
            inputMusicFile.click();
        };
        inputMusicFile.onchange = function () {
            // 得到音乐名字等信息
            if ( inputMusicFile.files.length == 0 ) {
                return;
            }
            var musicName = inputMusicFile.files[0].name;
            var musicLastModified = inputMusicFile.files[0].lastModified;
            var musicSize = inputMusicFile.files[0].size;
            // 先判断文件是否超过大小限制
            if ( musicSize > 4 * MB ) {
                alert( "音乐文件不能超过4MB~" );
                return;
            }
            // 同一首音乐不允许上传两次，判断是不是同一首音乐先看名称，然后再看它的时间戳
            var userMusicItems = userList.querySelectorAll( ".user-music-item" );
            var isLive = false;
            if ( userMusicItems.length != 0 ) {
                for ( var i = 0; i < userMusicItems.length; i++ ) {
                    if ( userMusicItems[i].musicName == musicName ) {
                        alert( "同一首音乐只能上传一次哟~!" );
                        isLive = true;
                        break;
                    }
                }
                if ( !isLive ) {
                    // 如果上传的音乐不重复，则进行后续处理
                    processUpload( inputMusicFile.files[0] );
                }
            }
            else {
                // 目前还没上传过音乐，直接略过是不是同一首音乐的检查
                processUpload( inputMusicFile.files[0] );
            }
            function processUpload( file ) {
                var fd = new FormData();
                fd.append( "blob-fileName", file.name );
                fd.append( "MyFile", file, file.name );// 在某些IDE中會该句代码可能会提示报错，忽略，因为目前支队chrome内核支持，所以忽略
                // 在列表中生成项
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
                        // 如果还在加载状态，点击的时候abort上传的xhr
                        syncxhr && syncxhr.abort();
                        uploadxhr && uploadxhr.abort();
                        list.removeChild( item );
                    }
                    else {
                        // 已经上传完毕，点击播放音乐
                        if ( !btn.classList.contains( "play" ) ) {
                            // 沒播放，則進行播放
                            //　如果此时还有其他音乐在播放，修改对方的播放图标
                            page.querySelector( ".play.btn" ) && page.querySelector( ".play.btn" ).classList.remove( "play" );
                            btn.classList.add( "play" );
                            audio.src = name.music.url;
                            audio.play();
                        }
                        else {
                            // 正在播放，則暫停
                            btn.classList.remove( "play" );
                            audio.pause();
                        }
                    }
                } );
                uploadxhr = fpInvokeAPI.uploadUserMusic( {
                    data : fd,
                    success : function ( data ) {
                        item.url = data.data.Url;
                        // 成功上传到第三方服务器后和我们的服务器同步
                        syncxhr = fpInvokeAPI.syncUploadMusic( {
                            FileName : data.data.FileName,
                            Url : data.data.Url
                        }, function ( syndata ) {
                            if ( syndata.code == 200 ) {
                                CSS( item.querySelector( ".already-progress" ), {
                                    width : "100%"
                                } );
                                setTimeout( function () {
                                    item.classList.remove( "loading" );
                                    // 上传完毕之后给这个条目注册事件：播放和选中
                                    name.music = {
                                        Id : data.data.ID,
                                        url : data.data.Url,
                                        MusicType : 2
                                    };
                                    onTap( name, function () {
                                        var cur = page.querySelector( ".item.select" );
                                        cur && cur.classList.remove( "select" );
                                        item.classList.add( "select" );
                                    } );
                                }, 1000 );
                            }
                        } );
                    },
                    progress : function ( e ) {
                        //e.loaded / e.total
                        CSS( item.querySelector( ".already-progress" ), {
                            width : e.loaded / e.total * 100 * 0.8 + "%"
                            // 由于上传的进度实际上是分为两部分，一部分是上传到第三方服务器，另外一部分是和我方服务器做同步
                            // 向第三方服务器上传音乐传输的数据比较大，所以设置为总进度的80%（0.8）
                        } );
                    }
                } );
            }
        }
    }

// 作品设置
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
        var hotSwitch = querySelector( ".edit-setting-switch-hot" );// 热门初页开关
        var publicitySwitch = querySelector( ".edit-setting-switch-publicity" );// 公开开关
        var recommendSwitch = querySelector( ".edit-setting-switch-recommend" );// 推荐开关
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
                signatureWord.classList.remove( "not-visible" );
            }
            else {
                hotSwitch.classList.add( "not-visible" );
                signatureWord.classList.add( "not-visible" );
            }
        };

        $( ".edit-setting-page .crop-img-border" ).cropit();
        page.addEventListener( "mouseover", function () {
            page.classList.add( "top" );
        }, false );
        page.addEventListener( "mouseout", function () {
            page.classList.remove( "top" );
        }, false );
        querySelector( ".close-edit-setting-page-hide-btn" ).onclick = function () {
            page.classList.add( "hide" );
        };
        changeThBtn.onclick = function () {
            fileInput.click();
        };
        // 监听标题的字数
        //title.addEventListener( "keydown", function ( e ) {
        //	titleCount.innerHTML = this.value.length == 1 && e.keyCode == 8 ? 2 : this.value.length + "/" + this.maxLength;// 每次弹出这个页面都应该执行一次这行代码
        //}, false );

        title.onkeyup = function () {
            setWordCount( title, titleCount, 32 );
        };
        title.onkeydown = function () {
            setWordCount( title, titleCount, 32 );
        };

        function setWordCount( textarea, wordCountSpan, maxLength ) {
            var enterCount = 0;
            for ( var i = 0; i < textarea.value.length; i++ ) {
                if ( textarea.value[i] == "\n" ) {
                    enterCount += 1;
                }
            }
            var count = textarea.value.length + enterCount;
            wordCountSpan.innerHTML = (count > maxLength ? maxLength : count) + "/" + maxLength;
        }

        // 监听描述的字数
        description.addEventListener( "keydown", function ( e ) {
            descriptionCount.innerHTML = this.value.length == 1 && e.keyCode == 8 ? 2 : this.value.length + "/" + this.maxLength;// 每次弹出这个页面都应该执行一次这行代码
        }, false );
        moreBtn.onclick = function () {
            querySelector( ".edit-setting-page .triangle" ).classList.toggle( "show-more" );
            moreBorder.classList.toggle( "show-more" );
        };
        hotSwitch.onclick = function () {
            this.classList.toggle( "close" );
        };
        publicitySwitch.onclick = function () {
            if ( !publicitySwitch.classList.contains( "close" ) ) {
                // 如果是关闭“公开”开关，则自动关闭“推荐”开关
                recommendSwitch.classList.add( "close" );
                number = 2;
            }
            else {
                number = 1;
            }
            publicitySwitch.classList.toggle( "close" );
        };
        recommendSwitch.onclick = function () {
            if ( recommendSwitch.classList.contains( "close" ) ) {
                // 如果是打开“推荐”开关，则自动关闭“公开”开关
                publicitySwitch.classList.remove( "close" );
                number = 11;
            }
            else {
                number = 12;
            }
            this.classList.toggle( "close" );
        };
        closePageBtn.onclick = function () {
            page.classList.add( "hide" );
        };
        openPageBtn.onclick = function () {
            page.classList.remove( "hide" );
        };
        makeSureBtn.onclick = function () {
            fp.message( {
                text : "正在保存您的配置"
            } );
            saveUserConfig( false, function ( data ) {
                if ( data.code == 200 ) {
                    fp.message( {
                        text : "保存成功"
                    } );
                    // 更新作品标志
                    querySelector( ".edit-page-theme-thumbnail img" ).src = data.data;
                    //　更新作品标题
                    querySelector( ".edit-page-theme-title" ).innerHTML = querySelector( ".edit-setting-title textarea" ).value;
                }
                page.classList.add( "hide" );
            }, number );
        }
    }

// 预览页面
    function presetPreviewPage() {
        var backBtn = previewPage.querySelector( ".preview-page-back-btn" );
        var iframe = previewPage.querySelector( "iframe" );
        iframe.onload = function () {
            try {
                iframe.contentDocument.querySelector( ".preview-page" ).parentNode.removeChild( iframe.contentDocument.querySelector( ".preview-page" ) );
            }
            catch ( e ) {
            }
        };
        backBtn.onclick = function () {
            previewPage.classList.remove( "show" );
            iframe.src = "";
        };
        querySelector( ".edit-page-preview.edit-page-icon" ).onclick = function () {
            previewPage.classList.add( "show" );
            iframe.src = virtualPath + "/" + workId;
        };
        // 上一页
        querySelector( ".preview-page-pre-page" ).onclick = function () {
            iframe.contentWindow.curPageIndex--;
        };
        //　下一页
        querySelector( ".preview-page-next-page" ).onclick = function () {
            iframe.contentWindow.curPageIndex++;
        };
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
        // 如果没有加载过数据，则在页面打开时候获取数据
        addPageSettingPage.classList.add( "loading" );
        fpInvokeAPI.getAllTemplate( function ( data ) {
            // 制作模板
            addPageSettingPage.isLoadTemplate = true;
            addPageSettingPage.classList.remove( "loading" );
            loopArray( data.data, function ( template, i ) {
                // state为0，以及在不支持名单中的版式不会显示，也就是没法添加这些版式页面
                if ( template.State == 1 && !notSupportList[template.ID] ) {
                    var ne = systemTemPlate.make( ".template-item-border" );
                    var thumbnail = ne.querySelector( ".template-thumbnail" );
                    CSS( thumbnail, {
                        "background" : "url(" + template.Thumbnail + ")",
                        "background-size" : "cover"
                    } );
                    ne.querySelector( ".template-description" ).innerHTML = template.Description;
                    wall.appendChild( ne );
                    onTap( thumbnail, function () {
                        wall.curselect && wall.curselect.classList.remove( "select" );
                        thumbnail.classList.add( "select" );
                        wall.curselect = thumbnail;
                        // 确认添加新的页面
                        fp.message( {
                            text : "正在添加新页面"
                        } );
                        fpInvokeAPI.addPage( template.ID, function ( data ) {
                            // todo 添加新的页面回调
                            if ( data.code == 200 ) {
                                // 添加成功
                                fp.message( {
                                    text : "添加成功"
                                } );
                                var li = appendOnePage( data.data, document.querySelectorAll( ".thumbnail-page-list li.show" ).length + 1, function ( page ) {
                                    // 将最新添加的页面映射到主屏幕
                                    mappingToScreen( page );
                                } );
                                //　要自动滑到最后,将最新页面选中
                                var pageListBorder = querySelector( ".edit-page-left ul" );
                                pageListBorder.scrollTop = pageListBorder.querySelectorAll( "li.show" ).length * 154 - pageListBorder.offsetHeight;
                                pageListBorder.querySelector( "li.select" ) && pageListBorder.querySelector( "li.select" ).classList.remove( "select" );
                                li.classList.add( "select" );
                            }
                        } );
                        // 保存的时候获取当前页面的id不用去其他地方取了，直接在确认按钮上找templateID
                    } );
                }
            } );
        } );
    }

    onTap( addPageBtn, function () {
        addPageBtn.classList.add( "hide" );
        openInnerPage( addPageSettingPage );
        if ( addPageSettingPage.isLoadTemplate == false ) {
            loadTemplate();
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
                    return "bottom";
            }
            return "middle";
        }

        function hexToRgb( hex ) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
            return result ? {
                r : parseInt( result[1], 16 ),
                g : parseInt( result[2], 16 ),
                b : parseInt( result[3], 16 )
            } : null;
        }

        var modeName,
            imgArr = [],
            textArr = [],
            videoArr = [],
            imageinfo = [],
            location = [],
            actionlinks = [],
            position = [],
            signup = {};
        var imgMediaInfo = [];
        var textMediaInfo = [];
        var videoMediaInfo = [];
        var linkMediaInfo = [];
        var mapMediaInfo = [];

        loopArray( data.Medias, function ( media ) {
            var attr = JSON.parse( media.Attributes );
            switch ( media.Category ) {
                // 纯文字
                case 1: //单行文本
                case 56: //多行文字
                    media.Text && textArr.push( media.Text );
                    media.Text && textMediaInfo.push( media );
                    break;
                // 图片、有可能是纯图片、文字转图片、报名、遮罩
                case 2:// 图片
                case 7:// 文字转图片
                case 9:// 报名
                case 11:// 高级报名
                case 57:// 遮罩
                case 58:// 文字转图片拼接
                    if ( media.Category == 57 ) {
                        if ( data.Layout == "custom" ) {
                            // 不是自定义的版式，mask不会加入到imgMediaInfo中
                            imgMediaInfo.push( media );
                            if ( media.Uri ) {
                                imgArr.push( media.Uri );
                            }
                            else {
                                if ( attr.Alpha ) {
                                    var rgb = hexToRgb( attr.Color );
                                    imgArr.push( "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + attr.Alpha + ")" );
                                }
                                else {
                                    imgArr.push( attr.Color );
                                }
                            }
                        }
                    }
                    else {
                        if ( media.Uri ) {
                            media.Uri && imgArr.push( media.Uri );
                        }
                        else {
                            imgArr.push( virtualPath + "/content/image/texteditspace.png" );
                        }
                        imgMediaInfo.push( media );
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
                        } );
                    }
                    if ( media.Category == 11 ) {
                        media.Text && position.push( getPosition( media.Text ) );
                        //todo: 高级报名
                        signup.formId = "";
                        signup.template = "{}";
                    }
                    break;
                case 5: // 视频
                    media.ActionLink && videoArr.push( media.ActionLink );
                    media.ActionLink && videoMediaInfo.push( media );
                    break;
                case 3: // 地图定位
                    if ( media.Text ) {
                        var loc = media.Text.split( '$' );
                        location.push( {
                            lng : loc[0],
                            lat : loc[1],
                            name : loc[2],
                            address : loc[3]
                        } );
                        mapMediaInfo.push( media );
                    }
                    break;
                case 6: // 外链接
                    media.Text && position.push( getPosition( media.Text ) );
                    media.ActionLink && actionlinks.push( media.ActionLink );
                    media.Text && linkMediaInfo.push( media );
                    break;
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
            // 如果是不支持的版式，添加水印
            var notSupportImage = new Image();
            notSupportImage.classList.add( "not-surppot-image" );
            notSupportImage.src = staticImgSrc( "image/not-surppot.png" );
            page.appendChild( notSupportImage );
        }
        return page;
    }

// 将一个页面数据变成一个页面dom，添加到右侧list，注册事件
    function appendOnePage( pageData, i, renderFinishedCallBack ) {
        var pageListBorder = querySelector( ".edit-page-left ul" );
        var li = systemTemPlate.make( ".page-list" );
        var page = makePage( pageData, function () {
            page.pageInfo.pageData = pageData;
            renderFinishedCallBack && renderFinishedCallBack( page );
            onTap( li, function () {
                // 将影像映射到手机屏幕上,注意这里不要直接用page，因为这里ontap可以在任何时候点击，
                // 页面有可能修改过，所以为了保证实时性，必须是query出来的map到主屏幕
                pageListBorder.querySelector( "li.select" ).classList.remove( "select" );
                li.classList.add( "select" );
                mappingToScreen( li.querySelector( ".page" ) );
                closeAllSlidePage();
            } );
        } );
        li.appendChild( page );
        li.classList.add( "show" );
        var deleteBtn = li.querySelector( ".delete-btn" );
        li.Guid = pageData.Guid;
        deleteBtn.Guid = pageData.Guid;
        deleteBtn.Id = pageData.Id;
        li.pageData = pageData;// 因为cloneNode不会复制用户自定义的dom属性，所以需要以li为载体，向映射到屏幕上的dom传输数据
        onTap( deleteBtn, function () {
            if ( confirm( "确认要删除该页面么？" ) ) {
                fpInvokeAPI.deletePage( deleteBtn.Guid, function ( data ) {
                    // todo 可以在这里做删除是否成功的验证
                    //console.log( data )
                } );
                //　直接從列表中移除
                li.classList.add( "hide" );
                li.classList.remove( "show" );
                // 重新编号
                loopArray( pageListBorder.querySelectorAll( "li.show" ), function ( li, i ) {
                    li.querySelector( ".thumbnail-page-list-item-num span" ).innerHTML = i + 1;
                } );
                if ( pageListBorder.querySelectorAll( "li" ).length == pageListBorder.querySelectorAll( "li.hide" ).length ) {
                    // 如果都删完了，清空手机屏幕，弹出新建页面配置页
                    var screen = querySelector( ".edit-page-phone-screen" );
                    screen.innerHTML = "";
                    addPageBtn.classList.add( "hide" );
                    openInnerPage( addPageSettingPage );
                    if ( addPageSettingPage.isLoadTemplate == false ) {
                        loadTemplate();
                    }
                }
                else {
                    //优先选下一个，也就是说第4个被删除，则默认显示第5个（由于被删除的页面并没有从dom中移除）
                    var next = pageViewJumpTo( 1, true );
                    if ( next.el == null ) {
                        next = pageViewJumpTo( -1, true );
                    }
                    mappingToScreen( next.el.querySelector( ".page" ) );
                }
            }
        } );
        li.querySelector( "span" ).innerHTML = i;
        pageListBorder.appendChild( li );
        return li;
    }

    var screenMessageTimeId;
//　可以在手机屏幕上显示提示
    var screenMessage = function ( text ) {
        clearTimeout( screenMessageTimeId );
        var screen = querySelector( ".edit-page-phone-screen" );
        var messageBox = screen.querySelector( ".edit-page-screen-message-box" );
        if ( !messageBox ) {
            messageBox = element( "div", {
                classList : "edit-page-screen-message-box"
            }, screen );
        }
        setTimeout( function () {
            messageBox.classList.add( "show" );
        }, 10 );
        messageBox.innerHTML = text;
        screenMessageTimeId = setTimeout( function () {
            clearTimeout( screenMessageTimeId );
            messageBox.classList.remove( "show" );
        }, 1500 );
    };


// 将左侧列表中的页面映射到手机屏幕上
    function mappingToScreen( page ) {
        if ( querySelector( "li.page-list.select" ).pageData.Id != page.pageInfo.pageData.Id ) {
            /* 如果此時被選中的与要渲染的页面不一致，则直接return
             造成不一致的原因主要是因为页面被渲染（makePage）是异步的，必须等到页面被渲染出来才能映射到屏幕上
             而用户可能等不及映射完毕就去选看其它页面了，这时候就会出现不一致的情况
             */
            return;
        }
        var editWordPage = querySelector( ".slide-page-edit-word" );
        var editImagePage = querySelector( ".slide-page-edit-bgimg" );
        var editVideoPage = querySelector( ".slide-page-edit-video" );
        var editLinkPage = querySelector( ".slide-page-edit-anchor" );
        var editMapPage = querySelector( ".slide-page-edit-map" );
        var editMultiImagePage = querySelector( ".slide-page-edit-multi-img" );

        // 得到一个元素相对于页面的坐标，有些元素是嵌套包含的
        function getPageCo( el ) {
            var x = 0;
            var y = 0;
            while ( true ) {
                if ( el.classList.contains( "page" ) ) {
                    break;
                }
                // 在这里其实是忽略了一些东西，比如说border的宽度没有计算在内,目前没有见到设置border的元素
                //　如果将来有了，用这个方法获取：getComputedStyle( el, null )["border-width"]
                x += el.x;
                y += el.y;
                el = el.parentNode;
            }
            return {
                x : x,
                y : y
            }
        }

        // 初始化文字编辑页面
        function initSlideWordPage( info, media ) {
            editWordPage.textInfo = media;
            editWordPage.selectColor( info.Color );
            editWordPage.selectFontAnimation( info.Animation );
            editWordPage.selectFontFamily( info.FontFamily );
            editWordPage.fillText( media.Text );
        }

        // 文字的旋转、缩放、拖拽保存的时候都调用这个函数
        function saveTextConfig( media, pageData, callback ) {
            // 保存文字的旋转、缩放、旋转
            var mediaAttr = JSON.parse( media.Attributes );
            var sendData = {
                model : {
                    "Guid" : media.Guid,// 部件的guid
                    "Text" : media.Text,
                    "ID" : media.ID,// 部件的id
                    "Category" : media.Category,
                    "ActionLink" : media.ActionLink,
                    "LayoutId" : pageData.LayoutId
                },
                pid : pageData.Guid,// page的id
                customenable : true
            };

            loopObj( mediaAttr, function ( key, value ) {
                if ( !sendData.model[key] ) {
                    // 如果data.model中没有这项数据，则采用textinfo.Attributes中的
                    sendData.model[key] = value;
                }
            } );
            fpInvokeAPI.saveTextConfig( sendData, callback );
        }

        var screen = querySelector( ".edit-page-phone-screen" );
        var bigPage = page.cloneNode( true );
        // 因为canvas的内容不能依靠cloneNode复制，所以需要绘制一遍
        var sCanvas = page.querySelectorAll( "canvas" );
        if ( sCanvas.length != 0 ) {
            //如果有canvas，手工绘制一遍
            var bCanvas = bigPage.querySelectorAll( "canvas" );
            loopArray( sCanvas, function ( s, i ) {
                bCanvas[i].getContext( "2d" ).drawImage( s, 0, 0 );
            } )
        }


        bigPage.pageInfo = page.pageInfo;
        var newPlugs = bigPage.querySelectorAll( ".layout-component-from-data" );
        // 添加透明遮罩层，注册事件
        var virtualLayer = element( "div", {classList : "virtual-layer"}, null );
        if ( !notSupportList[page.pageInfo.pageData.LayoutId] ) {
            // 只对支持的版式进行处理
            // 生成可编辑对象
            var curLi = null;
            var lis = document.querySelectorAll( "li.page-list.show" );
            for ( var n = 0; n < lis.length; n++ ) {
                if ( page.pageInfo.pageData.Guid == lis[n].pageData.Guid ) {
                    curLi = lis[n];
                    break;
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
                        return;
                    }
                    // 如果是文字转图片的话，应该按照文字来处理,同时要对文字传图片的部件可以进行拖拽、缩放、旋转操作
                    else if ( page.pageInfo.imgMediaInfo[plug.dataSource.index].Category == 7 ) {
                        var dragObj = element( "div", {classList : "virtual-layer-editable-drag-obj"}, editableObj );
                        dragObj.wx = editableObj.wx;
                        dragObj.wy = editableObj.wy;
                        dragObj.ww = editableObj.ww;
                        dragObj.wh = editableObj.wh;
                        dragObj.wr = editableObj.wr;
                        onTap( dragObj, function () {
                            if ( editableObj.classList.contains( "select" ) ) {
                                // 如果对象已经被选中，则点击的时候需要关闭滑动页
                                closeAllSlidePage();
                            }
                            else {
                                virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                                // 打开编辑文字页面
                                editWordPage.pageData = page.pageInfo.pageData;
                                initSlideWordPage( info, page.pageInfo.imgMediaInfo[plug.dataSource.index] );
                                querySelector( ".slide-page-edit-word" ).classList.remove( "pure-word" );
                                openSlidePage( querySelector( ".slide-page-edit-word" ) );
                            }
                            editableObj.classList.toggle( "select" );
                        } );
                        var liMediaData = null;
                        if ( curLi ) {
                            for ( n = 0; n < curLi.pageData.Medias.length; n++ ) {
                                if ( curLi.pageData.Medias[n].ID == page.pageInfo.imgMediaInfo[plug.dataSource.index].ID ) {
                                    liMediaData = curLi.pageData.Medias[n];
                                    break;
                                }
                            }
                        }
                        // 只有能转换成自定义版式的文转图才能拖拽、縮放、旋轉
                        if ( page.pageInfo.pageData.AllowCustom ) {
                            editableObj.onmouseover = function () {
                                fp.message( {
                                    text : "按住可以拖拽"
                                } );
                            };
                            //　拖拽&缩放按钮
                            var scaleAndRotateBasicPoint = element( "img", {
                                classList : "scale-rotate-basic-point",
                                src : staticImgSrc( "image/scale-rotate-basic-point.png" )
                            }, editableObj );
                            var scalePoint = element( "img", {
                                classList : "scale-basic-point",
                                src : staticImgSrc( "image/scale-basic-point.png" )
                            }, editableObj );
                            // 拖拽
                            onDrag( dragObj, {
                                end : function ( pos ) {
                                    // 拖拽結束后发送更新数据请求
                                    editableObj.wx = (editableObj.wx || 0) + pos.dx;
                                    editableObj.wy = (editableObj.wy || 0) + pos.dy;
                                    var Attributes = JSON.parse( page.pageInfo.imgMediaInfo[plug.dataSource.index].Attributes );
                                    //Attributes.X = editableObj.wx;
                                    //Attributes.Y = editableObj.wy;
                                    // 由於编辑和渲染采用的缩放手段不同，编辑采用的是scale，而渲染是根据缩放后的width、height
                                    //　这种差异导致定位的方式是不同的
                                    if ( editableObj.wscale < 1 ) {
                                        Attributes.X = (editableObj.wx + editableObj.ww * (1 - editableObj.wscale) / 2) << 0;
                                        Attributes.Y = (editableObj.wy + editableObj.wh * (1 - editableObj.wscale) / 2) << 0;
                                    }
                                    else {
                                        Attributes.X = (editableObj.wx - editableObj.ww * (editableObj.wscale - 1) / 2) << 0;
                                        Attributes.Y = (editableObj.wy - editableObj.wh * (editableObj.wscale - 1) / 2) << 0;
                                    }
                                    liMediaData.Attributes = page.pageInfo.imgMediaInfo[plug.dataSource.index].Attributes = JSON.stringify( Attributes );
                                    saveTextConfig( page.pageInfo.imgMediaInfo[plug.dataSource.index], page.pageInfo.pageData, function ( a ) {
                                    } );
                                    curLi.pageData.Layout = "custom";
                                },
                                move : function ( pos ) {
                                    translate( editableObj, (editableObj.wx || 0) + pos.dx, (editableObj.wy || 0) + pos.dy, editableObj.wscale, editableObj.wrotate );
                                    translate( bigPagePlugs[i], (editableObj.wx || 0) + pos.dx, (editableObj.wy || 0) + pos.dy, editableObj.wscale, editableObj.wrotate );
                                    !pagePlugs[i] && (pagePlugs[i] = curLi.querySelectorAll( ".layout-component-from-data" )[i]);
                                    pagePlugs[i] && translate( pagePlugs[i], (editableObj.wx || 0) + pos.dx, (editableObj.wy || 0) + pos.dy, editableObj.wscale, editableObj.wrotate );
                                }
                            } );
                            // 长按的时候，需要把缩放和旋转的按钮显示出来
                            onLTap( dragObj, function () {
                                if ( !editableObj.classList.contains( "select" ) ) {
                                    closeAllSlidePage();
                                    virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                                }
                                editableObj.classList.toggle( "select" );
                            } );
                            // 旋转缩放&缩放
                            setTimeout( function () {
                                function syncMove( obj ) {
                                    plug.wscale = obj.scale;
                                    plug.wrotate = obj.rotate * 2 * Math.PI / 360;
                                    translate( editableObj, editableObj.wx, editableObj.wy, obj.scale, obj.rotate );
                                    translate( bigPagePlugs[i], editableObj.wx, editableObj.wy, obj.scale, obj.rotate );
                                    !pagePlugs[i] && (pagePlugs[i] = curLi.querySelectorAll( ".layout-component-from-data" )[i]);
                                    pagePlugs[i] && translate( pagePlugs[i], editableObj.wx, editableObj.wy, obj.scale, obj.rotate );
                                }

                                function syncEnd() {
                                    // 缩放旋转結束后发送更新数据请求
                                    var Attributes = JSON.parse( page.pageInfo.imgMediaInfo[plug.dataSource.index].Attributes );
                                    // 由於编辑和渲染采用的缩放手段不同，编辑采用的是scale，而渲染是根据缩放后的width、height
                                    //　这种差异导致定位的方式是不同的
                                    if ( editableObj.wscale < 1 ) {
                                        Attributes.X = (editableObj.wx + editableObj.ww * (1 - editableObj.wscale) / 2) << 0;
                                        Attributes.Y = (editableObj.wy + editableObj.wh * (1 - editableObj.wscale) / 2) << 0;
                                    }
                                    else {
                                        Attributes.X = (editableObj.wx - editableObj.ww * (editableObj.wscale - 1) / 2) << 0;
                                        Attributes.Y = (editableObj.wy - editableObj.wh * (editableObj.wscale - 1) / 2) << 0;
                                    }
                                    Attributes.R = editableObj.wrotate * 2 * Math.PI / 360;
                                    Attributes.W = editableObj.ww * editableObj.wscale << 0;
                                    Attributes.H = editableObj.wh * editableObj.wscale << 0;
                                    liMediaData.Attributes = page.pageInfo.imgMediaInfo[plug.dataSource.index].Attributes = JSON.stringify( Attributes );
                                    saveTextConfig( page.pageInfo.imgMediaInfo[plug.dataSource.index], page.pageInfo.pageData, function ( a ) {
                                    } );
                                    curLi.pageData.Layout = "custom";
                                }

                                scaleAndRotate( scaleAndRotateBasicPoint, 0, editableObj.offsetHeight / 2, {
                                    move : function ( obj ) {
                                        syncMove( obj );
                                    },
                                    end : syncEnd
                                } );
                                scaleTheObj( scalePoint, editableObj.offsetWidth / 2, -editableObj.offsetHeight / 2, {
                                    move : function ( obj ) {
                                        syncMove( obj );
                                    },
                                    end : syncEnd
                                } );
                            }, 0 );
                        }
                    }
                    else {
                        onTap( editableObj, function () {
                            // 点击选择之后要有被选中的的效果
                            if ( editableObj.classList.contains( "select" ) ) {
                                // 如果对象已经被选中，则点击的时候需要去掉select同时关闭滑动页
                                editableObj.classList.remove( "select" );
                                closeAllSlidePage();
                            }
                            else {
                                virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                                editableObj.classList.add( "select" );
                                // 打开编辑图片页面
                                editImagePage.pageData = page.pageInfo.pageData;
                                editImagePage.mediaData = page.pageInfo.imgMediaInfo[plug.dataSource.index];
                                // 图片有大有小，需要调整页面编辑框的大小
                                // 图片的大小可以直接参照传输来的数据
                                CSS( editImagePage.querySelector( ".cropit-image-preview" ), {
                                    height : 256 * info.H / info.W + "px",
                                    "margin-top" : -128 * info.H / info.W + "px"
                                } );
                                $( ".slide-page-edit-bgimg .crop-img-border" ).cropit( 'destroy' );
                                $( ".slide-page-edit-bgimg .crop-img-border" ).cropit( {imageState : {src : page.pageInfo.imgMediaInfo[plug.dataSource.index].Uri}} );
                                openSlidePage( querySelector( ".slide-page-edit-bgimg" ) );
                                setTimeout( function () {
                                    querySelector( ".slide-page-edit-bgimg input.cropit-image-zoom-input.edit-bgimg-range" ).disabled = "disabled";
                                }, 0 );
                            }
                        } );
                    }
                }
                else if ( plug.dataSource.from == "text" ) {
                    info = JSON.parse( page.pageInfo.textMediaInfo[plug.dataSource.index].Attributes );
                    onTap( editableObj, function () {
                        if ( editableObj.classList.contains( "select" ) ) {
                            // 如果对象已经被选中，则点击的时候需要去掉select同时关闭滑动页
                            editableObj.classList.remove( "select" );
                            closeAllSlidePage();
                        }
                        else {
                            // 点击选择之后要有被选中的的效果
                            virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                            editableObj.classList.add( "select" );
                            //　打开编辑文字页面
                            editWordPage.pageData = page.pageInfo.pageData;
                            initSlideWordPage( info, page.pageInfo.textMediaInfo[plug.dataSource.index] );
                            editWordPage.classList.add( "pure-word" );
                            openSlidePage( editWordPage );
                        }
                    } );
                }
                else if ( plug.dataSource.from == "video" ) {
                    info = JSON.parse( page.pageInfo.videoMediaInfo[plug.dataSource.index].Attributes );
                    onTap( editableObj, function () {
                        if ( editableObj.classList.contains( "select" ) ) {
                            //editVideoPage
                            // 如果对象已经被选中，则点击的时候需要去掉select同时关闭滑动页
                            editableObj.classList.remove( "select" );
                            closeAllSlidePage();
                        }
                        else {
                            virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                            editableObj.classList.add( "select" );
                            //　打开编辑视频页面
                            querySelector( ".edit-video-text" ).value = "请输入视频的通用代码";
                            editVideoPage.pageData = page.pageInfo.pageData;
                            editVideoPage.videoMediaInfo = page.pageInfo.videoMediaInfo[plug.dataSource.index];
                            openSlidePage( editVideoPage );
                        }
                    } );
                }
                else if ( plug.dataSource.from == "link" ) {
                    info = JSON.parse( page.pageInfo.linkMediaInfo[plug.dataSource.index].Attributes );
                    onTap( editableObj, function () {
                        if ( editableObj.classList.contains( "select" ) ) {
                            //editVideoPage
                            // 如果对象已经被选中，则点击的时候需要去掉select同时关闭滑动页
                            editableObj.classList.remove( "select" );
                            closeAllSlidePage();
                        }
                        else {
                            virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                            editableObj.classList.add( "select" );
                            //　打开编辑视频页面
                            editLinkPage.pageData = page.pageInfo.pageData;
                            editLinkPage.linkMediaInfo = page.pageInfo.linkMediaInfo[plug.dataSource.index];
                            openSlidePage( editLinkPage );
                        }
                    } );
                }
                else if ( plug.dataSource.from == "map" ) {
                    //mapMediaInfo
                    info = JSON.parse( page.pageInfo.mapMediaInfo[plug.dataSource.index].Attributes );
                    onTap( editableObj, function () {
                        if ( editableObj.classList.contains( "select" ) ) {
                            //editVideoPage
                            // 如果对象已经被选中，则点击的时候需要去掉select同时关闭滑动页
                            editableObj.classList.remove( "select" );
                            closeAllSlidePage();
                        }
                        else {
                            virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                            editableObj.classList.add( "select" );
                            //　打开编辑视频页面
                            editMapPage.pageData = page.pageInfo.pageData;
                            editMapPage.mapMediaInfo = page.pageInfo.mapMediaInfo[plug.dataSource.index];
                            var locationInfo = editMapPage.mapMediaInfo.Text.split( "$" );
                            if ( (/^[\d|.]+$/).test( locationInfo[0] ) && (/^[\d|.]+$/).test( locationInfo[1] ) ) {
                                editMapPage.setMapPosition( new BMap.Point( locationInfo[0], locationInfo[1] ) );
                            }
                            openSlidePage( editMapPage );
                        }
                    } );
                }
                else if ( plug.dataSource.from == "multi-image" ) {
                    function setMultiImage( Layout ) {
                        var width = Layout == "MutipleImage04" ? 224 : 280;
                        var height = Layout == "MutipleImage04" ? 289 : 450;
                        var X = Layout == "MutipleImage04" ? 48 : 20;
                        var Y = Layout == "MutipleImage04" ? 169 : 29;

                        // 因为多图组件没有尺寸数据，所以需要枚举出来做适配，也就是说每次新弄出来一个多图版式都需要在这里做适配
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
                                break;
                        }
                        info = {
                            W : 280,
                            H : 450
                        };
                        setTimeout( function () {
                            CSS( editableObj, {
                                width : width + "px",
                                height : height + "px",
                                "-webkit-transform" : "translate3d(" + X + "px," + Y + "px,0) scale(1) rotateZ(0deg)"
                            } );
                            editableObj.wx = 280;
                            editableObj.wy = 450;
                            editableObj.ww = 20;
                            editableObj.wh = 29;
                        }, 0 );
                    }

                    setMultiImage( page.pageInfo.pageData.Layout );
                    onTap( editableObj, function () {
                        if ( editableObj.classList.contains( "select" ) ) {
                            editableObj.classList.remove( "select" );
                            closeAllSlidePage();
                        }
                        else {
                            virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ) && virtualLayer.querySelector( ".virtual-layer-editable-obj.select" ).classList.remove( "select" );
                            editableObj.classList.add( "select" );
                            openSlidePage( editMultiImagePage );
                            editMultiImagePage.init( page.pageInfo );
                        }
                    } );
                }
                if ( info.W == 320 && info.H == 504 ) {
                    // 是背景圖
                    info && CSS( editableObj, {
                        width : info.W - 2 + "px",
                        height : info.H - 2 + "px",
                        left : info.X + "px",
                        top : info.Y + "px",
                        "-webkit-transform" : "scale(" + plug.wscale + ") rotateZ(" + (plug.wrotate * 360 / (2 * Math.PI)) + "deg)",
                        "z-index" : 1
                    } );
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
                    editableObj.wscale = plug.wscale || info.scale || 1;
                }
            } );
        }
        screen.innerHTML = "";
        screen.appendChild( virtualLayer );
        screen.appendChild( bigPage );
    }

// 得到用户配置的数据，用于初始化
    function initPageView() {
        fpInvokeAPI.getPageData( function ( data ) {
            // 取到数据之后去掉loading类，加载标志就会消失
            editPageLeft.classList.remove( "loading" );
            if ( data.code != 200 ) {
                alert( "网络或服务器有问题，请稍后再试" );
                return;
            }
            // 根据得到的该作品的基本信息初始化一些配置内容
            if ( data.data ) {
                // 设置页面的标题
                data.data.Title && (querySelector( ".edit-setting-title textarea" ).value = data.data.Title);
                data.data.Description && (querySelector( ".edit-description textarea" ).value = data.data.Description);
                data.data.Thumbnail && (querySelector( ".edit-setting-page .default-thumbnail" ).src = data.data.Thumbnail);
                // 翻页动画
                data.data.Switch && (querySelector( ".edit-setting-page .page-turning-animation" ).value = data.data.Switch);
                // 翻页手势
                data.data.Mode && (querySelector( ".edit-setting-page .page-turning-gesture" ).value = data.data.Mode);
                // 主页面手机上的标题
                data.data.Title && (querySelector( ".edit-page-phone-content-border .edit-page-theme-title" ).innerHTML = data.data.Title);
                querySelector( ".edit-music-make-sure" ).musicUrl = data.data.BackgroundMusic;
                querySelector( ".edit-page-theme-thumbnail img" ).src = data.data.Thumbnail;
                querySelector( ".preview-page-share-thumbnail" ).src = data.data.Thumbnail;
                querySelector( ".preview-page-descrption" ).innerHTML = data.data.Description;
                querySelector( ".preview-page-share-title" ).innerHTML = data.data.Title;

                var switcher = querySelector( ".edit-setting-page .page-turning-animation" );
                if ( data.data.Mode && data.data.Mode == "push" ) {
                    switcher.disabled = true;
                    switcher.style.color = "#cfcfcf";
                }
                else {
                    switcher.disabled = false;
                    switcher.style.color = "#626262";
                }
                var publicitySwitch = querySelector( ".edit-setting-switch-publicity" );// 公开开关
                var recommendSwitch = querySelector( ".edit-setting-switch-recommend" );// 推荐开关
                /* 这个字段与公开&推荐有关
                 2---->不公开&不推荐
                 11---->公开&推荐
                 12---->公开&不推荐
                 */
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
                        break;
                }
            }
            // 进行页面渲染
            if ( data.data.PageItems.length == 0 ) {
                querySelector( ".edit-page-phone-content-border" ).classList.remove( "loading" );
                // todo 如果现在还没有页面，则自动弹出添加页面菜单
                addPageBtn.classList.add( "hide" );
                openInnerPage( addPageSettingPage );
                if ( addPageSettingPage.isLoadTemplate == false ) {
                    loadTemplate();
                }
            }
            else {
                var screen = querySelector( ".edit-page-phone-screen" );
                loopArray( data.data.PageItems, function ( pagedata, i ) {
                    var li = appendOnePage( pagedata, i + 1 );
                    if ( i == 0 ) {
                        // 将第一页的影像映射到手机屏幕上
                        li.classList.add( "select" );
                        var page = makePage( pagedata, function () {
                            querySelector( ".edit-page-phone-content-border" ).classList.remove( "loading" );
                            page.pageInfo.pageData = pagedata;
                            mappingToScreen( page );
                        } );
                        screen.appendChild( page );
                    }
                } );
            }

            window.customCopyright = data.data.CustomCopyright;
            querySelector( ".edit-setting-page .page-turning-gesture" ).onchange = function () {
                var val = this.value, switcher = querySelector( ".edit-setting-page .page-turning-animation" );
                if ( val == "push" ) {
                    switcher.disabled = true;
                    switcher.style.color = "#cfcfcf";
                }
                else {
                    switcher.disabled = false;
                    switcher.style.color = "#626262";
                }
            };
        } );
    }

// 上一頁、下一页使用，删除一个页面后也会调用
    function pageViewJumpTo( step, isNotMove ) {
        var pageListBorder = querySelector( ".edit-page-left ul" );
        // 选出当前选中的
        var cur = pageListBorder.querySelector( "li.select" );
        if ( !cur ) {
            return;
        }
        var ds = 0;// 记录下翻的距离（由于删除页面时候并没有真正移除dom，只是用display加以控制，所以需要记录这个ds控制下翻的距离）
        var next = null;
        if ( step == 1 ) {
            //往后翻
            while ( cur.nextElementSibling ) {
                if ( !cur.nextElementSibling.classList.contains( "hide" ) ) {
                    // 如果存在并且没有被删除就是我们要找的
                    next = cur.nextElementSibling;
                    break;
                }
                ds++;
                cur = cur.nextElementSibling;
            }
        }
        else {
            // 向前翻
            while ( cur.previousElementSibling ) {
                if ( !cur.previousElementSibling.classList.contains( "hide" ) ) {
                    // 如果存在并且没有被删除就是我们要找的
                    next = cur.previousElementSibling;
                    break;
                }
                ds++;
                cur = cur.previousElementSibling;
            }
        }
        if ( next != null ) {
            // 如果被找到了,则更改
            pageListBorder.querySelector( "li.select" ).classList.remove( "select" );
            next.classList.add( "select" );
            if ( isNotMove != true && document.querySelectorAll( ".edit-page-left ul li.show" ).length * 154 > pageListBorder.offsetHeight ) {
                // 调整ul的scrolltop使被选中的li始终在视野之内
                // 计算可以完整展示几个li
                var count = Math.floor( pageListBorder.offsetHeight / 154 );
                var curIndex = parseInt( next.querySelector( ".thumbnail-page-list-item-num span" ).innerHTML );
                if ( (curIndex - 1) * 154 > pageListBorder.scrollTop + pageListBorder.offsetHeight || (curIndex - 1) * 154 < pageListBorder.scrollTop ) {
                    // 不在可见范围内
                    if ( step == 1 ) {
                        pageListBorder.scrollTop = (curIndex - 1) * 154;
                    }
                    else {
                        if ( curIndex <= count ) {
                            pageListBorder.scrollTop = 0;
                        }
                        else {
                            pageListBorder.scrollTop = curIndex * 154 - pageListBorder.offsetHeight;
                        }
                    }
                }
            }
            return {
                el : next,
                ds : ds
            };
        }
        else {
            return {
                el : null,
                ds : null
            };
        }
    }

// 上一页与下一页按钮
    onTap( querySelector( ".edit-page-pre-page-btn" ), function () {
        // 上一页
        var li = pageViewJumpTo( -1 );
        if ( li.el != null ) {
            mappingToScreen( li.el.querySelector( ".page" ) );
        }
        else {
            fp.message( {
                text : "已经是第一页"
            } );
        }
        closeAllSlidePage();
    } );
    onTap( querySelector( ".edit-page-next-page-btn" ), function () {
        // 上一页
        var li = pageViewJumpTo( 1 );
        if ( li.el != null ) {
            mappingToScreen( li.el.querySelector( ".page" ) );
        }
        else {
            fp.message( {
                text : "已经是最后一页"
            } );
        }
        closeAllSlidePage();
    } );

    var weixinTips = querySelector( ".edit-page-weixin-tip" );
    var weixinTipsImg = querySelector( ".edit-page-weixin-tip-img" );

    weixinTips.onmouseover = function () {
        weixinTipsImg.classList.remove( "hide" );
    };
    weixinTips.onmouseout = function () {
        weixinTipsImg.classList.add( "hide" );
    };

// 获取音乐数据，为做展示用
    function preLoadingMusic() {
        // 音乐分类框
        var page = querySelector( ".edit-music-page" );
        var musicListCache = [];
        var musicListBorder = querySelector( ".edit-music-system-music-list .music-list" );
        var audio = querySelector( ".edit-music-page audio" );
        var systemMusicList = querySelector( ".edit-music-system-music-list" );
        var cats = [];// 因为目前的接口把自定义也算作在内，所以需要过滤一遍，以防止将来顺序发生变化导致出现错误
        var musicCategoryBorder = querySelector( ".edit-music-page .edit-music-system-class" );
        audio.addEventListener( "ended", function () {
            // 由于每次end的时候，播放的音乐可能都不相同，所以每次都要现query一遍，query不能提出
            var playBtn = page.querySelector( ".play.btn" );
            playBtn && playBtn.classList.remove( "play" );
        }, false );
        audio.addEventListener( "error", function () {
            alert( "对不起，该音乐暂时无法播放" );
            //　注释同上面的end事件
            var playBtn = page.querySelector( ".play.btn" );
            playBtn && playBtn.classList.remove( "play" );
        }, false );
        /*
         * 以下fpInvokeAPI.getMusicCategory中的这段代码做了很多工作：
         * ① 获取所有音乐的分类
         * ② 根据获取到的音乐分类生成分类按钮
         * ③ 为分类按钮注册点击事件，点击时获取相应的音乐列表（做了缓存优化）
         * ④ 获取到音乐列表之后要生成列表，并为列表中的每一项添加选中和播放功能
         * */
        fpInvokeAPI.getMusicCategory( function ( data ) {
            musicCategoryBorder.classList.remove( "loading" );
            if ( data.code == 200 ) {
                loopArray( data.data, function ( cat ) {
                    cat != "自定义" && cats.push( cat );
                } );
                loopArray( cats, function ( Category, i ) {
                    var catBtn = element( "div", {"classList" : "btn"}, musicCategoryBorder );
                    catBtn.innerHTML = Category;
                    catBtn.isGetList = false;
                    // 点击种类按钮的时候再去获取列表
                    catBtn.onclick = function () {
                        var curSelectCat = musicCategoryBorder.querySelector( "div.select" );
                        curSelectCat && curSelectCat.classList.remove( "select" );
                        catBtn.classList.add( "select" );
                        var curListPage = systemMusicList.querySelector( ".music-list .inner-music-list.show" );
                        if ( curListPage ) {
                            // 关闭当前列表
                            curListPage.classList.remove( "show" );
                            curListPage.classList.add( "hide" );
                        }
                        // 没有发送过数据则发送
                        if ( !musicListCache[i] ) {
                            var musicList = element( "div", {
                                "classList" : ["inner-music-list", "loading", "show", "cat-" + i]
                            }, systemMusicList );
                            element( "div", {
                                "classList" : ["loading-icon", "edit-page-icon"]
                            }, musicList );
                            musicListCache[i] = musicList;// 做缓存
                            musicListBorder.appendChild( musicListCache[i] );
                            // 发送获取指定分类音乐列表的请求
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
                                        name.music = {
                                            Id : music.Id,
                                            url : music.Url,
                                            MusicType : music.MusicType
                                        };
                                        // 选中音乐
                                        onTap( name, function () {
                                            // 选中音乐
                                            // 先去掉已经选择的
                                            var curSelectItem = page.querySelector( ".item.select" );
                                            curSelectItem && curSelectItem.classList.remove( "select" );
                                            name.parentNode.classList.add( "select" );
                                        } );
                                        // 播放音乐
                                        onTap( playBtn, function () {
                                            if ( !playBtn.classList.contains( "play" ) ) {
                                                // 沒播放，則進行播放
                                                //　如果此时还有其他音乐在播放，修改对方的播放图标
                                                var curPlayBtn = page.querySelector( ".play.btn" );
                                                curPlayBtn && curPlayBtn.classList.remove( "play" );
                                                playBtn.classList.add( "play" );
                                                audio.src = name.music.url;
                                                audio.play();
                                            }
                                            else {
                                                // 正在播放，則暫停
                                                playBtn.classList.remove( "play" );
                                                audio.pause();
                                            }
                                        } );
                                        list.appendChild( item );
                                    } );
                                }
                            } );
                        }
                        else {
                            systemMusicList.querySelector( ".music-list .inner-music-list.cat-" + i ).classList.remove( "hide" );
                            systemMusicList.querySelector( ".music-list .inner-music-list.cat-" + i ).classList.add( "show" );
                        }
                    };
                    i == 0 && catBtn.click();
                } );
            }
        } );
    }

    function initUserSetting() {
        fpInvokeAPI.getUserSetting( function ( data ) {
            if ( data.data ) {
                window.usersetting = data;
                var optionItem = $( "<option>" ).val( "custom" ).html( data.data.Author ).appendTo( $( ".edit-setting-page .page-turning-signature" ) );
                if ( window.customCopyright && window.customCopyright == true ) {
                    optionItem.prop( "selected", "selected" );
                }
            }
        } );
    }

    function init() {
        ppt.initial( {
            width : 320,
            height : 504,
            contentSrc : function ( src ) {
                return window.contentPath + "/content/" + src.toLowerCase();
            }
        } );

        // 初始化頁面视图，请求数据、展示、注册事件
        initPageView();
        initUserSetting();
        // 加载音乐,给分类按钮注册事件等
        preLoadingMusic();
    }

    init();
})();
