'use strict';
const accessToken = require('get-accesstoken');

// 封装检查的请求
const handleCheck = async (url, data) => {
  const result = await uniCloud.httpclient.request(url, {
    method: 'POST',
    data,
    contentType: 'json',
    dataType: 'json'
  });
  if (result.status === 200) {
    return result.data;
  }
};
exports.main = async (event) => {
  // 默认值，默认平台微信，类型默认是文字段落
  // 其实云函数是可以直接获取运行平台的，但是此函数业务中不仅仅是要在小程序中用，会把云函数url化之后暴露给其他业务用，所以我们直接使用指定传参platform来进行处理
  const { platform = 'mp-weixin', content } = event;
  let requestUrl = '';
  let token = '';
  switch (platform) {
    case 'mp-weixin':
      token = await accessToken('wechat-miniprogram');
      requestUrl = `https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${token}`;
    case 'mp-qq':
      token = await accessToken('qq-miniprogram');
      requestUrl = `https://api.q.qq.com/api/json/security/MsgSecCheck?access_token=${token}`;
  }
  return await handleCheck(requestUrl, {
    content
  });
};
