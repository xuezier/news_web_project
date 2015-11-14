var customTagsInit = jSouper.customTagsInit;
var modulesInit = jSouper.modulesInit;

var _is_ueditor_css_load = false;
customTagsInit["ueditor"] = function(vm) {
	_is_ueditor_css_load || $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'umeditor1_2_2-utf8-php/themes/default/css/umeditor.css'));
	_is_ueditor_css_load = true;
	var ueditorNode = vm.getOneElementByTagName("ueditor");
	var ueNode = vm.getOneElementByTagName("uecontanier");
	$.when(
		$.getScript("umeditor1_2_2-utf8-php/umeditor.js"),
		$.getScript("umeditor1_2_2-utf8-php/umeditor.config.js")
	).done(function() {
		//语言包
		$.getScript("umeditor1_2_2-utf8-php/lang/zh-cn/zh-cn.js", function() {
			var id = ueNode.id = Math.random().toString(36).substr(2);
			var ue;
			var _ue_init_ti;
			var _ue_set_ti;
			jSouper.onElementPropertyChange(ueditorNode, "value", function _init_value(key, value) {
				if (!ue && document.getElementById(id)) {
					window.ue = ue = UM.getEditor(id);

					ue.setOpt("imageCompressEnable", true); //启用压缩
					ue.setOpt("imageCompressBorder", 1200); //多图上传压缩最大宽度
					ue.setWidth(ueditorNode.clientWidth)

					ue.addListener("contentChange", function() {
						var bind_input_key = ueditorNode.getAttribute("input");
						if (bind_input_key) {
							vm.set(bind_input_key, ue.getContent());
						}
						jSouper.dispatchEvent(ueditorNode, "input");
					});
					ue.ready(function() {
						//DOM remove 后，又append，这是UM的isReady任然认为是1，其实iframe需要重载，所以这边又再次出发，value会被正确绑定
						var value = ueditorNode.getAttribute("value");
						typeof value === "string" && (value != ue.getContent()) && ue.setContent(value);
					});

					clearTimeout(_ue_init_ti);
					var args = Array.prototype.slice.call(arguments);
					var self = this;
					_ue_init_ti = setTimeout(function() {
						_init_value.apply(self, args);
					}, 200)
					return
				}
				value && (value != ue.getContent()) && ue.setContent(value)
			}, true);
			jSouper.onElementPropertyChange(ueditorNode, "input", function(key, bind_input_key) {
				bind_input_key && ue && vm.set(bind_input_key, ue.getContent());
			});
		});
	}).fail(function() {
		console.error(arguments);
	});
};

customTagsInit["pagecut2"] = function(vm) {
	var node = vm.getOneElementByTagName("pagecut2");
	//每页数量
	jSouper.onElementPropertyChange(node, "num", function(attrKey, value) {
		value = ~~value;
		vm.set("$CPrivate.$Cache.num", value);
	}, true);
	//当前页号
	jSouper.onElementPropertyChange(node, "page", function(attrKey, value) {
		value = ~~value;
		vm.set("$CPrivate.$Cache.page", value);
		vm.set("$CPrivate.$Cache.thepagenum", value + 1);
	}, true);
	//页号数组
	jSouper.onElementPropertyChange(node, "total-page", function(attrKey, value) {
		var number_list = [];
		number_list.length = ~~value;
		jSouper.forEach(number_list, function(v, i) {
			number_list[i] = i + 1;
		});
		vm.set("$CPrivate.$Cache.number_list", number_list);
	}, true)

	function _change_page(num, page) {
		Path.setHash({
			num: num,
			page: page
		});
		jSouper.dispatchEvent(node, "change");
	};
	vm.set("$CPrivate.$Event.pre_page", function() {
		_change_page(vm.get("$CPrivate.$Cache.num"), vm.get("$CPrivate.$Cache.page") - 1);
	});
	vm.set("$CPrivate.$Event.next_page", function() {
		_change_page(vm.get("$CPrivate.$Cache.num"), vm.get("$CPrivate.$Cache.page") + 1);
	});
	vm.set("$CPrivate.$Event.change_page", function(e, cvm) {
		_change_page(vm.get("$CPrivate.$Cache.num"), cvm.get("$Index"));
	});
};

customTagsInit["img-uploader"] = function(vm) {
	var uploaderNode = vm.getOneElementByTagName("imgUploaderWrap");
	var inputNode = vm.getOneElementByTagName("input");
	var markNode = vm.getOneElementByTagName("imgMark");

	vm.set("$CPrivate.$Cache.text", "初始化中");
	inputNode.disabled = true;
	require(["localResizeIMG"], function() {

		function _set_url(url) {
			var _bind_input_key = uploaderNode.getAttribute("input-key");
			if (_bind_input_key) {
				vm.set(_bind_input_key, url);
			}
			//显示预览
			_show_preview(url);
		}
		var _ti;

		function _show_preview(url) {
			clearInterval(_ti);
			//是否在控件上显示图片
			var _one_way = uploaderNode.getAttribute("one-way");
			if (_one_way != "true") {
				vm.set("$CPrivate.$Cache.img_url", url);
				if (!uploaderNode.clientWidth) {
					_ti = setInterval(function() {
						_show_preview(url)
					}, 200);
					//中断
					return;
				}
				vm.set("$CPrivate.$Cache.img_width", uploaderNode.clientWidth);
				vm.set("$CPrivate.$Cache.img_height", uploaderNode.clientHeight);
			}
		}

		function _set_status(value) {
			var _upload_status = uploaderNode.getAttribute("status");
			_upload_status && vm.set(_upload_status, value);
			vm.set("$CPrivate.$Cache.uploading", value);
		}

		inputNode.removeAttribute("disabled");
		jSouper.onElementPropertyChange(uploaderNode, "text", function(attr, text) {
			vm.set("$CPrivate.$Cache.text", text || "点击选择文件上传");
		}, true);
		jSouper.onElementPropertyChange(uploaderNode, "url", function(attr, value) {
			_show_preview(value)
		}, true);
		//压缩图片的配置与回调
		var localResizeIMG_config = {
			maxWidth: 1024,
			quality: 1,
			before: function() {
				_set_status(true);
			},
			success: function(result) {
				//使用BASE64上传
				coAjax.post(appConfig.other.upload_base64_image, {
					img_base64: result.base64
				}, function(result) {
					_set_status(false);
					var img_url = appConfig.img_server_url + result.result.key;
					//给绑定的值赋值
					_set_url(img_url);
					//运行回调
					var _upload_callback = uploaderNode.getAttribute("upload-callback");
					if (_upload_callback) {
						var _cb = vm.get(_upload_callback);
						(_cb instanceof Function) && _cb(img_url);
					}
				}, function(errorCode, xhr, errorMsg) {
					_set_status(false);
					alert("error", errorMsg);
				}, function() {
					_set_status(false);
					alert("error", "网络异常，请重试！")
				});
			}
		};
		//动态修改配置
		jSouper.onElementPropertyChange(uploaderNode, "max-width", function(attr, value) {
			var _maxWidth = +uploaderNode.getAttribute("max-width");
			isNaN(_maxWidth) && (_maxWidth = 1024);
			localResizeIMG_config.maxWidth = _maxWidth;
		}, true);
		$inputNode = $(inputNode);
		$inputNode.localResizeIMG(localResizeIMG_config);
	});


	vm.set("$CPrivate.$Event.show_mark", function() {
		markNode.className = "show";
	});
	vm.set("$CPrivate.$Event.hide_mark", function() {
		markNode.className = "";
	});
	vm.set("$CPrivate.$Event.toggle_mark", function() {
		markNode.className = markNode.className ? "" : "show"
	});
	vm.set("$CPrivate.$Event.remove", function() {
		_set_url();
	});
};

customTagsInit["weibo-share"] = function(vm) {
	var shareNode = vm.getOneElementByTagName("div");
	vm.set("$CPrivate.$Event.shareToWeibo", function() {
		var title = shareNode.getAttribute("title") || "";
		var src = shareNode.getAttribute("src");
		var href = shareNode.getAttribute("href");
		window.open("http://service.weibo.com/share/share.php?pic=" + encodeURIComponent(src) +
			"&title=" + encodeURIComponent(title.replace(/&nbsp;/g, " ").replace(/<br \/>/g, " ")) +
			"&url=" + encodeURIComponent(href),
			"分享至新浪微博",
			"toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
	});
};

customTagsInit["href"] = function(vm) {
	var aNode = vm.getOneElementByTagName("href");
	if (!!history.pushState) {
		//使用History Api封装跳转
		vm.set("$CPrivate.$Event.noreload_jump", function(e) {
			jSouper.dispatchEvent(this, "beforejump");
			if (jSouper.$.strToBool(aNode.getAttribute("stop-jump"))) {
				return false;
			}
			var _to_url = aNode.getAttribute("to");
			if (_to_url) {
				Path.jump(_to_url);
			}
			return false;
		});
	}
};



customTagsInit["pagination2"] = function(vm) {
	var paginationNode = vm.getOneElementByTagName("pagination2");
	jSouper.onElementPropertyChange(paginationNode, "page-num", function(attr, value) {
		vm.set("_number_list", new Array(~~value));
	}, true);
	vm.set("$CPrivate.$Event.first_page", function() {
		Path.setQuery("page", 0)
	});
	vm.set("$CPrivate.$Event.jump_page", function(e, cvm) {
		Path.setQuery("page", cvm.get("$Index"))
	});
	vm.set("$CPrivate.$Event.end_page", function(e, cvm) {
		Path.setQuery("page", vm.get("total_page"))
	});
	vm.set("$CPrivate.$Event.pre_page", function() {
		Path.setQuery("page", ~~Path.getQuery("page") - 1)
	});
	vm.set("$CPrivate.$Event.next_page", function() {
		Path.setQuery("page", ~~Path.getQuery("page") + 1)
	});
};

modulesInit["goods-item"] = function(vm) {
	var node = vm.getOneElementByTagName("commodity");

	var eventManager = require("eventManager");

	function _filter_cash() {
		var finally_cash = vm.get("cash");
		var sou_cash = vm.get("price");
		var user_card_id_list = App.get("loginer.card_list") || [];
		jSouper.forEach(user_card_id_list, function(card_id) {
			var card_info = card_id.split(/[\:\|]/);
			var bus_id = card_info[1];
			if (bus_id == window.busInfo ? busInfo._id : appConfig.bus_id) {
				var card_factory_id = card_info[3];
				var new_finally_cash = (vm.get("card_cash_map") || {})[card_factory_id] || finally_cash;
				if (new_finally_cash !== finally_cash) {
					finally_cash = new_finally_cash;
				}
				return false;
			}
		});
		vm.set("$Private.finally_cash", finally_cash);
		// console.log("_filter_cash");
	}
	vm.set("$Private.$Event.add_to_cart", function(e, cvm) {
		var _notify = alert("info waiting", "请稍后……", 10000);
		require(["/js/common/goodsCart.js"], function(goodsCart) {
			_notify.close();

			function _goodsCart(e, cvm) {
				goodsCart.add_to_cart(cvm.get("_id"), 1, function(result) {
					Path.jump("cart.html");
				});
			};
			_goodsCart(e, cvm);
			vm.set("$Private.$Event.add_to_cart", _goodsCart);
		});
	});
	/*
	 * 用户登录完成后跳转，节点数据重新下载，会触发onfollow，这时候再重新计算也行。无效马上重计算所有
	 * eventManager.after("getLoginer", _filter_cash, true);
	 */
	vm.model.onfollow = _filter_cash;
	jSouper.onElementPropertyChange(node, "goods-id", _filter_cash);
};