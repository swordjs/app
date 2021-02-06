// application -> index.js

const explain = require("explain");
// 引入路由
const route = require("./router/router")
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
        ],
      },
    ]);
    config.route.add(route);
  });
};
