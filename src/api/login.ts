let uniCloud: any;
export async function loginByWechat(userInfo, res) {
  const { success, result } = await uniCloud.callFunction({
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
  return {
    success,
    result,
  };
}
