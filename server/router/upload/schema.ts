/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import { isBase64 } from 'validator';
import z from 'zod';

import { EXAM_TYPES, SEMESTER } from '../../constants/constants/shared';

function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const sanitizeInput = (params: string) =>
  params.toUpperCase().replace(/[^A-Z0-9]/g, '');

const baseSchema = z.object({
  file: z.object({
    dataURI: z.string().refine((dataURI) => isBase64(dataURI)),
    name: z.string().min(1).max(100),
  }),
});

export const uploadFilesInputSchema = z.array(
  z.discriminatedUnion('examType', [
    z
      .object({
        examType: z.enum(getValues(EXAM_TYPES.INSTITUTIONAL)),
        institution: z.string().trim().min(1).max(50),
        branch: z.string().trim().min(1).max(50),
        year: z
          .string()
          .trim()
          .refine(
            (inputtedYear) => {
              const digitRegex = /^[0-9]{4}$/;
              const currentYear = new Date().getFullYear();
              const yearFifteenYearsBack = currentYear - 15;

              if (digitRegex.test(inputtedYear) === false) return false;
              if (
                Number(inputtedYear) > currentYear ||
                Number(inputtedYear) < yearFifteenYearsBack
              ) {
                return false;
              }
              return true;
            },
            {
              message: `Year should be between ${
                new Date().getFullYear() - 15
              } and ${new Date().getFullYear()}`,
            }
          ),
        semester: z.enum(getValues(SEMESTER)),
        subjectCode: z
          .string()
          .trim()
          .min(1)
          .max(10)
          .transform((subjectCode) => sanitizeInput(subjectCode)),
        subjectName: z
          .string()
          .trim()
          .min(1)
          .max(50)
          .transform((subjectName) => sanitizeInput(subjectName)),
        tags: z
          .string()
          .trim()
          .min(1)
          .max(1000)
          .transform((tags) => tags.toLowerCase())
          .refine(
            (value) =>
              value &&
              !value.endsWith(',') &&
              !value.startsWith(',') &&
              value.split(',').every((tag) => tag.trim() !== '' && tag !== ','),
            {
              message:
                'The tags should be seperated by single comma with no space in between',
            }
          ),
      })
      .merge(baseSchema),
    z.object({
      examType: z.enum(getValues(EXAM_TYPES.COMPETITIVE)),
      phase: z.string(),
    }),
  ])
);

export const addNamesInputSchema = z.object({
  name: z.string().min(1).max(100),
});
export const getNamesInputSchema = z.string().min(1).max(100);
export const fileUploadNotifWebhookSchema = z.object({
  public_id: z.string(),
  secure_url: z.string(),
});
