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
  return request;
});

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use((response) => {
  return response.data;
});

export default (params: RequestParams): Promise<ActionResult> => {
  return new Promise((resolve, reject) => {
    fly
      .request(
        `https://c7e81452-9d28-4486-bedc-5dbf7c8386a5.bspapp.com/http/v1/${params.data.route}`,
        {
          ...params.data,
          // service注明服务名称，按照规范是action的/之后的内容
          service: params.data.route.substr(params.data.route.indexOf('/') + 1)
        },
        {
          method: params?.data?.method || 'POST',
          timeout: 5000
        }
      )
      .then((res) => {
        console.log(res);
        resolve(res);
      });
  });
};
