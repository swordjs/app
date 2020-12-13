const explain = require("explain");
const headerConfig = require("../config/header.js");
module.exports = class tokenFilter extends explain.filter {

	async onActionExecuting() {
		let {
			context
		} = this;
		// 判断context中是否
	}
}
