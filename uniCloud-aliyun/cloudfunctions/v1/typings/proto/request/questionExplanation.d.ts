export interface AddQuestionExplanation {
  _id: string;
  content: string;
}

export interface UpdateQuestionExplanation {
  _id: string;
  content: string;
}

export interface AdoptionQuestionExplanation {
  _id: string;
}

export interface CollectQuestionExplanation {
  _id: string;
}

export type GetExplanationCountByUser = string;
export type GetLikeCountByUser = string;
