import * as explain from 'explain';
import openApiService from '../service/openApi';
import * as IOpenApi from '../../proto/openapi';
export = class OpenApiController extends explain.service {
  private service: openApiService;
  constructor(e: ExplainController) {
    super(e);
    this.service = new openApiService(this.context);
  }
  /**
   * @name 添加openapi
   * @param IOpenApi.AddOpenApi
   * @return {*} {Promise<unknown>}
   * @memberof OpenApiController
   */
  async addOpenApi(): Promise<unknown> {
    return await this.service.addOpenApi(this.event.data as IOpenApi.AddOpenApi);
  }
  /**
   * @name 修改openapi
   * @param IOpenApi.AddOpenApi
   * @return {*} {Promise<unknown>}
   * @memberof OpenApiController
   */
  async updateOpenApi(): Promise<unknown> {
    return await this.service.updateOpenApi(this.event.data as IOpenApi.UpdateOpenApi);
  }
  /**
   * @name 开启/关闭openapi的状态
   * @param IOpenApi.ToggleOpenApiState
   * @return {*} {Promise<unknown>}
   * @memberof OpenApiController
   */
  async toggleOpenApiState(): Promise<unknown> {
    return await this.service.toggleOpenApiState(this.event.data as IOpenApi.ToggleOpenApiState);
  }
  /**
   * @name 获取题目列表
   * @param IOpenApi.GetQuestionList
   * @return {*} {Promise<unknown>}
   * @memberof OpenApiController
   */
  async getQuestionList(): Promise<unknown> {
    return await this.service.getQuestionList(this.event.data as IOpenApi.GetQuestionList);
  }
  /**
   * @name 获取专区列表
   * @return {*} {Promise<unknown>}
   * @memberof OpenApiController
   */
  async getQuestionAreaList(): Promise<unknown> {
    return await this.service.getQuestionAreaList();
  }
  /**
   * @name 获取标签列表
   * @return {*} {Promise<unknown>}
   * @memberof OpenApiController
   */
  async getQuestionTag(): Promise<unknown> {
    return await this.service.getQuestionTag();
  }
};
