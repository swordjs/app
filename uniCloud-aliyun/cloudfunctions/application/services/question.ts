namespace Question {
  const explain = require("explain");
  const uniID = require("uni-id");
  const db = uniCloud.database();
  const collection = db.collection("question");
  // 工具函数
  const { appErrorMessage, handleMustRequireParam } = require("app-tools");
  module.exports = class Question extends explain.service {
    // 添加一道题
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
          }
        ],
        this.event.params
      )
        .then(async () => {
          const nowDate: string = new Date().toISOString();
          return collection.add({
            title: this.event.params.title,
            areaID: this.event.params.areaID,
            content: this.event.params.content || "",
            publishUserID: this.event.userID,
            tagID: this.event.params.tagID || "",
            questionExplanation: [],
            state: "onlist",
            createDate: nowDate,
            updateDate: nowDate,
            deleteDate: "",
          });
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
        ],
        this.event.params
      )
        .then(() => {
          const nowDate: string = new Date().toISOString();
          // 只能更改title，areaID，content，tagID
          return collection.doc(this.event.params._id).update({
            title: this.event.params.title,
            areaID: this.event.params.areaID,
            content: this.event.params.content || "",
            tagID: this.event.params.tagID || "",
            updateDate: nowDate,
          });
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
        .then(() => {
          const nowDate: string = new Date().toISOString();
          return collection.doc(this.event.params._id).update({
            deleteDate: nowDate,
          });
        })
        .catch((err) => err);
    }
    // 审核题目
    async examineQuestion(){
      return handleMustRequireParam(
        [
          {
            key: "_id",
            value: "题目ID",
          },
          {
            key: "state",
            value: "审核状态"
          }
        ],
        this.event.params
      )
        .then(() => {
          const nowDate: string = new Date().toISOString();
          // 判断传递进来的状态是否是reject
          if(this.event.params.state === "reject" && !this.event.params.hasOwnProperty("examineInfo")){
            return appErrorMessage("拒绝审核需要传递examineInfo对象，注明拒绝原因")
          }
          return collection.doc(this.event.params._id).update({
            state: this.event.params.state,
            examineInfo: this.event.params.examineInfo || "",
            updateDate: nowDate,
          });
        })
        .catch((err) => err);
    }
  };
}
