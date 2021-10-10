export default (callback?: (userID?: string) => void): void => {
  // 获取ID，判断是否有登录
  const userID = uni.getStorageSync('uni_id');
  if (userID === '') {
    uni.showModal({
      title: '提示',
      content: '您暂未登录，请登陆后再试试',
      confirmText: '登录',
      success: (res: unknown) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/user/login?from=1'
          });
        }
      }
    });
  } else {
    callback && callback(userID);
  }
};
