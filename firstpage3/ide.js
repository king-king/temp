/**
 * Created by 白 on 2015/1/13.
 */

var p, ua;
var clientWidth, clientHeight,
	designWidth = 640, designHeight = 1136,
	idealWidth, idealHeight,
	fp,
	xRatio, yRatio, gRatio,
	inClickMode = false,
	body,
	switchAnimations,
	enterAnimation,
	layoutFormats,
	Content = function () {
	},
	Component = function () {
	};

var firstpageScript, firstpageStyle;
firstpage = {};
firstpage.getWorkList = function () {
};
firstpage.layoutType = 0;
firstpage.noRefresh = 0;
firstpage.nickname = 0;

firstpage.onLogin = 0;

cas = {};
cas.trackPageview = 0;

data = {};
data.maskRadius = 0;
window.enableFollow = false;

window.onWorkLoad = 0;
window.firstpageVersion = 0;
window.localResource = 0;
window.listPath = 0;
window.pathList = [];
iconMap = {};
window.cas = {
	trackEvent : function () {
	}
};

page = {};
page.specialSwitchAnimate = 0;

BMap = {};
Point = BMap.Point = {};
Marker = BMap.Marker = {};
Map = BMap.Map = {};
Map.centerAndZoom = 0;
Map.setViewport = 0;
Marker.setIcon = 0;
Marker.openInfoWindow = 0;
Map.addOverlay = 0;
BMap.InfoWindow = 0;

wx = {};
wx.onMenuShareTimeline = 0;
wx.onMenuShareAppMessage = 0;
wx.onMenuShareQQ = 0;
wx.onMenuShareWeibo = 0;
wx.ready = 0;
wx.getNetworkType = 0;

window.wxConfig = 0;
window.pluginList = [];
window.avatarList = [];
window.contentPath = "";
window.virtualPath = "";
window.onclick = 0;

document.onFirstPageDataLoad = 0;
window.onFirstPageLoad = 0;
window.AnalyticsDownload = 0;

window.localIconTable = 0;

workData = {
	"code" : 200,
	"data" : {
		"thumbnail" : "http://firstpage.blob.core.chinacloudapi.cn/resource/21193b7d882574947aee724adc118320.jpg",
		"title" : "芦苇",
		"description" : "每一页，都美若人生初见。",
		"mode" : "push",
		"pageSwitch" : {"animateId" : "push"},
		"backgroud" : {"color" : "#FFFFFF"},
		"music" : {"src" : "https://firstpage.blob.core.chinacloudapi.cn/resource/%e3%80%8a%e5%a4%a9%e7%a9%ba%e4%b9%8b%e5%9f%8e%e3%80%8b%e5%a5%b3%e5%a3%b0.mp3"},
		"pages" : [{
			"layout" : {
				"label" : "ImageText03",
				"image" : ["http://firstpage.blob.core.chinacloudapi.cn/resource/15c02df1e456e0b238f6b93e547e8cc5.jpg"],
				"text" : ["芦苇花开", "随风而荡 若飘若止", "摄影：戴军"],
				"imageinfo" : []
			}
		}],
		"author" : "戴军",
		"headimgurl" : "http://wx.qlogo.cn/mmopen/aygoOjXa9KNyfkiaMVDAymSsAObInD7KlXxoDWYAZB8U6HPOIHOpOJqkkAmSXaqP4zdOI8IzLyBZ6icSVQU9Yt9mubcnyo9lpd/0",
		"userworks" : {
			"title" : "戴军的其他初页",
			"works" : [{
				"thumbnail" : "https://firstpage.blob.core.chinacloudapi.cn/resource/3aab1804630cfc21f3338c8be9882b53.jpg",
				"title" : "坑呗古村",
				"url" : "/Beta/91102"
			}]
		},
		"copyright" : 1,
		"praise" : 0
	}
};

WeixinJSBridge = {};
WeixinJSBridge.invoke = 0;

like = {
	"Items" : [
		{
			"UserId" : 1,
			"NickName" : "sample string 2",
			"HeadPhoto" : "sample string 3",
			"Time" : "2015-02-02T16:04:04.2051719+08:00",
			"Text" : "sample string 5"
		},
		{
			"UserId" : 1,
			"NickName" : "sample string 2",
			"HeadPhoto" : "sample string 3",
			"Time" : "2015-02-02T16:04:04.2051719+08:00",
			"Text" : "sample string 5"
		}
	],
	"Like" : 1,
	"Text" : 2
};

window.marshall = true;
window.saveMarshall = true;
window.copyrightUrl = 0;