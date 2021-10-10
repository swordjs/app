const db = uniCloud.database();
const collection = db.collection('questionArea');
import * as IQuestionArea from '../../proto/questionArea';
export default class QuestionArea {
  public userID: string;
  public nowDate: string;
  constructor(data: CloudData) {
    this.userID = data.context.userID;
    this.nowDate = new Date().toISOString();
  }
  async getAreaList(params: IQuestionArea.GetAreaList): Promise<unknown> {
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
  async addQuestionArea(params: IQuestionArea.AddQuestionArea): Promise<unknown> {
    const { name, iconPath } = params;
    return await collection.add({
      name,
      iconPath,
      createDate: this.nowDate,
      updateDate: this.nowDate,
      deleteDate: ''
    });
  }
  async updateQuestionArea(params: IQuestionArea.UpdateQuestionArea): Promise<unknown> {
    const { name, iconPath } = params;
    return await collection.doc(params._id).update({
      name,
      iconPath,
      updateDate: this.nowDate
    });
  }
  async deleteQuestionArea(params: IQuestionArea.DeleteQuestionArea): Promise<unknown> {
    return await collection.doc(params._id).update({
      updateDate: this.nowDate,
      deleteDate: this.nowDate
    });
  }
}
