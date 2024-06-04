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

export const uploadFileTypes = Object.freeze({
  PDF: 'application/pdf',
});
