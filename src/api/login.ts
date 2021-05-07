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
 * @name 绑定手机号
 * @param params 
 * @returns 
 */
export async function bindMobile(params: {
  uid: string;
  mobile: string;
  code: string;
}): Promise<ActionResult> {
  return await callFunction({
    name: "application",
    data: {
      route: `api/user/bindMobile`,
      method: "POST",
      params
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


export async function logout(params: {
  token: string
}): Promise<ActionResult> {
  return await callFunction({
    name: "application",
    data: {
      route: `api/user/userLogout/${params.token}`,
      method: "GET"
    },
  });
}