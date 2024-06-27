import { EXAM_TYPES } from './shared';

export const QUERY_FIELDS = Object.freeze({
  PAGE: 'page',
  YEAR: 'year',
  QUERY: 'query',
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

export const SEARCH_FILTTER_OPTIONS = Object.freeze({
  'Sort by': SORT_FILTER_OPTIONS,
  Year: FILTER_YEAR_OPTIONS,
  'Exam type': EXAM_TYPES.INSTITUTIONAL,
});

// TODO: attach all the fields involved
