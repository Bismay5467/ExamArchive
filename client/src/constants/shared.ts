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

export const ALLOWED_FILE_TYPES: ReadonlyArray<string> = [
  'data:application/pdf',
];

export const TEMP_JWT_TOKEN_HARDCODED =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2NjVkOTM1ZWIxOWJjYWVjMmQ0MjQwZDIiLCJ1c2VybmFtZSI6IkRldmlsIiwiZW1haWwiOiJhcmtvLm9mZmljaWFsbml0a0BnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MTgxMDA5MzQsImV4cCI6MTcyMDY5MjkzNH0.kLN74mdBd9XWS4_1ax7_XYvlWJlI9vnPADePzjKb9Lg';
