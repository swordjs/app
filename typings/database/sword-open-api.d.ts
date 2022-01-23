/* tslint:disable */
export interface OpenApi {
  /* ID，系统自动生成 */
  _id: string;
  /* api名称 */
  name: string;
  /* 备注 */
  remark: string;
  /* 类型，close不开放，open开放 */
  state: string;
  /* openapi的信息，其中包括url等等 */
  info: Record<string, unknown>;
  /* 创建时间 */
  createDate: string;
  /* 修改时间 */
  updateDate: string;
  /* 删除时间 */
  deleteDate: string;
}
