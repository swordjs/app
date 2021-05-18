const db = uniCloud.database();

/**
 * 搜索功能
 * @param params 
 * @returns 
 */
export async function search (params: {
  searchText: string,
  limit: number,
  page: number
}): Promise<ActionResult> {
    return new Promise((resolve) => {
        const { limit, page } = params;
        db.collection("questionExplanation,uni-id-users")
          .where(`questionID == '${params.questionID}'`)
          .field(`userID{avatar,nickname},content,createDate`)
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