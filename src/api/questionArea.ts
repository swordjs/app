import { ActionResult } from '../../typings';

const db = uniCloud.database();

/**
 * @name 获取专区列表
 * @returns
 */
export async function getQuestionAreaList(): Promise<ActionResult> {
  // 获取题目专区列表
  const res = await db.collection('sword-question-area').where("deleteDate == ''").get();
  return {
    ...res,
    data: res.result.data
  };
}
