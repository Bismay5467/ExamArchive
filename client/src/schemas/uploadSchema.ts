/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import z from 'zod';
import {
  ALLOWED_FILE_TYPES,
  EXAM_TYPES,
  SEMESTER,
} from '@/constants/shared.ts';
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const sanitizeInput = (params: string) =>
  params.toUpperCase().replace(/[^A-Z0-9]/g, '');

const baseSchema = z.object({
  file: z
    .custom<FileList>()
    .refine((fileList) => fileList && fileList.length === 1, {
      message: 'No file uploaded',
    })
    .transform((file) => file[0] as File)
    .refine(
      (file) => {
        return file && file.size <= MAX_FILE_SIZE;
      },
      { message: `Max file size allowed is ${MAX_FILE_SIZE} MB` }
    )
    .refine((file) => file && ALLOWED_FILE_TYPES.includes(file.type), {
      message: 'Only .pdf format is supported',
    }),
});

export const uploadFilesInputSchema = z
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
  .merge(baseSchema);

export const addNamesInputSchema = z.object({
  name: z.string().min(1).max(100),
});
export const getNamesInputSchema = z.string().min(1).max(100);
export const fileUploadNotifWebhookSchema = z.object({
  public_id: z.string(),
  secure_url: z.string(),
});
