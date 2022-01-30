const db = uniCloud.database();
const collection = db.collection('sword-question-tag');
import * as IQuestionTag from '../../typings/proto/request/questionTag';
export default class QuestionTag {
  public userID: string;
  public nowDate: string;
  constructor(data: CloudData) {
    this.userID = data.context.userID;
    this.nowDate = new Date().toISOString();
  }
  public async getTagList(params: IQuestionTag.GetTagList): Promise<unknown> {
    const { limit, page } = params;
    const whereParams = {
      deleteDate: ''
    };
    const data = await collection
      .aggregate()
      .match(whereParams)
      .sort({
        createDate: -1
      })
      .skip(limit * (page - 1))
      .limit(limit)
      .lookup({
        from: 'questionArea',
        localField: 'areaID',
        foreignField: '_id',
        as: 'areaInfo'
      })
      .end();
    // 获取数量
    const countResult = await collection.where(whereParams).count();
    return {
      list: data.data,
      count: countResult.total
    };
  }
  public async addQuestionTag(params: IQuestionTag.AddQuestionTag): Promise<unknown> {
    const { areaID, name } = params;
    return await collection.add({
      areaID,
      name,
      createDate: this.nowDate,
      updateDate: this.nowDate,
      deleteDate: ''
    });
  }
  public async updateQuestionTag(params: IQuestionTag.UpdateQuestionTag): Promise<unknown> {
    const { _id, areaID, name } = params;
    return await collection.doc(_id).update({
      areaID,
      name,
      updateDate: this.nowDate,
      deleteDate: ''
    });
  }
  public async deleteQuestionTag(params: IQuestionTag.DeleteQuestionTag): Promise<unknown> {
    return await collection.doc(params._id).update({
      updateDate: this.nowDate,
      deleteDate: this.nowDate
    });
  }
}
