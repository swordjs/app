const db = uniCloud.database();
import request from '../common/request';

/**
 * @name 新增题解
 * @param params
 * @returns
 */
export async function addQuestionExplanation(params: { _id: string; content: string }): Promise<ActionResult> {
  return await request({
    route: `api/questionExplanation`,
    method: 'POST',
    data: params,
    checkLogin: true
  });
}

/**
 * @name 修改题解
 * @param params
 * @returns
 */
export async function updateQuestionExplanation(params: { _id: string; content: string }): Promise<ActionResult> {
  return await request({
    route: `api/questionExplanation`,
    method: 'PUT',
    data: params,
    checkLogin: true
  });
}

/**
 * @name 赞同题解/取消赞同题解
 * @param params
 * @returns
 */
export async function adoptionQuestionExplanation(params: { _id: string }): Promise<ActionResult> {
  return await request({
    route: `api/questionExplanation/adoptionQuestionExplanation`,
    method: 'POST',
    data: params,
    checkLogin: true
  });
}

/**
 * @name 收藏/取消收藏题解
 * @param params
 * @returns
 */
export async function collectQuestionExplanation(params: { _id: string }): Promise<ActionResult> {
  return await request({
    route: `api/questionExplanation/collectQuestionExplanation`,
    method: 'POST',
    data: params,
    checkLogin: true
  });
}

/**
 * @name 获取题解列表根据题目ID
 * @param params
 */
export async function getExplanationsByQuestionID(params: { questionID: string; page: number; limit: number }): Promise<ActionResult> {
  const { limit, page } = params;
  const res = await db
    .collection('questionExplanation,uni-id-users')
    .where(`questionID == '${params.questionID}'`)
    .field(`userID{avatar,nickname},content,createDate`)
    .skip(limit * (page - 1))
    .limit(limit)
    .orderBy('createDate', 'desc')
    .get();
  return {
    ...res,
    data: res.result.data
  };
}

/**
 * @name 获取题解详情根据ID
 * @param params
 * @returns
 */
export async function getExplanationsByID(params: { id: string }): Promise<ActionResult> {
  const res = await db
    .collection('questionExplanation,question,uni-id-users')
    .doc(params.id)
    .field(`questionID{title,_id},content,userID,userAgreed,userDisagreed,userID{avatar,nickname,sign}`)
    .get();
  return {
    ...res,
    data: res.result.data
  };
}

/**
 * @name 检查用户是否已经答过这道题
 * @param params
 * @returns ActionResult
 */
export async function checkExplanationByUser(params: { _id: string; userID?: string }): Promise<ActionResult> {
  const res = await db
    .collection('questionExplanation')
    .where({
      questionID: params._id,
      userID: params.userID || uni.getStorageSync('uni_id')
    })
    .get<{ _id: string }>();
  return {
    ...res,
    data: res.result.data.length > 0 ? res.result.data[0]._id : null
  };
}

/**
 * @name 获取题解列表根据用户ID，查询该用户的题解列表以及题目信息
 * @param params
 * @returns ActionResult
 */
export async function getExplanationsByUserID(params: { userID: string; limit: number; page: number }): Promise<ActionResult> {
  const { limit, page } = params;
  const res = await db
    .collection('questionExplanation,question,uni-id-users')
    .where({
      userID: params.userID
    })
    // publishUserID{nickname, avatar}
    .field(`questionID{title,_id},content,createDate`)
    .orderBy('createDate', 'desc')
    .skip(limit * (page - 1))
    .limit(limit)
    .get();
  return {
    ...res,
    data: res.result.data
  };
}
