namespace questionArea {
  const explain = require("explain");
  const db = uniCloud.database();
  const collection = db.collection("questionArea");
  const { appErrorMessage, handleMustRequireParam } = require("app-tools");
  module.exports = class User extends explain.service {
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
        .then(() => {
          const { name, iconPath } = this.event.params;
          if (this.event.params.name === "") {
            return appErrorMessage("名称为空");
          } else if (this.event.params.iconPath === "") {
            return appErrorMessage("图片地址为空");
          } else {
            const now: string  = new Date().toISOString();
            return collection.add({
              name,
              iconPath,
              createDate: now,
              updateDate: now,
              deleteDate: "",
            });
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
        .then(() => {
          const { name, iconPath } = this.event.params;
          if (this.event.params.name === "") {
            return appErrorMessage("名称为空");
          } else if (this.event.params.iconPath === "") {
            return appErrorMessage("图片地址为空");
          } else {
            const now: string  = new Date().toISOString();
            return collection.doc(this.event.params._id).update({
              name,
              iconPath,
              updateDate: now,
            });
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
        .then(() => {
          const now: string  = new Date().toISOString();
          return collection.doc(this.event.params._id).update({
            updateDate: now,
            deleteDate: now
          });
        })
        .catch((err) => err);
    }
  };
}
