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
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    const { limit, page, areaID } = params;
    db.collection("question,uni-id-users")
      .where(`areaID == '${areaID}' && deleteDate == '' && state == 'pass'`)
      .field(`publishUserID{avatar,nickname},title,content`)
      // 按照规则进行排序
      .limit(limit)
      .skip(limit * (page - 1))
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
