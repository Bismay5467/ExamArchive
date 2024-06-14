export type TContentType = 'COMMENT' | 'POST';

export interface IReportContent {
  postId: string;
  contentType: TContentType;
  reason: { rank: number; reason: string };
}
