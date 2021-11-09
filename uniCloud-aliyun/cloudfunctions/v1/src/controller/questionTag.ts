import * as explain from 'explain';
import questionTagService from '../service/questionTag';
import * as IQuestionTag from '../../proto/questionTag';

export class QuestionTagController extends explain.service {
  private service: questionTagService;
  constructor(e: CloudData) {
    super(e);
    this.service = new questionTagService(this);
  }
  /**
   * @name 获取专区列表（HTTP调用）
   * @param IQuestionTag.GetTagList
   * @return {*}  {Promise<unknown>}
   * @memberof QuestionTagController
   */
  async getTagList(): Promise<unknown> {
    return await this.service.getTagList(this.event.data as IQuestionTag.GetTagList);
  }
  /**
   * @name 添加Tag
   * @param IQuestionTag.AddQuestionTag
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/vxylvr#g13V0
   * @memberof QuestionTagController
   */
  async addQuestionTag(): Promise<unknown> {
    return await this.service.addQuestionTag(this.event.data as IQuestionTag.AddQuestionTag);
  }
  /**
   * @name 修改Tag
   * @param IQuestionTag.UpdateQuestionTag
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/vxylvr#qLNHs
   * @memberof QuestionTagController
   */
  async updateQuestionTag(): Promise<unknown> {
    return await this.service.updateQuestionTag(this.event.data as IQuestionTag.UpdateQuestionTag);
  }
  /**
   * @name 删除tag
   * @param IQuestionTag.DeleteQuestionTag
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/vxylvr#VYwM2
   * @memberof QuestionTagController
   */
  async deleteQuestionTag(): Promise<unknown> {
    return await this.service.deleteQuestionTag(this.event.data as IQuestionTag.DeleteQuestionTag);
  }
}
