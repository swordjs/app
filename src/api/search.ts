import { ActionResult } from '../../typings';
import request from '../common/request';
import { arrObjectUnique } from '../util/common';
const db = uniCloud.database();

/**
 * 搜索功能
 * @param params
 * @returns
 */
export async function search(params: { searchText: string; limit: number; page: number }): Promise<ActionResult> {
  const { limit, page } = params;
  const res = await db
    .collection('sword-question')
    .aggregate()
    .match({
      title: new RegExp(params.searchText, 'gi')
    })
    .sort({
      createDate: -1
    })
    .skip(limit * (page - 1))
    .limit(limit)
    .end();
  return {
    ...res,
    data: res.result.data
  };
}

/**
 * @name 增加搜索结果，后端需要拿到搜索结果去生成热搜词
 * @param params
 * @returns
 */
export async function addSearchLog(params: { content: string; user_id?: string; device_id?: string }): Promise<ActionResult> {
  return await request({
    route: `api/search/addSeachLog`,
    method: 'POST',
    data: params
  });
}

/**
 * @name 获取热搜词
 * @param params
 */
export async function getHotSearchWordList(): Promise<ActionResult> {
  const res = await db
    .collection('opendb-search-hot')
    .aggregate()
    .sort({
      create_date: -1,
      count: -1
    })
    .skip(0)
    .limit(50)
    .end();
  return {
    ...res,
    data: arrObjectUnique(res.result.data, 'content').slice(0, 15)
  };
}
