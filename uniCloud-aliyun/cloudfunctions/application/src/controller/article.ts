const explain = require("explain");
const articleService = require("../service/article");
const { appErrorMessage, handleMustRequireParam } = require("app-tools");

module.exports = class ArticleController extends explain.service {
  // 核心处理服务方法
  async handler(methodName: string) {
    const service = new articleService({
      context: this.context,
    });
    return await service[methodName](this.event.params);
  }
  // 添加文章
  async addArticle() {
    return handleMustRequireParam(
      [
        {
          key: "title",
          value: "文章标题",
        },
        {
          key: "content",
          value: "content内容",
        },
        {
          key: "tagID",
          value: "标签内容",
        }
      ],
      this.event.params
    )
      .then(async () => await this.handler("addArticle"))
      .catch((err) => err);
  }
  // 审核文章
  async auditArticle() {
    return handleMustRequireParam(
      [
        {
          key: "id",
          value: "文章id",
        },
        {
          key: "state",
          value: "状态",
        },
      ],
      this.event.params
    )
      .then(async () => await this.handler("auditArticle"))
      .catch((err) => err);
  }
};
