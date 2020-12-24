/**
 * @description APP返回错误信息
 * @param {string} value
 */
function appErrorMessage(value) {
	let errData = {
		code: 1,
		msg: "未知错误"
	}
	if (value !== "") {
		errData.msg = value;
	}
	return errData;
}
/**
 * @description 处理云函数对必传参数的校验
 * @param {Object: {key: string, value: string}} requireParamData
 * @param {Object} event 传入对象
 */
function handleMustRequireParam(requireParamData, event) {
	return new Promise((resolve, reject) => {
		for (let i in requireParamData) {
			if (!event.hasOwnProperty(requireParamData[i].key) || event[requireParamData[i].key] === "") {
				reject(appErrorMessage(`${requireParamData[i].value}为必填,不可不填或为空`));
			}
		}
		resolve()
	})
}


module.exports = {
	appErrorMessage,
	handleMustRequireParam
}
