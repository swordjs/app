/**
 * github项目：https://github.com/haizlin/fe-interview
 * 名称：前端知识每日3+1
 * 所属专区：前端
 */
const http = require("http");
const Config = require("./config.json");
// 云函数获取数据库的引用
const db = uniCloud.database();
const collection = db.collection('question');
exports.main = function() {
	return new Promise(async (resolve, reject) => {
		const webDevelope = Config["webDevelope"];
		// 获取今日题库的API
		const toDayAPI =
			"http://api.h-camel.com/api?mod=interview&ctr=issues&act=today";
		// 对应发布者的用户ID
		const publishUserID = "5ff5bdd5770c7900015b1f80";
		http
			.get(toDayAPI, (resp) => {
				const {
					statusCode
				} = resp;
				const contentType = resp.headers["content-type"];
				let error;
				if (statusCode !== 200) {
					error = new Error("请求失败\n" + `状态码: ${statusCode}`);
				} else if (!/^application\/json/.test(contentType)) {
					error = new Error("与期望的application-json不符合");
				}
				if (error) {
					console.error(error.message);
					resp.resume(); // 消费相应的数据释放内存
					reject(error);
				}
				let rawData = "";
				resp.on("data", (chunk) => (rawData += chunk));
				resp.on("end", async () => {
					try {
						const parsedData = JSON.parse(rawData);
						if (parsedData.result.today) {
							let questions = parsedData.result.today;
							let arr = [];
							// 获取当前时间
							const nowDate = new Date().toISOString();
							for (let key in questions) {
								// 不添加软技能题
								const labels = ["js", "css", "html"];
								if (labels.includes(questions[key].label)) {
									arr.push({
										title: questions[key].title,
										areaID: webDevelope.areaID, // 前端
										publishUserID, // 对应用户
										content: questions[key].body,
										questionExplanation: [],
										tagID: webDevelope.tag[questions[key].label],
										createDate: nowDate,
										updateDate: nowDate,
										deleteDate: ""
									});
								}
							}
							resolve(await storeQuetionInDatabase(arr)); // 调用入库操作 
						}
					} catch (e) {
						console.error(e.message);
						reject(e);
					}
				});
			})
			.on("error", (e) => {
				console.error("错误", e);
				reject(e);
			});
	})
};

/**
 * 
 * @param {Array<Object>} questions 提取出来的题目列表
 */
async function storeQuetionInDatabase(questions) {
	const result = await collection.add(questions)
	return {
		success: true,
		...result
	}
	
}
