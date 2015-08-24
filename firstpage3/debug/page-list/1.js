/**
 * Created by 白 on 2015/4/9.
 */

!function () {
	var signup = {
		formId : 0,
		template : JSON.stringify( {
			"id" : "1",
			"name" : "我要报名",
			"state" : "Publish",
			"createTimeUtc" : "2014-10-24 19:24:32",
			"startTimeUtc" : "",
			"stopTimeUtc" : "",
			"publishTimeUtc" : "",
			"allowAnymous" : true,
			"data" : {
				"form" : {"title" : "", "subTitle" : "", "submitName" : "我要报名"},
				"component" : [{
					"name" : "datepicker",
					"id" : "com1",
					"label" : "报名时间",
					"size" : "medium",
					"required" : "true",
					"type" : "yyyy-MM",
					"visiable" : false,
					"enable" : true,
					"value" : ""
				}, {
					"name" : "textbox",
					"id" : "com2",
					"label" : "微信昵称",
					"size" : "medium",
					"type" : "text",
					"visiable" : false,
					"enable" : true,
					"required" : "false",
					"value" : ""
				}, {
					"name" : "textbox",
					"id" : "com3",
					"label" : "微信头像",
					"size" : "medium",
					"type" : "text",
					"visiable" : false,
					"enable" : true,
					"required" : "false",
					"value" : ""
				}, {
					"name" : "textbox",
					"id" : "com10",
					"label" : "微信性别",
					"size" : "medium",
					"type" : "text",
					"visiable" : false,
					"enable" : true,
					"required" : "false",
					"value" : ""
				}, {
					"name" : "textbox",
					"id" : "com11",
					"label" : "微信City",
					"size" : "medium",
					"type" : "text",
					"visiable" : false,
					"enable" : true,
					"required" : "false",
					"value" : ""
				}, {
					"name" : "textbox",
					"id" : "com12",
					"label" : "微信Province",
					"size" : "medium",
					"type" : "text",
					"visiable" : false,
					"enable" : true,
					"required" : "false",
					"value" : ""
				}, {
					"name" : "textbox",
					"id" : "com12",
					"label" : "微信Country",
					"size" : "medium",
					"type" : "text",
					"visiable" : false,
					"enable" : true,
					"required" : "false",
					"value" : ""
				}, {
					"name" : "textbox",
					"id" : "com4",
					"label" : "姓名",
					"size" : "medium",
					"type" : "text",
					"visiable" : true,
					"enable" : true,
					"placeholder" : "请填写您的姓名",
					"required" : "false",
					"value" : ""
				}, {
					"name" : "textbox",
					"id" : "com5",
					"label" : "邮箱",
					"size" : "medium",
					"type" : "email",
					"visiable" : true,
					"enable" : false,
					"placeholder" : "请填写您的邮箱",
					"required" : "true",
					"value" : ""
				}, {
					"name" : "textbox",
					"id" : "com6",
					"label" : "电话",
					"size" : "medium",
					"type" : "tel",
					"visiable" : true,
					"enable" : true,
					"placeholder" : "请填写您的电话",
					"required" : "true",
					"value" : ""
				}, {
					"name" : "textbox",
					"id" : "com7",
					"label" : "公司",
					"size" : "medium",
					"type" : "text",
					"visiable" : true,
					"enable" : true,
					"placeholder" : "请填写您的公司",
					"required" : "true",
					"value" : ""
				}, {
					"name" : "textbox",
					"id" : "com8",
					"label" : "职位",
					"size" : "medium",
					"type" : "text",
					"visiable" : true,
					"enable" : false,
					"placeholder" : "请填写您的职位",
					"required" : "true",
					"value" : ""
				}, {"name" : "btn", "id" : "com9", "label" : "", "size" : "large", "visiable" : true, "enable" : true, "value" : "立即报名"}],
				"submitComplete" : {"type" : "text", "value" : "报名已提交"}
			}
		} )
	};

	window.out = {
		"作者" : {
			label : "author",
			image : ["http://wx.qlogo.cn/mmopen/fCicKiaZsGwzfLcvj0B9PJIVUMibicek41MkA6o7jHibUvctKnLBg8SP0WuaWps8JZs1MU22IJU3Olv4gdRgyrmuj2bnu7DcnNGicG/0"],
			data : {
				author : "微信用户",
				uid : 10
			}
		},
		"报名" : {
			label : "Sign-Up03",
			image : [imgLib.Desert, imgLib.Koala],
			position : ["top"],
			signup : signup
		},
		"外链" : {
			label : "Sign-Up02",
			image : [imgLib.Koala],
			actionlinks : ["http://www.baidu.com"],
			position : ["top"]
		},
		"二维码" : pageData.qrcode,
		"自定义1" : pageData.cu01,
		"自定义2" : pageData.cu02,
		"自定义3" : pageData.cu03,
		"自定义5" : pageData.cu05,
		"自定义6" : pageData.cu06,
		"自定义8" : pageData.cu08,
		"自定义10" : pageData.cu10,
		"酸梅双" : {
			label : "razzies-double",
			"image" : ["http://img01.cloud7.com.cn/fc89e02ec5b1fbe8a8a65c887a600109.png", "http://img01.cloud7.com.cn/38b3c7bdb01c498c7557907d6c056f06.png"],
			"text" : ["获奖人：罗永浩&王自如", "两个东北男人，居然用能吵吵就没动手的方式，对着镜头如胶似漆地撕逼了三个小时，最终一致得出了iPhone是业界最佳的结论，这就是爱啊。", "年度\n最秀恩爱奖"]
		},
		"酸梅单" : {
			label : "razzies-single",
			"image" : ["http://img01.cloud7.com.cn/fc89e02ec5b1fbe8a8a65c887a600109.png", "http://img01.cloud7.com.cn/38b3c7bdb01c498c7557907d6c056f06.png"],
			"text" : ["获奖人：罗永浩&王自如", "两个东北男人，居然用能吵吵就没动手的方式，对着镜头如胶似漆地撕逼了三个小时，最终一致得出了iPhone是业界最佳的结论，这就是爱啊。", "年度\n最秀恩爱奖"]
		},
		"地图" : {
			label : "map",
			image : [imgLib.Chrysanthemum],
			location : [{
				lat : 39.983127,
				lng : 116.313702,
				name : "西部动力（北京）科技有限公司",
				address : "中关村西区苏州街18号长远天地大厦A1座7层"
			}]
		},
		"多图2" : {
			label : "MutipleImage02",
			image : [
				imgLib.Chrysanthemum,
				imgLib.Desert,
				imgLib.Hydrangeas
			]
		},
		"涂抹" : {
			label : "scratch-card",
			image : [imgLib.Desert, imgLib.Hydrangeas]
		},
		"多图3" : {
			label : "MutipleImage03",
			image : [
				imgLib.Koala,
				imgLib.Jellyfish,
				imgLib.Tulips
			]
		},
		"联系" : {
			label : "contact",
			image : [imgLib.Koala],
			text : [
				"010-66059909",
				"chuye@cloud7.com",
				"http://www.cloud7.com.cn",
				"Cloud7LApp",
				"Cloud7云起轻应用"
			]
		},
		"视频" : {
			label : "video",
			image : [imgLib.Chrysanthemum],
			video : ['<iframe height=498 width=510 src="http://player.youku.com/embed/XODUxMDUyODQw" frameborder=0 allowfullscreen></iframe>']
		},
		"多图1" : {
			label : "MutipleImage01",
			image : [
				{
					images : [
						"http://img01.cloud7.com.cn/51e310717d92ecea943d094b99e8b129.jpg",
						"http://img01.cloud7.com.cn/8db72c786ab85cef9c22e9f5a43e3b68.jpg",
						"http://img01.cloud7.com.cn/ae9ca394ee259bd095c099669bb1e8ff.jpg",
						"http://img01.cloud7.com.cn/371a9a98071ed29cbd09f3f8d4102e38.jpg"
					],
					arrow : "",
					imageinfo : {
						x : 35,
						y : 61,
						width : 251,
						height : 381,
						maskRadius : 0,
						borderWidth : 0
					}
				}
			],
			custom : {
				type : "y",
				animationFirst : "image"
			}
		},
		"图文4" : {
			label : "ImageText04",
			image : [imgLib.Hydrangeas],
			text : ["话说天下大势，分久必合，合久必分。周末七国分争，并入于秦。及秦灭之后，楚、汉分争，又并入于汉。\n汉朝自高祖斩白蛇而起义，一统天下，后来光武中兴，传至献帝，遂分为三国。推其致乱之由，殆始于桓、灵二帝。桓帝禁锢善类，崇信宦官。及桓帝崩，灵帝即位，大将军窦武、太傅陈蕃共相辅佐。时有宦官曹节等弄权，窦武、陈蕃谋诛之，机事不密，反为所害，中涓自此愈横。\n"]
		},
		"图文7" : {
			label : "ImageText07",
			image : [imgLib.Hydrangeas],
			text : ["话说天下大势，分久必合，合久必分。周末七国分争，并入于秦。及秦灭之后，楚、汉分争，又并入于汉。\n汉朝自高祖斩白蛇而起义，一统天下，后来光武中兴，传至献帝，遂分为三国。推其致乱之由，殆始于桓、灵二帝。桓帝禁锢善类，崇信宦官。及桓帝崩，灵帝即位，大将军窦武、太傅陈蕃共相辅佐。时有宦官曹节等弄权，窦武、陈蕃谋诛之，机事不密，反为所害，中涓自此愈横。"]
		}
	};
}();