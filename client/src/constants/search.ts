import { TFilterOption } from '@/types/search';
import { EXAM_TYPES } from './shared';

export const QUERY_FIELDS = Object.freeze({
  PAGE: 'page',
  YEAR: 'year',
  QUERY_PARAMS: 'searchParams',
  EXAM_TYPE: 'examType',
});

export const FILTER_YEAR_OPTIONS = Object.freeze({
  3: 'Past 3 Years',
  5: 'Past 5 Years',
  10: 'Past 10 Years',
});

export const SORT_FILTER_OPTIONS = Object.freeze({
  'MOST VIEWS': 'Most Views',
  'MOST RECENT': 'Most Recent',
});

export const getExamNames = (data: Record<string, string>) =>
  Object.entries(data).map(([key, value]) => ({ id: key, val: value }));

export const SEARCH_FILTTER_OPTIONS: TFilterOption[] = [
  {
    label: 'Sort By',
    options: SORT_FILTER_OPTIONS,
    key: 'sortFilter',
    component: 'radio',
  },
  {
    label: 'Year',
    options: FILTER_YEAR_OPTIONS,
    key: 'year',
    component: 'radio',
  },
  {
    label: 'Exam Type',
    options: getExamNames(EXAM_TYPES.INSTITUTIONAL),
    key: 'examType',
    component: 'autocomplete',
  },
];

// TODO: attach all the fields involved
