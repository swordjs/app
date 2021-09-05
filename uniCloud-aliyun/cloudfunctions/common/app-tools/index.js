/**
 * @description APP返回错误信息
 * @param {string} value
 */
function appErrorMessage(value) {
  let errData = {
    code: 1,
    msg: '未知错误'
  };
  if (value !== '') {
    errData.msg = value;
  }
  return errData;
}
/**
 * @description 处理云函数对必传参数的校验
 * @param {Object: {key: string, value: string, must: boolean}} requireParamData
 * @param {Object} event 传入对象
 */
function handleMustRequireParam(requireParamData, event) {
  return new Promise((resolve, reject) => {
    for (let i in requireParamData) {
      const isHasOwnProperty = event.hasOwnProperty(requireParamData[i].key); // 是否传递
      const isEmpty = event[requireParamData[i].key] === ''; // 是否为空
      if (!isHasOwnProperty || isEmpty) {
        reject(appErrorMessage(`${requireParamData[i].value}为必填,不可不传或为空`));
      }
    }
    resolve();
  });
}
/**
 * @param {Object} data 需要返回给client的data数据
 */
function handleDataTemplate(data) {
  return {
    code: 0,
    data
  };
}

module.exports = {
  appErrorMessage,
  handleMustRequireParam,
  handleDataTemplate
};
