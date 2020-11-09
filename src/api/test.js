const db = uniCloud.database();
const databaseName = "testInit";

// 获取测试数据列表
export function getTestList(){
	return new Promise(resolve => {
		db.collection(databaseName)
		  .get()
		  .then((res)=>{
		    // res 为数据库查询结果
			resolve(res);
		  }).catch((err)=>{
		    // err.message 错误信息
		    // err.code 错误码
		  })
	})
	  
}