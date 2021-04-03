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
 * 获取用户全部信息UserID（包括赞同数，粉丝数等）
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
 * 获取用户基本信息根据UserID
 * @param params
 */
export async function getUserBaseContentByUserID(params: {
  userID: string;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    db.collection("uni-id-users")
      .where({
        _id: params.userID
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

