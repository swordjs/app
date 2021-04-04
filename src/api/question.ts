const db = uniCloud.database();

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
  userID: string;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    const { limit, page, areaID, userID } = params;
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

export async function postAddPageView(params: { _id: string }) {
  const { success, result } = await uniCloud.callFunction({
    name: "application",
    data: {
      route: `api/question/addPageView`,
      method: "POST",
      params: {
        _id: params._id,
      },
    },
  });
  return {
    success,
    result,
  };
}

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
