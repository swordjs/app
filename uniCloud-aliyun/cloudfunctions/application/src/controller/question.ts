const explain = require("explain");
// 工具函数
const { appErrorMessage, handleMustRequireParam } = require("app-tools");
const QuestionService = require("./../service/question");
module.exports = class QuestionController extends explain.service {
  // 获取推荐的题目(version 1)
  // 核心处理服务方法
  async handler(methodName: string) {
    const service = new QuestionService({
      userID: this.context.userID,
      context: this.context,
    });
    return await service[methodName](this.event.params);
  }
  // 添加题目
  async addQuestion() {
    return handleMustRequireParam(
      [
        {
          key: "title",
          value: "标题",
        },
        {
          key: "areaID",
          value: "专区ID",
        },
      ],
      this.event.params
    )
      .then(async () => {
        return await this.handler("addQuestion");
      })
      .catch((err) => err);
  }
  async updateQuestion() {
    return handleMustRequireParam(
      [
        {
          key: "_id",
          value: "题目ID",
        },
        {
          key: "title",
          value: "题目标题",
        },
        {
          key: "content",
          value: "题目内容",
        },
        {
          key: "areaID",
          value: "题目ID",
        },
        {
          key: "tagID",
          value: "标签ID",
        },
      ],
      this.event.params
    )
      .then(async () => {
        return await this.handler("updateQuestion");
      })
      .catch((err) => err);
  }
  async deleteQuestion() {
    return handleMustRequireParam(
      [
        {
          key: "_id",
          value: "题目ID",
        },
      ],
      this.event.params
    )
      .then(async () => {
        return await this.handler("deleteQuestion");
      })
      .catch((err) => err);
  }
  // 审核题目
  async examineQuestion() {
    return handleMustRequireParam(
      [
        {
          key: "_id",
          value: "题目ID",
        },
        {
          key: "state",
          value: "审核状态",
        },
      ],
      this.event.params
    )
      .then(async () => {
        // 判断传递进来的状态是否是reject
        if (
          this.event.params.state === "reject" &&
          !this.event.params.hasOwnProperty("examineInfo")
        ) {
          return appErrorMessage(
            "拒绝审核需要传递examineInfo对象，注明拒绝原因"
          );
        }
        return await this.handler("examineQuestion");
      })
      .catch((err) => err);
  }
  // 分页获取题目列表, 筛选了题目的状态
  async getQuestionList() {
    return handleMustRequireParam(
      [
        {
          key: "state",
          value: "题目状态",
        },
      ],
      this.event.params
    )
      .then(async () => {
        return await this.handler("getQuestionList");
      })
      .catch((err) => err);
  }
  // 浏览题目详情（如果没有pageView就默认设置为1）
  async addPageView() {
    return handleMustRequireParam(
      [
        {
          key: "_id",
          value: "题目",
        },
      ],
      this.event.params
    )
      .then(async () => {
        return await this.handler("addPageView");
      })
      .catch((err) => err);
  }
};

export {};
