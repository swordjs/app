namespace QuestionAreaService {
  const db = uniCloud.database();
  const collection = db.collection("questionArea");
  interface IQuestionAreaData {
    userID: string;
  }
  interface IGetAreaList {
    limit?: number;
    page?: number;
  }
  interface IAddQuestionArea {
    name: string;
    iconPath: string;
  }
  interface IUpdateQuestionArea {
    _id: string;
    name: string;
    iconPath: string;
  }
  interface IDeleteQuestionArea {
    _id: string;
  }
  module.exports = class QuestionArea {
    public userID: string;
    public nowDate: string;
    constructor(data: IQuestionAreaData) {
      this.userID = data.userID;
      this.nowDate = new Date().toISOString();
    }
    async getAreaList(params: IGetAreaList) {
      const { limit, page } = params;
      const whereParams = {
        deleteDate: "",
      }
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
        count: countResult.total,
      }
    }
    async addQuestionArea(params: IAddQuestionArea) {
      const { name, iconPath } = params;
      return await collection.add({
        name,
        iconPath,
        createDate: this.nowDate,
        updateDate: this.nowDate,
        deleteDate: "",
      });
    }
    async updateQuestionArea(params: IUpdateQuestionArea) {
      const { name, iconPath } = params;
      return await collection.doc(params._id).update({
        name,
        iconPath,
        updateDate: this.nowDate,
      });
    }
    async deleteQuestionArea(params: IDeleteQuestionArea) {
      return await collection.doc(params._id).update({
        updateDate: this.nowDate,
        deleteDate: this.nowDate,
      });
    }
  };
}
