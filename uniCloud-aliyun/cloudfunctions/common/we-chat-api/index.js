let httpclient = uniCloud.httpclient;

// 微信测试号配置
let APPID = 'wx08adc1165170fb39';
let APPSECRET = 'c6f17c25e4b6ff3d92e8af902c4f2f8d';

/**
 * 获取微信服务器token,这里需要进行缓存机制，因为不能每个请求都要调用一次API,次数有限，缓存两个小时
 * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
 */
async function getAccessToken() {
  let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;

  const response = await httpclient.request(url, {
    method: 'GET',
    dataType: 'json'
  });
  const data = response.data;

  return data.access_token;
}

/**
 * 发送一个模板消息
 * @alias https://mp.weixin.qq.com/debug/cgi-bin/readtmpl?t=tmplmsg/faq_tmpl
 * @param {Object} data 需要发送的数据，格式如下，自行组装
{
    "touser":"OPENID",
    "template_id":"ngqIpbwh8bUfcSsECmogfXcV14J0tQlEpBO27izEYtY",
    "url":"http://weixin.qq.com/download",
    "topcolor":"#FF0000",
    "data":Object{...}
}
 * 
 */
async function sendTemplate(data) {
  let access_token = await getAccessToken();
  let url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`;

  const response = await httpclient.request(url, {
    method: 'POST',
    dataType: 'json',
    contentType: 'json',
    data: data
  });
  return response.data;
}

module.exports = {
  getAccessToken,
  sendTemplate
};
