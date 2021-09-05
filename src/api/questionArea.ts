const db = uniCloud.database();

/**
 * @name 获取专区列表
 * @returns
 */
export async function getQuestionAreaList(): Promise<ActionResult> {
  // 获取题目专区列表
  return new Promise((resolve) => {
    db.collection('questionArea')
      .where("deleteDate == ''")
      .get()
      .then((res) => {
        const { success, result } = res;
        resolve({
          success,
          data: result.data
        });
      })
      .catch((err: { message: string }) => {
        uni.showToast({
          title: err.message,
          icon: 'none'
        });
      });
  });
}
