const db = uniCloud.database();
const dbCmd = db.command;

export async function postFollow(params: {
  targetID: string;
}): Promise<ActionResult> {
  const { success, result } = await uniCloud.callFunction({
    name: "application",
    data: {
      route: `api/user/checkFollowers`,
      method: "PUT",
      params: {
        follower: params.targetID,
      },
    },
  });
  return {
    success,
    data: result,
  };
}

/**
 * 获取用户信息UserID
 */
export async function getUserContentByID(params: {
  userID: string;
}): Promise<ActionResult> {
  const { success, result } = await uniCloud.callFunction({
    name: "application",
    data: {
      route: `api/user/getUserContentByID/${params.userID}`,
      method: "GET",
    },
  });
  return {
    success,
    data: result,
  };
}

/**
 * 获取粉丝数根据用户ID
 * @param params
 */
export async function getFansCountByUser(params: {
  userID: string;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    db.collection("uni-id-users")
      .where({
        followers: params.userID
      })
      .field({"_id": true})
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

