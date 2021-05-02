type CallFunctionParams = {
  name: string;
  data: {
    route: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    params?: object;
  };
  checkLogin?: boolean;
};
const errorMessage = {
  401: "您暂未登录或登录状态过期",
};
import notLogin from "../util/notLogin";

/**
 * @name 查询是否登录
 * @returns Boolean
 */
const checkLogin = (): boolean => {
  const token: string = uni.getStorageSync("uni_id_token");
  return token !== "";
};
/**
 * @name 云函数调用
 * @params params
 * @returns Promise<ActionResult>
 */
export default (params: CallFunctionParams): Promise<ActionResult> => {
  return new Promise(async (resolve) => {
    // 如果接口注明需要验证token，如果没传递，则不会执行请求
    if (params.checkLogin) {
      notLogin();
    }
    const { result } = await uniCloud.callFunction({
      name: params.name,
      data: {
        route: params.data.route,
        method: params.data.method,
        params: params.data.params,
      },
    });
    let response: ActionResult = {
      success: true,
      data: result,
    };
    if (result.code) {
      // 判断code是否存在于errorMessage对象中
      if (result.code in errorMessage) {
        response = {
          success: false,
        };
        uni.hideLoading();
        uni.showToast({
          title: errorMessage[result.code],
          icon: "none",
        });
      }
    }
    resolve(response);
  });
};
