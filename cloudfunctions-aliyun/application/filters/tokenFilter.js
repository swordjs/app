const explain = require("explain");
const headerConfig = require("../config/header.js");
module.exports = class tokenFilter extends explain.filter {

	async onActionExecuting() {
		let {
			context
		} = this;
		console.log(context);
		
	}

}
