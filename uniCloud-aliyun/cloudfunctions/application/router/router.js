module.exports = [
  {
    route: "api/user",
    service: "user",
    routes: [
      {
        action: "addUserByPhone",
      },
      {
        route: "loginByWechat/{code}",
        httpMethod: "POST",
        action: "loginByWechat",
      },
      {
        route: "postLoginByPhone",
        httpMethod: "POST",
        action: "postLoginByPhone",
      },
      {
        route: "userLogout/{token}",
        httpMethod: "GET",
        action: "userLogout",
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
        route: "getUserContentByID",
        httpMethod: "GET",
        action: "getUserContentByID"
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
        action: "getAreaList"
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
        action: "getTagList"
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
        action: "addQuestionExplanation"
      }
    ],
  }
];
