export declare interface Context {
  // 客户端ip信息
  CLIENTIP: string;
  // 客户端user-agent
  CLIENTUA: string;
  // 当前环境信息 {spaceId:'xxx',provider:'tencent'}
  SPACEINFO: string;
}

// 调用explain框架的event，普通云函数的event就是传递的参数
export declare interface ExplainEvent {
  service: string;
  action: string;
  data: unknown;
  headers: Record<string, string>;
}
