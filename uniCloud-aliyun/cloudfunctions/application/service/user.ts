namespace UserService {
  // 公告模块
  const uniID = require("uni-id");
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
      // 把用户信息也添加到库中
      const res = await uniID.loginByWeixin({
        code,
        needPermission: true, // 返回权限
      });
      // 更新用户信息（昵称，头像，性别等）
      await uniID.updateUser({
        uid: res.uid,
        ...params,
      });
      return res;
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
      return await uniID.getUserInfo({
        uid: userID,
      });
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
