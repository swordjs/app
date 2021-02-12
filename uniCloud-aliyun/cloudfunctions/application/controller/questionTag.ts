namespace questionTag {
  const explain = require("explain");
  const questionTagService = require("../service/questionTag");
  const { appErrorMessage, handleMustRequireParam } = require("app-tools");
  module.exports = class QuestionTag extends explain.service {
    async handler(methodName: string) {
      const service = new questionTagService({
        userID: this.context.userID,
      });
      return await service[methodName](this.event.params);
    }
    // 获取专区列表（HTTP调用）
    async getTagList(){
      return await this.handler("getTagList")
    }
    // 添加Tag
    addQuestionTag() {
      return handleMustRequireParam(
        [
          {
            key: "areaID",
            value: "专区ID",
          },
          {
            key: "name",
            value: "名称",
          },
        ],
        this.event.params
      )
        .then(async () => {
          if (this.event.params.name === "") {
            return appErrorMessage("名称不能为空");
          } else {
            return await this.handler("addQuestionTag");
          }
        })
        .catch((err) => err);
    }
    // 修改Tag
    updateQuestionTag() {
      return handleMustRequireParam(
        [
          {
            key: "_id",
            value: "id",
          },
          {
            key: "areaID",
            value: "专区ID",
          },
          {
            key: "name",
            value: "名称",
          },
        ],
        this.event.params
      )
        .then(async () => {
          if (this.event.params.name === "") {
            return appErrorMessage("名称不能为空");
          } else if (this.event.params._id === "") {
            return appErrorMessage("id不能为空");
          } else {
            return await this.handler("updateQuestionTag");
          }
        })
        .catch((err) => err);
    }
    // 删除tag
    deleteQuestionTag() {
      return handleMustRequireParam(
        [
          {
            key: "_id",
            value: "id",
          },
        ],
        this.event.params
      )
        .then(async () => {
          if (this.event.params._id === "") {
            return appErrorMessage("id不能为空");
          } else {
            return await this.handler("deleteQuestionTag");
          }
        })
        .catch((err) => err);
    }
  };
}
