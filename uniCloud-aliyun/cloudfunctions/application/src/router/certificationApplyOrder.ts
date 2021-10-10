const router: CloudRouter = {
  route: 'api/certificationApplyOrder',
  service: 'certificationApplyOrder',
  routes: [
    {
      action: 'addCertificationApplyOrder'
    },
    {
      action: 'updateCertificationApplyOrder'
    },
    {
      route: 'updateCertificationApplyOrderState',
      action: 'updateCertificationApplyOrderState',
      httpMethod: 'PUT'
    }
  ]
};

export = router;
