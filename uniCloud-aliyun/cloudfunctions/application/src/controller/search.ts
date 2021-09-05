const explain = require('explain');
const searchService = require('../service/search');
const { handleMustRequireParam } = require('app-tools');
module.exports = class QuestionTag extends explain.service {
  async handler(methodName: string) {
    const service = new searchService({
      context: this.context
    });
    return await service[methodName](this.event.params);
  }
  // 删除搜索记录
  // 增加搜索记录
  addSeachLog() {
    return handleMustRequireParam(
      [
        {
          key: 'content',
          value: '搜索内容'
        }
      ],
      this.event.params
    ).then(async () => {
      return await this.handler('addSeachLog');
    });
  }
};

export {};
