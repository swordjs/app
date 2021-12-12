import * as explain from 'explain';
import accesskeyService from '../service/accesskey';

export = class AccessKeyController extends explain.service {
  private service: accesskeyService;
  constructor(e: CloudData) {
    super(e);
    this.service = new accesskeyService(this);
  }
  /**
   * @name 生成accesskey
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/xahksz#g13V0
   * @memberof AccessKeyController
   */
  async generateAccesskey(): Promise<unknown> {
    return await this.service.generateAccesskey();
  }
};
