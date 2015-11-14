// var _isMobile = function(_mobileAgent) {
// 	var mobileAgent = _mobileAgent || ["nokia", "iphone", "android", "motorola", "^mot-", "softbank", "foma", "docomo", "kddi", "up.browser", "up.link", "htc", "dopod", "blazer", "netfront", "helio", "hosin", "huawei", "novarra", "CoolPad", "webos", "techfaith", "palmsource", "blackberry", "alcatel", "amoi", "ktouch", "nexian", "samsung", "^sam-", "s[cg]h", "^lge", "ericsson", "philips", "sagem", "wellcom", "bunjalloo", "maui", "symbian", "smartphone", "midp", "wap", "phone", "windows ce", "iemobile", "^spice", "^bird", "^zte-", "longcos", "pantech", "gionee", "^sie-", "portalmmm", "jigs browser", "hiptop", "^benq", "haier", "^lct", "operas*mobi", "opera*mini", "mobile", "blackberry", "IEMobile", "Windows Phone", "webos", "incognito", "webmate", "bada", "nokia", "lg", "ucweb", "skyfire", "ucbrowser"];
// 	var browser = navigator.userAgent.toLowerCase();
// 	var isMobile = false;
// 	for (var i = 0; i < mobileAgent.length; i++) {
// 		if (browser.indexOf(mobileAgent[i]) != -1) {
// 			isMobile = true;
// 			break;
// 		}
// 	}
// 	return isMobile;
// }();
var _isMobile = false; // 永久不跳转

var requireConfig = {
	// baseUrl: "./",
	waitSeconds: 0,
	paths: {
		"r_css": "/js/lib/require.css.v3",
		"r_text": "/js/lib/require.text3",
		"app": "/js/lib/app",
		"jQuery": "/js/lib/jquery-1.11.2.min",
		"jQuery.notify": "/js/lib/jquery.notify",
		"moment": "/js/lib/moment.min",
		"moment-locale-zh-cn": "/js/lib/moment.locale.zh-cn",
		"jSouper": "/js/lib/jSouper"
	},
	shim: {
		"app": {
			deps: ["jQuery"]
		},
		"jQuery.notify": {
			deps: ["jQuery"],
			init: function() {
				require(["r_css!" + "/js/lib/css/jquery.notify"])
			}
		},
		"moment-locale-zh-cn": {
			deps: ["moment"]
		}
	}
};
require.config(requireConfig);