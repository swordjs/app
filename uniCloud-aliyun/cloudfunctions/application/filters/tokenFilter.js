const explain = require("explain");
const uniID = require("uni-id");
module.exports = class tokenFilter extends explain.filter {
	async onActionExecuting() {
		let {
			event,
			context
		} = this;
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
