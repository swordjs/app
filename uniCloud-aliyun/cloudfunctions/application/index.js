// application -> index.js

const explain = require("explain");

exports.main = async (event, context) => {
  return explain.run(event, context, (config) => {
    config.init({
      baseDir: __dirname,
      serviceDir: "/dist/",
    });

    config.filter.add([
      {
        filter: require("./filters/tokenFilter"),
        ignore: [
          {
            service: "user",
            actions: [
              "addUserByPhone",
              "postLoginByPhone",
              "checkToken",
              "loginByWechat",
            ],
          },
          {
            service: "questionExplanation",
            actions: ["getRecommendQuestionList"],
          },
        ],
      },
    ]);
    config.route.add([
      {
        route: "api/user",
        service: "user",
        routes: [
          {
            action: "addUserByPhone",
          },
          {
            route: "loginByWechat/{code}",
            httpMethod: "POST",
            action: "loginByWechat",
          },
          {
            route: "postLoginByPhone",
            httpMethod: "POST",
            action: "postLoginByPhone",
          },
          {
            route: "userLogout/{token}",
            httpMethod: "GET",
            action: "userLogout",
          },
          {
            route: "checkToken/{token}",
            httpMethod: "GET",
            action: "checkToken",
          },
          {
            route: "addFollowers/{id}",
            httpMethod: "POST",
            action: "addFollowers",
          },
          {
            route: "deleteFollowers/{id}",
            httpMethod: "POST",
            action: "deleteFollowers",
          },
          {
            action: "updateUserInfo",
          },
		  {
			route: "checkFollowers",
			action: "checkFollowers",
			httpMethod: "PUT",
		  }
        ],
      },
      {
        route: "api/questionArea",
        service: "questionArea",
        routes: [
          {
            action: "addQuestionArea",
          },
          {
            action: "updateQuestionArea",
          },
          {
            action: "deleteQuestionArea",
          },
        ],
      },
      {
        route: "api/questionTag",
        service: "questionTag",
        routes: [
          {
            action: "addQuestionTag",
          },
          {
            action: "updateQuestionTag",
          },
          {
            action: "deleteQuestionTag",
          },
        ],
      },
    ]);
  });
};
