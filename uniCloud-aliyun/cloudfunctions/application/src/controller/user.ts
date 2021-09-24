import * as explain from 'explain';
import userService from '../service/user';
import * as IUser from '../../proto/user';
export = class UserController extends explain.service {
  private service: userService;
  constructor(e: ExplainController) {
    super(e);
    this.service = new userService(this.context);
  }
  /**
   * @name 微信登录
   * @param IUser.LoginByWechat
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/gkg5mv#g13V0
   * @memberof UserController
   */
  async loginByWechat(urlParams): Promise<unknown> {
    return await this.service.loginByWechat(this.event.data as IUser.LoginByWechat, urlParams);
  }
  /**
   * @name 微信绑定
   * @param IUser.BindWechat
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/gkg5mv#SCvy9
   * @memberof UserController
   */
  async bindWechat(): Promise<unknown> {
    return await this.service.bindWechat(this.event.data as IUser.BindWechat);
  }
  /**
   * @name QQ登录
   * @param IUser.LoginByQQ
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/gkg5mv#nLSrd
   * @memberof UserController
   */
  async loginByQQ(urlParams): Promise<unknown> {
    return await this.service.loginByQQ(this.event.data as IUser.LoginByQQ, urlParams);
  }
  /**
   * @name QQ绑定
   * @param IUser.BindQQ
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/gkg5mv#aSr2C
   * @memberof UserController
   */
  async bindQQ(): Promise<unknown> {
    return await this.service.bindQQ(this.event.data as IUser.BindQQ);
  }
  /**
   * @name 手机号验证码登录
   * @param IUser.LoginBySms
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/gkg5mv#G8wB1
   * @memberof UserController
   */
  async loginBySms(): Promise<unknown> {
    return await this.service.loginBySms(this.event.data as IUser.LoginBySms);
  }
  /**
   * @name 发送验证码
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/gkg5mv#IJ4Rm
   * @memberof UserController
   */
  async sendSms(urlParams): Promise<unknown> {
    return await this.service.sendSms(null, urlParams);
  }
  /**
   * @name 绑定手机号
   * @param IUser.BindMobile
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/gkg5mv#NXQR7
   * @memberof UserController
   */
  async bindMobile(): Promise<unknown> {
    return await this.service.bindMobile(this.event.data as IUser.BindMobile);
  }
  /**
   * @name 用户登出
   * @param IUser.UserLogout
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/gkg5mv#aZV8x
   * @memberof UserController
   */
  async userLogout(): Promise<unknown> {
    return await this.service.userLogout(this.event.data as IUser.UserLogout);
  }
  /**
   * @name 校验Token
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/gkg5mv#O3olO
   * @memberof UserController
   */
  async checkToken(urlParams): Promise<unknown> {
    return await this.service.checkToken(urlParams);
  }
  /**
   * @name 更新用户信息
   * @param IUser.UpdateUserInfo
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/gkg5mv#DXqsc
   * @memberof UserController
   */
  async updateUserInfo(): Promise<unknown> {
    return await this.service.updateUserInfo(this.event.data as IUser.UpdateUserInfo);
  }
  /**
   * @name 获取用户信息根据token
   * @return {*}  {Promise<unknown>}
   * @memberof UserController
   */
  async getUserContentByToken(): Promise<unknown> {
    return await this.service.getUserContentByToken();
  }
  /**
   * @name 根据ID获取用户信息
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/gkg5mv#jjVuV
   * @memberof UserController
   */
  async getUserContentByID(urlParams): Promise<unknown> {
    return await this.service.getUserContentByID(urlParams);
  }
  /**
   * @name 添加/取消关注
   * @param IUser.CheckFollowers
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/gkg5mv#hwU5V
   * @memberof UserController
   */
  async checkFollowers(): Promise<unknown> {
    return await this.service.checkFollowers(this.event.data as IUser.CheckFollowers);
  }
  /**
   * @name 重置登录密码
   * @param IUser.ResetPassword
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/gkg5mv#HMaQP
   * @memberof UserController
   */
  async resetPassword(): Promise<unknown> {
    return await this.service.resetPassword(this.event.data as IUser.ResetPassword);
  }
};
