import { Types } from 'mongoose';

import { RATING_TYPE } from '../../constants/constants/filePreview';

export interface IRatingInfo {
  ratingType: (typeof RATING_TYPE)[keyof typeof RATING_TYPE];
  totalRating: number;
  averageRating: number;
}

export type TNotifType = 'downloads' | 'views' | 'tags';

export type TNotif<T extends TNotifType> = {
  type: T;
  ownerId: Types.ObjectId;
  workflowIndentifier: string;
  postId: string;
} & (T extends Exclude<TNotifType, 'tags'> ? { count: number } : {});
