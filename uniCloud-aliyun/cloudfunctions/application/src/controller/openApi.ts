const explain = require('explain');
const openApiService = require('../service/openApi');
const { handleMustRequireParam } = require('app-tools');
module.exports = class OpenApiController extends explain.service {
  async handler(methodName: string) {
    const service = new openApiService({
      context: this.context
    });
    return await service[methodName](this.event.params);
  }
  addOpenApi() {
    return handleMustRequireParam(
      [
        {
          key: 'name',
          value: 'api名称'
        },
        {
          key: 'remark',
          value: '备注'
        },
        {
          key: 'info',
          value: '内容'
        }
      ],
      this.event.params
    )
      .then(async () => await this.handler('addOpenApi'))
      .catch((err) => err);
  }
  updateOpenApi() {
    return handleMustRequireParam(
      [
        {
          key: 'id',
          value: 'api id'
        },
        {
          key: 'name',
          value: 'api名称'
        },
        {
          key: 'remark',
          value: '备注'
        },
        {
          key: 'info',
          value: '内容'
        }
      ],
      this.event.params
    )
      .then(async () => await this.handler('updateOpenApi'))
      .catch((err) => err);
  }
  toggleOpenApiState() {
    return handleMustRequireParam(
      [
        {
          key: 'id',
          value: 'api id'
        },
        {
          key: 'state',
          value: '状态'
        }
      ],
      this.event.params
    )
      .then(async () => await this.handler('toggleOpenApiState'))
      .catch((err) => err);
  }
  getQuestionList() {
    return handleMustRequireParam(
      [
        {
          key: 'page',
          value: 'page'
        }
      ],
      this.event.params
    )
      .then(async () => await this.handler('getQuestionList'))
      .catch((err) => err);
  }
  async getQuestionAreaList() {
    return await this.handler('getQuestionAreaList');
  }
  async getQuestionTag() {
    return await this.handler('getQuestionTag');
  }
};

export {};
