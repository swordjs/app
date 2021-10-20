import * as explain from 'explain';
import questionExplanationService from '../service/questionExplanation';
import * as IQuestionExplanation from '../../proto/questionExplanation';

export = class QuestionExplanationController extends explain.service {
  private service: questionExplanationService;
  constructor(e: CloudData) {
    super(e);
    this.service = new questionExplanationService(this);
  }
  /**
   * @name 添加题解
   * @param IQuestionExplanation.AddQuestionExplanation
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/xsd6wg#g13V0
   * @memberof QuestionExplanationController
   */
  async addQuestionExplanation(): Promise<unknown> {
    return await this.service.addQuestionExplanation(this.event.data as IQuestionExplanation.AddQuestionExplanation);
  }
  /**
   * @name 修改题解
   * @param IQuestionExplanation.UpdateQuestionExplanation
   * @return {*}  {Promise<unknown>}
   * @memberof QuestionExplanationController
   */
  async updateQuestionExplanation(): Promise<unknown> {
    return await this.service.addQuestionExplanation(this.event.data as IQuestionExplanation.UpdateQuestionExplanation);
  }
  /**
   * @name 采纳/取消采纳题解
   * @param IQuestionExplanation.AdoptionQuestionExplanation
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/xsd6wg#h2Ix9
   * @memberof QuestionExplanationController
   */
  async adoptionQuestionExplanation(): Promise<unknown> {
    return await this.service.adoptionQuestionExplanation(this.event.data as IQuestionExplanation.AdoptionQuestionExplanation);
  }
  /**
   * @name 收藏/取消收藏题解
   * @param IQuestionExplanation.CollectQuestionExplanation
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/xsd6wg#z7Okn
   * @memberof QuestionExplanationController
   */
  async collectQuestionExplanation(): Promise<unknown> {
    return await this.service.collectQuestionExplanation(this.event.data as IQuestionExplanation.CollectQuestionExplanation);
  }
};
