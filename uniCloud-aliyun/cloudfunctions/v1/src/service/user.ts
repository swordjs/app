import uniID from 'uni-id';
import questionService from './question';
import explanationService from './questionExplanation';
const db = uniCloud.database();
const collection = db.collection('uni-id-users');
import * as IUser from '../../typings/proto/request/user';
export default class UserService {
  private data: CloudData;
  private uniID: uniID;
  public nowDate: string;
  public clientIp: string;
  public userID: string;
  public token: string;
  constructor(data: CloudData) {
    this.data = data;
    this.userID = data.context.userID;
    this.nowDate = new Date().toISOString();
    this.clientIp = data?.context?.CLIENTIP || '';
    this.token = data.context.token;
    this.uniID = uniID.createInstance({
      context: data.context
    });
  }
  public async loginByWechat(params: IUser.LoginByWechat): Promise<unknown> {
    // 把用户信息也添加到库中, 设置角色为默认角色
    const res = await this.uniID.loginByWeixin({
      code: params.code,
      role: ['normal'],
      needPermission: true // 返回权限
    });
    // 更新用户信息（昵称，头像，性别等）
    await this.uniID.updateUser({
      uid: res.uid,
      nickname: params.nickname,
      avatar: params.avatar,
      gender: params.gender
    });
    return res;
  }
  public async bindWechat(params: IUser.BindWechat): Promise<unknown> {
    const { code, uid } = params;
    return await this.uniID.bindWeixin({
      uid,
      code
    });
  }
  public async loginByQQ(params: IUser.LoginByQQ): Promise<unknown> {
    const { nickname, avatar, gender, code } = params;
    // 把用户信息也添加到库中, 设置角色为默认角色
    const res = await this.uniID.loginByQQ({
      code,
      role: ['normal'],
      needPermission: true // 返回权限
    });
    await this.uniID.updateUser({
      uid: res.uid,
      nickname: nickname,
      avatar: avatar,
      gender: gender
    });
    return res;
  }
  public async bindQQ(params: IUser.BindQQ): Promise<unknown> {
    const { code, uid } = params;
    return await this.uniID.bindQQ({
      uid,
      code
    });
  }
  public async loginBySms(params: IUser.LoginBySms): Promise<unknown> {
    const { phone, code } = params;
    const result = await this.uniID.loginBySms({
      mobile: phone,
      code,
      needPermission: true,
      role: ['normal']
    });
    if (result.code === 0) {
      let userBaseInfo = {};
      // 根据返回的Type判断如果是新注册用户，就更新一些基础个人信息
      if (result.type === 'register') {
        // 更新用户信息（昵称，头像，性别等）
        userBaseInfo = {
          nickname: '暂未昵称',
          avatar: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/97f24e41-574b-4f46-8939-abbea060f3d3.png',
          sign: '感谢支持剑指题解'
        };
        // 执行更新
        await this.uniID.updateUser({
          uid: result.uid,
          ...userBaseInfo
        });
      }
      // 在返回结果的userInfo中新增我们刚刚update的信息
      return {
        ...result,
        userInfo: {
          ...result.userInfo,
          ...userBaseInfo
        }
      };
    }
  }
  public async sendSms(params: IUser.SendSms): Promise<unknown> {
    const { type, phone } = params;
    return await this.uniID.sendSmsCode({
      mobile: phone,
      templateId: '11846',
      type
    });
  }
  public async bindMobile(params: IUser.BindMobile): Promise<unknown> {
    return await this.uniID.bindMobile({
      uid: params.uid,
      mobile: params.mobile,
      code: params.code
    });
  }
  public async userLogout(params: IUser.UserLogout): Promise<unknown> {
    const { token } = params;
    return await this.uniID.logout(token);
  }
  public async checkToken(params: IUser.CheckToken): Promise<unknown> {
    return await this.uniID.checkToken(params.token);
  }
  public async updateUserInfo(params: IUser.UpdateUserInfo): Promise<unknown> {
    return await this.uniID.updateUser({
      ...params
    });
  }
  public async getUserContentByToken(): Promise<unknown> {
    return await this.uniID.getUserInfoByToken(this.token);
  }
  public async resetPassword(params: IUser.ResetPassword): Promise<unknown> {
    return await this.uniID.resetPwd({
      uid: params.id,
      password: params.password
    });
  }
  public async getUserContentByID(params: IUser.GetUserContentByID): Promise<unknown> {
    const { id } = params;
    // return await collection.doc(this.userID).get();
    const baseUserInfo = await this.uniID.getUserInfo({
      uid: id
    });
    if (baseUserInfo.code === 0) {
      // 获取基础用户信息
      const { total: fansCount } = await collection
        .where({
          followers: id
        })
        .field({ _id: true })
        .count();
      // 出题数, 调用question模块下的方法
      const question = new questionService(this.data);
      const { total: questionCount } = await question.questionCountByUserID(id);
      // 题解数, 调用题解模块下的方法
      const questionExplanation = new explanationService(this.data);
      const { total: explanationCount } = await questionExplanation.getExplanationCountByUser(id);
      const { data: likeData } = await questionExplanation.getLikeCountByUser(id);
      return {
        ...baseUserInfo,
        fansCount,
        questionCount,
        explanationCount,
        likeCount: likeData.length
      };
    }
  }
  public async checkFollowers(params: IUser.CheckFollowers): Promise<unknown> {
    const { follower } = params;
    // 获取当前用户关注用户信息
    const result = await this.uniID.getUserInfo({
      uid: this.userID
    });
    if (result.code === 0) {
      let followers = [];
      // 如果有此followers字段，则直接设置用户中的followers，否则使用默认空
      if (result.userInfo.followers) {
        followers = result.userInfo.followers;
      }
      // 查询下标
      const index = followers.indexOf(follower);
      if (index === -1) {
        followers.push(follower);
      } else {
        followers.splice(index, 1);
      }
      // 更新数据库
      return await this.uniID.updateUser({
        uid: this.userID,
        followers: followers
      });
    }
  }
  // 重置请求次数
  public async resetRequestNumber(): Promise<unknown> {
    return await collection
      .where({
        mobile_confirmed: 1
      })
      .update({
        openApiRequestNumber: 200
      });
  }
}
