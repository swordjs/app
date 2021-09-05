const explain = require('explain');
const commonService = require('../service/common');
module.exports = class CommonController extends explain.service {
  // 核心处理服务方法
  async handler(methodName: string) {
    const service = new commonService({
      event: this.event
    });
    return await service[methodName](this.event.params);
  }
};

export {};
