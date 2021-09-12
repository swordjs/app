// application -> index.js
const explain = require('explain');
const path = require('path');
const router = require('./router/router');
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
      app.route.add(router);
      // 添加校验参数中间件
      app.use(async ({ event }) => {
        const validateResult = await ParamsValidate({
          ...event,
          params: event.data,
          schemas
        });
        if (!validateResult.isSucc) {
          // 将响应信息改为异常信息
          explain.response.body = {
            message: validateResult.error
          };
        }
      });
    }
  });
