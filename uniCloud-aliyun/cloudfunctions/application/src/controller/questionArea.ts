const explain = require("explain");
const questionAreaService = require("../service/questionArea");
const { appErrorMessage, handleMustRequireParam } = require("app-tools");
module.exports = class User extends explain.service {
  async handler(methodName: string) {
    const service = new questionAreaService({
      userID: this.context.userID,
    });
    return await service[methodName](this.event.params);
  }
  // 获取专区列表（HTTP调用）
  async getAreaList() {
    return await this.handler("getAreaList");
  }
  // 添加题目专区
  addQuestionArea() {
    return handleMustRequireParam(
      [
        {
          key: "name",
          value: "名称",
        },
        {
          key: "iconPath",
          value: "图标地址",
        },
      ],
      this.event.params
    )
      .then(async () => {
        if (this.event.params.name === "") {
          return appErrorMessage("名称为空");
        } else if (this.event.params.iconPath === "") {
          return appErrorMessage("图片地址为空");
        } else {
          return await this.handler("addQuestionArea");
        }
      })
      .catch((err) => err);
  }
  updateQuestionArea() {
    return handleMustRequireParam(
      [
        {
          key: "_id",
          value: "专区ID",
        },
        {
          key: "name",
          value: "名称",
        },
        {
          key: "iconPath",
          value: "图标地址",
        },
      ],
      this.event.params
    )
      .then(async () => {
        if (this.event.params.name === "") {
          return appErrorMessage("名称为空");
        } else if (this.event.params.iconPath === "") {
          return appErrorMessage("图片地址为空");
        } else {
          return await this.handler("updateQuestionArea");
        }
      })
      .catch((err) => err);
  }
  deleteQuestionArea() {
    return handleMustRequireParam(
      [
        {
          key: "_id",
          value: "专区ID",
        },
      ],
      this.event.params
    )
      .then(async () => {
        return await this.handler("deleteQuestionArea");
      })
      .catch((err) => err);
  }
};

export {};
