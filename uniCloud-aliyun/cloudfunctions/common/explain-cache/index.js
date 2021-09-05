'use strict';
const explain = require('explain'),
  db = uniCloud.database(),
  dbCmd = db.command,
  dbColl = db.collection('explain-cache');
module.exports = class e {
  static async set({ key: e, value: t, expire: a = 7200 }) {
    if (!e) throw new Error('key无效');
    let i = explain.dateTime.now(),
      l = explain.dateTime.addSeconds(i, a),
      r = await dbColl.where({ key: e }).update({ value: t, set_time: i, expire_time: l });
    if (!r.updated)
      try {
        await dbColl.add({ key: e, value: t, set_time: i, expire_time: l });
      } catch (e) {
        if (!e.message.includes('E11000 duplicate key error')) return !1;
      }
    return !0;
  }
  static async get(t) {
    let a = await dbColl.where({ key: t }).get(),
      i = a.data[0];
    return i ? (i.expire_time > explain.dateTime.now() ? i.value : (await e.remove(t), null)) : null;
  }
  static async remove(e) {
    if (!e) throw new Error('key无效');
    let t = await dbColl.where({ key: e }).remove();
    return t.deleted > 0;
  }
  static async clearAll() {
    var e = await dbColl.where({ _id: dbCmd.exists(!0) }).remove();
    return e.deleted;
  }
  static async clearTimeout() {
    var e = await dbColl.where({ expire_time: dbCmd.lte(explain.dateTime.now()) }).remove();
    return e.deleted;
  }
};
