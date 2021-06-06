import callFunction from "../common/callFunction";
import { arrObjectUnique } from "../util/common";
const db = uniCloud.database();

/**
 * 搜索功能
 * @param params
 * @returns
 */
export async function search(params: {
  searchText: string;
  limit: number;
  page: number;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    const { limit, page } = params;
    db.collection("question")
      .aggregate()
      .match({
        title: new db.RegExp({
          regex: params.searchText, // 正则表达式为 /^\ds/，转义后变成 '^\\ds'
          options: "gi",
        }),
      })
      .sort({
        createDate: -1
      })
      .skip(limit * (page - 1))
      .limit(limit)
      .end()
      .then((res) => {
        const { success, result } = res;
        resolve({
          success,
          data: result.data,
        });
      })
      .catch((err: { message: string }) => {
        uni.showToast({
          title: err.message,
          icon: "none",
        });
      });
  });
}

/**
 * @name 增加搜索结果，后端需要拿到搜索结果去生成热搜词
 * @param params
 * @returns 
 */
export async function addSearchLog(params:{
  content: string,
  user_id?: string,
  device_id?: string
}): Promise<ActionResult> {
  return await callFunction({
    name: "application",
    data: {
      route: `api/search/addSeachLog`,
      method: "POST",
      params,
    },
  });
}


/**
 * @name 获取热搜词
 * @param params 
 */
export async function getHotSearchWordList(): Promise<ActionResult> {
  return new Promise((resolve) => {
  db.collection("opendb-search-hot")
      .aggregate()
      .sort({
        create_date: -1,
        count: -1
      })
      .skip(0)
      .limit(50)
      .end()
      .then((res) => {
        const { success, result } = res;
        // 循环热搜结果，根据content去重复
        resolve({
          success,
          data: arrObjectUnique(result.data, "content").slice(0, 15),
        });
      })
      .catch((err: { message: string }) => {
        uni.showToast({
          title: err.message,
          icon: "none",
        });
      });
    })
}