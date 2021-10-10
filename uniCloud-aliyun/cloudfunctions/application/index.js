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

      // 根据url解析service以及route
      const paths = context.body.path.split('/'); // 根据请求的url解析service和action

      // 兼容云函数测试用例调用以及http外部调用的数据处理中间件
      app.use(async ({ context, next }) => {
        // 如果云函数是http请求
        if (context.SOURCE === 'http') {
          // 赋值成功之后，交由下一个中间件去处理event
          event.service = paths[2];
          // 处理action
          if (paths[3]) {
            event.action = paths[3];
          } else {
            // 有些场景不会传递action，而是通过method来查询对应的action
            // 查看当前的httpMethods，然后去云函数对应的service的routes去查询符合条件的action
            const _map = {
              GET: ['get'],
              POST: ['post', 'create', 'add', 'insert'],
              PUT: ['put', 'update'],
              DELETE: ['delete', 'remove']
            };
            // 获取对应service符合条件（没有route和httpMethod属性）的routes
            const currentRoutes = allRoute.find((f) => f.service === event.service).routes.filter((c) => !(c.route && c.httpMethod));
            // 获取符合条件的route，并且提取其中的action
            const match = new RegExp(`^${_map[event.httpMethod].map((m) => `(${m})`).join('|')}`);
            const result = currentRoutes.find((c) => {
              return match.test(c.action);
            });
            event.action = result.action;
          }
          // 判断请求是否是get请求，如果是get请求，则就把queryStringParameters进行转换
          if (event.httpMethod === 'GET') {
            event.data = event.queryStringParameters;
          } else {
            event.data = JSON.parse(event.body) || {};
          }
          // 提取自定义请求头中的platform，赋值给context
          context.PLATFORM = context.body.headers['sword-platform'];
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
