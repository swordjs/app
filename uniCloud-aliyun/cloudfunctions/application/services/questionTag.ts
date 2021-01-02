namespace questionTag {
  const explain = require("explain");
  const db = uniCloud.database();
  const collection = db.collection("questionTag");
  const { appErrorMessage, handleMustRequireParam } = require("app-tools");
  module.exports = class QuestionTag extends explain.service {
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
        .then(() => {
          const { areaID, name } = this.event.params;
          const now: string = new Date().toISOString();
          if (this.event.params.name === "") {
            return appErrorMessage("名称不能为空");
          } else {
            return collection.add({
              areaID,
              name,
              createDate: now,
              updateDate: now,
              deleteDate: "",
            });
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
        .then(() => {
          const { _id, areaID, name } = this.event.params;
          const now: string = new Date().toISOString();
          if (this.event.params.name === "") {
            return appErrorMessage("名称不能为空");
          } else if (this.event.params._id === "") {
            return appErrorMessage("id不能为空");
          } else {
            return collection.doc(_id).update({
              areaID,
              name,
              updateDate: now,
              deleteDate: "",
            });
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
        .then(() => {
          const { _id } = this.event.params;
          const now: string = new Date().toISOString();
          if (this.event.params._id === "") {
            return appErrorMessage("id不能为空");
          } else {
            return collection.doc(_id).update({
              updateDate: now,
              deleteDate: now,
            });
          }
        })
        .catch((err) => err);
    }
  };
}
