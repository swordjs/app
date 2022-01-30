import * as ICertificationApplyOrder from '../../typings/proto/request/certificationApplyOrder';
const db = uniCloud.database();
const collection = db.collection('sword-certification-order');
export default class CertificationApplyOrder {
  public userID: string;
  public nowDate: string;
  constructor(data: CloudData) {
    this.userID = data.context.userID;
    this.nowDate = new Date().toISOString();
  }
  async getCertificationApplyOrder(params: ICertificationApplyOrder.GetCertificationApplyOrder): Promise<unknown> {
    const { limit, page, state } = params;
    const whereParams = {
      state
    };
    const data = await collection
      .where(whereParams)
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({
        createDate: -1
      })
      .filed(`state, userID, content, createDate`)
      .get();
    const countResult = await collection.where(whereParams).count();
    return {
      list: data.data,
      count: countResult.total
    };
  }
  async addCertificationApplyOrder(params: ICertificationApplyOrder.AddCertificationApplyOrder): Promise<unknown> {
    // 调用钉钉通知函数
    uniCloud.callFunction({
      name: 'dingtalk-robot',
      data: {
        content: `有一个新的出题官认证申请，申请时间为${this.nowDate}\n申请内容为: ${JSON.stringify(params.content)}\n请及时查看，尤其是群主，你别忘记了！`
      }
    });
    return await collection.add({
      state: 'pending',
      userID: this.userID,
      content: params.content,
      createDate: this.nowDate,
      updateDate: this.nowDate,
      deleteDate: ''
    });
  }
  async updateCertificationApplyOrder(params: ICertificationApplyOrder.UpdateCertificationApplyOrder): Promise<unknown> {
    return await collection.doc(params._id).update({
      content: params.content,
      updateDate: this.nowDate
    });
  }
  async updateCertificationApplyOrderState(params: ICertificationApplyOrder.UpdateCertificationApplyOrderState): Promise<unknown> {
    return await collection.doc(params._id).update({
      state: params.state,
      updateDate: this.nowDate
    });
  }
}
