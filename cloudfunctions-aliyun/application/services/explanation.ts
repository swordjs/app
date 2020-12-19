namespace Explanation {
  const explain = require("explain");
  // 公告模块
  const uniID = require("uni-id");
  // 工具函数
  const { appErrorMessage, handleMustRequireParam } = require("app-tools");
  module.exports = class Explanation extends explain.service {
    // 获取推荐题解
    async getRecommendQuestionList() {
      // 一次最大获取的题解数量
      const questionListLength: number = 5;
      // 是否登录
      if (!this.event.hasOwnProperty("uniIdToken")) {
        // TODO 直接获取最新的5条记录
      } else {
        // 检查token是否校验成功
        const checkData = await uniID.checkToken(this.event.uniIdToken);
        // token校验不合法
        if (checkData.code !== 0) {
            // TODO 直接获取最新的5条记录
        }else {
            // 根据专区ID以及UID获取可能喜欢的内容
        }
      }
    }
  };
}
