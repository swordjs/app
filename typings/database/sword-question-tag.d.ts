/* tslint:disable */
export interface QuestionTag {
  /* ID，系统自动生成 */
  _id: string;
  /* 标签名称 */
  name: string;
  /* 专区id */
  areaID: Record<string, unknown>;
  /* 创建时间 */
  createDate: string;
  /* 修改时间 */
  updateDate: string;
  /* 删除时间 */
  deleteDate: string;
}
