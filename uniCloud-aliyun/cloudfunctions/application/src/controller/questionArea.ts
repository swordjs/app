import * as explain from 'explain';
import questionAreaService from '../service/questionArea';
import * as IQuestionArea from '../../proto/questionArea';
export = class QuestionAreaController extends explain.service {
  private service: questionAreaService;
  constructor(e: ExplainController) {
    super(e);
    this.service = new questionAreaService(this.context);
  }
  /**
   * @name 获取专区列表（HTTP调用）
   * @param IQuestionArea.IGetAreaList
   * @return {*}  {Promise<unknown>}
   * @memberof QuestionAreaController
   */
  async getAreaList(): Promise<unknown> {
    return await this.service.getAreaList(this.event.data as IQuestionArea.IGetAreaList);
  }
  /**
   * @name 添加题目专区
   * @param IQuestionArea.IAddQuestionArea
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/xdytvh#g13V0
   * @memberof QuestionAreaController
   */
  async addQuestionArea(): Promise<unknown> {
    return await this.service.addQuestionArea(this.event.data as IQuestionArea.IAddQuestionArea);
  }
  /**
   * @name 修改题目专区
   * @param IQuestionArea.IUpdateQuestionArea
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/xdytvh#HDXsW
   * @memberof QuestionAreaController
   */
  async updateQuestionArea(): Promise<unknown> {
    return await this.service.updateQuestionArea(this.event.data as IQuestionArea.IUpdateQuestionArea);
  }
  /**
   * @name 删除题目专区
   * @param IQuestionArea.IUpdateQuestionArea
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/xdytvh#tOjkO
   * @memberof QuestionAreaController
   */
  async deleteQuestionArea(): Promise<unknown> {
    return await this.service.deleteQuestionArea(this.event.data as IQuestionArea.IDeleteQuestionArea);
  }
};
