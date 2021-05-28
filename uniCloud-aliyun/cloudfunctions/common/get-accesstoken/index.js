const config = require("./config.json");
const explain = require("explain");
const https = require("https");
explain.cache = require("explain-cache");

// 封装交换accesstoken的逻辑
const getAccessToken = async (url, type) => {
  const result = await uniCloud.httpclient.request(url, {
    method: "GET",
    dataType: "json",
  });
  if (result.status === 200) {
    // 请求成功之后存储accesstoken
    await explain.cache.set({
      key: type + "-accesstoken",
      value: result.data.access_token,
      expire: result.data.expires_in,
    });
    return result.data.access_token;
  }
};
module.exports = async function(type) {
  // 判断缓存中是否存在
  const res = await explain.cache.get(type + "-accesstoken");
  if (res) {
    return res;
  }
  const requestUrlRoles = {
    "wechat-miniprogram": `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config[type].appid}&secret=${config[type].appsecret}`,
    "qq-miniprogram": `https://api.q.qq.com/api/getToken?grant_type=client_credential&appid=${config[type].appid}&secret=${config[type].appsecret}`,
  };
  return await getAccessToken(requestUrlRoles[type], type);
};
