import * as explain from 'explain';
import certificationService from '../service/certificationApplyOrder';
import * as ICertificationApplyOrder from '../../proto/certificationApplyOrder';
export = class CertificationApplyOrderController extends explain.service {
  private service: certificationService;
  constructor(e: ExplainController) {
    super(e);
    this.service = new certificationService(this.context);
  }
  //
  /**
   * @name 新增申请认证
   * @param ICertificationApplyOrder.AddCertificationApplyOrder
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/qoght3#g13V0
   * @memberof CertificationApplyOrderController
   */
  async addCertificationApplyOrder(): Promise<unknown> {
    return await this.service.addArticle(this.event.data as ICertificationApplyOrder.AddCertificationApplyOrder);
  }
  /**
   * @name 修改申请认证
   * @param ICertificationApplyOrder.UpdateCertificationApplyOrder
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/qoght3#Ykwby
   * @memberof CertificationApplyOrderController
   */
  async updateCertificationApplyOrder(): Promise<unknown> {
    return await this.service.addArticle(this.event.data as ICertificationApplyOrder.UpdateCertificationApplyOrder);
  }
  /**
   * @name 对认证单进行审核/拒绝等操作
   * @param ICertificationApplyOrder.UpdateCertificationApplyOrderState
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/qoght3#HhUZH
   * @memberof CertificationApplyOrderController
   */
  async updateCertificationApplyOrderState(): Promise<unknown> {
    return await this.service.addArticle(this.event.data as ICertificationApplyOrder.UpdateCertificationApplyOrderState);
  }
  /**
   * @name 申请单列表分页查询
   * @param ICertificationApplyOrder.GetCertificationApplyOrder
   * @return {*}  {Promise<unknown>}
   * @memberof CertificationApplyOrderController
   */
  async getCertificationApplyOrder(): Promise<unknown> {
    return await this.service.addArticle(this.event.data as ICertificationApplyOrder.GetCertificationApplyOrder);
  }
};
