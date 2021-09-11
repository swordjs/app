'use strict';

const invoke = require('./invoke');

module.exports.use = async ({ event, context, explain }) => {
  let middlewares = explain.middlewares;
  if (middlewares.length > 0) {
    let next = async (i) => {
      if (middlewares.length > i) {
        await middlewares[i]({
          event,
          context,
          explain,
          next: async () => {
            i++;
            await next(i);
          }
        });
      } else {
        await invoke({
          event,
          context,
          explain
        });
      }
    };
    await next(0);
  } else {
    await invoke({
      event,
      context,
      explain
    });
  }
};
