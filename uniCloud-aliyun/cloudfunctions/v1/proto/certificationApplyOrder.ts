export interface AddCertificationApplyOrder {
  content: {
    contactDetails: string;
    filed: string;
    identity: string;
    socialHomepage: string;
  };
}

export interface UpdateCertificationApplyOrder {
  _id: string;
  content: string;
}

export interface UpdateCertificationApplyOrderState {
  _id: string;
  state: string;
}

export interface GetCertificationApplyOrder {
  state: string;
  limit: number;
  page: number;
}
