namespace QuestionTagService {
  const db = uniCloud.database();
  const collection = db.collection("questionTag");
  interface QuestionTagData {
    userID: string;
  }
  interface IAddQuestionTag {
    areaID: string;
    name: string;
  }
  interface IUpdateQuestionTag {
    _id: string;
    areaID: string;
    name: string;
  }
  interface IDeleteQuestionTag {
    _id: string;
  }
  module.exports = class QuestionTag {
    public userID: string;
    public nowDate: string;
    constructor(data: QuestionTagData) {
      this.userID = data.userID;
      this.nowDate = new Date().toISOString();
    }
    public async addQuestionTag(params: IAddQuestionTag) {
      const { areaID, name } = params;
      return await collection.add({
        areaID,
        name,
        createDate: this.nowDate,
        updateDate: this.nowDate,
        deleteDate: "",
      });
    }
    public async updateQuestionTag(params: IUpdateQuestionTag) {
      const { _id, areaID, name } = params;
      return await collection.doc(_id).update({
        areaID,
        name,
        updateDate: this.nowDate,
        deleteDate: "",
      });
    }
    public async deleteQuestionTag(params: IDeleteQuestionTag) {
      return await collection.doc(params._id).update({
        updateDate: this.nowDate,
        deleteDate: this.nowDate,
      });
    }
  };
}
