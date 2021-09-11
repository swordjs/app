'use strict';

module.exports = class object {
  /**
   * 对象属性根据键排序
   * @param {Object} obj
   */
  static sort(obj) {
    let keys = Object.keys(obj).sort();
    let newObj = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      newObj[key] = obj[key];
    }
    return newObj;
  }
};
