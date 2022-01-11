import Fly from 'flyio/dist/npm/wx';
import notLogin from '../util/notLogin';

const fly = new Fly();

type RequestParams = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  route: `api/${string}`;
  data: Record<string, unknown>;
  checkLogin?: boolean;
};

// 添加请求拦截器
fly.interceptors.request.use((request) => {
  // 如果命令登录检查
  if (request.body.checkLogin) {
    notLogin();
  }
  // uni-id-token
  const token = uni.getStorageSync('uni_id_token');
  const id = uni.getStorageSync('uni_id');
  if (token) {
    request.headers['uni-id-token'] = token;
    request.headers['uni-id'] = id;
  }
  request.headers['sword-platform'] = process.env.UNI_PLATFORM;
  return request;
});

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use((response) => {
  return response.data;
});

export default <T = unknown>(params: RequestParams): Promise<ActionResult<T>> => {
  return new Promise((resolve, reject) => {
    fly
      .request(`${process.env.NODE_ENV ? process.env.VUE_APP_V1_RELEASE_API_HTTP_URL : process.env.VUE_APP_V1_API_HTTP_URL}${params.route}`, params.data, {
        method: params?.method || 'POST',
        timeout: 5000
      })
      .then((res) => {
        let response: ActionResult<T> = {
          success: true,
          data: res
        };
        if (res.code) {
          // 判断code是否存在于errorMessage对象中
          if (res.code !== 0) {
            response = {
              success: false
            };
            uni.hideLoading();
            uni.showToast({
              title: res.message,
              icon: 'none'
            });
          }
        }
        resolve(response);
      });
  });
};
