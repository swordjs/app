const db = uniCloud.database();

/**
 * @name 检查自己是否已收藏题解
 * @param params
 * @returns
 */
export async function checkIDInCollect(params: { id: string }): Promise<ActionResult> {
  const res = await db
    .collection('userCollect')
    .where({
      userID: uni.getStorageSync('uni_id')
    })
    .get<{
      collectData: unknown[];
    }>();

  const { success, result } = res;
  // 根据返回的多个收藏夹去循环
  for (const collectKey in result.data) {
    // 查询当前收藏夹中的收藏内容
    const isCollect = result.data[collectKey].collectData.some((c: { id: string }) => c.id === params.id);
    // 如果找到收藏
    if (isCollect) {
      // 已收藏, 这里要么使用return去终止for循环，同理还可以使用延时器以及breaK跳出循环
      // 如果Promise没有立即调用then，那么for会依旧执行，resolve第二次调用是无效的，会取第一个。
      return {
        success,
        data: true
      };
    }
  }
  // 默认返回未收藏
  return {
    success,
    data: false
  };
}
