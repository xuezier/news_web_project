var jhs = require("jhs");
jhs.options = {
	code_start_reg: "<?js",
	code_end_reg: "?>",
	css_minify: false,
	js_minify: false,
	root: [__dirname + "/../news-web-project"],
	index: "app.html",
	"404": "app.html",
	common_filter_handle: function(pathname, params, req, res) {
		if (!res.is_text) {
			return;
		}
		var _is_mobile = $$.isMobile(req.header("user-agent"));;
		if (res.text_file_info.extname === ".html" && res.statusCode == 404 && jhs.fs.existsSync(jhs.options.root.map(root => root + "/app-pages/pages/" + (_is_mobile ? "mb" : "pc") + pathname) /**/ )) {
			console.log("前端自动二次路由，404 => 200")
			res.status(200); //找得到，不是真正的404
		}
	}
};

jhs.listen(7879, function() {
	console.log("文件服务启动，Listen Start!");
});
