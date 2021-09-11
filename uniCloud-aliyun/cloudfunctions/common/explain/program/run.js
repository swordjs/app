'use strict';

const middleware = require('./middleware');

module.exports = async ({ event, context, startup }) => {
  // 构建explain对象
  let explain = {
    // 模式：路由模式 route/匹配模式 match
    mode: '',
    // 基础配置
    config: {},
    // 请求
    request: {
      service: '', // 匹配到的service
      action: '', // 匹配到的action
      data: {}, // 客户端传入的参数
      isHttp: false, // 是否是HTTP请求
      route: undefined, // 客户端传入的路由，只有当mode为route时该属性才有值
      routeTemplate: undefined, // 成功匹配的路由模板，只有当mode为route时该属性才有值
      httpMethod: undefined // HTTP Method，只有当mode为route时该属性才有值
    },
    // 响应
    response: {
      mpserverlessComposedResponse: true, // 使用阿里云返回集成响应是需要此字段为true
      statusCode: 200,
      headers: {
        'content-type': (event.headers && event.headers['content-type']) || 'application/json' // 默认响应json格式数据
      },
      body: undefined
    },
    // 异常
    exception: undefined,
    // 路由
    routes: [],
    // 中间件
    middlewares: [],
    // 过滤器
    filters: [],
    /**
     * 扩展方法，在服务中引入并使用其他服务
     */
    useService: (obj) => {
      return new obj({
        event,
        context,
        explain
      });
    }
  };

  // 应用属性
  let app = {
    /**
     * 初始化
     */
    init: ({
      baseDir = '',
      serviceDir = '/services/',
      serviceKey = 'service',
      actionKey = 'action',
      dataKey = 'data',
      enableMatchMode = true,
      matchIgnore = []
    }) => {
      explain.config.baseDir = baseDir;
      explain.config.serviceDir = serviceDir;
      explain.config.serviceKey = serviceKey;
      explain.config.actionKey = actionKey;
      explain.config.dataKey = dataKey;
      explain.config.enableMatchMode = enableMatchMode;
      explain.config.matchIgnore = matchIgnore;
    },
    /**
     * 添加中间件
     */
    use: (middleware) => {
      explain.middlewares.push(middleware);
    },
    route: {
      /**
       * 路由添加
       */
      add: (routes) => {
        if (routes.constructor === Array) {
          explain.routes = explain.routes.concat(routes);
        } else if (routes.constructor === Object) {
          explain.routes.push(routes);
        }
      }
    },
    filter: {
      /**
       * 过滤器添加
       */
      add: (filters) => {
        if (filters.constructor === Array) {
          explain.filters = explain.filters.concat(filters);
        } else if (filters.constructor === Object) {
          explain.filters.push(filters);
        }
      }
    }
  };

  if (startup) {
    startup(app);
  }

  if (!explain.config.baseDir) {
    throw new Error(`"baseDir"必须配置。`);
  }

  // 使用中间件
  await middleware.use({
    event,
    context,
    explain
  });

  // console.log(explain.mode);
  // console.log(explain.response);
  if (explain.mode === 'route') {
    // return explain.response 之前可以正常响应，现在会报错 The Body of Composed Response is not valid
    // 不知道是不是服务商更新后出现的bug，解决办法为JSON对象转为JSON字符串再传入body即可
    explain.response.body = typeof explain.response.body === 'string' ? explain.response.body : JSON.stringify(explain.response.body); // route模式需要集成响应，集成响应body需要转为字符串
    return explain.response;
  } else if (explain.mode === 'match') {
    return explain.response.body; // match模式不需要集成响应
  }
};
