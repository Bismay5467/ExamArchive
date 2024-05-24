import { SORT_FILTERS } from '../../constants/constants/search';

export type TUserFilter = {
  year: Array<number>;
  subjectName: string;
  subjectCode: string;
  examType: Array<string>;
};

export type TUserSortFilter = (typeof SORT_FILTERS)[number];
