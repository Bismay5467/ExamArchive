/* eslint-disable newline-per-chained-call */
/* eslint-disable no-magic-numbers */
/* eslint-disable import/prefer-default-export */
import z from 'zod';

import { EXAM_TYPES } from '../../constants/constants/shared';
import { SORT_FILTERS } from '../../constants/constants/search';
import { sanitizeInput } from '../upload/schema';

function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

const getExamTypes = () => {
  const examTypes: string[] = [];
  Object.keys(EXAM_TYPES).forEach((key) => {
    const values = EXAM_TYPES[key as keyof typeof EXAM_TYPES];
    examTypes.push(...getValues(values));
  });
  return examTypes as unknown as readonly [string, ...string[]];
};

export const searchInputSchema = z.object({
  searchParams: z
    .string()
    .transform((params) =>
      params.trim().toLowerCase().split(',').filter(Boolean).join(',')
    ),
  page: z.string(),
  filter: z
    .object({
      subjectName: z.string().trim().max(100).optional(),
      year: z.array(z.number()),
      subjectCode: z
        .string()
        .trim()
        .max(100)
        .transform((subjectCode) => sanitizeInput(subjectCode))
        .optional(),
      examType: z.array(z.enum(getExamTypes())).optional(),
    })
    .optional(),
  sortFilter: z.enum(SORT_FILTERS).optional(),
});
