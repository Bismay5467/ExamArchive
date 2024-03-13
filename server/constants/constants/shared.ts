export const MONGO_READ_QUERY_TIMEOUT = 10000;
export const MONGO_WRITE_QUERY_TIMEOUT = 15000;

export const MAIL_EVENT_NAME = 'send.mail';
export const SCHEDULED_TIME_SECONDS = 300;

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

export const LOGO_URL =
  'https://res.cloudinary.com/dzorpsnmn/image/upload/v1710307765/EXAM:WKhU72luie:ARCHIVE/izmmduii2snt5fz5pcuk.png';
