import * as IOpenApi from '../../proto/openApi';
const db = uniCloud.database();
const collection = db.collection('openApi');
const questionCollection = db.collection('question');
const questionAreaCollection = db.collection('questionArea');
const questionTag = db.collection('questionTag');

export default class OpenApiService {
  public userID: string;
  public nowDate: string;
  constructor(data: CloudData) {
    this.userID = data.context.userID;
    this.nowDate = new Date().toISOString();
  }
  async addOpenApi(params: IOpenApi.AddOpenApi): Promise<unknown> {
    // 默认添加一个类型为关闭的openapi
    return await collection.add({
      name: params.name,
      remark: params.remark,
      info: params.info,
      state: 'close',
      createDate: this.nowDate,
      updateDate: this.nowDate,
      deleteDate: ''
    });
  }
  async updateOpenApi(params: IOpenApi.UpdateOpenApi): Promise<unknown> {
    return await collection.doc(params.id).update({
      name: params.name,
      remark: params.remark,
      info: params.info,
      updateDate: this.nowDate
    });
  }
  async toggleOpenApiState(params: IOpenApi.ToggleOpenApiState): Promise<unknown> {
    return await collection.doc(params.id).update({
      state: params.state,
      updateDate: this.nowDate
    });
  }
  // 题目列表
  async getQuestionList(params: IOpenApi.GetQuestionList): Promise<unknown> {
    const limit = 10;
    const page: number = params.page || 1;

    const whereParams = {
      state: 'pass'
    };
    // 可选参数
    if (params.areaID) {
      whereParams['areaID'] = params.areaID;
    }
    const data = await questionCollection
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
    const countResult = await questionCollection.where(whereParams).count();
    return {
      list: data.data,
      count: countResult.total
    };
  }
  // 专区列表
  async getQuestionAreaList(): Promise<unknown> {
    const res = await questionAreaCollection.get();
    return {
      list: res.data
    };
  }
  // 标签列表
  async getQuestionTag(): Promise<unknown> {
    const res = await questionTag
      .aggregate()
      .lookup({
        from: 'questionArea',
        localField: 'areaID',
        foreignField: '_id',
        as: 'areaInfo'
      })
      .end();
    return {
      list: res.data
    };
  }
}
