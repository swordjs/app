namespace CertificationApplyOrder {
  const explain = require("explain");
  const certificationService = require("../service/certificationApplyOrder");
  const { appErrorMessage, handleMustRequireParam } = require("app-tools");
  module.exports = class CommonController extends explain.service {
    // 核心处理服务方法
    async handler(methodName: string) {
      const service = new certificationService({
        context: this.context,
      });
      return await service[methodName](this.event.params);
    }
    // 新增申请认证
    async addCertificationApplyOrder() {
      return handleMustRequireParam(
        [
          {
            key: "content",
            value: "content内容",
          },
        ],
        this.event.params
      )
        .then(async () => await this.handler("addCertificationApplyOrder"))
        .catch((err) => err);
    }
    // 修改申请认证
    async updateCertificationApplyOrder() {
      return handleMustRequireParam(
        [
          {
            key: "_id",
            value: "id",
          },
          {
            key: "content",
            value: "content内容",
          },
        ],
        this.event.params
      )
        .then(async () => await this.handler("updateCertificationApplyOrder"))
        .catch((err) => err);
    }
    // 对认证单进行审核/拒绝等操作
    async updateCertificationApplyOrderState() {
        return handleMustRequireParam(
          [
            {
              key: "_id",
              value: "id",
            },
            {
              key: "state",
              value: "状态",
            },
          ],
          this.event.params
        )
          .then(async () => await this.handler("updateCertificationApplyOrderState"))
          .catch((err) => err);
      }
	 // 申请单列表分页查询
	 async getCertificationApplyOrder(){
		 return handleMustRequireParam(
		   [
		     {
		       key: "state",
		       value: "状态",
		     }
		   ],
		   this.event.params
		 )
		   .then(async () => await this.handler("getCertificationApplyOrder"))
		   .catch((err) => err);
	 }
  };
}
