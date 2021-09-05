const db = uniCloud.database();
const collection = db.collection('article,uni-id-users');

/**
 * @name 获取文章列表
 */
export function getArticleList(): Promise<ActionResult> {
  return new Promise((resolve) => {
    collection
      .where({
        state: 'pass'
      })
      .field(`userID{avatar,nickname,sign,_id},title,content,createDate`)
      .orderBy('createDate desc')
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

/**
 * @name 获取文章详情根据ID
 */
export function getArticleByID(params: { id: string }): Promise<ActionResult> {
  return new Promise((resolve) => {
    collection
      .doc(params.id)
      .field(`userID{avatar,nickname,sign,_id},title,content`)
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
