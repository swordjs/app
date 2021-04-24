namespace UserService {
  // 公告模块
  const uniID = require("uni-id");
  const questionService = require("./question");
  const explanationService = require("./questionExplanation");
  const db = uniCloud.database();
  const collection = db.collection("uni-id-users");

  interface ILoginByWechat {
    code: string;
  }
  interface IAddUserByPhone {
    username: string;
    password: string;
  }
  interface IPostLoginByPhone {
    username: string;
    password: string;
  }
  interface ICheckFollowers {
    uid: string;
    follower: string;
  }
  interface IUserData {
    userID: string;
    token: string;
  }
  module.exports = class User {
    public nowDate: string;
    public userID: string;
    public token: string;
    constructor(data: IUserData) {
      this.userID = data.userID;
      this.nowDate = new Date().toISOString();
      this.token = data.token;
    }
    public async loginByWechat(
      params: ILoginByWechat,
      urlParams: { code: string }
    ) {
      const { code } = urlParams;
      // 把用户信息也添加到库中, 设置角色为默认角色
      const res = await uniID.loginByWeixin({
        code,
        role: ["normal"],
        needPermission: true, // 返回权限
      });
      // 更新用户信息（昵称，头像，性别等）
      await uniID.updateUser({
        uid: res.uid,
        ...params,
      });
      return res;
    }
    public async loginBySms(params: { phone: string; code: string }) {
      const { phone, code } = params;
      const result = await uniID.loginBySms({
        mobile: phone,
        code,
        needPermission: true,
        role: ["normal"],
      });
      if (result.code === 0) {
        let userBaseInfo = {};
        // 根据返回的Type判断如果是新注册用户，就更新一些基础个人信息
        if (result.type === "register") {
          // 更新用户信息（昵称，头像，性别等）
          userBaseInfo = {
            nickname: "暂未昵称",
            avatar:
              "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/97f24e41-574b-4f46-8939-abbea060f3d3.png",
            sign: "感谢支持剑指题解",
          };
          // 执行更新
          await uniID.updateUser({
            uid: result.uid,
            ...userBaseInfo,
          });
        }
        // 在返回结果的userInfo中新增我们刚刚update的信息
        return {
          ...result,
          userInfo: {
            ...result.userInfo,
            ...userBaseInfo,
          },
        };
      }
    }
    public async sendSms(params, urlParams) {
      const { type, phone } = urlParams;
      return await uniID.sendSmsCode({
        mobile: phone,
        templateId: "11846",
        type,
      });
    }
    public async addUserByPhone(params: IAddUserByPhone) {
      const { username, password } = params;
      return await uniID.register({
        username,
        password,
      });
    }
    public async postLoginByPhone(params: IPostLoginByPhone) {
      const { username, password } = params;
      return await uniID.login({
        username,
        password,
      });
    }
    public async userLogout({ urlParams }) {
      const { token } = urlParams;
      return await uniID.logout(token);
    }
    public async checkToken({ urlParams }) {
      const { token } = urlParams;
      return await uniID.checkToken(token);
    }
    public async updateUserInfo(params) {
      return await uniID.updateUser({
        ...params,
      });
    }
    public async getUserContentByToken() {
      return await uniID.getUserInfoByToken(this.token);
    }
    public async getUserContentByID({ userID }) {
      // return await collection.doc(this.userID).get();
      const baseUserInfo = await uniID.getUserInfo({
        uid: userID,
      });
      if (baseUserInfo.code === 0) {
        // 获取基础用户信息
        const { total: fansCount } = await collection
          .where({
            followers: userID,
          })
          .field({ _id: true })
          .count();
        // 出题数, 调用question模块下的方法
        const question = new questionService();
        const { total: questionCount } = await question.questionCountByUserID(
          userID
        );
        // 题解数, 调用题解模块下的方法
        const questionExplanation = new explanationService();
        const {
          total: explanationCount,
        } = await questionExplanation.getExplanationCountByUser(userID);
        const { data: likeData } = await questionExplanation.getLikeCountByUser(
          userID
        );
        return {
          ...baseUserInfo,
          fansCount,
          questionCount,
          explanationCount,
          likeCount: likeData.length,
        };
      }
    }
    public async checkFollowers(params: ICheckFollowers) {
      const { follower } = params;
      // 获取当前用户关注用户信息
      let result = await uniID.getUserInfo({
        uid: this.userID,
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
        return await uniID.updateUser({
          uid: this.userID,
          followers: followers,
        });
      }
    }
  };
}
