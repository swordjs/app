/**
 * dateTime模块，主要作用为日期时间处理
 */
'use strict';

module.exports = class dateTime {
  static now(formatString, timezone) {
    let timestamp = new Date().getTime();
    if (formatString) {
      timestamp = dateTime.format(timestamp, formatString, timezone);
    }
    return timestamp;
  }

  static format(timestamp, formatString, timezone = 8) {
    var d = new Date(timestamp);
    let gmt = d.getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
    d.setMinutes(d.getMinutes() + gmt); // 添补时间差至格林威治时间
    d.setHours(d.getHours() + timezone); // 加上时区
    var o = {
      'M+': d.getMonth() + 1, //月份
      'd+': d.getDate(), //日
      'H+': d.getHours(), //小时
      'm+': d.getMinutes(), //分
      's+': d.getSeconds(), //秒
      'q+': Math.floor((d.getMonth() + 3) / 3) //季度
    };
    if (/(y+)/.test(formatString)) {
      formatString = formatString.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(formatString)) {
        formatString = formatString.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }
    if (/(f+)/.test(formatString)) {
      formatString = formatString.replace(RegExp.$1, (d.getMilliseconds() + '').substr(3 - RegExp.$1.length));
    }
    return formatString;
  }

  static addYears(timestamp, value) {
    var date = new Date(timestamp);
    date.setFullYear(date.getFullYear() + value);
    return date.getTime();
  }

  static addMonths(timestamp, value) {
    var date = new Date(timestamp);
    date.setMonth(date.getMonth() + value);
    return date.getTime();
  }

  static addDays(timestamp, value) {
    var date = new Date(timestamp);
    date.setDate(date.getDate() + value);
    return date.getTime();
  }

  static addHours(timestamp, value) {
    var date = new Date(timestamp);
    date.setHours(date.getHours() + value);
    return date.getTime();
  }

  static addMinutes(timestamp, value) {
    var date = new Date(timestamp);
    date.setMinutes(date.getMinutes() + value);
    return date.getTime();
  }

  static addSeconds(timestamp, value) {
    var date = new Date(timestamp);
    date.setSeconds(date.getSeconds() + value);
    return date.getTime();
  }

  static addMilliseconds(timestamp, value) {
    var date = new Date(timestamp);
    date.setMilliseconds(date.getMilliseconds() + value);
    return date.getTime();
  }
};
