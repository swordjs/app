'use strict';
const db = uniCloud.database();
const userCollection = db.collection('uni-id-users');
const questionCollection = db.collection('sword-question');
const explanationCollection = db.collection('sword-question-explanation');
const areaCollection = db.collection('sword-question-area');
const hotCollection = db.collection('opendb-search-hot');
const certificationApplyOrderCollection = db.collection('certificationApplyOrder');
const $ = db.command.aggregate;
exports.main = async (event) => {
  // 用户表数量
  const { total: userTotal } = await userCollection.count();
  // 问题数量
  const questionInfo = await questionCollection
    .aggregate()
    .match({
      state: 'pass'
    })
    .group({
      _id: '$areaID',
      num: $.sum(1)
    })
    .end();
  // 解答数量
  const { total: explanationTotal } = await explanationCollection.count();
  // 专区信息
  const { data: areaInfo } = await areaCollection.get();
  // 今日热搜词
  const { data: hotInfo } = await hotCollection
    .field({
      content: true
    })
    .get();
  // 出题官认证申请（只展示未处理）
  const { data: certificationInfo } = await certificationApplyOrderCollection
    .where({
      state: 'pending'
    })
    .skip(0)
    .limit(10)
    .orderBy('createTime', 'desc')
    .get();
  // 构成统计数据
  const mainStr = `今日用户数量: ${userTotal}个
题目数据概览: ${questionInfo.data.map((q) => {
    return areaInfo.find((a) => a._id === q._id).name + `(${q.num}道)`;
  })}
题解数量: ${explanationTotal}个
今日热搜词: ${hotInfo.map((h) => h.content).join(',')}
最近的认证申请(未处理): \n${certificationInfo.map((c) => `-- 联系方式: ${c.content.contactDetails}, 擅长: ${c.content.filed}`).join('\n')}
	`;
  // 发送钉钉通知
  await uniCloud.callFunction({
    name: 'dingtalk-robot',
    data: { content: `${mainStr}` }
  });
  //返回数据给客户端
  return event;
};
