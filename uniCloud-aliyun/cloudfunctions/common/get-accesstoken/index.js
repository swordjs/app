const config = require("./config.json");
const explain = require("explain");
const https = require('https');
explain.cache = require("explain-cache");

module.exports = function(type) {
	return new Promise(async (resolve, reject) => {
		switch (type) {
			case "wechat-miniprogram":
				// 判断缓存中是否存在
				const res = await explain.cache.get(type + "-accesstoken");
				if (res) {
					resolve(res);
				} else {
					// 获取accesstoken
					const url =
						`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config[type].appid}&secret=${config[type].appsecret}`;
					const req = https.get(url, res => {
						let rawData = "";
						res.on('data', d => {
							rawData += d;
						});
						res.on("end", async () => {
							const parsedData = JSON.parse(rawData);
							if (parsedData.access_token && parsedData.expires_in) {
								// 请求成功之后存储accesstoken
								await explain.cache.set({
									key: `wechat-miniprogram-accesstoken`,
									value: parsedData.access_token,
									expire: parsedData.expires_in
								});
								resolve(parsedData.access_token)
							}
						})
					});
					req.on('error', (e) => reject(e));
				}
				break;
		}
	})
}
