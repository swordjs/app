'use strict';

/**
 * 过滤器抽象基类
 */
module.exports = class filter {
  constructor({ event, context, explain }) {
    this.event = event;
    this.context = context;
    this.explain = explain;
  }
  onActionExecuting() {}
  onActionExecuted() {}
  onException() {}
};
