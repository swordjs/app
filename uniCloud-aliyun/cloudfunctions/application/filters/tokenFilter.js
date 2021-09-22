const explain = require('explain');
const uniID = require('uni-id');
module.exports = class tokenFilter extends explain.filter {
  async onActionExecuting() {
    const token_name = 'uni-id-token';
    let { event: _event, explain: _explain, context: _context } = this;
    // 判断headers中是否存在token
    if (!_event.headers[token_name]) {
      _explain.response.body = {
        code: 401,
        message: 'token不存在'
      };
      return;
    } else {
      // 检查token合法性和过期时间
      const checkData = await uniID.getUserInfoByToken(_event.headers[token_name]);
      // token校验不合法
      if (!checkData.uid) {
        _explain.response.body = {
          ...checkData
        };
        return;
      } else {
        _context.userID = checkData.uid;
      }
    }
  }
};
