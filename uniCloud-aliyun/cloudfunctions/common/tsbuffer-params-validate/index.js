const { TSBufferValidator } = require('tsbuffer-validator');

module.exports = function (event) {
  // schemas 由ts的proto生成的schemas
  // params 参数
  // service 路由url中的service
  // action 具体的方法
  const { schemas, params, service, action } = event;
  const validator = new TSBufferValidator(schemas);
  let vRes = validator.validate(params, `${service}/${action}`);
  return vRes;
};
