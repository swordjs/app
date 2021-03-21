namespace QuestionExplanationService {
  const db = uniCloud.database();
  const uniID = require("uni-id");
  const collection = db.collection("questionExplanation");
  const questionService = require("../service/question");
  const dbCmd = db.command;
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
        if (checkResultIndex >= 0) {
          userAgreed.splice(checkResultIndex, 1);
          // 如果存在，取消赞同
          await docEvent.update({
            userAgreed,
          });
        } else {
          // 不存在，赞同
          await docEvent.update({
            userAgreed: dbCmd.push(this.userID),
          });
        }
        // 更新用户的socialInfo
        return await this.updateUserSocialInfo({
          event: checkResultIndex >= 0,
          explanationID: params._id,
        });
      }
    }
    public async collectQuestionExplanation(params: { _id: string }) {
      // 判断此用户中的收藏夹中是否存在此题解，如果存在，则取消，反之收藏
      const res: {
        userInfo: {
          userLikedQuestionExplanation: string[];
        };
      } = await uniID.getUserInfo({
        uid: this.userID,
        field: ["userLikedQuestionExplanation"],
      });
      if (res.userInfo.userLikedQuestionExplanation) {
      }
    }
    // 处理题解点赞操作，对应的用户中的socialInfo字段变更的逻辑
    private async updateUserSocialInfo(params: {
      event: boolean;
      explanationID: string;
    }) {
      // 社交类型
      // 获取用户信息中的socialInfo字段
      const socialInfoResult = await uniID.getUserInfo({
        uid: this.userID,
        field: ["sociaInfo"],
      });
      // 初始化sociaInfo
      let sociaInfo: object[] = [];
      // 判断此用户中的信息有没有socialInfo
      if (socialInfoResult.userInfo.sociaInfo) {
        // 如果存在
        sociaInfo = socialInfoResult.userInfo.sociaInfo;
      }
      // 如果event是true，则取消此操作
      switch (params.event) {
        case true:
          // 查询索引
          let resultIndex = sociaInfo.findIndex((s: any) => {
            return (
              s.type === "explanation" &&
              s.event === "like" &&
              s.info._id === params.explanationID
            );
          });
          console.log("嘿嘿", resultIndex);
          if (resultIndex >= 0) {
            sociaInfo.splice(resultIndex, 1);
            return await uniID.updateUser({
              uid: this.userID,
              sociaInfo,
            });
          }
          break;
        case false:
          return await uniID.updateUser({
            uid: this.userID,
            sociaInfo: dbCmd.push({
              type: "explanation",
              event: "like",
              info: {
                _id: params.explanationID,
              },
            }),
          });
      }
    }
  };
}
