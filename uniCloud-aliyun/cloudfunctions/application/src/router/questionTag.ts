const router: CloudRouter = {
  route: 'api/questionTag',
  service: 'questionTag',
  routes: [
    {
      action: 'getTagList'
    },
    {
      action: 'addQuestionTag'
    },
    {
      action: 'updateQuestionTag'
    },
    {
      action: 'deleteQuestionTag'
    }
  ]
};

export default router;
