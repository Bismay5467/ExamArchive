export interface IFilterInputs {
  ExamType?: string;
  subjectName?: string;
  year?: string;
  sortFilter?: string;
}

export type TFilterInputs = 'ExamType' | 'subjectName' | 'year' | 'sortFilter';
export interface ISearchInput {
  query: string;
}

export interface ISearchData {
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
