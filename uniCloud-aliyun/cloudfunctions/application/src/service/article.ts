const db = uniCloud.database();
const collection = db.collection("article");

module.exports = class ArticleService {
  public userID: string;
  public nowDate: string;
  constructor(data) {
    this.userID = data.context.userID;
    this.nowDate = new Date().toISOString();
  }
  async addArticle(params: {
    title: string;
    content: string;
    tagID: string[];
  }) {
    // 调用钉钉通知函数
    uniCloud.callFunction({
      name: "dingtalk-robot",
      data: {
        content: `有一篇新的文章待审核：《${params.title}》`,
      },
    });
    // 入库
    return await collection.add({
      title: params.title,
      content: params.content,
      tagID: params.tagID,
      userID: this.userID,
      state: "onlist",
      createDate: this.nowDate,
      updateDate: this.nowDate,
      deleteDate: ""
    });
  }
  async auditArticle(params: { id: string; state: string; rejectReason?: string }) {
    const updateParams = {
      state: params.state,
    };
    // 判断state如果是拒绝，就入库填写原因
    if (params.state === "reject") {
      updateParams["rejectReason"] = params.rejectReason || "原因暂无";
    }
    return collection.doc(params.id).update(updateParams);
  }
};
