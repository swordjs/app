namespace User {
  const explain = require("explain");
  // 公告模块
  const uniID = require("uni-id");
  // 工具函数
  const { appErrorMessage, handleMustRequireParam } = require("app-tools");
  module.exports = class User extends explain.service {
    // 微信登录
    async loginByWechat({ code }) {
      // 把用户信息也添加到库中
      const res = await uniID.loginByWeixin({
        code,
      });
      // 更新用户信息（昵称，头像，性别等）
      await uniID.updateUser({
        uid: res.uid,
        ...this.event.params,
      });
      return res;
    }
    // 注册用户根据手机号
    addUserByPhone() {
      return handleMustRequireParam(
        [
          {
            key: "username",
            value: "用户名",
          },
          {
            key: "password",
            value: "密码",
          },
        ],
        this.event.params
      )
        .then(async () => {
          const { username, password } = this.event.params;
          if (!/^1[3456789]\d{9}$/.test(username)) {
            return appErrorMessage("用户名格式不正确");
          } else if (password === "" || password.length < 6) {
            return appErrorMessage("密码格式不正确");
          } else {
            // 校验手机号
            return await uniID.register({
              username,
              password,
            });
          }
        })
        .catch((err) => {
          return err;
        });
    }

    // 用户登录根据手机号
    postLoginByPhone() {
      return handleMustRequireParam(
        [
          {
            key: "username",
            value: "用户名",
          },
          {
            key: "password",
            value: "密码",
          },
        ],
        this.event.params
      )
        .then(async () => {
          const { username, password } = this.event.params;
          if (!/^1[3456789]\d{9}$/.test(username)) {
            return appErrorMessage("用户名格式不正确");
          } else if (password === "" || password.length < 6) {
            return appErrorMessage("密码格式不正确");
          } else {
            // 校验手机号
            return await uniID.login({
              username,
              password,
            });
          }
        })
        .catch((err) => {
          return err;
        });
    }

    // 用户登出, 登出需要客户端删除持久性缓存
    async userLogout({ token }) {
      return await uniID.logout(token);
    }

    // 校验Token是否有效
    async checkToken({ token }) {
      return await uniID.checkToken(token);
    }

    // 更新用户信息
    async updateUserInfo() {
      // 更改昵称，性别，头像等信息
      if (!this.event.params.hasOwnProperty("uid")) {
        return appErrorMessage("用户ID为必填");
      }
      // 确定字段是否存在于限定字段之内
      const specifiedParam = ["nickname", "gender", "avatar"];
      // 查看event传入的参数，除了uid，有没有传入其他的参数
      for (let key in this.event.params) {
        if (key !== "uid") {
          let resultIndex = specifiedParam.indexOf(key);
          if (resultIndex < 0) {
            return appErrorMessage(`${key}参数不合法`);
          }
        }
      }
      return await uniID.updateUser({
        ...this.event.params,
      });
    }
	
	/**
	 * 检查用户关注状态，若已关注，则取消关注，若没关注，则直接关注
	 * @author mrc
	 */
	async checkFollowers() {
		return handleMustRequireParam(
		  [
		    {
		      key: "uid",
		      value: "用户ID",
		    },
		    {
		      key: "follower",
		      value: "关注ID",
		    },
		  ],
		  this.event.params
		).then(async () => {
			
			let {uid,follower} = this.event.params;
			
			// 获取当前用户关注用户信息
			const followers = await uniID.getUserInfo({
			    uid: uid,
			    field: ['followers']
			})
			
			// 查询下标
			const index = followers.indexOf(follower);
				
			if (index === -1) {
				followers.push(follower);
			} else {
				followers.splice(index,1)
			}
			
			// 更新数据库
			return await uniID.updateUser({
			  uid: uid,
			  followers: followers
			});
		}).catch((err) => {
          return err;
        })
	}
  };
}
