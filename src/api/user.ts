import callFunction from "./../common/callFunction";
const db = uniCloud.database();
const dbCmd = db.command;

/**
 * @name 关注用户
 * @param params
 * @returns
 */
export async function postFollow(params: {
  targetID: string;
}): Promise<ActionResult> {
  return await callFunction({
    name: "application",
    data: {
      route: `api/user/checkFollowers`,
      method: "PUT",
      params: {
        follower: params.targetID,
      },
    },
    checkLogin: true
  });
}

/**
 * @name 获取用户首页的信息（赞同数，解题数等）
 * @param params
 * @returns
 */
export async function getUserContentByID(params: {
  userID: string;
}): Promise<ActionResult> {
  return await callFunction({
    name: "application",
    data: {
      route: `api/user/getUserContentByID/${params.userID}`,
      method: "GET",
    },
  });
}

/**
 * @name 获取用户基本信息根据UserID
 * @param params
 */
export async function getUserBaseContentByUserID(params: {
  userID: string;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    db.collection("uni-id-users")
      .where({
        _id: params.userID,
      })
      .field("nickname,avatar,followers")
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
