import * as explain from 'explain';
import articleService from '../service/article';
import * as IArticle from '../../proto/article';

export = class ArticleController extends explain.service {
  private service: articleService;
  constructor(e: ExplainController) {
    super(e);
    this.service = new articleService(this.context);
  }
  /**
   * @name 添加/发布文章
   * @param IArticle.AddArticle
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/kif3lf#g13V0
   * @memberof ArticleController
   */
  async addArticle(): Promise<unknown> {
    return await this.service.addArticle(this.event.data as IArticle.AddArticle);
  }
  /**
   * @name 修改文章
   * @param IArticle.UpdateArticle
   * @return {*}  {Promise<unknown>}
   * @memberof ArticleController
   */
  async updateArticle(): Promise<unknown> {
    return await this.service.updateArticle(this.event.data as IArticle.UpdateArticle);
  }
  /**
   * @name 审核文章
   * @param IArticle.AuditArticle
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/kif3lf#zJelt
   * @memberof ArticleController
   */
  async auditArticle(): Promise<unknown> {
    return await this.service.auditArticle(this.event.data as IArticle.AuditArticle);
  }
};
