export interface IFileData {
  branch: string;
  createdAt: string;
  examType: string;
  file: {
    filename: string;
    publicId: string;
    url: string;
  };
  institutionName: string;
  isFlagged: boolean;
  noOfDownloads: {
    count: number;
    ips: Array<number>; // TODO: Needs further investigation
    userIds: Array<number>;
  };
  noOfViews: {
    count: number;
    ips: Array<number>; // TODO: Needs further investigation
    userIds: Array<number>;
  };
  rating: Array<{
    ratingType: string;
    totalRating: number;
    averageRating: number;
    _id: string;
  }>;
  semester: string;
  status: string;
  subjectCode: string;
  subjectName: string;
  tags: Array<string>;
  updatedAt: string;
  uploadedBy?: null | string; // Assuming uploadedBy can be null or a string
  year: string;
  __v: number;
  _id: string;
}

export type TRatingType = 'HELPFUL' | 'STANDARD' | 'RELEVANCE';

export interface IRating {
  postId: string;
  ratingArray: Array<{ type: TRatingType; value: number }>;
}
export interface IEditTags {
  postId: string;
  tagsToAdd: Array<string>;
  tagsToRemove: Array<string>;
}
