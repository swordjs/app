'use strict';
const ChatBot = require('dingtalk-robot-sender');
exports.main = (event, context) => {
	return new Promise(async resolve => {
		//event为客户端上传的参数
		const robot = new ChatBot({
			webhook: "https://oapi.dingtalk.com/robot/send?access_token=099cc8980106a0b6981c6cf58cf91de268563c599a6ee9094b36d94f3eb0c636",
		});
		let textContent = {
			"msgtype": "text",
			"text": {
				"content": event.content
			}
		}
		robot.send(textContent)
			.then((res) => {
				// TODO
				resolve(res);
			});
	})
};
