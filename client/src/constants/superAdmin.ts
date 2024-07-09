import { IReportFilterOption } from '@/types/report';

export const REPORT_CONTENT_TYPE_OPTIONS = Object.freeze({
  POST: 'POST',
  COMMENT: 'COMMENT',
});

export const SORT_REPORT_OPTIONS = Object.freeze({
  'MOST RECENT': 'MOST RECENT',
  'LEAST RECENT': 'LEAST RECENT',
});

export const REPORT_COUNT_OPTIONS = Object.freeze({
  'MOST COUNT': 'MOST COUNT',
  'LEAST COUNT': 'LEAST COUNT',
});

export const REPORT_FILTTER_OPTIONS: IReportFilterOption[] = [
  {
    label: 'Content Type',
    options: REPORT_CONTENT_TYPE_OPTIONS,
    key: 'contentType',
    component: 'radio',
  },
  {
    label: 'Sort',
    options: SORT_REPORT_OPTIONS,
    key: 'sortFilters',
    component: 'radio',
  },
  {
    label: 'Count',
    options: REPORT_COUNT_OPTIONS,
    key: 'countOfReports',
    component: 'radio',
  },
];
