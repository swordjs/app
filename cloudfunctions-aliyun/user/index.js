'use strict';
// 公告模块
const uniID = require('uni-id');
// 工具函数
const {
	appErrorMessage,
	handleMustRequireParam
} = require("app-tools");


// 注册用户根据手机号
function addUserByPhone(event, context) {
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
			return await uniID.register({
				username,
				password
			});
		}
	}).catch(err => {
		return err;
	});
}

// 用户登录根据手机号
function getLoginByPhone(event, context) {
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
			return await uniID.login({
				username,
				password
			});
		}
	}).catch(err => {
		return err;
	});
}

// 用户登出, 登出需要客户端删除持久性缓存
async function userLogout(event, context) {
	if(!event.hasOwnProperty("token")){
		return appErrorMessage("token为必填");
	}else {
		return await uniID.logout(event.token);
	}
}

// 校验Token是否有效
async function checkToken(event, context){
	if(!event.hasOwnProperty("token")){
		return appErrorMessage("token为必填");
	}else {
		return await uniID.checkToken(event.token);
	}
}

const functionSet = {
	addUserByPhone,
	getLoginByPhone,
	userLogout,
	checkToken
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
