import * as IQuestion from '../../proto/question';
const db = uniCloud.database();
const dbCmd = db.command;
const collection = db.collection('sword-question');

export default class Question {
  public userID: string;
  public nowDate: string;
  public clientIp: string;
  constructor(data: CloudData) {
    this.userID = data.context.userID || '';
    this.clientIp = data?.context?.CLIENTIP || '';
    this.nowDate = new Date().toISOString();
  }
  async addQuestion(params: IQuestion.AddQuestion): Promise<unknown> {
    return await collection.add({
      title: params.title,
      areaID: params.areaID,
      content: params.content || '',
      publishUserID: this.userID,
      tagID: params.tagID || '',
      state: 'onlist',
      createDate: this.nowDate,
      updateDate: this.nowDate,
      deleteDate: ''
    });
  }
  async updateQuestion(params: IQuestion.UpdateQuestion): Promise<unknown> {
    return await collection.doc(params._id).update({
      title: params.title,
      areaID: params.areaID,
      content: params.content || '',
      tagID: params.tagID || '',
      updateDate: this.nowDate
    });
  }
  async deleteQuestion(params: IQuestion.DeleteQuestion): Promise<unknown> {
    return await collection.doc(params._id).update({
      deleteDate: this.nowDate
    });
  }
  async examineQuestion(params: IQuestion.ExamineQuestion): Promise<unknown> {
    return await collection
      .where({
        _id: dbCmd.in(params._id)
      })
      .update({
        state: params.state,
        examineInfo: params.examineInfo || '',
        updateDate: this.nowDate
      });
  }
  async getQuestionList(params: IQuestion.GetQuestionList): Promise<unknown> {
    // 构建查询条件
    const whereParams = {
      state: params.state
    };
    const limit: number = params.limit || 10;
    const page: number = params.page || 1;
    const data = await collection
      .aggregate()
      .match(whereParams)
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({
        createDate: -1
      })
      .lookup({
        from: 'questionArea',
        localField: 'areaID',
        foreignField: '_id',
        as: 'areaInfo'
      })
      .lookup({
        from: 'questionTag',
        localField: 'tagID',
        foreignField: '_id',
        as: 'tagInfo'
      })
      .lookup({
        from: 'uni-id-users',
        localField: 'publishUserID',
        foreignField: '_id',
        as: 'publishUser'
      })
      .end();
    // 获取数量
    const countResult = await collection.where(whereParams).count();
    return {
      list: data.data,
      count: countResult.total
    };
  }
  async addPageView(params: IQuestion.AddPageView): Promise<unknown> {
    // 当前题目中的浏览量信息
    const result = await collection.doc(params._id).get();
    // 判断结果集中是否有pageView，如果没有则默认为0
    const pageView: number = result.data[0].pageView || 0;
    const pageViewIP: string[] = result.data[0].pageViewIP || [];
    // 判断IP是否存在
    if (pageViewIP.includes(this.clientIp)) {
      // 存在
      return {
        msg: `增加页面浏览量失败，因为${this.clientIp}已存在`
      };
    } else {
      // 做set操作时不能操作主键_id，所以要把返回的对象中的_id置为undefined，但是这个不是标准的
      // 可以使用delete操作符，但是这个关键字太慢，也可以使用JSON中的一些方法，最优雅就是lodash中的方法
      delete result.data[0]._id;
      return await collection.doc(params._id).set({
        ...result.data[0],
        pageViewIP: pageViewIP.concat([this.clientIp]),
        pageView: pageView + 1
      });
    }
  }
  // 根据UserID获取发布了多少道题目
  async questionCountByUserID(userID: string): Promise<{ total: number }> {
    return await collection
      .where({
        publishUserID: userID,
        state: 'pass',
        deleteDate: ''
      })
      .count();
  }
  // 获取随机题目
  async getSampleQuestionList(params: IQuestion.GetSampleQuestionList): Promise<unknown> {
    const whereParams: Record<string, unknown> = {
      state: 'pass'
    };
    if (params?.areaID) {
      whereParams['areaID'] = params?.areaID;
    }
    const res = await collection
      .aggregate()
      .match(whereParams)
      .sample({
        size: params?.size || 3
      })
      .end();
    return res;
  }
}
