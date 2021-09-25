declare interface CloudContext {
  // 客户端ip信息
  CLIENTIP: string;
  // 客户端user-agent
  CLIENTUA: string;
  // 当前环境信息 {spaceId:'xxx',provider:'tencent'}
  SPACEINFO: string;
  userID?: string;
  token?: string;
}

// 调用explain框架的event，普通云函数的event就是传递的参数
declare interface ExplainCloudEvent {
  service: string;
  action: string;
  data: unknown;
  headers: Record<string, string>;
}

declare type CloudData = { event: ExplainCloudEvent; context: CloudContext; explain: unknown };
// 请求方法类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

declare type CloudRouter = {
  route: `api/${string}`;
  service: string;
  routes: {
    route?: string;
    action: string;
    httpMethod?: HttpMethod | HttpMethod[];
  }[];
};
