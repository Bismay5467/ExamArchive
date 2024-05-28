export interface SearchData {
  _id: string;
  year: string;
  tags: string[];
  semester: string;
  branch: string;
  createdAt: string;
  updatedAt: string;
  institutionName: string;
  noOfDownloads: { count: number };
  noOfViews: number;
  subjectCode: string;
  subjectName: string;
  examType: string;
  __v: number;
}
