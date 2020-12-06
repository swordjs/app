// application -> index.js

const explain = require("explain");

exports.main = async (event, context) => {
	return explain.run(event, context, (config) => {

		config.init({
			baseDir: __dirname
		});

		// config.route.setRoot({
		// 	get: {
		// 		service: "home",
		// 		action: "index"
		// 	},
		// 	post: {
		// 		service: "values",
		// 		action: "postValueAsync"
		// 	}
		// });
		config.route.add([{
			route: "api/user",
			service: "user",
			routes: [{
				action: "addUserByPhone"
			},{
				route: "postLoginByPhone",
				httpMethod: "POST",
				action: "postLoginByPhone"
			},{
				route: "userLogout/{token}",
				httpMethod: "GET",
				action: "userLogout"
			},{
				route: "checkToken/{token}",
				httpMethod: "GET",
				action: "checkToken"
			},{
				action: "updateUserInfo"
			}]
		}]);
	});
}
