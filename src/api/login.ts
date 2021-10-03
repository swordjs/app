import request from '../common/request';

type UserInfo = {
  gender: number;
  avatarUrl: string;
  nickName: string;
};

/**
 * @name 微信登录
 * @param userInfo
 * @param res
 * @returns
 */
export async function loginByWechat(userInfo: UserInfo, res: { code: string }): Promise<ActionResult> {
  return await request({
    method: 'POST',
    route: `api/user/loginByWechat`,
    data: {
      code: res.code,
      gender: userInfo.gender,
      avatar: userInfo.avatarUrl,
      nickname: userInfo.nickName
    }
  });
}

/**
 * @name QQ登录
 * @param userInfo
 * @param res
 * @returns
 */
export async function loginByQQ(userInfo: UserInfo, res: { code: string }): Promise<ActionResult> {
  return await request({
    route: `api/user/loginByQQ`,
    method: 'POST',
    data: {
      code: res.code,
      gender: userInfo.gender,
      avatar: userInfo.avatarUrl,
      nickname: userInfo.nickName
    }
  });
}

/**
 * @name 绑定微信
 * @param params
 * @returns
 */
export async function bindWechat(params: { code: string }): Promise<ActionResult> {
  return await request({
    route: `api/user/bindWechat`,
    method: 'POST',
    data: {
      code: params.code,
      uid: uni.getStorageSync('uni_id')
    }
  });
}

/**
 * @name 绑定QQ
 * @param params
 * @returns
 */
export async function bindQQ(params: { code: string }): Promise<ActionResult> {
  return await request({
    route: `api/user/bindQQ`,
    method: 'POST',
    data: {
      code: params.code,
      uid: uni.getStorageSync('uni_id')
    }
  });
}

/**
 * @name 发送短信验证码
 * @param params
 * @returns
 */
export async function sendSms(params: { phone: string; type: string }): Promise<ActionResult> {
  return await request({
    route: `api/user/sendSms`,
    method: 'POST',
    data: params
  });
}

/**
 * @name 绑定手机号
 * @param params
 * @returns
 */
export async function bindMobile(params: { uid: string; mobile: string; code: string }): Promise<ActionResult> {
  return await request({
    route: `api/user/bindMobile`,
    method: 'POST',
    data: params
  });
}

/**
 * @name 根据验证码进行登录
 * @param params
 * @returns
 */
export async function loginBySms(params: { phone: string; code: string }): Promise<unknown> {
  return await request({
    route: `api/user/loginBySms`,
    method: 'POST',
    data: params
  });
}

export async function logout(params: { token: string }): Promise<ActionResult> {
  return await request({
    route: `api/user/userLogout`,
    method: 'GET',
    data: {
      token: params.token
    }
  });
}
