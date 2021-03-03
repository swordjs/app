namespace QuestionExplanationService {
  const db = uniCloud.database();
  const collection = db.collection("questionExplanation");
  interface IQuestionExplanation {
    userID: string;
    nowDate: string;
  }
  interface IAddQuestionExplanation {
    _id: string;
    content: string;
  }
  module.exports = class QuestionExplanationService {
    public userID: string;
    public nowDate: string;
    constructor(data: IQuestionExplanation) {
      this.userID = data.userID;
      this.nowDate = new Date().toISOString();
    }
    public async addQuestionExplanation(params: IAddQuestionExplanation) {
      const { _id, content } = params;
      return await collection.add({
        questionID: _id,
        userID: this.userID,
        content,
        userAgreed: [],
        userDisagreed: [],
        createDate: this.nowDate,
        updateDate: this.nowDate,
        deleteDate: "",
      });
    }
  };
}
