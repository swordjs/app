
const db = uniCloud.database();
// 获取 `context` 集合的引用
const collection = db.collection('testInit');
const functionSet = {
	addTest
}

exports.main = async (event, context) => {
	const method = event.$method;
	if(!functionSet.hasOwnProperty(method)){
		return {
			message: "方法名不存在"
		}
	}
	//event为客户端上传的参数
	// 删除event中的$method
	delete event.$method;
	return functionSet[method](event, context);
};


function addTest(event, context){
	const collectionResultData = collection.add(event);
	return collectionResultData;
}