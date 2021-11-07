'use strict';

const db = uniCloud.database();
const collection = db.collection('uni-id-users');
// 每个月重置的次数
const RESET_NUMBER = 200;

exports.main = async (event, context) => {
  // 重置
  return await collection
    .where({
      mobile_confirmed: 1
    })
    .update({
      openApiRequestNumber: RESET_NUMBER
    });
};
