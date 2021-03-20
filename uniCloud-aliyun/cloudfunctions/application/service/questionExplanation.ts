namespace QuestionExplanationService {
  const db = uniCloud.database();
  const collection = db.collection("questionExplanation");
  const questionService = require("../service/question");
  const dbCmd = db.command
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
      if (explanationResult.id) {
        // 如果题解添加成功需要在具体的question表中的questionExplanation添加一个ID作为关联
        const questionCore = new questionService({
          userID: this.userID,
        });
        return await questionCore.addQuestionExplanationByID({
          _id,
          questionExplanationID: explanationResult.id,
        });
      }
    }
    public async adoptionQuestionExplanation(params: { _id: string }) {
      // 判断当前题解中的采纳列表中是否存在此userID
      const explanationResult = await collection.doc(params._id).get();
      if (explanationResult.data) {
        const userAgreed: string[] = explanationResult.data[0].userAgreed;
        // 查询userAgreed中是否存在userID
        const checkResultIndex = userAgreed.findIndex((u) => u === this.userID);
        const docEvent = collection.doc(params._id);
        if(checkResultIndex >= 0){
          userAgreed.splice(checkResultIndex, 1);
          // 如果存在，取消赞同
          return await docEvent.update({
            userAgreed
          });
        }else{
          // 不存在，赞同
          return await docEvent.update({
            userAgreed: dbCmd.push(this.userID)
          });
        }
      }
    }
  };
}
