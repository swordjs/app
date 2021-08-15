module.exports = [
  {
    route: "api/user",
    service: "user",
    routes: [
      {
        route: "loginBySms",
        httpMethod: "POST",
        action: "loginBySms",
      },
      {
        route: "sendSms/{type}/{phone}",
        httpMethod: "POST",
        action: "sendSms",
      },
      {
        route: "loginByWechat/{code}",
        httpMethod: "POST",
        action: "loginByWechat",
      },
      {
        route: "bindWechat",
        httpMethod: "POST",
        action: "bindWechat",
      },
      {
        route: "loginByQQ/{code}",
        httpMethod: "POST",
        action: "loginByQQ",
      },
      {
        route: "bindQQ",
        httpMethod: "POST",
        action: "bindQQ",
      },
      {
        route: "bindMobile",
        httpMethod: "POST",
        action: "bindMobile",
      },
      {
        route: "userLogout/{token}",
        httpMethod: "GET",
        action: "userLogout",
      },
      {
        route: "resetPassword",
        httpMethod: "POST",
        action: "resetPassword",
      },
      {
        route: "checkToken/{token}",
        httpMethod: "GET",
        action: "checkToken",
      },
      {
        route: "addFollowers/{id}",
        httpMethod: "POST",
        action: "addFollowers",
      },
      {
        route: "deleteFollowers/{id}",
        httpMethod: "POST",
        action: "deleteFollowers",
      },
      {
        route: "getUserContentByToken",
        httpMethod: "GET",
        action: "getUserContentByToken",
      },
      {
        route: "getUserContentByID/{userID}",
        httpMethod: "GET",
        action: "getUserContentByID",
      },
      {
        action: "updateUserInfo",
      },
      {
        route: "checkFollowers",
        action: "checkFollowers",
        httpMethod: "PUT",
      },
    ],
  },
  {
    route: "api/questionArea",
    service: "questionArea",
    routes: [
      {
        action: "getAreaList",
      },
      {
        action: "addQuestionArea",
      },
      {
        action: "updateQuestionArea",
      },
      {
        action: "deleteQuestionArea",
      },
    ],
  },
  {
    route: "api/questionTag",
    service: "questionTag",
    routes: [
      {
        action: "getTagList",
      },
      {
        action: "addQuestionTag",
      },
      {
        action: "updateQuestionTag",
      },
      {
        action: "deleteQuestionTag",
      },
    ],
  },
  {
    route: "api/question",
    service: "question",
    routes: [
      {
        action: "addQuestion",
      },
      {
        action: "updateQuestion",
      },
      {
        action: "deleteQuestion",
      },
      {
        route: "examineQuestion",
        action: "examineQuestion",
        httpMethod: "PUT",
      },
      {
        route: "addPageView",
        action: "addPageView",
        httpMethod: "POST",
      },
      {
        action: "getQuestionList",
      },
    ],
  },
  {
    route: "api/questionExplanation",
    service: "questionExplanation",
    routes: [
      {
        action: "addQuestionExplanation",
      },
      {
        action: "updateQuestionExplanation",
      },
      {
        route: "adoptionQuestionExplanation",
        action: "adoptionQuestionExplanation",
        httpMethod: "POST",
      },
      {
        route: "collectQuestionExplanation",
        action: "collectQuestionExplanation",
        httpMethod: "POST",
      },
    ],
  },
  {
    route: "api/certificationApplyOrder",
    service: "certificationApplyOrder",
    routes: [
      {
        action: "addCertificationApplyOrder",
      },
      {
        action: "updateCertificationApplyOrder",
      },
      {
        route: "updateCertificationApplyOrderState",
        action: "updateCertificationApplyOrderState",
        httpMethod: "PUT",
      },
    ],
  },
  {
    route: "api/search",
    service: "search",
    routes: [
      {
        route: "addSeachLog",
        action: "addSeachLog",
        httpMethod: "POST",
      },
    ],
  },
  {
    route: "api/article",
    service: "article",
    routes: [
      {
        action: "addArticle",
      },
      {
        action: "updateArticle",
      },
      {
        route: "auditArticle",
        action: "auditArticle",
        httpMethod: "POST",
      },
    ],
  },
  {
    route: "api/openApi",
    service: "openApi",
    routes: [
      {
        action: "addOpenApi",
      },
      {
        action: "updateOpenApi",
      },
      {
        route: "toggleOpenApiState",
        action: "toggleOpenApiState",
        httpMethod: "POST",
      },
    ],
  },
];
