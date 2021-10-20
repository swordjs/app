type _state = 'pass' | 'reject';
export interface AddQuestion {
  title: string;
  areaID: string;
  content: string;
  tagID: string[];
}

export interface UpdateQuestion {
  _id: string;
  title: string;
  areaID: string;
  content?: string;
  tagID?: string;
}

export interface DeleteQuestion {
  _id: string;
}

export interface ExamineQuestion {
  _id: string;
  state: _state;
  examineInfo?: {
    reason: string;
  };
}

export interface GetQuestionList {
  state: _state;
  limit: number;
  page: number;
}

export interface AddPageView {
  _id: string;
}
export interface GetSampleQuestionList {
  areaID?: string;
  size?: number;
}
