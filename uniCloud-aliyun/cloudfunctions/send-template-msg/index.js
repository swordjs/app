'use strict';

const { sendTemplate } = require('we-chat-api');

// 这里是测试内容，具体OPEN-ID需要从数据库查询
const TEMPLATE_ID = 'n2YpgvpUaCYtqR5qT-cK9pHDemmvGbc8_G-6jXHGpwc';
const OPEN_ID = 'ownxY5riBI7p2OMLeN5o_nUw2lTw';

exports.main = async () => {
  // 组装模板数据
  let data = {
    touser: OPEN_ID,
    template_id: TEMPLATE_ID,
    url: 'https://baidu.com',
    topcolor: '#FF0000',
    data: {
      name: {
        value: 'mrc',
        color: '#173177'
      }
    }
  };
  const desc = await sendTemplate(data);

  return desc;
};
