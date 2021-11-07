const createConfig = require('uni-config-center');

const uniIDConfig = createConfig({
  pluginId: 'uni-id'
});

const explain = require('explain');
explain.cache = require('explain-cache');

// 封装交换accesstoken的逻辑
const getAccessToken = async (url, type) => {
  const result = await uniCloud.httpclient.request(url, {
    method: 'GET',
    dataType: 'json'
  });
  if (result.status === 200) {
    // 请求成功之后存储accesstoken
    await explain.cache.set({
      key: type + '-accesstoken',
      value: result.data.access_token,
      expire: result.data.expires_in
    });
    return result.data.access_token;
  }
};
module.exports = async function (type) {
  const config = uniIDConfig.config();
  // 判断缓存中是否存在
  const res = await explain.cache.get(type + '-accesstoken');
  if (res) {
    return res;
  }
  const requestUrlRoles = {
    'wechat-miniprogram': `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config['mp-weixin']['oauth']['weixin'].appid}&secret=${config['mp-weixin']['oauth']['weixin'].appsecret}`,
    'qq-miniprogram': `https://api.q.qq.com/api/getToken?grant_type=client_credential&appid=${config['mp-qq']['oauth']['qq'].appid}&secret=${config['mp-qq']['oauth']['qq'].appsecret}`
  };
  return await getAccessToken(requestUrlRoles[type], type);
};
