//
//检查是否有历史记录用的索引，和History.length不同，这个属性只检查dotnar站点
;
(function() {
	Path.on("*", function() {
		App.set("$Cache.page_index", Path._back_urls.length);
		//只要不是登录页，就预备把当前页设为回调页，
		if (Path._current_page !== "/sign_in") {
			console.log(location.href, Path._current_location.href);
			LS.set("$Cache.cb_url_href", location.href);
			App.set("$Cache.cb_url_href", location.href);
		};
		document.body.scrollTop = 0;
	});
}());