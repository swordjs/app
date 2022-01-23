import { ActionResult } from '../../typings';
import request from '../common/request';
const db = uniCloud.database();

/**
 * @name 关注用户
 * @param params
 * @returns
 */
export async function postFollow(params: { targetID: string }): Promise<ActionResult> {
  return await request({
    route: `api/user/checkFollowers`,
    method: 'PUT',
    data: {
      follower: params.targetID
    },
    checkLogin: true
  });
}

/**
 * @name 获取用户首页的信息（赞同数，解题数等）
 * @param params
 * @returns
 */
export async function getUserContentByID(params: { userID: string }): Promise<ActionResult> {
  return await request({
    route: `api/user/getUserContentByID`,
    method: 'GET',
    data: {
      id: params.userID
    }
  });
}

/**
 * @name 获取用户基本信息根据UserID
 * @param params
 */
export async function getUserBaseContentByUserID(params: { userID: string }): Promise<ActionResult> {
  const res = await db
    .collection('uni-id-users')
    .where({
      _id: params.userID
    })
    .field('nickname,avatar,followers,sign,gender,wx_openid,qq_openid,mobile,mobile_confirmed')
    .get();
  return {
    ...res,
    data: res.result.data
  };
}

/**
 * @name 重置已登陆账户的密码
 * @param params
 */
export async function resetPassword(params: { password: string }): Promise<ActionResult> {
  return await request({
    route: `api/user/resetPassword`,
    method: 'POST',
    data: {
      password: params.password,
      id: uni.getStorageSync('uni_id')
    },
    checkLogin: true
  });
}

export async function updateUserProfile(params: { nickname: string; avatar: string; gender: number; sign: string }): Promise<ActionResult> {
  return await request({
    route: `api/user`,
    method: 'PUT',
    data: {
      ...params,
      uid: uni.getStorageSync('uni_id')
    },
    checkLogin: true
  });
}
