
const db = uniCloud.database();
// 获取 `user` 集合的引用
const collection = db.collection('testInit');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collectionResultData = collection.add(event);
	//返回数据给客户端
	return collectionResultData
};
