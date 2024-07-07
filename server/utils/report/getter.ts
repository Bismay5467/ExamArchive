/* eslint-disable no-nested-ternary */
import { SortOrder } from 'mongoose';
import {
  CONTENT_TYPE,
  REPORT_COUNT,
  SORT_FILTERS,
} from '../../constants/constants/report';

export const getQuery = ({
  action,
  contentType,
}: {
  action: 'PENDING' | 'RESOLVED';
  contentType?: (typeof CONTENT_TYPE)[number];
}) => ({
  ...(contentType === 'COMMENT'
    ? { docModel: 'Comment' }
    : contentType === 'POST'
      ? { docModel: 'Question' }
      : { docModel: { $in: ['Comment', 'Question'] } }),
  ...(action === 'PENDING'
    ? { 'resolved.isResolved': true }
    : { 'resolved.isResolved': false }),
});

export const getSortOptions = ({
  sortFilters,
  countOfReports,
}: {
  sortFilters?: (typeof SORT_FILTERS)[number];
  countOfReports?: (typeof REPORT_COUNT)[number];
}) =>
  ({
    ...(sortFilters === 'LEAST RECENT'
      ? { updatedAt: 'asc' }
      : { updatedAt: 'desc' }),
    ...(countOfReports === 'LEAST COUNT'
      ? { totalReports: 'asc' }
      : { totalReports: 'desc' }),
  }) as { [key: string]: SortOrder | { $meta: any } };
