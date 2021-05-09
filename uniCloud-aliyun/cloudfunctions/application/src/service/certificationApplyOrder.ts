namespace CertificationApplyOrderService {
  const db = uniCloud.database();
  const dbCmd = db.command;
  const collection = db.collection("certificationApplyOrder");
  interface ICertificationData {
    context: {
      userID: string;
    };
  }
  interface IAddCertificationParams {
    content: object;
  }
  interface IUpdateCertificationApplyOrder {
    content: object;
    _id: string;
  }
  module.exports = class CertificationApplyOrder {
    public userID: string;
    public nowDate: string;
    constructor(data: ICertificationData) {
      this.userID = data.context.userID;
      this.nowDate = new Date().toISOString();
    }
    async addCertificationApplyOrder(params: IAddCertificationParams) {
      // 调用钉钉通知函数
      uniCloud.callFunction({
        name: "dingtalk-robot",
        data: { content: `有一个新的出题官认证申请，申请时间为${this.nowDate}\n申请内容为: ${JSON.stringify(params.content)}\n请及时查看，尤其是群主，你别忘记了！` },
      });
      return await collection.add({
        state: "pending",
        userID: this.userID,
        content: params.content,
        createTime: this.nowDate,
        updateTime: this.nowDate,
        deleteTime: "",
      });
    }
    async updateCertificationApplyOrder(
      params: IUpdateCertificationApplyOrder
    ) {
      return await collection.doc(params._id).update({
        content: params.content,
        updateTime: this.nowDate,
      });
    }
    async updateCertificationApplyOrderState(params: {
      _id: string;
      state: string;
    }) {
      return await collection.doc(params._id).update({
        state: params.state,
        updateTime: this.nowDate,
      });
    }
  };
}
