import callFunction from "./../common/callFunction";

/**
 * @name 微信登录
 * @param userInfo
 * @param res
 * @returns
 */
export async function loginByWechat(userInfo, res): Promise<ActionResult> {
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

/**
 * @name QQ登录
 * @param userInfo 
 * @param res 
 * @returns 
 */
export async function loginByQQ(userInfo, res): Promise<ActionResult> {
  return await callFunction({
    name: "application",
    data: {
      route: `api/user/loginByQQ/${res.code}`,
      method: "POST",
      params: {
        gender: userInfo.gender,
        avatar: userInfo.avatarUrl,
        nickname: userInfo.nickName,
      },
    },
  });
}

/**
 * @name 发送短信验证码
 * @param params
 * @returns
 */
export async function sendSms(params: {
  phone: string;
  type: string;
}): Promise<ActionResult> {
  return await callFunction({
    name: "application",
    data: {
      route: `api/user/sendSms/${params.type}/${params.phone}`,
      method: "POST",
      params: {},
    },
  });
}

/**
 * @name 根据验证码进行登录
 * @param params 
 * @returns 
 */
export async function loginBySms(params: {
  phone: string;
  code: string;
}): Promise<any> {
  return await callFunction({
    name: "application",
    data: {
      route: `api/user/loginBySms`,
      method: "POST",
      params,
    },
  });
}
