namespace QQRobotGroup {
  const explain = require("explain");
  const url = "http://220.167.103.33:10441/MyQQHTTPAPI";

  module.exports = class home extends explain.service {
    async index(params) {
      const res = await uniCloud.httpclient.request(url, {
        method: "POST",
        data: {
          function: "Api_SendMsg", //要调用的函数英文名(查看右侧API列表)
          params: {
            c1: "3547888277", //参数1，要使用的机器人QQ
            c2: "2", //参数2，消息类型，2为群，以此类推...
            c3: "766968150", //参数3，要发送的群号，以此类推...
            c4: "", //参数4，要发送的QQ，此处发的是群，所以这个要留空，以此类推...
            c5: "前端题目列表: 1. 请写出一个冒泡排序", //参数5，要发送的消息内容，以此类推...
          },
        },
        contentType: "json",
        dataType: "json",
      });
      return res;
    }
  };
}
