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
      this.userID = data?.userID;
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
        await questionCore.addQuestionExplanationByID({
          _id,
          questionExplanationID: explanationResult.id,
        });
        return {
          _id: explanationResult.id,
        };
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
      // 如果没有收藏，则默认建立一个收藏夹, 名为默认收藏夹
      const collectResult = await uniID.getUserInfo({
        uid: this.userID,
        field: ["collect"],
      });
      const collectData = {
        type: "explanation",
        id: params._id,
      };
      if (
        !collectResult.userInfo.collect ||
        collectResult.userInfo.collect.length === 0
      ) {
        const result = await db.collection("userCollect").add({
          name: "默认收藏夹",
          userID: this.userID,
          collectData: [collectData],
        });
        return await uniID.updateUser({
          uid: this.userID,
          collect: [result.id],
        });
      } else {
        // 如果存在收藏夹，目前就往第0个，也就是默认收藏夹去添加数据
        // 判断题解ID是否存在于该收藏夹中
        const result = await db
          .collection("userCollect")
          .doc(collectResult.userInfo.collect[0])
          .get();
        let collectData = result.data[0].collectData;
        const collectIndex = collectData.findIndex((c: any) => {
          return c.type === "explanation" && c.id === params._id;
        });
        const collectAction = db
          .collection("userCollect")
          .doc(collectResult.userInfo.collect[0]);
        if (collectIndex >= 0) {
          collectData.splice(collectIndex, 1);
          // 更新collectData
          return await collectAction.update({
            collectData,
          });
        } else {
          return await collectAction.update({
            collectData: dbCmd.push({
              type: "explanation",
              id: params._id,
            }),
          });
        }
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
    // 获取题解数量
    public async getExplanationCountByUser(userID) {
      return await collection
        .where({
          userID,
          deleteDate: "",
        })
        .count();
    }
    // 查询题解共被采纳过多少次
    public async getLikeCountByUser(userID) {
      // 获取所有的题解列表并且
      return await collection
        .aggregate()
        .match({
          userID,
          deleteDate: "",
        })
        .unwind("$userAgreed")
        .end();
    }
  };
}
