import { RATING_TYPE } from '../../constants/constants/filePreview';

export type TComment = 'COMMENTS' | 'REPLIES';
export type TCommentReact = 'UPVOTE' | 'DOWNVOTE';
export type TReaction = 'LIKE' | 'UNLIKE';

export interface IRatingInfo {
  ratingType: (typeof RATING_TYPE)[keyof typeof RATING_TYPE];
  totalRating: number;
  averageRating: number;
}
