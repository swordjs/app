import * as ISearch from '../../proto/search';
const db = uniCloud.database();
const collection = db.collection('opendb-search-log');
export default class SearchService {
  public userID: string;
  public nowDate: string;
  constructor(data) {
    // this.userID = data.context.userID;
    // this.nowDate = new Date().toISOString();
  }
  async addSeachLog(params: ISearch.AddSeachLog): Promise<unknown> {
    return await collection.add({
      content: params.content,
      [params.device_id ? 'device_id' : 'user_id']: params.device_id ? params.device_id : params.user_id,
      create_date: Date.now()
    });
  }
}
