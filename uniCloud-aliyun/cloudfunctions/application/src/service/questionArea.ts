const db = uniCloud.database();
const collection = db.collection('questionArea');
import * as IQuestionArea from '../../proto/questionArea';
export default class QuestionArea {
  public userID: string;
  public nowDate: string;
  constructor(data) {
    // this.userID = data.userID;
    // this.nowDate = new Date().toISOString();
  }
  async getAreaList(params: IQuestionArea.IGetAreaList): Promise<unknown> {
    const { limit, page } = params;
    const whereParams = {
      deleteDate: ''
    };
    const data = await collection
      .aggregate()
      .match(whereParams)
      .skip(limit * (page - 1))
      .limit(limit)
      .end();
    // 获取数量
    const countResult = await collection.where(whereParams).count();
    return {
      list: data.data,
      count: countResult.total
    };
  }
  async addQuestionArea(params: IQuestionArea.IAddQuestionArea): Promise<unknown> {
    const { name, iconPath } = params;
    return await collection.add({
      name,
      iconPath,
      createDate: this.nowDate,
      updateDate: this.nowDate,
      deleteDate: ''
    });
  }
  async updateQuestionArea(params: IQuestionArea.IUpdateQuestionArea): Promise<unknown> {
    const { name, iconPath } = params;
    return await collection.doc(params._id).update({
      name,
      iconPath,
      updateDate: this.nowDate
    });
  }
  async deleteQuestionArea(params: IQuestionArea.IDeleteQuestionArea): Promise<unknown> {
    return await collection.doc(params._id).update({
      updateDate: this.nowDate,
      deleteDate: this.nowDate
    });
  }
}
