'use strict';
module.exports = class {
  constructor(t, s, e) {
    (this.event = t), (this.context = s), (this.explain = e);
  }
};
