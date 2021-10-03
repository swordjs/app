type _OtherLoginPlatformParams = {
  code: string;
  nickname: string;
  avatar: string;
  gender: number;
};

export type LoginByWechat = _OtherLoginPlatformParams;
export type LoginByQQ = _OtherLoginPlatformParams;

type _OtherBindPlatformParams = {
  code: string;
  uid: string;
};

export type BindWechat = _OtherBindPlatformParams;
export type BindQQ = _OtherBindPlatformParams;
export type BindMobile = _OtherBindPlatformParams & {
  mobile: string;
};

export interface LoginBySms {
  phone: string;
  code: string;
}

export interface UserLogout {
  token: string;
}

export interface UpdateUserInfo {
  nickname: string;
  avatar: string;
  gender: string;
}

export interface ResetPassword {
  id: string;
  password: string;
}

export interface CheckFollowers {
  uid: string;
  follower: string;
}

export interface SendSms {
  type: string;
  phone: string;
}

export interface CheckToken {
  token: string;
}

export interface GetUserContentByID {
  id: string;
}
