// application -> index.js
const explain = require("explain");
const path = require("path");
// 引入路由
const route = require("./router/router");
exports.main = async (event, context) => {
  return explain.run(event, context, (config) => {
    config.init({
      baseDir: path.resolve(__dirname, "dist"),
      serviceDir: "/controller/",
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
              "getUserContentByID",
              "sendSms",
              "loginByQQ",
              "loginBySms",
            ],
          },
          {
            service: "question",
            actions: ["addPageView"],
          },
          {
            service: "search",
            actions: ["addSeachLog"],
          },
        ],
      },
    ]);
    config.route.add(route);
  });
};
