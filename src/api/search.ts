const db = uniCloud.database();

/**
 * 搜索功能
 * @param params
 * @returns
 */
export async function search(params: {
  searchText: string;
  limit: number;
  page: number;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    const { limit, page } = params;
    db.collection("question")
      .aggregate()
      .match({
        title: new db.RegExp({
          regex: params.searchText, // 正则表达式为 /^\ds/，转义后变成 '^\\ds'
          options: "gi",
        }),
      })
      .sort({
        createDate: -1
      })
      .skip(limit * (page - 1))
      .limit(limit)
      .end()
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
