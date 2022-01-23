/* tslint:disable */
export interface Question {
  /* ID，系统自动生成 */
  _id: string;
  /*  */
  publishUserID: string;
  /*  */
  tagID: unknown[];
  /*  */
  areaID: unknown[];
  /* 标题 */
  title: string;
  /* 内容 */
  content: string;
  /* 状态 */
  state: string;
  /* 预览次数 */
  pageView: number;
  /* 创建时间 */
  createDate: string;
  /* 修改时间 */
  updateDate: string;
  /* 删除时间 */
  deleteDate: string;
}
