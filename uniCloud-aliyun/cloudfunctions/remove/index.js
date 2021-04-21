'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
const collection = db.collection("uni-id-users");
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	await collection.update({
		collect: dbCmd.remove()
	})
	//返回数据给客户端
	return event
};
