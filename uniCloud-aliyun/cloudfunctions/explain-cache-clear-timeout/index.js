"use strict";

const explain = require("explain");
explain.cache = require("explain-cache");

exports.main = async (event, context) => {
	var deleted = await explain.cache.clearTimeout();
	console.log(`已清理过期数据 ${deleted} 条。`);
}
