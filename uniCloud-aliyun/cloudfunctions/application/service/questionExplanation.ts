namespace QuestionExplanationService {
  const db = uniCloud.database();
  const collection = db.collection("questionExplanation");
  const questionService = require("../service/question");
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
      const explanationResult = await collection.add({
        questionID: _id,
        userID: this.userID,
        content,
        userAgreed: [],
        userDisagreed: [],
        createDate: this.nowDate,
        updateDate: this.nowDate,
        deleteDate: "",
      });
      if(explanationResult.id){
        // 如果题解添加成功需要在具体的question表中的questionExplanation添加一个ID作为关联
        const questionCore = new questionService({
          userID: this.userID
        });
        return await questionCore.addQuestionExplanationByID({
          _id, 
          questionExplanationID: explanationResult.id
        })
      }
    }
  };
}