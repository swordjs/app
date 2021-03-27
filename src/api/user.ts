const db = uniCloud.database();

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
  userID: string
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
    data: result.userInfo,
  };
}


// 获取用户