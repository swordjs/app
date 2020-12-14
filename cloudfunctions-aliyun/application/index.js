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
            // 过滤器忽略所指定的service和它的action
            service: "user",
            actions: ["addUserByPhone", "postLoginByPhone", "checkToken", "loginByWechat"], // 不写actions则表示忽略该service中的所有action
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
            action: "updateUserInfo",
          },
        ],
      },
    ]);
  });
};
