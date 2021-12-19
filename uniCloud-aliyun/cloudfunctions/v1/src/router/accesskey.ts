const router: CloudRouter = {
  route: 'api/accesskey',
  service: 'accesskey',
  routes: [
    {
      route: 'generateAccesskey',
      action: 'generateAccesskey',
      httpMethod: 'POST'
    }
  ]
};

export = router;
