'use strict';
const filter = require('../../abstracts/filter');
module.exports = {
  onActionExecuting: async (e, i, t, n) => {
    n = n.map((n) => ({ filter: new n.filter(e, i, t), ignore: n.ignore })).filter((e) => e.filter instanceof filter);
    e: for (var r = 0; r < n.length; r++) {
      var o = n[r].filter,
        f = n[r].ignore;
      if (f) {
        f = f.filter((i) => i.service === e.service);
        for (var c = 0; c < f.length; c++) {
          var a = f[c];
          if (void 0 === a.actions || !0 === a.actions) continue e;
          if (a.actions.filter((i) => i === e.action).length > 0) continue e;
        }
      }
      if ((await o.onActionExecuting(), i.response)) return i.response;
    }
  },
  onActionExecuted: async (e, i, t, n) => {
    n = n.map((n) => ({ filter: new n.filter(e, i, t), ignore: n.ignore })).filter((e) => e.filter instanceof filter);
    e: for (var r = 0; r < n.length; r++) {
      var o = n[r].filter,
        f = n[r].ignore;
      if (f) {
        f = f.filter((i) => i.service === e.service);
        for (var c = 0; c < f.length; c++) {
          var a = f[c];
          if (void 0 === a.actions || !0 === a.actions) continue e;
          if (a.actions.filter((i) => i === e.action).length > 0) continue e;
        }
      }
      await o.onActionExecuted();
    }
  },
  onException: async (e, i, t, n, r) => {
    (i.exception = r), (n = n.map((n) => ({ filter: new n.filter(e, i, t), ignore: n.ignore })).filter((e) => e.filter instanceof filter));
    e: for (var o = 0; o < n.length; o++) {
      var f = n[o].filter,
        c = n[o].ignore;
      if (c) {
        c = c.filter((i) => i.service === e.service);
        for (var a = 0; a < c.length; a++) {
          var l = c[a];
          if (void 0 === l.actions || !0 === l.actions) continue e;
          if (l.actions.filter((i) => i === e.action).length > 0) continue e;
        }
      }
      if ((await f.onException(), i.response)) return i.response;
    }
  }
};
