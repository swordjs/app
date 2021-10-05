'use strict';

const filter = require('./filter');

const EXPLAIN_ROUTE_PARAMETER_MATCHER = 'ＥＸＰＬＡＩＮ－ＲＯＵＴＥ－ＰＡＲＡＭＥＴＥＲ－ＭＡＴＣＨＥＲ';

module.exports = async ({ event, context, explain }) => {
  // 声明参数
  let service,
    action,
    route,
    method = undefined;
  let isHttp = (explain.request.isHttp = event.httpMethod ? true : false);
  let data = {};

  // 如果是URL化则使用路由模式，两者不能同时使用
  if (isHttp) {
    explain.mode = 'route';

    route = explain.request.route = event.path === '/' ? '/' : event.path.substring(1, event.path.length);
    method = explain.request.httpMethod = event.httpMethod.toUpperCase();

    var queryStringParameters = event.queryStringParameters;
    if (method === 'GET') {
      // get method 直接从 queryStringParameters 里面取参数
      data = queryStringParameters;
    } else {
      // post 和其他 method 根据 content-type 规范格式后取参数
      var body = {};
      var bodyString = event.body;
      if (event.isBase64Encoded) {
        if (event.body) {
          bodyString = new Buffer(event.body, 'base64').toString();
        }
      }
      if (event.headers['content-type']) {
        if (event.headers['content-type'].includes('application/json')) {
          if (bodyString) {
            body = JSON.parse(bodyString);
          }
        } else if (event.headers['content-type'].includes('application/x-www-form-urlencoded')) {
          if (bodyString) {
            bodyString.split('&').forEach((x) => {
              var xs = x.split('=');
              var key = xs[0];
              var value = decodeURIComponent(xs[1]);
              body[key] = value;
            });
          }
        }
      }
      data = body;
    }

    // 整合路由模板
    var routeTemplates = [];
    explain.routes.forEach((x) => {
      var serviceName = x.service;
      var serviceRoute = x.route || '';
      if (serviceRoute && serviceRoute != '/') {
        if (serviceRoute.startsWith('/') || serviceRoute.endsWith('/')) {
          throw new Error(
            `路由格式错误，不能以'/'开头或结束。${JSON.stringify({
              service: serviceName,
              route: serviceRoute
            })}`
          );
        } else if (serviceRoute.includes('}{')) {
          throw new Error(
            `路由格式错误，每个参数匹配符之间需要有其它字符。${JSON.stringify({
              service: serviceName,
              route: serviceRoute
            })}`
          );
        }
      }
      if (x.routes) {
        x.routes.forEach((xx) => {
          var actionName = xx.action;
          var actionRoute = xx.route || '';
          var routeTemplate = '';
          var httpMethod = '';
          if (actionRoute) {
            if (actionRoute.startsWith('/') || actionRoute.endsWith('/')) {
              throw new Error(
                `路由格式错误，不能以'/'开头或结束。${JSON.stringify({
                  service: serviceName,
                  action: actionName,
                  route: actionRoute
                })}`
              );
            } else if (actionRoute.includes('}{')) {
              throw new Error(
                `路由格式错误，每个参数匹配符之间需要有其它字符。${JSON.stringify({
                  service: serviceName,
                  action: actionName,
                  route: actionRoute
                })}`
              );
            }
          }
          if (serviceRoute && actionRoute) {
            routeTemplate = `${serviceRoute}/${actionRoute}`;
          } else if (!serviceRoute && actionRoute) {
            routeTemplate = actionRoute;
          } else if (serviceRoute && !actionRoute) {
            routeTemplate = serviceRoute;
          } else {
            routeTemplate = serviceName;
          }

          // 得到请求方法
          if (xx.httpMethod) {
            if (typeof xx.httpMethod === 'string') {
              xx.httpMethod = [xx.httpMethod];
            }
            httpMethod = xx.httpMethod;
          } else {
            if (actionName.toUpperCase().startsWith('GET')) {
              httpMethod = ['GET'];
            } else if (
              actionName.toUpperCase().startsWith('POST') ||
              actionName.toUpperCase().startsWith('CREATE') ||
              actionName.toUpperCase().startsWith('ADD') ||
              actionName.toUpperCase().startsWith('INSERT')
            ) {
              httpMethod = ['POST'];
            } else if (actionName.toUpperCase().startsWith('PUT') || actionName.toUpperCase().startsWith('UPDATE')) {
              httpMethod = ['PUT'];
            } else if (actionName.toUpperCase().startsWith('DELETE') || actionName.toUpperCase().startsWith('REMOVE')) {
              httpMethod = ['DELETE'];
            } else if (actionName.toUpperCase().startsWith('PATCH')) {
              httpMethod = ['PATCH'];
            }
          }

          routeTemplates.push({
            routeTemplate,
            httpMethod,
            service: serviceName,
            action: actionName
          });
        });
      }
    });

    // 匹配路由模板
    routeTemplates = routeTemplates.filter((x) => {
      // 过滤httpMethod不一致的路由模板
      if (x.httpMethod.includes(method)) {
        // 得到路由模板正则表达式
        var routeTemplateRegExpPattern = `^${x.routeTemplate.replace(new RegExp('\\{[^\\}]+\\}', 'g'), '[^/]+')}$`;
        // `^${x.routeTemplate.replace(new RegExp("\\{[^\\}]+\\}", "g"), "[^/\\?&#]+")}$`; // 是否还需要加上排除{}这两个符号
        // var routeTemplateRegExpPattern = `^${x.routeTemplate.replace(new RegExp("\\{[^\\}]+\\}", "g"), "[^/\\?&#\\{\\}].+?")}$`; // 是否还需要加上排除{}这两个符号
        // console.log(routeTemplateRegExpPattern)
        // 路由模板正则匹配当前路由
        if (new RegExp(routeTemplateRegExpPattern, 'gi').test(route)) {
          // console.log(routeTemplateRegExpPattern)
          return x;
        }
      }
    });
    if (routeTemplates.length === 0) {
      throw new Error('找不到与该请求匹配的操作。');
    }

    // console.log(routeTemplates);

    // 根据优先级排序
    routeTemplates = routeTemplates.sort((a, b) => {
      // 先把固定匹配符长度较长的排前面
      var arr = a.routeTemplate.replace(new RegExp('\\{[^\\}]+\\}', 'g'), '');
      var brr = b.routeTemplate.replace(new RegExp('\\{[^\\}]+\\}', 'g'), '');
      if (arr.length < brr.length) {
        return true;
      } else if (arr.length === brr.length) {
        // 如果固定匹配符长度一致则参数匹配符少的在前
        var arsl = a.routeTemplate.replace(new RegExp('\\{[^\\}]+\\}', 'g'), EXPLAIN_ROUTE_PARAMETER_MATCHER).split(EXPLAIN_ROUTE_PARAMETER_MATCHER).length - 1;
        var brsl = b.routeTemplate.replace(new RegExp('\\{[^\\}]+\\}', 'g'), EXPLAIN_ROUTE_PARAMETER_MATCHER).split(EXPLAIN_ROUTE_PARAMETER_MATCHER).length - 1;
        if (arsl > brsl) {
          return true;
        }
      }
    });

    // console.log(routeTemplates);

    // 得到已匹配的路由
    var matchedRouteTemplate = routeTemplates[0];
    var repeatRouteTemplates = routeTemplates.filter((x) => {
      if (
        matchedRouteTemplate.routeTemplate.replace(new RegExp('\\{[^\\}]+\\}', 'g'), EXPLAIN_ROUTE_PARAMETER_MATCHER) ===
        x.routeTemplate.replace(new RegExp('\\{[^\\}]+\\}', 'g'), EXPLAIN_ROUTE_PARAMETER_MATCHER)
      ) {
        return x;
      }
    });
    if (repeatRouteTemplates.length > 1) {
      throw new Error(`找到了与该请求匹配的多个操作，请对冲突的路由模板进行修改: ${JSON.stringify(repeatRouteTemplates)}`);
    }

    // 得到路由参数
    var routeParams = {};
    var _a = matchedRouteTemplate.routeTemplate;
    var _b = _a.split('/');
    var _c = _a.replace(new RegExp('\\{[^\\}]+\\}', 'g'), EXPLAIN_ROUTE_PARAMETER_MATCHER).split('/');
    var _d = route.split('/');
    _c.forEach((x, xi) => {
      var y = _d[xi];
      var z = _b[xi];
      if (x.includes(EXPLAIN_ROUTE_PARAMETER_MATCHER)) {
        if (x === EXPLAIN_ROUTE_PARAMETER_MATCHER) {
          // {id} 5
          routeParams[z.replace(new RegExp('\\{|\\}', 'g'), '')] = y;
        } else {
          // student:{name}-{age} student:Sansnn-99
          var _f = x.split(EXPLAIN_ROUTE_PARAMETER_MATCHER);
          var _g = y;
          var _r = z;
          for (var i = 0; i < _f.length - 1; i++) {
            var _h = _f[i];
            var _l = _f[i + 1];
            var _o = '';
            var _p = '';
            if (_h) {
              _o += `^${_h}`;
              _p += `^${_h}`;
            }
            _o += '{.+?}';
            _p += '.+';
            if (_l) {
              _o += `${_l}`;
              _p += `?${_l}`;
              if (i === _f.length - 2) {
                _o += '$';
                _p += '$';
              }
            }
            // console.log(_o, _p)
            // console.log(new RegExp(_o, "i").exec(_r)[0]);
            // console.log(new RegExp(_p, "i").exec(_g)[0]);
            // console.log(new RegExp(_p, "i").exec(_g));
            var _m = new RegExp(_o, 'i').exec(_r)[0].replace(new RegExp(`(^${_h})\\{|\\}(${_l}$)`, 'gi'), '');
            var _n = new RegExp(_p, 'i').exec(_g)[0].replace(new RegExp(`(^${_h})|(${_l}$)`, 'gi'), '');
            _r = _r.substring(_r.indexOf(`${_h}{${_m}}`) + `${_h}{${_m}}`.length, _r.length);
            _g = _g.substring(_g.toLowerCase().indexOf(`${_h}${_n}`.toLowerCase()) + `${_h}${_n}`.length, _g.length);
            // console.log(`_h_n ${_h}${_n}`)
            // console.log(_r, _g)
            // console.log(_m, _n)
            routeParams[_m] = _n;
          }
        }
      }
    });

    service = matchedRouteTemplate.service;
    action = matchedRouteTemplate.action;
    data = Object.assign({}, routeParams, data); // 合并参数

    explain.request.routeTemplate = matchedRouteTemplate.routeTemplate;
  }
  // 不是URL化则使用匹配模式
  else {
    explain.mode = 'match';

    service = event[explain.config.serviceKey];
    action = event[explain.config.actionKey];
    data = event[explain.config.dataKey] || {};

    if (explain.config.enableMatchMode) {
      if (!service) {
        if (explain.mode === 'match') {
          throw new Error(`service不能为空。`);
        } else {
          throw new Error(`找不到与该请求匹配的操作。`);
        }
      }
      if (!action) {
        if (explain.mode === 'match') {
          throw new Error(`action不能为空。`);
        } else {
          throw new Error(`找不到与该请求匹配的操作。`);
        }
      }

      // 主动忽略
      var matchIgnore = explain.config.matchIgnore.filter((x) => x.service === service);
      for (var i = 0; i < matchIgnore.length; i++) {
        var ignore = matchIgnore[i];
        var ignoreService = ignore.service;
        var ignoreActions = ignore.actions;
        if (typeof ignoreActions === 'undefined' || ignoreActions === true) {
          throw new Error(`service: "${service}"，action: "${action}" 拒绝访问。`);
        } else if (ignoreActions.filter((x) => x === action).length > 0) {
          throw new Error(`service: "${service}"，action: "${action}" 拒绝访问。`);
        }
      }
    } else {
      throw new Error(`service: "${service}"，action: "${action}" 拒绝访问。`);
    }
  }

  // 参数整理
  event[explain.config.serviceKey] = explain.request.service = service;
  event[explain.config.actionKey] = explain.request.action = action;
  event[explain.config.dataKey] = explain.request.data = data;

  // 实例化service
  let serviceObj = require(`${explain.config.baseDir}${explain.config.serviceDir}${service}`);

  // action执行前
  await filter.onActionExecuting({
    event,
    context,
    explain
  });
  // action执行前若存在响应信息则说明已经在过滤器被中断，则不再往下执行，直接返回响应结果
  if (explain.response.body) {
    // body存在响应信息，直接跳出到响应
    return;
  }
  let serviceInstance = new serviceObj({
    event,
    context,
    explain
  });

  if (!serviceInstance[action]) {
    throw new Error(`找不到action: "${action}"。`);
  }

  // 执行action方法
  try {
    var response = await serviceInstance[action](explain.request.data);
    if (response) {
      // 响应结果
      explain.response.body = response;
    }
  } catch (exception) {
    // 异常处理
    var filterOnException = await filter.onException({
      event,
      context,
      explain,
      exception
    });
    // body为undefined则表示没有进行响应处理则继续抛出异常
    if (!explain.response.body) {
      throw exception;
    }
  }

  // action执行后
  let filterOnActionExecuted = await filter.onActionExecuted({
    event,
    context,
    explain
  });
};
