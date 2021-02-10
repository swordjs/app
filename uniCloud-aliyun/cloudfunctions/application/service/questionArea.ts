namespace QuestionAreaService {
  const db = uniCloud.database();
  const collection = db.collection("questionArea");
  interface QuestionAreaData {
    userID: string;
  }
  interface IAddQuestionArea {
    name: string;
    iconPath: string;
  }
  interface IUpdateQuestionArea {
    _id: string;
    name: string;
    iconPath: string;
  }
  interface IDeleteQuestionArea {
    _id: string;
  }
  module.exports = class QuestionArea {
    public userID: string;
    public nowDate: string;
    constructor(data: QuestionAreaData) {
      this.userID = data.userID;
      this.nowDate = new Date().toISOString();
    }
    async addQuestionArea(params: IAddQuestionArea) {
      const { name, iconPath } = params;
      return await collection.add({
        name,
        iconPath,
        createDate: this.nowDate,
        updateDate: this.nowDate,
        deleteDate: "",
      });
    }
    async updateQuestionArea(params: IUpdateQuestionArea) {
      const { name, iconPath } = params;
      return await collection.doc(params._id).update({
        name,
        iconPath,
        updateDate: this.nowDate,
      });
    }
    async deleteQuestionArea(params: IDeleteQuestionArea) {
      return await collection.doc(params._id).update({
        updateDate: this.nowDate,
        deleteDate: this.nowDate,
      });
    }
  };
}
