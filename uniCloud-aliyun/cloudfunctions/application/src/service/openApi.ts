namespace OpenApiService {
  const db = uniCloud.database();
  const collection = db.collection("openApi");
  module.exports = class OpenApiService {
    public userID: string;
    public nowDate: string;
    constructor(data) {
      this.userID = data.context.userID;
      this.nowDate = new Date().toISOString();
    }
    async addOpenApi(params: { name: string; remark: string; info: string }) {
      // 默认添加一个类型为关闭的openapi
      return await collection.add({
        name: params.name,
        remark: params.remark,
        info: params.info,
        state: "close",
        createDate: this.nowDate,
        updateDate: this.nowDate,
        deleteDate: "",
      });
    }
    async updateOpenApi(params: {
      id: string;
      name: string;
      remark: string;
      info: string;
    }) {
      return await collection.doc(params.id).update({
        name: params.name,
        remark: params.remark,
        info: params.info,
        updateDate: this.nowDate,
      });
    }
    async toggleOpenApiState(params: { id: string; state: "close" | "open" }) {
      return await collection.doc(params.id).update({
        state: params.state,
        updateDate: this.nowDate,
      });
    }
  };
}
