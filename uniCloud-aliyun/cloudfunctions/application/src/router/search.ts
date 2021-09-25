const router: CloudRouter = {
  route: 'api/search',
  service: 'search',
  routes: [
    {
      route: 'addSeachLog',
      action: 'addSeachLog',
      httpMethod: 'POST'
    }
  ]
};

export default router;
