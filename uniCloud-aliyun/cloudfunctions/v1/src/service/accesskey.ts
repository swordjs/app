const db = uniCloud.database();
const collection = db.collection('sword-user-accesskey');
import { v4 as uuidv4 } from 'uuid';

export default class Accesskey {
  public userID: string;
  public nowDate: string;
  constructor(data: CloudData) {
    this.userID = data.context.userID || '';
    this.nowDate = new Date().toISOString();
  }
  async generateAccesskey(): Promise<unknown> {
    const ak = uuidv4();
    // 判断用户下有没有生成过ak
    const res = await collection
      .where({
        user_id: this.userID
      })
      .get<{ _id: string }>();
    if (res.data.length === 0) {
      // 调用新增
      await collection.add({
        user_id: this.userID,
        accesskey: ak,
        createDate: this.nowDate,
        updateDate: this.nowDate,
        deleteDate: ''
      });
      return ak;
    } else {
      await collection.doc(res.data[0]._id).update({
        accesskey: ak
      });
      return ak;
    }
  }
}
