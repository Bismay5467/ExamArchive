/* eslint-disable camelcase */
/* eslint-disable no-case-declarations */
import { TRPCError } from '@trpc/server';
import { v2 as cloudinary } from 'cloudinary';

import { EXAM_TYPES } from '../../constants/constants/shared';
import redisClient from '../../config/redisConfig';
import {
  TExamType,
  TExamTypeExtended,
  TUploadFile,
} from '../../types/upload/types';

export const addDetailsToCache = ({
  key,
  payload,
}: {
  key: string;
  payload: Record<string, string | number | string[] | Record<string, string>>;
}) => {
  if (redisClient === null) return null;
  return redisClient.sadd(key, JSON.stringify(payload));
};

export const getExamGroup = (examType: TExamType<keyof typeof EXAM_TYPES>) =>
  // eslint-disable-next-line no-unused-vars
  Object.entries(EXAM_TYPES).find(([_, type]) =>
    Object.values(type).includes(examType)
  )?.[0] as keyof typeof EXAM_TYPES | undefined;

export const sanitizeInput = (
  fileInfo: TExamTypeExtended<keyof typeof EXAM_TYPES>
) => {
  const sanitizedFileArray = fileInfo.map((file) => {
    const {
      userId,
      tags,
      year,
      examType,
      file: { name: filename },
    } = file;
    const fileObj = {
      tags: tags.split(' '),
      uploadedBy: userId,
      year,
      examType,
      file: { filename },
    };
    const examGroup = getExamGroup(examType);
    switch (examGroup) {
      case 'INSTITUTIONAL':
        const { institution, branch, semester, subjectCode, subjectName } =
          file as TUploadFile<'INSTITUTIONAL'>;
        Object.assign(fileObj, {
          institution,
          branch,
          semester,
          subjectCode,
          subjectName,
        });
        break;
      default:
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `We are still to integrate the case for ${examType}. You may try again after a couple of weeks`,
        });
    }
    return fileObj;
  });
  return sanitizedFileArray;
};

export const uploadToCloudinary = (dataURI: string, filename: string) =>
  cloudinary.uploader.upload(dataURI, {
    upload_preset: process.env.CLOUDINARY_PRESET,
    public_id: filename,
    resource_type: 'auto',
  });

const calculateEditDistance = (longerString: string, shorterString: string) => {
  const longerLength = longerString.length;
  const shorterLength = shorterString.length;
  const matrix = new Array(longerLength + 1).fill(0);
  matrix.forEach((_, index) => {
    matrix[index] = new Array(shorterLength + 1);
  });
  for (let j = 0; j <= longerLength; j++) matrix[j][0] = j;
  for (let j = 0; j <= shorterLength; j++) matrix[0][j] = j;
  for (let i = 1; i <= longerLength; i++) {
    for (let j = 1; j <= shorterLength; j++) {
      const delta =
        longerString.charAt(i - 1) !== shorterString.charAt(j - 1) ? 1 : 0;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + delta
      );
    }
  }
  return matrix[longerLength][shorterLength];
};

export const similarityScore = (name: string, searchParams: string) => {
  const [longerString, shorterString] =
    name.length < searchParams.length
      ? [searchParams, name]
      : [name, searchParams];

  const longerLength = longerString.length;
  if (longerLength === 0) return 1.0;
  return calculateEditDistance(longerString, shorterString);
};

// export const createFileBuffer = async (
//   fileInfo: TExamTypeExtended<keyof typeof EXAM_TYPES>
// ) => {
//   const uploadFilePromises: Promise<ITempFilePathResponse>[] = fileInfo.map(
//     (file) => {
//       return new Promise((resolve, reject) => {
//         if (file.file === null) {
//           reject(
//             new TRPCError({
//               message: 'File data is missing',
//               code: 'NOT_FOUND',
//             })
//           );
//           return;
//         }
//         file.file
//           .arrayBuffer()
//           .then(
//             (data: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => {
//               const filename =
//                 file.file?.name.split(' ').join('_') ?? 'file.pdf';

//               const buffer = Buffer.from(data).toString('base64');
//               const dataURI = `data:${file.file?.type};base64,${buffer}`;

//               resolve({
//                 name: `${file.id}_${filename}`,
//                 type: file.file?.type,
//                 dataURI,
//                 id: file.id,
//               });
//             }
//           );
//       });
//     }
//   );
//   return await Promise.all(uploadFilePromises);
// };
