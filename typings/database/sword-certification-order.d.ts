/* tslint:disable */
export interface CertificationOrder {
  /* ID，系统自动生成 */
  _id: string;
  /* 状态 */
  state: string;
  /*  */
  userID: string;
  /* 审核递交的内容 */
  content: Record<string, unknown>;
  /* 创建时间 */
  createDate: string;
  /* 修改时间 */
  updateDate: string;
  /* 删除时间 */
  deleteDate: string;
}
