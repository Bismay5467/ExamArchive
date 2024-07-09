import {
  REPORT_CONTENT_TYPE_OPTIONS,
  REPORT_COUNT_OPTIONS,
  SORT_REPORT_OPTIONS,
} from '@/constants/superAdmin';

export type TContentType = 'COMMENT' | 'POST';

export interface IReportContent {
  postId: string;
  contentType: TContentType;
  reason: { rank: number; reason: string };
}

export interface IResolveReport {
  reportId: string;
  postId: string;
  contentType: TContentType;
}

export interface IReportPreview {
  createdAt: string;
  docModel: 'Question' | 'Comment';
  postId: string;
  reasons: Array<{ count: number; reason: string; _id: string }>;
  resolved: { isResolved: boolean };
  totalReport: number;
  updatedAt: string;
  __v: number;
  _id: string;
}

export type TReportAction = 'RESOLVED' | 'PENDING';
export type TReportContentType = keyof typeof REPORT_CONTENT_TYPE_OPTIONS;
export type TSortFilter = keyof typeof SORT_REPORT_OPTIONS;
export type TReportCount = keyof typeof REPORT_COUNT_OPTIONS;

export interface IReportFilterFields {
  action: TReportAction;
  sortFilters?: TSortFilter;
  countOfReports?: TReportCount;
  contentType?: TReportContentType;
}

export interface IReportFilterOption {
  label: string;
  options: Record<string, string>;
  key: keyof IReportFilterFields;
  component: 'radio';
}
