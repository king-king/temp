/**
 * Created by 白 on 2014/9/15.
 * 按钮相关板式
 */

plugin( function () {
	var array = imports( "array" ),
		$ = imports( "element" ),
		async = imports( "async" ),
		object = imports( "object" ),
		tips = imports( "../tips" ),
		pointer = imports( "pointer" ),
		Img = imports( "../img" ),
		history = imports( "../history" ),
		main = imports( "../main" );

	layoutFormats["Sign-Up02"] = {
		create : function ( layout, ds ) {
			var yList = {
					top : 148,
					middle : 417,
					bottom : 687
				},
				buttonSize = 125 * gRatio << 0;

			Component( Content.ImageCover( ds.image( 0 ), clientWidth, clientHeight ), layout );
			var button = Component( Content.Rect( buttonSize, buttonSize ), layout );
			button.x = p.center( button );
			button.y = p.transformCover( 0, yList[ds.position( 0 )] / 2 )[1];

			onTap( button.element, function () {
				history.jump( ds.actionlinks( 0 ) );
			} );
		}
	};

	// 报名表单页
	var signUpFormPage = history.registLoginPage( "sign-up", fp.SignupSystem, function ( page, formInfo ) {
		var formTemplate = formInfo.template, // 表单模板
			pageContent = $( "div.page-content", page ), // 报名页的内容部分
			form = $( "form", {
				action : "/"
			}, pageContent ),
			back = $( "div.icon.back", [
				Img.Icon( "signup/close" )
			], page ), // 返回按钮
			curFocus = null,
			lastInput = null,
			inputList = [], // 输入列表
			hideField = {}; // 隐藏字段

		page.classList.add( "sign-up-form-slide-page" );
		page.classList.add( "scroll" );
		page.classList.add( "need-default" );

		onTap( back, history.back );

		// 提交表单
		function submit() {
			var formData = [], unfilled = [];
			curFocus && curFocus.blur();

			function pushField( component, value ) {
				formData.push( {
					name : component.name,
					label : component.label,
					value : value
				} );
			}

			// 收集输入字段
			var errors = [];
			array.foreach( inputList, function ( item ) {
				var value = item.input.value;
				// 如果是必填字段,检查是否为空,若为空,添加到未填数组中
				if ( item.data.required ) {
					if ( value === "" ) {
						unfilled.push( item.data.label );
						item.input.classList.add( "error" );
					}
					else {
						var validateInfo = item.validate ? item.validate( value ) : null;
						if ( validateInfo ) {
							errors.push( validateInfo );
							item.input.classList.add( "error" );
						}
						else {
							pushField( item.data, value );
							item.input.classList.remove( "error" );
						}
					}
				}
				else {
					pushField( item.data, item.input.value );
				}
			} );

			// 如果未填数组不为空,提示
			if ( unfilled.length !== 0 || errors.length !== 0 ) {
				alert( ( unfilled.length ? [unfilled.join( "，" ) + "不能为空。"] : [] ).concat( errors ).join( "<br>" ) );
			}
			else {
				var task = [],
					loading = tips.Loading( page ),
					userInfo = {};

				Lock( pageContent );

				// 如果用户登录了,收集用户信息
				if ( fp.SignupSystem.isLogIn() ) {
					task.push( function ( loadDone ) {
						fp.getUserInfo( function ( data ) {
							userInfo = data;
							loadDone();
						} );
					} );
				}

				// 收集完信息后,整理数据,提交表单
				async.concurrency( task, function () {
					var hideData = {
						"报名时间" : new Date().getTime(),
						"微信昵称" : userInfo.NickName,
						"微信头像" : userInfo.HeadPhoto,
						"微信性别" : userInfo.Sex,
						"微信City" : userInfo.City,
						"微信Province" : userInfo.Province,
						"微信Country" : userInfo.Country
					};

					object.foreach( hideField, function ( name, item ) {
						pushField( item, hideData[name] === undefined ? "" : hideData[name] );
					} );

					// 发送提交表单请求
					fp.sendForm( function () {
						$.remove( loading );

						// 弹出提示,1秒后移除页面
						alert( formTemplate.data.submitComplete.value, 1000 );
						setTimeout( function () {
							if ( page.isIn ) {
								history.back();
							}
						}, 1000 );
					}, {
						id : formInfo.formId,
						data : formData
					} );
				} );
			}
		}

		$.bind( form, "submit", function ( event ) {
			event.preventDefault();
		} );

		array.foreach( formTemplate.data.component, function ( component ) {
			if ( component.enable ) {
				if ( component.visiable ) {
					// 显示字段
					switch ( component.name ) {
						case "textbox":
							// 文本框
							(function () {
								var wrapper = {},
									label = $( "label", form ),
									caption = wrapper.caption = $( "div.caption", component.label + "：", label ), // 字段名
									input = wrapper.input = $( "input", {
										placeholder : component.placeholder,
										name : component.id
									}, label );

								switch ( component.label ) {
									case "电话":
										input.type = "tel";
										break;
									case "邮箱":
										input.type = "email";
										wrapper.validate = function ( value ) {
											return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( value ) ?
												null : "请输入正确的邮箱地址";
										};
										break;
								}

								// 获得焦点时,更新curFocus
								$.bind( input, "focus", function () {
									curFocus = input;
								} );

								// 如果是必填的,添加一个必填字段坐标
								if ( component.required ) {
									$( "div.required.icon", caption );
								}

								// 如果有上一个input,按回车时更新到此焦点
								if ( lastInput ) {
									$.bind( lastInput, "keypress", function ( event ) {
										if ( event.keyCode === 13 ) {
											input.focus();
										}
									} );
								}

								lastInput = input;
								wrapper.data = component;
								inputList.push( wrapper );
							})();
							break;
						case "btn":
							// 按钮,目前一律视为提交按钮
							(function () {
								var label = $( "label", form ),
									button = $( "div.button", {
										innerHTML : component.value
									}, label );

								onTap( button, submit );
							})();
							break;
					}
				}
				else {
					hideField[component.label] = component;
				}
			}
		} );

		if ( lastInput ) {
			$.bind( lastInput, "keypress", function ( event ) {
				if ( event.keyCode === 13 ) {
					submit();
				}
			} );
		}
	} );

	layoutFormats["Sign-Up03"] = {
		create : function ( layout, ds ) {
			var signup = object.extend( ds.signup, {} );
			signup.template = JSON.parse( signup.template );

			Component( Content.ImageCover( ds.image( 0 ), clientWidth, clientHeight ), layout );

			var button = p.layImage( p.transformCover, ds.image( 1 ), {
				alignX : 0.5,
				y : 208
			}, layout );

			onTap( button.element, function () {
				signUpFormPage( {
					data : signup,
					noLog : !signup.template.allowAnymous
				} );
			} );
		}
	};
} );