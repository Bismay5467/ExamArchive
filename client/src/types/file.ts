export interface IFileData {
  branch: string;
  createdAt: string;
  examType: string;
  ratingCount: number;
  file: {
    url: string;
  };
  institutionName: string;
  noOfDownloads: {
    count: number;
  };
  noOfViews: {
    count: number;
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
  uploadedBy: {
    _id: string;
    username: string;
  };
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
