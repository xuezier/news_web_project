(function() {
	/*
	 * Title-Map
	 */
	eventManager.after("AppReady", function() {
		var _set_title = Path.setTitle;
		Path.setTitle = function() {
			App.set("$Loc.document_title", _set_title());
		};
		App.set("$Loc.document_title", Path.document_title);

		// 显示按钮
		var _ti;
		App.set("$Event.top.show_top_nav", function() {
			clearInterval(_ti);
			App.model.toggle("$Cache.top.show_top_nav");
			if (App.get("$Cache.top.show_top_nav")) {
				_ti = setInterval(function() {
					App.set("$Cache.top.show_top_nav", false);
				}, 4500);
				return;
			};
		});
	});

	Path.setTitleMap({
		"/main": "首页",
		"/sign_in": {
			key: "id",
			value_map: {
				"*": "用户登录",
				"2": "用户注册"
			}
		}
	});
}());