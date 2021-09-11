const explain = require('explain');
const uniID = require('uni-id');
module.exports = class tokenFilter extends explain.filter {
  async onActionExecuting() {
    const token_name = 'uni-id-token';
    let { event, context, explain } = this;
    // 判断headers中是否存在token
    if (!event.headers[token_name]) {
      explain.response.body = {
        code: 401,
        message: 'token不存在'
      };
      return;
    } else {
      // 检查token合法性和过期时间
      console.log('token是这个：', event.headers[token_name]);
      const checkData = await uniID.getUserInfoByToken(event.headers[token_name]);
      // token校验不合法
      if (!checkData.uid) {
        explain.response.body = {
          ...checkData
        };
        return;
      } else {
        context.userID = checkData.uid;
      }
    }
  }
};
