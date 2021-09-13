import explain from 'explain';
import articleService from '../service/article';

module.exports = class ArticleController extends explain.service {
  private service: articleService;
  constructor() {
    super();
    this.service = new articleService(this.context);
  }
  // 添加文章
  async addArticle() {
    return await this.service.addArticle();
  }
  // 修改文章
  async updateArticle() {
    return handleMustRequireParam(
      [
        {
          key: 'id',
          value: '文章id'
        },
        {
          key: 'content',
          value: '内容'
        },
        {
          key: 'title',
          value: '标题'
        },
        {
          key: 'tagID',
          value: '标签'
        }
      ],
      this.event.params
    )
      .then(async () => await this.handler('updateArticle'))
      .catch((err) => err);
  }
  // 审核文章
  async auditArticle() {
    return handleMustRequireParam(
      [
        {
          key: 'id',
          value: '文章id'
        },
        {
          key: 'state',
          value: '状态'
        }
      ],
      this.event.params
    )
      .then(async () => await this.handler('auditArticle'))
      .catch((err) => err);
  }
};

export {};
