/* tslint:disable */
export interface Article {
  /* ID，系统自动生成 */
  _id: string;
  /* 文章标题 */
  title: string;
  /* 文章内容 */
  content: string;
  /* 标签 */
  tagID: unknown[];
  /* 描述 */
  desc: string;
  /* 发布者用户 */
  userID: string;
  /* 状态 */
  state: string;
  /* 拒绝原因 */
  rejectReason: string;
  /* 创建时间 */
  createDate: string;
  /* 修改时间 */
  updateDate: string;
  /* 删除时间 */
  deleteDate: string;
}
