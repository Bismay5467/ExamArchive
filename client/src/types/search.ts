import { SWRInfiniteResponse } from 'swr/infinite';
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
  options: Record<string, string> | Record<string, string>[];
  key: TFilterInputs;
  component: 'radio' | 'autocomplete';
  multiple: boolean;
}

export interface ISearchInputs extends IFilterInputs {
  searchParams: string;
}

export interface ISearchContext {
  searchInputs: ISearchInputs;
  swrResponse: SWRInfiniteResponse<any, any>;
  setSearchParam(_query: string): void;
  setFilters(_filters: IFilterInputs): void;
}

export interface ISearchInput {
  query: string;
}

export interface ISearchData {
  branch: string;
  createdAt: string;
  examType: string;
  institutionName: string;
  noOfDownloads: {
    count: number;
    ips: Array<number>; // TODO: needs further invetigation
  };
  noOfViews: {
    count: number;
    ips: Array<number>; // TODO: needs further invetigation
  };
  semester: string;
  status: string;
  subjectCode: string;
  subjectName: string;
  tags: Array<string>;
  updatedAt: string;
  year: string;
  __v: number;
  _id: string;
  uploadedBy: {
    _id: string;
    username: string;
  };
}
