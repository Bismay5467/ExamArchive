export type TRatingType = 'HELPFUL' | 'STANDARD' | 'RELEVANCE';

export interface IRating {
  postId: string;
  ratingArray: Array<{ type: TRatingType; value: number }>;
}
