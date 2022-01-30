import { ActionResult } from '../../typings';
import { Article } from '../../typings/database/sword-article';

const db = uniCloud.database();
const collection = db.collection('sword-article,uni-id-users');
/**
 * @name 获取文章列表
 */
export async function getArticleList(): Promise<ActionResult> {
  const res = await collection
    .where({
      state: 'pass'
    })
    .field(`userID{avatar,nickname,sign,_id},title,content,createDate`)
    .orderBy('createDate', 'desc')
    .get();
  return {
    ...res,
    data: res.result.data
  };
}

/**
 * @name 获取文章详情根据ID
 */
export type ResGetArticleByID = Article & {
  userID: {
    _id: string;
    avatar: string;
    nickname: string;
    sign: string;
  }[];
};
export async function getArticleByID(params: { id: string }): Promise<ActionResult<ResGetArticleByID>> {
  const res = await collection.doc(params.id).field(`userID{avatar,nickname,sign,_id},title,content`).get<ResGetArticleByID>();
  return {
    ...res,
    data: res.result.data[0]
  };
}
