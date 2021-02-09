namespace QuestionService {
  const db = uniCloud.database();
  const dbCmd = db.command;
  const collection = db.collection("question");
  interface IAddQuestion {
    title: string;
    areaID: string;
    content: string;
    tagID: string[];
  }
  interface IUpdateQuetion {
    _id: string;
    title: string;
    areaID: string;
    content?: string;
    tagID?: string;
  }

  interface IDeleteQuestion {
    _id: string;
  }

  interface IExamineQuestion {
    _id: string;
    state: string;
    examineInfo?: {
      reason: string;
    };
  }

  interface IGetQuestionList {
    state: string;
    limit: number;
    page: number;
  }

  interface QuestionData {
    userID: string;
  }

  module.exports = class Question {
    public userID: string;
    public nowDate: string;
    constructor(data: QuestionData) {
      this.userID = data.userID;
      this.nowDate = new Date().toISOString();
    }
    public async addQuestion(params: IAddQuestion) {
      return await collection.add({
        title: params.title,
        areaID: params.areaID,
        content: params.content || "",
        publishUserID: this.userID,
        tagID: params.tagID || "",
        questionExplanation: [],
        state: "onlist",
        createDate: this.nowDate,
        updateDate: this.nowDate,
        deleteDate: "",
      });
    }
    public async updateQuestion(params: IUpdateQuetion) {
      return collection.doc(params._id).update({
        title: params.title,
        areaID: params.areaID,
        content: params.content || "",
        tagID: params.tagID || "",
        updateDate: this.nowDate,
      });
    }
    public async deleteQuestion(params: IDeleteQuestion) {
      return collection.doc(params._id).update({
        deleteDate: this.nowDate,
      });
    }
    public async examineQuestion(params: IExamineQuestion) {
      return collection
        .where({
          _id: dbCmd.in(params._id),
        })
        .update({
          state: params.state,
          examineInfo: params.examineInfo || "",
          updateDate: this.nowDate,
        });
    }
    public async getQuestionList(params: IGetQuestionList) {
      // 构建查询条件
      const whereParams = {
        state: params.state,
      };
      const limit = params.limit || 10;
      const page = params.page || 1;
      const data = await collection
        .aggregate()
        .match(whereParams)
        .skip(limit * (page - 1))
        .limit(limit)
        .sort({
          createDate: -1,
        })
        .lookup({
          from: "questionArea",
          localField: "areaID",
          foreignField: "_id",
          as: "areaInfo",
        })
        .lookup({
          from: "questionTag",
          localField: "tagID",
          foreignField: "_id",
          as: "tagInfo",
        })
        .lookup({
          from: "uni-id-users",
          localField: "publishUserID",
          foreignField: "_id",
          as: "publishUser",
        })
        .end();
      // 获取数量
      const countResult = await collection.where(whereParams).count();
      return {
        list: data.data,
        count: countResult.total,
      };
    }
  };
}
