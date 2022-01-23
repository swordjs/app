const db = uniCloud.database();
import { ActionResult } from '../../typings';
import request from '../common/request';

/**
 * @name 获取题目列表
 * @param params
 * @description 需要查询User以及专区和标签的内容
 * @docLink https://www.yuque.com/u509950/lmm8g4/wmvcz3
 */
export async function getQuestionListData(params: { limit: number; page: number; areaID: string }): Promise<ActionResult> {
  const { limit, page, areaID } = params;
  const res = await db
    .collection('sword-question,uni-id-users')
    .where(`areaID == '${areaID}' && deleteDate == '' && state == 'pass'`)
    .field(`publishUserID{avatar,nickname,_id},title,content,createDate`)
    .orderBy('createDate', 'desc')
    .skip(limit * (page - 1))
    .limit(limit)
    .get();
  return {
    ...res,
    data: res.result.data
  };
}

/**
 * @name 获取题目详情根据ID
 * @param params
 */
export async function getQuestionDetailByID(params: { id: string }): Promise<ActionResult> {
  const res = await db.collection('sword-question,sword-question-tag').where(`_id == '${params.id}'`).field('tagID{name},title,content,pageView').get();
  return {
    ...res,
    data: res.result.data
  };
}

/**
 * @name 增加题目浏览量
 * @param params
 * @returns
 */
export async function postAddPageView(params: { _id: string }): Promise<ActionResult> {
  return await request({
    route: `api/question/addPageView`,
    method: 'POST',
    data: {
      _id: params._id
    }
  });
}

/**
 * @name 获取题目列表根据用户ID
 * @param params
 * @returns
 */
export async function getQuestionListByUser(params: { userID: string; limit: number; page: number }): Promise<ActionResult> {
  const { limit, page } = params;
  const res = await db
    .collection('sword-question')
    .where(`publishUserID == '${params.userID}' && state == 'pass' && deleteDate == ''`)
    .orderBy('createDate', 'desc')
    .skip(limit * (page - 1))
    .limit(limit)
    .get();
  return {
    ...res,
    data: res.result.data
  };
}
