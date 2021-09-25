import * as explain from 'explain';
import questionService from './../service/question';
import * as IQuestion from '../../proto/question';

export = class QuestionController extends explain.service {
  private service: questionService;
  constructor(e: CloudData) {
    super(e);
    this.service = new questionService(this);
  }
  /**
   * @name 添加题目
   * @param IQuestion.AddQuestion
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/fssf4b#g13V0
   * @memberof QuestionController
   */
  async addQuestion(): Promise<unknown> {
    return await this.service.addQuestion(this.event.data as IQuestion.AddQuestion);
  }
  /**
   * @name 修改题目
   * @param IQuestion.UpdateQuestion
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/fssf4b#sl2QT
   * @memberof QuestionController
   */
  async updateQuestion(): Promise<unknown> {
    return await this.service.updateQuestion(this.event.data as IQuestion.UpdateQuestion);
  }
  /**
   * @name 删除题目
   * @param IQuestion.DeleteQuestion
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/fssf4b#iJ8Hr
   * @memberof QuestionController
   */
  async deleteQuestion(): Promise<unknown> {
    return await this.service.deleteQuestion(this.event.data as IQuestion.DeleteQuestion);
  }
  /**
   * @name 审核题目
   * @param IQuestion.ExamineQuestion
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/fssf4b#hIZhf
   * @memberof QuestionController
   */
  async examineQuestion(): Promise<unknown> {
    return await this.service.examineQuestion(this.event.data as IQuestion.ExamineQuestion);
  }
  /**
   * @name 分页获取题目列表
   * @param IQuestion.GetQuestionList
   * @return {*}  {Promise<unknown>}
   * @memberof QuestionController
   */
  async getQuestionList(): Promise<unknown> {
    return await this.service.getQuestionList(this.event.data as IQuestion.GetQuestionList);
  }
  /**
   * @name 浏览题目详情
   * @description（如果没有pageView就默认设置为1）
   * @param IQuestion.AddPageView
   * @return {*}  {Promise<unknown>}
   * @memberof QuestionController
   */
  async addPageView(): Promise<unknown> {
    return await this.service.addPageView(this.event.data as IQuestion.AddPageView);
  }
  /**
   * @name 随机获取题目
   * @param IQuestion.GetSampleQuestionList
   * @return {*}  {Promise<unknown>}
   * @memberof QuestionController
   */
  async getSampleQuestionList(): Promise<unknown> {
    return await this.service.getSampleQuestionList(this.event.data as IQuestion.GetSampleQuestionList);
  }
};
