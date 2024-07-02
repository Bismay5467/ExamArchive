export type TContentType = 'COMMENT' | 'POST';

export interface IReportContent {
  postId: string;
  contentType: TContentType;
  reason: { rank: number; reason: string };
}

export interface IResolveReport {
  reportId: string;
  postId: string;
  contentType: TContentType;
}

export interface IReportPreview {
  createdAt: string;
  docModel: string;
  postId: string;
  reasons: Array<string>;
  totalReport: number;
  updatedAt: string;
  __v: number;
  _id: string;
}
