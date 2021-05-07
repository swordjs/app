namespace UserService {
  // 公告模块
  const uniID = require("uni-id");
  const https = require("https");
  const questionService = require("./question");
  const explanationService = require("./questionExplanation");
  const db = uniCloud.database();
  const dbCmd = db.command;
  const collection = db.collection("uni-id-users");
  const QQ_SESSION_URL = "https://api.q.qq.com/sns/jscode2session";
  // 获取QQ小程序相关的APPID和密钥
  const config = require("./../config/oauth");
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
    context: {
      CLIENTIP: string;
    };
  }
  module.exports = class User {
    public nowDate: string;
    public clientIp: string;
    public userID: string;
    public token: string;
    constructor(data: IUserData) {
      this.userID = data.userID;
      this.nowDate = new Date().toISOString();
      this.clientIp = data?.context?.CLIENTIP || "";
      this.token = data.token;
    }
    public async loginByWechat(params, urlParams: { code: string }) {
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
    public async bindWechat(params) {
      const { code, uid } = params;
      return await uniID.bindWeixin({
        uid,
        code,
      });
    }
    public loginByQQ(
      params,
      urlParams: { code: string }
    ): Promise<{
      token: string;
      uid: string;
    }> {
      return new Promise((resolve) => {
        const { nickname, avatar } = params;
        const { code } = urlParams;
        const currentTime = new Date().getTime();
        // 用户id
        let currentUserID: string = "";
        // 调用QQ接口获取openid相关信息
        this.code2sessionByQQ(code).then(async (openID) => {
          const userInfo = await collection
            .where({
              ["qq_openid"]: dbCmd.eq({
                "mp-qq": openID,
              }),
            })
            .get();
          if (userInfo.data.length === 0) {
            // 未注册, 进行注册
            const { id } = await collection.add({
              qq_openid: {
                "mp-qq": openID,
              },
              register_date: currentTime,
              register_ip: this.clientIp,
              followers: [],
              sign: "感谢支持剑指题解",
              role: ["normal"],
              nickname,
              avatar,
            });
            currentUserID = id;
          } else {
            currentUserID = userInfo.data[0]._id;
            // 登录修改 日期和ip
            await collection.doc(currentUserID).update({
              last_login_date: currentTime,
              last_login_ip: this.clientIp,
            });
          }
          // 生成token并且返回
          const { token } = await uniID.createToken({
            uid: currentUserID,
            needPermission: true,
          });
          // token创建完成之后update用户表
          await collection.doc(currentUserID).update({
            token: dbCmd.push(token),
          });
          resolve({
            token,
            uid: currentUserID,
          });
        });
      });
    }
    public bindQQ(params) {
      return new Promise((resolve) => {
        const { code, uid } = params;
        this.code2sessionByQQ(code).then(async (openID) => {
          // 修改QQ绑定
          resolve(
            await collection.doc(uid).update({
              qq_openid: {
                "mp-qq": openID,
              },
            })
          );
        });
      });
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
    public async bindMobile(params: {
      uid: string;
      mobile: string;
      code: string;
    }) {
      return await uniID.bindMobile({
        uid: params.uid,
        mobile: params.mobile,
        code: params.code,
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
    public async userLogout(params) {
      const { token } = params;
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
    private code2sessionByQQ(code: string): Promise<string | boolean> {
      return new Promise((resolve, reject) => {
        const { appid, appsecret } = config.mpqq.oauth.qq;
        https.get(
          `${QQ_SESSION_URL}?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`,
          (resp) => {
            let data: any = "";
            resp.on("data", (chunk) => {
              data += chunk;
            });
            resp.on("end", async () => {
              data = JSON.parse(data);
              if (data.errcode === 0) {
                let openID = data.openid;
                resolve(openID);
              } else {
                reject(false);
              }
            });
          }
        );
      });
    }
  };
}
