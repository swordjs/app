const explain = require('explain');
const createConfig = require('uni-config-center');
const robotConfig = createConfig({
  pluginId: 'qq-robot'
}) as {
  config: () => Record<'myqqApi' | 'myqqRobotUsername' | 'myqqRobotGroup', string>;
};
module.exports = class Group extends explain.service {
  async postMessage(msg: string) {
    const { myqqApi, myqqRobotUsername, myqqRobotGroup } = robotConfig.config();
    const res = await uniCloud.httpclient.request(myqqApi, {
      method: 'POST',
      data: {
        function: 'Api_SendMsg', //要调用的函数英文名(查看右侧API列表)
        params: {
          c1: myqqRobotUsername, //参数1，要使用的机器人QQ
          c2: '2', //参数2，消息类型，2为群，以此类推...
          c3: myqqRobotGroup, //参数3，要发送的群号，以此类推...
          c4: '', //参数4，要发送的QQ，此处发的是群，所以这个要留空，以此类推...
          c5: msg //参数5，要发送的消息内容，以此类推...
        }
      },
      contentType: 'json',
      dataType: 'json'
    });
    return res;
  }
};

export {};
