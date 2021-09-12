const explain = require('explain');
const createConfig = require('uni-config-center');
const robotConfig = createConfig({
  pluginId: 'qq-robot'
}) as {
  config: () => Record<'myqqApi' | 'myqqRobotUsername' | 'myqqRobotGroup', string>;
};

const coreConfig = createConfig({
  pluginId: 'core'
}) as {
  config: () => Record<'CORE_API_TEST_HTTP_URL' | 'CORE_API_RELEASE_HTTP_URL' | 'CORE_API_TEST_ADMIN_TOKEN' | 'CORE_API_RELEASE_ADMIN_TOKEN', string>;
};
module.exports = class group extends explain.service {
  constructor(context) {
    super(context);
  }
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
  // 调用http api 请求数据
  async getSampleQuestionList() {
    const { CORE_API_RELEASE_HTTP_URL, CORE_API_TEST_ADMIN_TOKEN, CORE_API_RELEASE_ADMIN_TOKEN, CORE_API_TEST_HTTP_URL } = coreConfig.config();
    const res = await uniCloud.httpclient.request(CORE_API_TEST_HTTP_URL + `/api/question/getSampleQuestionList`, {
      method: 'GET',
      data: {},
      headers: {
        'uni-id-token': CORE_API_TEST_ADMIN_TOKEN
      },
      contentType: 'json',
      dataType: 'json'
    });
    // 判断是否请求成功
    if (res.status === 200) {
      // 循环其中的data
      const { data } = res.data as {
        data: {
          title: string;
        }[];
      };
      let str = '';
      if (Array.isArray(data)) {
        for (const key in data) {
          str += `${Number(key) + 1}: ${data[key].title} \n`;
        }
        str += `数据来源于测试环境，仅供测试，尽情期待v1.1.0版本 [@all]`;
        await this.postMessage(str);
      }
    }
    return res;
  }
};

export {};
