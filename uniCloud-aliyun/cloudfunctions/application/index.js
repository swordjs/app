// application -> index.js
const explain = require('explain');
const fs = require('fs');
const path = require('path');
const ParamsValidate = require('tsbuffer-params-validate');
const schemas = require('./schemas/schemas.json');

exports.main = async (event, context) =>
  explain.run({
    event,
    context,
    startup: (app) => {
      app.init({
        baseDir: path.resolve(__dirname, 'dist'),
        serviceDir: '/controller/'
      });
      app.filter.add([
        {
          filter: require('./filters/tokenFilter'),
          ignore: [
            {
              service: 'user',
              actions: ['checkToken', 'loginByWechat', 'getUserContentByID', 'sendSms', 'loginByQQ', 'loginBySms']
            },
            {
              service: 'question',
              actions: ['addPageView']
            },
            {
              service: 'search',
              actions: ['addSeachLog']
            }
          ]
        }
      ]);

      // 将dist/router所有内容进行加载
      const routeList = fs.readdirSync(path.resolve(__dirname, 'dist/router'));
      const allRoute = routeList.map((r) => require(path.resolve(__dirname, 'dist/router', r)));
      app.route.add(allRoute);

      // 兼容云函数测试用例调用以及http外部调用的event处理中间件
      app.use(async ({ context, next }) => {
        // 如果云函数是http请求
        if (context.SOURCE === 'http') {
          // 根据url解析service以及route
          const paths = context.body.path.split('/'); // 根据请求的url解析service和action
          // 赋值成功之后，交由下一个中间件去处理event
          event.service = paths[2];
          event.action = paths[3];
          event.data = JSON.parse(event.body) || {};
        }
        await next();
      });
      // 添加校验参数中间件
      app.use(async ({ explain: _explain, next }) => {
        const validateResult = await ParamsValidate({
          service: event.service,
          action: event.action,
          params: event.data,
          schemas
        });
        if (!validateResult.isSucc) {
          // 将响应信息改为异常信息
          _explain.response.body = {
            message: validateResult.error
          };
        } else {
          await next();
        }
      });
    }
  });
