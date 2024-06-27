import { EXAM_TYPES } from '../constants/shared';
import { FILTER_YEAR_OPTIONS, SORT_FILTER_OPTIONS } from '@/constants/search';

export type TSortFilters = keyof typeof SORT_FILTER_OPTIONS;

export type TYear =
  (typeof FILTER_YEAR_OPTIONS)[keyof typeof FILTER_YEAR_OPTIONS];

export type TExamType<T extends keyof typeof EXAM_TYPES> =
  (typeof EXAM_TYPES)[T][keyof (typeof EXAM_TYPES)[T]];
export interface IFilterInputs {
  subjectName?: string;
  year?: TYear;
  examType?: TExamType<'INSTITUTIONAL'>;
  sortFilter?: TSortFilters;
}

export type TFilterInputs = keyof IFilterInputs;

export interface TFilterOption {
  label: string;
  options: Record<string, string>;
  key: TFilterInputs;
}

export interface ISearchInputs extends IFilterInputs {
  searchParams: string;
}

export interface ISearchContext {
  searchInputs: ISearchInputs;
  setSearchParam(_query: string): void;
  setFilters(_filters: IFilterInputs): void;
}

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
