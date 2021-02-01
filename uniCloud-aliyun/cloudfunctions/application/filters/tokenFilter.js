const explain = require("explain");
const uniID = require("uni-id");
module.exports = class tokenFilter extends explain.filter {
	async onActionExecuting() {
		let {
			event,
			context
		} = this;
		// 判断context判断请求入口是http还是云函数调用
		if(context.args.hasOwnProperty("headers") && context.args.headers.hasOwnProperty("http-request-serverless")){
			if(context.args.headers["sword-token"] !== ""){
				event.uniIdToken = context.args.headers["sword-token"];
				const requestParams = context.args.params;
				event.params = JSON.parse(requestParams.params);
			}
		}
		// 判断context中是否存在token
		if(!event.hasOwnProperty("uniIdToken")){
			context.response = {
                code: 401,
                message: "token不存在"
            }
		}else {
			// 检查token合法性和过期时间
			const checkData = await uniID.checkToken(event.uniIdToken);
			// token校验不合法
			if(checkData.code !== 0){
				context.response = {
					...checkData
				}
			}else{
				this.event.userID = checkData.uid;
			}
		}
	}
}
