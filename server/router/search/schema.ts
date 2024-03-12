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
    .array(z.string())
    .max(100)
    .refine((params) => params.map((param) => param.toLowerCase())),
  page: z.number().min(1),
  filter: z
    .object({
      institutionName: z.array(z.string().trim()).max(10).optional(),
      subjectName: z.string().trim().max(100).optional(),
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
