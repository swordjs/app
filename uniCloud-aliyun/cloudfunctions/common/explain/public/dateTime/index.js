'use strict';
module.exports = class e {
  static now(t, s) {
    let a = new Date().getTime();
    return t && (a = e.format(a, t, s)), a;
  }
  static format(e, t, s = 8) {
    var a = new Date(e);
    let r = a.getTimezoneOffset();
    a.setMinutes(a.getMinutes() + r), a.setHours(a.getHours() + s);
    var n = {
      'M+': a.getMonth() + 1,
      'd+': a.getDate(),
      'H+': a.getHours(),
      'm+': a.getMinutes(),
      's+': a.getSeconds(),
      'q+': Math.floor((a.getMonth() + 3) / 3)
    };
    for (var g in (/(y+)/.test(t) && (t = t.replace(RegExp.$1, (a.getFullYear() + '').substr(4 - RegExp.$1.length))), n))
      new RegExp('(' + g + ')').test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? n[g] : ('00' + n[g]).substr(('' + n[g]).length)));
    return /(f+)/.test(t) && (t = t.replace(RegExp.$1, (a.getMilliseconds() + '').substr(3 - RegExp.$1.length))), t;
  }
  static addYears(e, t) {
    var s = new Date(e);
    return s.setFullYear(s.getFullYear() + t), s.getTime();
  }
  static addMonths(e, t) {
    var s = new Date(e);
    return s.setMonth(s.getMonth() + t), s.getTime();
  }
  static addDays(e, t) {
    var s = new Date(e);
    return s.setDate(s.getDate() + t), s.getTime();
  }
  static addHours(e, t) {
    var s = new Date(e);
    return s.setHours(s.getHours() + t), s.getTime();
  }
  static addMinutes(e, t) {
    var s = new Date(e);
    return s.setMinutes(s.getMinutes() + t), s.getTime();
  }
  static addSeconds(e, t) {
    var s = new Date(e);
    return s.setSeconds(s.getSeconds() + t), s.getTime();
  }
  static addMilliseconds(e, t) {
    var s = new Date(e);
    return s.setMilliseconds(s.getMilliseconds() + t), s.getTime();
  }
};
