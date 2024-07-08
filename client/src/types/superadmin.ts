import {
  REPORT_CONTENT_TYPE_OPTIONS,
  REPORT_COUNT_OPTIONS,
  SORT_REPORT_OPTIONS,
} from '@/constants/superAdmin';

export type TModeratorRole = 'SUPERADMIN' | 'ADMIN';

export interface IMderatorDetails {
  email: string;
  invitationStatus: string;
  userId: string;
  username: string;
}

export interface IModerator {
  email: string;
  username: string;
  role: TModeratorRole;
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
