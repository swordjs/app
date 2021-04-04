import callFunction from "./../common/callFunction";

/**
 * @name 微信登录
 * @param userInfo
 * @param res
 * @returns
 */
export async function loginByWechat(userInfo, res) {
  return await callFunction({
    name: "application",
    data: {
      route: `api/user/loginByWechat/${res.code}`,
      method: "POST",
      params: {
        gender: userInfo.gender,
        avatar: userInfo.avatarUrl,
        nickname: userInfo.nickName,
      },
    },
  });
}
