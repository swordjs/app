export interface AddQuestionArea {
  name: string;
  iconPath: string;
}

export interface GetAreaList {
  limit: number;
  page: number;
  name: string;
  iconPath: string;
}

export interface UpdateQuestionArea {
  _id: string;
  name: string;
  iconPath: string;
}

export interface DeleteQuestionArea {
  _id: string;
}
