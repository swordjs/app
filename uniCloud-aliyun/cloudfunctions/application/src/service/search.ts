namespace SearchService {
  const db = uniCloud.database();
  const dbCmd = db.command;
  const collection = db.collection("opendb-search-log");
  interface IServiceData {
    context: {
      userID: string;
    };
  }
  module.exports = class SearchService {
    public userID: string;
    public nowDate: string;
    constructor(data: IServiceData) {
      this.userID = data.context.userID;
      this.nowDate = new Date().toISOString();
    }
    async addSeachLog(params: {
      content: string;
      device_id?: string;
      user_id?: string;
    }) {
     return await collection.add({
        content: params.content,
        [params.device_id ? 'device_id' : 'user_id']: params.device_id ? params.device_id : params.user_id,
        create_date: Date.now()
      });
    }
  };
}
