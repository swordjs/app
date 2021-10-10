const router: CloudRouter = {
  route: 'api/questionArea',
  service: 'questionArea',
  routes: [
    {
      action: 'getAreaList'
    },
    {
      action: 'addQuestionArea'
    },
    {
      action: 'updateQuestionArea'
    },
    {
      action: 'deleteQuestionArea'
    }
  ]
};

export = router;
