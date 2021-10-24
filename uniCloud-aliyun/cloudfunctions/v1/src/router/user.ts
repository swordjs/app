const router: CloudRouter = {
  route: 'api/user',
  service: 'user',
  routes: [
    {
      route: 'loginBySms',
      httpMethod: 'POST',
      action: 'loginBySms'
    },
    {
      route: 'sendSms',
      httpMethod: 'POST',
      action: 'sendSms'
    },
    {
      route: 'loginByWechat',
      httpMethod: 'POST',
      action: 'loginByWechat'
    },
    {
      route: 'bindWechat',
      httpMethod: 'POST',
      action: 'bindWechat'
    },
    {
      route: 'loginByQQ',
      httpMethod: 'POST',
      action: 'loginByQQ'
    },
    {
      route: 'bindQQ',
      httpMethod: 'POST',
      action: 'bindQQ'
    },
    {
      route: 'bindMobile',
      httpMethod: 'POST',
      action: 'bindMobile'
    },
    {
      route: 'userLogout',
      httpMethod: 'GET',
      action: 'userLogout'
    },
    {
      route: 'resetPassword',
      httpMethod: 'POST',
      action: 'resetPassword'
    },
    {
      route: 'checkToken',
      httpMethod: 'GET',
      action: 'checkToken'
    },
    {
      route: 'getUserContentByToken',
      httpMethod: 'GET',
      action: 'getUserContentByToken'
    },
    {
      route: 'getUserContentByID',
      httpMethod: 'GET',
      action: 'getUserContentByID'
    },
    {
      action: 'updateUserInfo'
    },
    {
      route: 'checkFollowers',
      action: 'checkFollowers',
      httpMethod: 'PUT'
    },
    {
      route: 'resetRequestNumber',
      action: 'resetRequestNumber',
      httpMethod: 'POST'
    }
  ]
};

export = router;
