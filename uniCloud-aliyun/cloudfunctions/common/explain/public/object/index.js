'use strict';
module.exports = class {
  static sort(t) {
    let r = Object.keys(t).sort(),
      s = {};
    for (var e = 0; e < r.length; e++) {
      var o = r[e];
      s[o] = t[o];
    }
    return s;
  }
};
