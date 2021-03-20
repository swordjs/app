namespace questionExplanation {
  const explain = require("explain");
  const questionExplanation = require("../service/questionExplanation");
  const { appErrorMessage, handleMustRequireParam } = require("app-tools");
  module.exports = class QuestionExplanation extends explain.service {
    async handler(methodName: string) {
      const service = new questionExplanation({
        userID: this.context.userID,
      });
      return await service[methodName](this.event.params);
    }
    // 添加题解
    async addQuestionExplanation() {
      return handleMustRequireParam(
        [
          {
            key: "_id",
            value: "题目ID",
          },
          {
            key: "content",
            value: "内容",
          },
        ],
        this.event.params
      )
        .then(async () => {
          return await this.handler("addQuestionExplanation");
        })
        .catch((err) => err);
    }
    // 采纳/取消题解
    async adoptionQuestionExplanation() {
      return handleMustRequireParam(
        [
          {
            key: "_id",
            value: "题解ID",
          },
        ],
        this.event.params
      )
        .then(async () => {
          return await this.handler("adoptionQuestionExplanation");
        })
        .catch((err) => err);
    }
  };
}
