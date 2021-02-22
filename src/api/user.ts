export async function postFollow(params: {
  targetID: string;
}): Promise<ActionResult> {
  // 获取题目专区列表
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
