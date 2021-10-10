'use strict';

/**
 * filter模块，主要作用是程序运行时执行已注入的过滤器
 */

const filter = require('../abstracts/filter');

module.exports = {
  onActionExecuting: async ({ event, context, explain }) => {
    // 得到过滤器集合，必须是继承自abstracts.filter的类，以免执行方法时没有父类方法引发报错
    let filters = explain.filters
      .map((x) => {
        return {
          filter: new x.filter({
            event,
            context,
            explain
          }),
          ignore: x.ignore
        };
      })
      .filter((x) => x.filter instanceof filter);

    forI: for (var i = 0; i < filters.length; i++) {
      var iFilter = filters[i].filter;
      var iIgnore = filters[i].ignore;

      // 过滤器忽略
      if (iIgnore) {
        iIgnore = iIgnore.filter((x) => x.service === event.service);
        forJ: for (var j = 0; j < iIgnore.length; j++) {
          var jIgnore = iIgnore[j];
          if (typeof jIgnore.actions === 'undefined' || jIgnore.actions === true) {
            continue forI;
          } else if (jIgnore.actions.filter((x) => x === event.action).length > 0) {
            continue forI;
          }
        }
      }

      await iFilter.onActionExecuting();
      // 可在过滤器onActionExecuting方法赋值explain.response.body中断之后的进程，返回响应结果。一般用作onActionExecuting内部处理错误或异常。
      if (explain.response.body) {
        // body存在响应信息，直接跳转到响应
        return;
      }
    }
  },
  onActionExecuted: async ({ event, context, explain }) => {
    // 得到过滤器集合，必须是继承自abstracts.filter的类，以免执行方法时没有父类方法引发报错
    let filters = explain.filters
      .map((x) => {
        return {
          filter: new x.filter({
            event,
            context,
            explain
          }),
          ignore: x.ignore
        };
      })
      .filter((x) => x.filter instanceof filter);

    forI: for (var i = 0; i < filters.length; i++) {
      var iFilter = filters[i].filter;
      var iIgnore = filters[i].ignore;

      // 过滤器忽略
      if (iIgnore) {
        iIgnore = iIgnore.filter((x) => x.service === event.service);
        forJ: for (var j = 0; j < iIgnore.length; j++) {
          var jIgnore = iIgnore[j];
          if (typeof jIgnore.actions === 'undefined' || jIgnore.actions === true) {
            continue forI;
          } else if (jIgnore.actions.filter((x) => x === event.action).length > 0) {
            continue forI;
          }
        }
      }

      await iFilter.onActionExecuted();
      // 可在过滤器onActionExecuted方法不断操作explain.response.body以改变响应结果。注意explain.response.body是只能不断覆盖更新而不是直接返回。
    }
  },
  onException: async ({ event, context, explain, exception }) => {
    explain.exception = exception;

    // 得到过滤器集合，必须是继承自abstracts.filter的类，以免执行方法时没有父类方法引发报错
    let filters = explain.filters
      .map((x) => {
        return {
          filter: new x.filter({
            event,
            context,
            explain
          }),
          ignore: x.ignore
        };
      })
      .filter((x) => x.filter instanceof filter);

    forI: for (var i = 0; i < filters.length; i++) {
      var iFilter = filters[i].filter;
      var iIgnore = filters[i].ignore;

      // 过滤器忽略
      if (iIgnore) {
        iIgnore = iIgnore.filter((x) => x.service === event.service);
        forJ: for (var j = 0; j < iIgnore.length; j++) {
          var jIgnore = iIgnore[j];
          if (typeof jIgnore.actions === 'undefined' || jIgnore.actions === true) {
            continue forI;
          } else if (jIgnore.actions.filter((x) => x === event.action).length > 0) {
            continue forI;
          }
        }
      }

      await iFilter.onException();
      // 可在过滤器onException方法赋值explain.response.body中断之后的进程，直接响应客户端而不返回异常错误。也可以内部throw异常。
      if (explain.response.body) {
        // body存在响应信息，直接跳转到响应
        return;
      }
    }
  }
};
