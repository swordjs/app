const explain = require('explain');
const createConfig = require('uni-config-center');

const robotConfig = createConfig({
  pluginId: 'qq-robot'
}) as {
  config: () => Record<'myqqApi' | 'myqqRobotUsername' | 'myqqRobotGroup' | 'myqqTriggerMessage', string | []>;
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
    const { myqqRobotUsername } = robotConfig.config();
    // 判断请求头是否符合标准
    if ('qqrobot-callback' in this.event.headers && this.event.headers['qqrobot-callback']) {
      // 判断发送者是否是自身，如果是自身，就不处理
      const body: CallBackBody = JSON.parse(this.event.body);
      // 判断机器人qq和参数一样 且 fromqq不是机器人qq
      if (body.MQ_robot === myqqRobotUsername && body.MQ_fromQQ !== myqqRobotUsername) {
        // 解析QQ消息
        const messageData = decodeURI(body.MQ_msg);
        // 如果消息中含有艾特符号并且艾特是机器人的话，那么就触发
        const callData = `[%40${myqqRobotUsername}]+`;
        // 是否艾特了机器人
        const callSuccessStatus = messageData.indexOf(callData);
        if (callSuccessStatus > -1) {
          // 确认艾特了
          // 调用发送群组消息的api
          return await group.postMessage((await this.checkTrigger(messageData)) + `[@${body.MQ_fromQQ}]`); // 拼接一个艾特，意指回复
        }
        return null;
      } else {
        return null;
      }
    }
  }
  // 判断是否要进行trigger
  async checkTrigger(message: string) {
    // 将确认艾特之后才会触发checkTrigger这个方法
    const { myqqTriggerMessage } = robotConfig.config();
    if (Array.isArray(myqqTriggerMessage)) {
      // 循环trigger数组
      for (const key in myqqTriggerMessage) {
        const triggerItem = myqqTriggerMessage[key] as { trigger: string[]; message?: string };
        // 判断当前message是否存在在trigger中 (模糊匹配)
        for (const triggerIndex in triggerItem.trigger) {
          if (message.indexOf(triggerItem.trigger[triggerIndex]) > -1) {
            return triggerItem.message;
          }
        }
      }
      return '抱歉oh，我没听懂你说的话，请尝试对我说: 群主, 人呢, 有人吗 ';
    }
  }
};

export {};
