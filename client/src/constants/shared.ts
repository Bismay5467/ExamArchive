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

export const folderColumns = [
  { name: 'Folder name', uid: 'name', sortable: false },
  { name: 'Created at', uid: 'createdAt', sortable: true },
  { name: 'Last Modified', uid: 'updatedAt', sortable: true },
];

export const bookmarkFileColumns = [
  { name: 'File name', uid: 'filename', sortable: false },
  { name: 'Created at', uid: 'createdAt', sortable: true },
  { name: 'Last Modified', uid: 'updatedAt', sortable: true },
];

export const uploadFileColumns = [
  { name: 'File name', uid: 'filename', sortable: false },
  { name: 'Status', uid: 'status', sortable: false },
  { name: 'Created at', uid: 'createdAt', sortable: true },
  { name: 'Last Modified', uid: 'updatedAt', sortable: true },
];

export const ALLOWED_FILE_TYPES: ReadonlyArray<string> = [
  'data:application/pdf',
];
export const INITIAL_PAGE_NUMBER = 1;
export const TEMP_JWT_TOKEN_HARDCODED =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2NjUxOTVjY2U5NWY4ZGZmNzM1YTQ1YzYiLCJ1c2VybmFtZSI6IkFya29qZWV0IiwiZW1haWwiOiJhcmtvamVldC5kZXZAZ21haWwuY29tIiwicm9sZSI6IlNVUEVSQURNSU4iLCJpYXQiOjE3MTk3NjkyMTksImV4cCI6MTcyMjM2MTIxOX0.wIjAlzNH4VFUCgJqvcxmT23pjct8-v3C2VOe3H_CD5M';

export const PDF_WORKER_URL =
  'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js' as const;

export const TEMP_COMMENT_ID = '974106db98afe24eb114' as const;
export const VOTE: Readonly<number> = 1;
export const RETRACE_VOTE: Readonly<number> = -1;

export const THEME = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
});
