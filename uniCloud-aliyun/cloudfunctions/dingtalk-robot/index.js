'use strict';
const ChatBot = require('dingtalk-robot-sender');
const createConfig = require('uni-config-center');

const robotConfig = createConfig({
  pluginId: 'dingtalk-robot'
});

exports.main = (event) => {
  return new Promise(async (resolve) => {
    let config = robotConfig.config();
    //event为客户端上传的参数
    const robot = new ChatBot({
      webhook: `https://oapi.dingtalk.com/robot/send?access_token=${config.access_token}`
    });
    let textContent = {
      msgtype: 'text',
      text: {
        content: event.content
      },
      at: config.at
    };
    robot.send(textContent).then((res) => {
      // TODO
      resolve(res);
    });
  });
};
