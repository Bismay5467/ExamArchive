export type TSortFilters = 'MOST VIEWS' | 'MOST RECENT';
export interface IFilterInputs {
  subjectName?: string;
  year?: string;
  examType?: string;
  sortFilter?: string;
}

export interface ISearchInputs extends IFilterInputs {
  searchParams: string;
}

export interface ISearchContext {
  searchInputs: ISearchInputs;
  setSearchParam(_query: string): void;
  setFilters(_filters: IFilterInputs): void;
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
