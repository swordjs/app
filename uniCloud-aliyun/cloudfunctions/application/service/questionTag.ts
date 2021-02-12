namespace QuestionTagService {
  const db = uniCloud.database();
  const collection = db.collection("questionTag");
  interface QuestionTagData {
    userID: string;
  }
  interface IGetTagList {
    limit: number;
    page: number;
  }
  interface IAddQuestionTag {
    areaID: string;
    name: string;
  }
  interface IUpdateQuestionTag {
    _id: string;
    areaID: string;
    name: string;
  }
  interface IDeleteQuestionTag {
    _id: string;
  }
  module.exports = class QuestionTag {
    public userID: string;
    public nowDate: string;
    constructor(data: QuestionTagData) {
      this.userID = data.userID;
      this.nowDate = new Date().toISOString();
    }
    public async getTagList(params: IGetTagList) {
      const { limit, page } = params;
      const whereParams = {
        deleteDate: "",
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
          from: "questionArea",
          localField: "areaID",
          foreignField: "_id",
          as: "areaInfo",
        })
        .end();
      // 获取数量
      const countResult = await collection.where(whereParams).count();
      return {
        list: data.data,
        count: countResult.total,
      };
    }
    public async addQuestionTag(params: IAddQuestionTag) {
      const { areaID, name } = params;
      return await collection.add({
        areaID,
        name,
        createDate: this.nowDate,
        updateDate: this.nowDate,
        deleteDate: "",
      });
    }
    public async updateQuestionTag(params: IUpdateQuestionTag) {
      const { _id, areaID, name } = params;
      return await collection.doc(_id).update({
        areaID,
        name,
        updateDate: this.nowDate,
        deleteDate: "",
      });
    }
    public async deleteQuestionTag(params: IDeleteQuestionTag) {
      return await collection.doc(params._id).update({
        updateDate: this.nowDate,
        deleteDate: this.nowDate,
      });
    }
  };
}
