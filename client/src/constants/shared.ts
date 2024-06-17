export const LinkedIn = Object.freeze({
  Arkojeet: 'https://www.linkedin.com/in/arkojeet-bera/',
  Bismay: 'https://www.linkedin.com/in/bismay-purkayastha-4a63a6179/',
});

export const EXAM_TYPES = {
  INSTITUTIONAL: {
    MIDSEM: 'Midsem',
    ENDSEM: 'Endsem',
    'QUIZ-I': 'Quiz I',
    'QUIZ-2': 'Quiz II',
    'PRACTICAL-I': 'Practical I',
    'PRACTICAL-II': 'Practical II',
  },
  COMPETITIVE: { GATE: 'Gate' },
} as const;

export const SEMESTER = Object.freeze({
  I: 'Semester I',
  II: 'Semester II',
  III: 'Semester III',
  IV: 'Semester IV',
  V: 'Semester V',
  VI: 'Semester VI',
  VII: 'Semester VII',
  VIII: 'Semester VIII',
});

export const reportReasons = [
  { rank: 1, reason: 'Inappropriate or Offensive language' }, // -> Hate Speech
  { rank: 2, reason: 'Harassesment or Bullying' }, // -> Harassesment or Bullying
  { rank: 3, reason: 'Sexually Explicit Content' }, // -> nudity
  { rank: 4, reason: 'Misinformation or Fake news' }, // -> scam
  { rank: 5, reason: 'Violence or Graphic Content' }, // Violence
  { rank: 6, reason: 'Impersonation' }, // -> Impersonation
  { rank: 7, reason: 'Other' }, // -> Other
];

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const ALLOWED_FILE_TYPES: ReadonlyArray<string> = [
  'data:application/pdf',
];
export const INITIAL_PAGE_NUMBER = 1;
export const TEMP_JWT_TOKEN_HARDCODED =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2NjVkOTM1ZWIxOWJjYWVjMmQ0MjQwZDIiLCJ1c2VybmFtZSI6IkRldmlsIiwiZW1haWwiOiJhcmtvLm9mZmljaWFsbml0a0BnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MTgxOTM3OTIsImV4cCI6MTcyMDc4NTc5Mn0.M5ktLtTghXyDFbbO92mHGdJ3f3MN8KmAsYIJBNsliQI';

export const PDF_WORKER_URL =
  'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js' as const;

export const TEMP_COMMENT_ID = '974106db98afe24eb114' as const;
export const VOTE: Readonly<number> = 1;
export const RETRACE_VOTE: Readonly<number> = -1;
