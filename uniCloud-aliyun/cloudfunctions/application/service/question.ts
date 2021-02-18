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
    context: {
      CLIENTIP: string;
    };
  }

  module.exports = class Question {
    public userID: string;
    public nowDate: string;
    public clientIp: string;
    constructor(data: QuestionData) {
      this.userID = data.userID;
      this.clientIp = data.context.CLIENTIP; // context注入的IP段
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
      const limit: number = params.limit || 10;
      const page: number = params.page || 1;
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
    public async addPageView(params: { _id: string }) {
      // 当前题目中的浏览量信息
      const result = await collection
        .doc(params._id)
        .get();
      // 判断结果集中是否有pageView，如果没有则默认为0
      const pageView: number = result.data[0].pageView || 0;
      const pageViewIP: string[] = result.data[0].pageViewIP || [];
      // 判断IP是否存在
      if (pageViewIP.includes(this.clientIp)) {
        // 存在
        return {
          msg: `增加页面浏览量失败，因为${this.clientIp}已存在`,
        };
      } else {
        // 做set操作时不能操作主键_id，所以要把返回的对象中的_id置为undefined，但是这个不是标准的
        // 可以使用delete操作符，但是这个关键字太慢，也可以使用JSON中的一些方法，最优雅就是lodash中的方法
        delete result.data[0]._id;
        return await collection.doc(params._id).set({
          ...result.data[0],
          pageViewIP: pageViewIP.concat([this.clientIp]),
          pageView: pageView + 1,
        });
      }
    }
  };
}
