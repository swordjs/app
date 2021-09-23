export interface IAddQuestionArea {
  name: string;
  iconPath: string;
}

export interface IGetAreaList {
  limit: number;
  page: number;
  name: string;
  iconPath: string;
}

export interface IUpdateQuestionArea {
  _id: string;
  name: string;
  iconPath: string;
}

export interface IDeleteQuestionArea {
  _id: string;
}
