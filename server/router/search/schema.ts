/* eslint-disable no-magic-numbers */
/* eslint-disable import/prefer-default-export */
import z from 'zod';

import { EXAM_TYPES } from '../../constants/constants/shared';
import { SORT_FILTERS } from '../../constants/constants/search';

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
  searchParams: z.array(z.string()),
  page: z.string().transform((page) => {
    const parsedPage = parseInt(page, 10);
    if (Number.isNaN(parsedPage) === true || parsedPage <= 0) return 1;
    return parsedPage;
  }),
  subjectName: z.string().trim().max(100).optional(),
  year: z
    .array(z.string())
    .transform((arr) =>
      arr
        .filter(Boolean)
        .filter((year) => {
          const parsedYear = parseInt(year, 10);
          const currYear = new Date().getFullYear();
          if (
            Number.isNaN(parsedYear) === false &&
            parsedYear <= currYear &&
            parsedYear > currYear - 10
          ) {
            return true;
          }
          return false;
        })
        .map((year) => parseInt(year, 10))
    )
    .optional(),
  examType: z
    .string()
    .transform((params) =>
      params
        .trim()
        .split(',')
        .filter(Boolean)
        .filter((type) => getExamTypes().includes(type))
    )
    .optional(),

  sortFilter: z.enum(SORT_FILTERS).optional(),
});
