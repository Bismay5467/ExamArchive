/* eslint-disable no-magic-numbers */
import { Types } from 'mongoose';
import z from 'zod';

import {
  CONTENT_TYPE,
  REPORT_COUNT,
  SORT_FILTERS,
  reasonsForReport,
} from '../../constants/constants/report';

export const reportContentInputSchema = z.object({
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
  contentType: z.enum(['COMMENT', 'POST']),
  reason: z.object({
    rank: z.number().min(1).max(7),
    reason: z.enum([reasonsForReport[0], ...reasonsForReport.slice(0)]),
  }),
});

export const viewReportInputSchema = z.object({
  page: z.string(),
  action: z.enum(['RESOLVED', 'PENDING']),
  sortFilters: z.enum(SORT_FILTERS).optional(),
  countOfReports: z.enum(REPORT_COUNT).optional(),
  contentType: z.enum(CONTENT_TYPE).optional(),
});
export const getCommentInputSchema = z.object({
  commentId: z
    .string()
    .refine((commentId) => Types.ObjectId.isValid(commentId)),
});

export const markAsResolvedInputSchema = z.object({
  reportId: z.string().refine((reportId) => Types.ObjectId.isValid(reportId)),
  postId: z.string().refine((postId) => Types.ObjectId.isValid(postId)),
  contentType: z.enum(['COMMENT', 'POST']),
});
