const router: CloudRouter = {
  route: 'api/questionExplanation',
  service: 'questionExplanation',
  routes: [
    {
      action: 'addQuestionExplanation'
    },
    {
      action: 'updateQuestionExplanation'
    },
    {
      route: 'adoptionQuestionExplanation',
      action: 'adoptionQuestionExplanation',
      httpMethod: 'POST'
    },
    {
      route: 'collectQuestionExplanation',
      action: 'collectQuestionExplanation',
      httpMethod: 'POST'
    }
  ]
};

export default router;
