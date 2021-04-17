const db = uniCloud.database();
import callFunction from "./../common/callFunction";

/**
 * @name 获取题目列表
 * @param params
 * @description 需要查询User以及专区和标签的内容
 * @docLink https://www.yuque.com/u509950/lmm8g4/wmvcz3
 */
export async function getQuestionListData(params: {
  limit: number;
  page: number;
  areaID: string;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    const { limit, page, areaID } = params;
    db.collection("question,uni-id-users")
      .where(`areaID == '${areaID}' && deleteDate == '' && state == 'pass'`)
      .field(`publishUserID{avatar,nickname,_id},title,content,createDate`)
      .orderBy("createDate desc")
      .skip(limit * (page - 1))
      .limit(limit)
      .get()
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
 * @name 获取题目详情根据ID
 * @param params
 */
export async function getQuestionDetailByID(params: {
  id: string;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    db.collection("question,questionTag")
      .where(`_id == '${params.id}'`)
      .field("tagID{name},title,content,pageView")
      .get()
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
 * @name 增加题目浏览量
 * @param params 
 * @returns 
 */
export async function postAddPageView(params: { _id: string }) {
  return await callFunction({
    name: "application",
    data: {
      route: `api/question/addPageView`,
      method: "POST",
      params: {
        _id: params._id,
      },
    },
  });
}

/**
 * @name 获取题目列表根据用户ID
 * @param params 
 * @returns 
 */
export async function getQuestionListByUser(params: {
  userID: string;
  limit: number;
  page: number;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    const { limit, page } = params;
    db.collection("question")
      .where(
        `publishUserID == '${params.userID}' && state == 'pass' && deleteDate == ''`
      )
      .orderBy("createDate desc")
      .skip(limit * (page - 1))
      .limit(limit)
      .get()
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
