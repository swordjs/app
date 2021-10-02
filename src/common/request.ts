const Fly = require('flyio/dist/npm/wx');
import notLogin from '../util/notLogin';

const fly = new Fly();

type RequestParams = {
  data: {
    action?: string;
    route: `api/${string}`;
    data?: Record<string, unknown>;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  };
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
  if (token) request.headers['uni-id-token'] = token;
  const id = uni.getStorageSync('uni_id');
  if (id) request.headers['uni_id'] = id;
  return request;
});

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use((response) => {
  return response.data;
});

export default (params: RequestParams): Promise<ActionResult> => {
  // 获取需要传递参数的route，如果params中的route是 api/user/loginByWechat/* ，我们需要将loginByWechat/*这一部分给后端传递
  // console.log(params.data.route.substr(params.data.route.indexOf(params.data.route.split('/')[1])));
  const service = params.data.route.split('/')[1];
  const route = params.data.route.substr(params.data.route.indexOf(service) + service.length + 1);
  return new Promise((resolve, reject) => {
    fly
      .request(
        `https://c7e81452-9d28-4486-bedc-5dbf7c8386a5.bspapp.com/http/v1/${params.data.route}`,
        {
          ...params.data,
          route,
          service,
          // service注明服务名称，按照规范是action的/之后的内容
          action: params.data.action || params.data.route.split('/')[2]
        },
        {
          method: params?.data?.method || 'POST',
          timeout: 5000
        }
      )
      .then((res) => {
        let response: ActionResult = {
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
