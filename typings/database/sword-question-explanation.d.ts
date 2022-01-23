/* tslint:disable */
export interface QuestionExplanation {
  /* ID，系统自动生成 */
  _id: string;
  /*  */
  questionID: Record<string, unknown>;
  /*  */
  userID: Record<string, unknown>;
  /* 解答内容 */
  content: string;
  /* 用户赞同 */
  userAgreed: unknown[];
  /* 用户不赞同 */
  userDisagreed: unknown[];
  /* 创建时间 */
  createDate: string;
  /* 修改时间 */
  updateDate: string;
  /* 删除时间 */
  deleteDate: string;
}
