import * as IArticle from '../../typings/proto/request/article';
const db = uniCloud.database();
const collection = db.collection('sword-article');

export default class ArticleService {
  public userID: string;
  public nowDate: string;
  constructor(data: CloudData) {
    this.userID = data.context.userID;
    this.nowDate = new Date().toISOString();
  }
  async addArticle(params: IArticle.AddArticle): Promise<unknown> {
    // 调用钉钉通知函数
    uniCloud.callFunction({
      name: 'dingtalk-robot',
      data: {
        content: `有一篇新的文章待审核：《${params.title}》`
      }
    });
    // 入库
    return await collection.add({
      title: params.title,
      content: params.content,
      tagID: params.tagID,
      desc: params.desc,
      userID: this.userID,
      state: 'onlist',
      createDate: this.nowDate,
      updateDate: this.nowDate,
      deleteDate: ''
    });
  }
  async updateArticle(params: IArticle.UpdateArticle): Promise<unknown> {
    return await collection.doc(params.id).update({
      title: params.title,
      content: params.content,
      tagID: params.tagID,
      updateDate: this.nowDate
    });
  }
  async auditArticle(params: IArticle.AuditArticle): Promise<unknown> {
    const updateParams: Omit<IArticle.AuditArticle, 'id'> = {
      state: params.state
    };
    // 判断state如果是拒绝，就入库填写原因
    if (params.state === 'reject') {
      updateParams['rejectReason'] = params.rejectReason || '原因暂无';
    }
    return collection.doc(params.id).update(updateParams);
  }
}
