const db = uniCloud.database();

// 新增题解
export async function addQuestionExplanation(params: {
  _id: string;
  content: string;
}) {
  const { success, result } = await uniCloud.callFunction({
    name: "application",
    data: {
      route: `api/questionExplanation`,
      method: "POST",
      params,
    },
  });
  return {
    success,
    result,
  };
}

// 赞同题解/取消赞同题解
export async function adoptionQuestionExplanation(params: { _id: string }) {
  const { success, result } = await uniCloud.callFunction({
    name: "application",
    data: {
      route: `api/questionExplanation/adoptionQuestionExplanation`,
      method: "POST",
      params,
    },
  });
  return {
    success,
    result,
  };
}

// 收藏/取消收藏题解
export async function collectQuestionExplanation(params: { _id: string }) {
  const { success, result } = await uniCloud.callFunction({
    name: "application",
    data: {
      route: `api/questionExplanation/collectQuestionExplanation`,
      method: "POST",
      params,
    },
  });
  return {
    success,
    result,
  };
}

/**
 * @name 获取题解列表根据题目ID
 * @param params
 */
export async function getExplanationsByQuestionID(params: {
  questionID: string;
  page: number;
  limit: number;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    const { limit, page } = params;
    db.collection("questionExplanation,uni-id-users")
      .where(`questionID == '${params.questionID}'`)
      .field(`userID{avatar,nickname},content`)
      .skip(limit * (page - 1))
      .limit(limit)
      .orderBy("createDate desc")
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

export async function getExplanationsByID(params: {
  id: string;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    db.collection("questionExplanation,question,uni-id-users")
      .doc(params.id)
      .field(
        `questionID{title,_id},content,userID,userAgreed,userDisagreed,userID{avatar,nickname,collect}`
      )
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
 * @name 检查用户是否已经答过这道题
 * @param params
 * @returns explanationID
 */
export async function checkExplanationByUser(params: {
  _id: string;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    db.collection("questionExplanation")
      .where({
        questionID: params._id,
        userID: uni.getStorageSync("uni_id"),
      })
      .get()
      .then((res) => {
        const { success, result } = res;
        resolve({
          success,
          data: result.data.length > 0 ? result.data[0]._id : null,
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

// 获取题解列表根据用户ID，查询该用户的题解列表以及题目信息
export async function getExplanationsByUserID(params: {
  userID: string;
  limit: number;
  page: number
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    const { limit, page } = params;
    db.collection("questionExplanation,question")
      .where({
        userID: params.userID,
      })
      .field(`questionID{title,_id},content`)
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
