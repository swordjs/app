export interface AddArticle {
  title: string;
  content: string;
  tagID: string[];
  desc: string;
}

export interface UpdateArticle {
  id: string;
  title: string;
  content: string;
  tagID: string[];
}

export interface AuditArticle {
  id: string;
  state: string;
  rejectReason?: string;
}
