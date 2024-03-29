'use strict';

const uniID = require('uni-id');
const db = uniCloud.database();
const dbCmd = db.command;
const userCollection = db.collection('uni-id-users');
const apiCollection = db.collection('openApi');

exports.main = async (event, context) => {
  // 判断请求类型，如果非post就不处理
  if (event.httpMethod !== 'POST') {
    return error({
      code: 406,
      message: '请求类型必须为post'
    });
  }
  const { token = '', apiID = '' } = event.queryStringParameters;
  // 获取请求体中的值
  let body = event.body;
  // 判断是否是json字符串，如果是就转换一下
  if (event.body !== '' && typeof event.body === 'string') {
    body = JSON.parse(body);
  }
  // 判断token和apiID是否传递了
  if (token === '' || apiID === '') {
    return error({
      code: 406,
      message: 'token和apiID为必传'
    });
  }
  // 检查token
  const checkTokenResult = await uniID.checkToken(token, {
    needUserInfo: true
  });
  if (checkTokenResult.code === 0) {
    const { uid: userID } = checkTokenResult;
    // 处理apiID逻辑
    return await handleApi({
      apiID,
      uniIdToken: token,
      userID,
      body
    });
  } else {
    // token校验失败
    return error({
      code: checkTokenResult.code,
      message: checkTokenResult.errDetail + ' ' + checkTokenResult.errMsg
    });
  }
  //返回数据给客户端
  return token;
};

// 错误处理
const error = (params) => {
  return {
    code: params.code,
    message: params.message
  };
};

// 校验openapi传入的参数和api规定的是否合规
const verificationParameters = (params, role) => {
  // 获取规则中的必传参数
  const requiredKeys = role.filter((r) => r.required).map((m) => m.key);
  // 在已传参数中查询，看看哪个已传参数，实际并没有传递
  const parmasKeys = Object.keys(params);
  for (let key in requiredKeys) {
    if (!parmasKeys.includes(requiredKeys[key])) {
      return {
        success: false,
        message: `已传参数没有包含规定参数:${requiredKeys[key]}`
      };
    }
  }
  return {
    success: true
  };
};

// 检查apiid，并且处理返回逻辑
const handleApi = async (params) => {
  const { apiID, uniIdToken, body, userID } = params;
  const apiResult = await apiCollection.doc(apiID).get();
  if (apiResult.data.length === 0) {
    return error({
      code: 406,
      message: '您查询的api不存在'
    });
  } else {
    // 查询成功, 获取开放api的详情
    // 判断api的状态，如果是close，那就不能访问
    let result = apiResult.data[0];
    if (result.state === 'close') {
      return error({
        code: 501,
        message: '该api目前是关闭/维护等不可使用状态，请联系管理员'
      });
    } else if (result.state === 'open') {
      // 请求url, 获取其中的info
      const { url } = result.info;
      // 查询参数是否符合开发api的规范
      const checkParamsResult = verificationParameters(body, url.params);
      if (checkParamsResult.success) {
        // openapi云函数调用对象中的函数
        const res = await uniCloud.callFunction({
          name: url.name,
          data: {
            route: url.route,
            method: url.method,
            params: body,
            uniIdToken
          }
        });
        if (!res.success) {
          return error({
            code: 502,
            message: 'api远端服务出现错误，请稍后再试或者联系管理员'
          });
        } else if (res.success && res.result.code > 1) {
          // 远端服务的连接没问题，但是内部出现了其他错误，比如字段没传，或者其他问题
          return error({
            code: 502,
            message: `api远端服务连接无误，但是在执行中出现了错误 ${res.result.msg}`
          });
        } else if (res.success) {
          await handleUserRequestNumber(userID);
          // 连接和执行都没问题，返回它的结果
          return {
            code: 200,
            result: res.result
          };
        }
      } else {
        // 返回校验参数的错误
        return error({
          code: 406,
          message: checkParamsResult.message
        });
      }
    }
  }
};

// 减去相关用户的调用次数
const handleUserRequestNumber = async (userID) => {
  return await userCollection.doc(userID).update({
    openApiRequestNumber: dbCmd.inc(-1)
  });
};
