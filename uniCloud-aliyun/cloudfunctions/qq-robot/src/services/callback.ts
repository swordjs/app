const explain = require('explain');
const createConfig = require('uni-config-center');
const robotConfig = createConfig({
  pluginId: 'qq-robot'
}) as {
  config: (string: 'myqq-api') => string;
};
module.exports = class CallBack extends explain.service {
  async main() {
    uniCloud.logger.log(this);
  }
};

export {};
