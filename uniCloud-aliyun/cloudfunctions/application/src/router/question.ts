const router: CloudRouter = {
  route: 'api/question',
  service: 'question',
  routes: [
    {
      action: 'addQuestion'
    },
    {
      action: 'updateQuestion'
    },
    {
      action: 'deleteQuestion'
    },
    {
      route: 'examineQuestion',
      action: 'examineQuestion',
      httpMethod: 'PUT'
    },
    {
      route: 'addPageView',
      action: 'addPageView',
      httpMethod: 'POST'
    },
    {
      action: 'getQuestionList'
    },
    {
      route: 'getSampleQuestionList',
      action: 'getSampleQuestionList',
      httpMethod: 'GET'
    }
  ]
};

export = router;
