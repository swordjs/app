namespace User {
  const explain = require("explain");
  const userService = require("../service/user");
  // 工具函数
  const { appErrorMessage, handleMustRequireParam } = require("app-tools");
  module.exports = class User extends explain.service {
    async hanlder(methodName: string, urlParams?: any) {
      const service = new userService({
        context: this.context
      });
      return await service[methodName](this.event.params, urlParams);
    }
    // 微信登录
    async loginByWechat(urlParams) {
      return await this.hanlder("loginByWechat", urlParams);
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
            return await this.hanlder("addUserByPhone");
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
            return await this.hanlder("postLoginByPhone");
          }
        })
        .catch((err) => {
          return err;
        });
    }

    // 用户登出, 登出需要客户端删除持久性缓存
    async userLogout(urlParams) {
      return await this.hanlder("userLogout", urlParams);
    }

    // 校验Token是否有效
    async checkToken(urlParams) {
      return await this.hanlder("checkToken", urlParams);
    }

    // 更新用户信息
    async updateUserInfo() {
      return handleMustRequireParam(
        [
          {
            key: "uid",
            value: "用户ID",
          },
          {
            key: "nickname",
            value: "昵称",
          },
          {
            key: "gender",
            value: "性别",
          },
          {
            key: "avatar",
            value: "头像",
          },
        ],
        this.event.params
      )
        .then(async () => {
          return await this.hanlder("updateUserInfo");
        })
        .catch((error) => error);
    }
    /**
     * 检查用户关注状态，若已关注，则取消关注，若没关注，则直接关注
     * @author mrc
     */
    async checkFollowers() {
      return handleMustRequireParam(
        [
          {
            key: "follower",
            value: "关注ID",
          },
        ],
        this.event.params
      )
        .then(async () => {
          return await this.hanlder("checkFollowers");
        })
        .catch((err) => err);
    }
  };
}
