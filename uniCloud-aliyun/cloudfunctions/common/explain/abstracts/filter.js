'use strict';
module.exports = class {
  constructor(t, e, n) {
    (this.event = t), (this.context = e), (this.explain = n);
  }
  onActionExecuting() {}
  onActionExecuted() {}
  onException() {}
};
