'use strict';
// 公告模块
const uniID = require('uni-id');
// 工具函数
const {
	appErrorMessage,
	handleMustRequireParam
} = require("app-tools");
const functionSet = {
	addUserByPhone
}

// 注册用户根据手机号
function addUserByPhone(event, context) {
	// 判断是否传入必填参数
	return handleMustRequireParam([{
		key: "username",
		value: "用户名"
	}, {
		key: "password",
		value: "密码"
	}], event).then(async () => {
		const {
			username,
			password
		} = event;
		if (!(/^1[3456789]\d{9}$/.test(username))) {
			return appErrorMessage("用户名格式不正确")
		} else if (password === "" || password.length < 6) {
			return appErrorMessage("密码格式不正确");
		} else {
			// 校验手机号
			const res = await uniID.register({
				username,
				password
			});
			return res;
		}
	}).catch(err => {
		return err;
	});
}


exports.main = async (event, context) => {
	const method = event.$method;
	if (!functionSet.hasOwnProperty(method)) {
		return appErrorMessage(`方法名不存在`)
	}
	//event为客户端上传的参数
	// 删除event中的$method
	delete event.$method;
	return functionSet[method](event, context);
};
