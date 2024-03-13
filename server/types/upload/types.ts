import { EXAM_TYPES, SEMESTER } from '../../constants/constants/shared';

export type TExamType<T extends keyof typeof EXAM_TYPES> =
  keyof (typeof EXAM_TYPES)[T];

export type TFile = {
  dataURI: string;
  name: string;
};

export type TUploadFile<T extends keyof typeof EXAM_TYPES> = {
  examType: TExamType<T>;
  file: TFile;
  tags: string;
  year: string;
} & (T extends 'INSTITUTIONAL'
  ? {
      institution: string;
      branch: string;
      semester: (typeof SEMESTER)[keyof typeof SEMESTER];
      subjectCode: string;
      subjectName: string;
    }
  : {});

export type TExamTypeExtended<T extends keyof typeof EXAM_TYPES> = Array<
  TUploadFile<T> & { userId: string }
>;

export type TCache = {
  key: string;
  payload: Record<string, string | string[] | number | Record<string, string>>;
};
