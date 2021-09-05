const explain = require('explain');
const uniID = require('uni-id');
module.exports = class tokenFilter extends explain.filter {
  async onActionExecuting() {
    let { event, context } = this;
    // 判断context判断请求入口是http还是云函数调用
    if (context.isHttp) {
      if (context.args.headers['sword-token'] !== '') {
        event.uniIdToken = context.args.headers['sword-token'];
        let params = {};
        // 判断请求的方法，如果是GET请求那么请求体中会有params嵌套的结构体，需要单独处理
        if (context.httpMethod === 'GET') {
          const requestParams = context.args.params;
          params = JSON.parse(requestParams.params);
        } else {
          params = context.args.params;
        }
        event.params = params;
      }
    }
    // 判断context中是否存在token
    if (!event.hasOwnProperty('uniIdToken')) {
      context.response = {
        code: 401,
        message: 'token不存在'
      };
    } else {
      // 检查token合法性和过期时间
      const checkData = await uniID.getUserInfoByToken(event.uniIdToken);
      // token校验不合法
      if (!checkData.uid) {
        context.response = {
          ...checkData
        };
      } else {
        context.userID = checkData.uid;
      }
    }
  }
};
