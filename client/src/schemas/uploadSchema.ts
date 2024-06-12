/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import z from 'zod';
import { isBase64 } from 'validator';
import {
  ALLOWED_FILE_TYPES,
  EXAM_TYPES,
  SEMESTER,
} from '@/constants/shared.ts';

function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const sanitizeInput = (params: string) =>
  params.toUpperCase().replace(/[^A-Z0-9]/g, '');

const baseSchema = z.object({
  file: z.object({
    dataURI: z
      .string()
      .refine((dataURI) => isBase64(dataURI.split(',')[1]), {
        message: 'Invalid DataURI',
      })
      .refine((dataURI) => ALLOWED_FILE_TYPES.includes(dataURI.split(';')[0]), {
        message: 'Only .pdf is allowed',
      }),
    name: z.string().min(1).max(100),
  }),
  folderId: z.string(),
});

export const uploadFilesInputSchema = z
  .object({
    examType: z.enum(getValues(EXAM_TYPES.INSTITUTIONAL)),
    institution: z
      .string()
      .trim()
      .min(1, { message: '*Institution must contaian atleast 1 character(s)' })
      .max(50, {
        message: '*Institution must contaian atmost 50 character(s)',
      }),
    branch: z
      .string()
      .trim()
      .min(1, { message: '*Branch must contaian atleast 1 character(s)' })
      .max(50, { message: '*Branch must contaian atmost 50 character(s)' }),
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
          message: `*Year should be between ${
            new Date().getFullYear() - 15
          } and ${new Date().getFullYear()}`,
        }
      ),
    semester: z.enum(getValues(SEMESTER)),
    subjectCode: z
      .string()
      .trim()
      .min(1, { message: '*Subject Code must contaian atleast 1 character(s)' })
      .max(10, {
        message: '*Subject Code must contaian atmost 10 character(s)',
      })
      .transform((subjectCode) => sanitizeInput(subjectCode)),
    subjectName: z
      .string()
      .trim()
      .min(1, { message: '*Subject Name must contaian atleast 1 character(s)' })
      .max(50, {
        message: '*Subject Name must contaian atmost 50 character(s)',
      })
      .transform((subjectName) => sanitizeInput(subjectName)),
    tags: z
      .string()
      .trim()
      .min(1, { message: '*Tags must contaian atleast 1 character(s)' })
      .max(1000, { message: '*Tags must contaian atmost 1000 character(s)' })
      .transform((tags) => tags.toLowerCase())
      .refine(
        (value) =>
          value &&
          !value.endsWith(',') &&
          !value.startsWith(',') &&
          value.split(',').every((tag) => tag.trim() !== '' && tag !== ','),
        {
          message:
            '*The tags should be seperated by single comma with no space in between',
        }
      ),
  })
  .merge(baseSchema);

export const addNamesInputSchema = z.object({
  name: z.string().min(1).max(100),
});
export const getNamesInputSchema = z.string().min(1).max(100);
export const fileUploadNotifWebhookSchema = z.object({
  public_id: z.string(),
  secure_url: z.string(),
});
