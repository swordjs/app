'use strict';

/**
 * 服务抽象基类
 */
module.exports = class service {
  constructor({ event, context, explain }) {
    this.event = event;
    this.context = context;
    this.explain = explain;
  }
};
