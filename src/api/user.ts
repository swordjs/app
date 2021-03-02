const db = uniCloud.database();

export async function postFollow(params: {
  targetID: string;
}): Promise<ActionResult> {
  const { success, result } = await uniCloud.callFunction({
    name: "application",
    data: {
      route: `api/checkFollowers`,
      method: "POST",
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
 * 获取用户信息根据Token
 */
export async function getUserContentByID(): Promise<ActionResult> {
  const { success, result } = await uniCloud.callFunction({
    name: "application",
    data: {
      route: `api/user/getUserContentByID`,
      method: "GET"
    },
  });
  return {
    success,
    data: result,
  };
}