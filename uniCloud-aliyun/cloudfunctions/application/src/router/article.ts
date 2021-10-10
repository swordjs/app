const router: CloudRouter = {
  route: 'api/article',
  service: 'article',
  routes: [
    {
      action: 'addArticle'
    },
    {
      action: 'updateArticle'
    },
    {
      route: 'auditArticle',
      action: 'auditArticle',
      httpMethod: 'POST'
    }
  ]
};

export = router;
