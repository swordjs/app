const router: CloudRouter = {
  route: 'api/openApi',
  service: 'openApi',
  routes: [
    {
      action: 'addOpenApi'
    },
    {
      action: 'updateOpenApi'
    },
    {
      route: 'toggleOpenApiState',
      action: 'toggleOpenApiState',
      httpMethod: 'POST'
    },
    {
      route: 'getQuestionList',
      action: 'getQuestionList',
      httpMethod: 'GET'
    },
    {
      route: 'getQuestionAreaList',
      action: 'getQuestionAreaList',
      httpMethod: 'GET'
    },
    {
      route: 'getQuestionTag',
      action: 'getQuestionTag',
      httpMethod: 'GET'
    }
  ]
};

export default router;
