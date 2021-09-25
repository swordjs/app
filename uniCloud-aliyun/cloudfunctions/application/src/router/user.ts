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
      route: 'sendSms/{type}/{phone}',
      httpMethod: 'POST',
      action: 'sendSms'
    },
    {
      route: 'loginByWechat/{code}',
      httpMethod: 'POST',
      action: 'loginByWechat'
    },
    {
      route: 'bindWechat',
      httpMethod: 'POST',
      action: 'bindWechat'
    },
    {
      route: 'loginByQQ/{code}',
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
      route: 'userLogout/{token}',
      httpMethod: 'GET',
      action: 'userLogout'
    },
    {
      route: 'resetPassword',
      httpMethod: 'POST',
      action: 'resetPassword'
    },
    {
      route: 'checkToken/{token}',
      httpMethod: 'GET',
      action: 'checkToken'
    },
    {
      route: 'addFollowers/{id}',
      httpMethod: 'POST',
      action: 'addFollowers'
    },
    {
      route: 'deleteFollowers/{id}',
      httpMethod: 'POST',
      action: 'deleteFollowers'
    },
    {
      route: 'getUserContentByToken',
      httpMethod: 'GET',
      action: 'getUserContentByToken'
    },
    {
      route: 'getUserContentByID/{userID}',
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
    }
  ]
};

export default router;
