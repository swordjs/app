"use strict";
const accessToken = require("get-accesstoken");

// 封装检查的请求
const handleCheck = async (url, data, platform) => {
	const result = await uniCloud.httpclient.request(url, {
		method: "POST",
		data,
		contentType: "json",
		dataType: "json",
	});
	if (result.status === 200) {
		return result.data.errCode === 0 ? true : false;
	}
};
exports.main = async (event, context) => {
	// 默认值，默认平台微信，类型默认是文字段落
	const {
		platform = "mp-weixin", type = "text", content
	} = event;
	let requestUrl = "";
	let token = "";
	switch (platform) {
		case "mp-weixin":
			token = await accessToken("wechat-miniprogram");
			requestUrl = `https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${token}`;
		case "mp-qq":
			token = await accessToken("qq-miniprogram");
			requestUrl = `https://api.q.qq.com/api/json/security/MsgSecCheck?access_token=${token}`;
	}
	return await handleCheck(requestUrl, {
		content,
	});
};
