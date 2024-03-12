import { SORT_FILTERS } from '../../constants/constants/search';

export type TUserFilter = {
  institutionName: Array<string>;
  subjectName: string;
  subjectCode: string;
  examType: Array<string>;
};

export type TUserSortFilter = (typeof SORT_FILTERS)[number];

export type TSearchParams = {
  searchParams: Array<string>;
  page: number;
  filter?: Partial<TUserFilter>;
  sortFilter?: TUserSortFilter;
};
