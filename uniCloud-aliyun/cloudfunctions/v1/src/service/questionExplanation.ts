const db = uniCloud.database();
const collection = db.collection('sword-question-explanation');
const collectService = db.collection('sword-user-collect');
const dbCmd = db.command;
import * as IQuestionExplanation from '../../typings/proto/request/questionExplanation';
export default class QuestionExplanationService {
  public userID: string;
  public nowDate: string;
  constructor(data: CloudData) {
    this.userID = data.context.userID;
    this.nowDate = new Date().toISOString();
  }
  public async addQuestionExplanation(params: IQuestionExplanation.AddQuestionExplanation): Promise<unknown> {
    const { _id, content } = params;
    const explanationResult = await collection.add({
      questionID: _id,
      userID: this.userID,
      content: content,
      userAgreed: [],
      userDisagreed: [],
      createDate: this.nowDate,
      updateDate: this.nowDate,
      deleteDate: ''
    });
    return {
      _id: explanationResult.id
    };
  }
  public async updateQuestionExplanation(params: IQuestionExplanation.UpdateQuestionExplanation): Promise<unknown> {
    const { _id, content } = params;
    console.log('进入');
    return await collection.doc(_id).update({
      content,
      updateDate: this.nowDate
    });
  }
  public async adoptionQuestionExplanation(params: IQuestionExplanation.AdoptionQuestionExplanation): Promise<unknown> {
    // 判断当前题解中的采纳列表中是否存在此userID
    const explanationResult = await collection.doc(params._id).get();
    if (explanationResult.data) {
      const userAgreed: string[] = explanationResult.data[0].userAgreed;
      // 查询userAgreed中是否存在userID
      const checkResultIndex = userAgreed.findIndex((u) => u === this.userID);
      const docEvent = collection.doc(params._id);
      let res: unknown;
      if (checkResultIndex >= 0) {
        userAgreed.splice(checkResultIndex, 1);
        // 如果存在，取消赞同
        res = await docEvent.update({
          userAgreed
        });
      } else {
        // 不存在，赞同
        res = await docEvent.update({
          userAgreed: dbCmd.push(this.userID)
        });
      }
      return res;
    }
  }
  public async collectQuestionExplanation(params: IQuestionExplanation.CollectQuestionExplanation): Promise<unknown> {
    // 如果没有收藏，则默认建立一个收藏夹, 名为默认收藏夹
    const collectResult = await collectService
      .where({
        userID: this.userID
      })
      .get<{ _id: string }>();

    const collectData = {
      type: 'explanation',
      id: params._id
    };
    if (collectResult.data.length === 0) {
      const result = await db.collection('sword-user-collect').add({
        name: '默认收藏夹',
        userID: this.userID,
        collectData: [collectData]
      });
      return result;
    } else {
      // 如果存在收藏夹，目前就往第0个，也就是默认收藏夹去添加数据
      // 判断题解ID是否存在于该收藏夹中
      const result = await db.collection('sword-user-collect').doc(collectResult.data[0]._id).get();
      const collectData = result.data[0].collectData;
      const collectIndex = collectData.findIndex((c) => {
        return c.type === 'explanation' && c.id === params._id;
      });
      const collectAction = db.collection('sword-user-collect').doc(collectResult.data[0]._id);
      if (collectIndex >= 0) {
        collectData.splice(collectIndex, 1);
        // 更新collectData
        return await collectAction.update({
          collectData
        });
      } else {
        return await collectAction.update({
          collectData: dbCmd.push({
            type: 'explanation',
            id: params._id
          })
        });
      }
    }
  }
  // 获取题解数量
  public async getExplanationCountByUser(userID: IQuestionExplanation.GetExplanationCountByUser): Promise<{ total: number }> {
    return await collection
      .where({
        userID,
        deleteDate: ''
      })
      .count();
  }
  // 查询题解共被采纳过多少次
  public async getLikeCountByUser(userID: IQuestionExplanation.GetLikeCountByUser): Promise<{ data: unknown[] }> {
    // 获取所有的题解列表并且
    return await collection
      .aggregate()
      .match({
        userID,
        deleteDate: ''
      })
      .unwind('$userAgreed')
      .end();
  }
}

export {};
