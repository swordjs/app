export interface AddOpenApi {
  name: string;
  remark: string;
  info: string;
}

export interface UpdateOpenApi {
  id: string;
  name: string;
  remark: string;
  info: string;
}

export interface ToggleOpenApiState {
  id: string;
  state: 'close' | 'open';
}

export interface GetQuestionList {
  page: number;
  areaID?: string;
}
