const explain = require('explain');
const createConfig = require('uni-config-center');

const robotConfig = createConfig({
  pluginId: 'qq-robot'
}) as {
  config: () => Record<'myqqApi' | 'myqqRobotUsername' | 'myqqRobotGroup' | 'myqqTriggerMessage', unknown>;
};
const Group = require('./group');
const group = new Group();

interface CallBackBody {
  MQ_robot: string;
  MQ_fromQQ: string;
  MQ_type: string;
  MQ_msg: string;
}
module.exports = class CallBack extends explain.service {
  async main() {
    // 只有消息类型为 群 才会触发
    const { myqqRobotUsername, myqqTriggerMessage } = robotConfig.config();
    // 判断请求头是否符合标准
    if ('qqrobot-callback' in this.event.headers && this.event.headers['qqrobot-callback']) {
      // 判断发送者是否是自身，如果是自身，就不处理
      const body: CallBackBody = JSON.parse(this.event.body);
      // 判断机器人qq和参数一样 且 fromqq不是机器人qq
      if (body.MQ_robot === myqqRobotUsername && body.MQ_fromQQ !== myqqRobotUsername) {
        // 解析QQ消息
        const messageData = decodeURI(body.MQ_msg);
        // 调用发送群组消息的api
        return await group.postMessage(messageData);
      } else {
        return null;
      }
    }
  }
};

export {};
