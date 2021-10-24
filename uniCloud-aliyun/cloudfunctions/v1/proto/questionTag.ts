export interface GetTagList {
  limit: number;
  page: number;
}
export interface AddQuestionTag {
  areaID: string;
  name: string;
}
export interface UpdateQuestionTag {
  _id: string;
  areaID: string;
  name: string;
}
export interface DeleteQuestionTag {
  _id: string;
}
