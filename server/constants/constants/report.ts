export const reportReasons = [
  { rank: 1, reason: 'Other' }, // -> Other
  { rank: 2, reason: 'Inappropriate or Offensive language' }, // -> Hate Speech
  { rank: 3, reason: 'Harassesment or Bullying' }, // -> Harassesment or Bullying
  { rank: 4, reason: 'Sexually Explicit Content' }, // -> nudity
  { rank: 5, reason: 'Misinformation or Fake news' }, // -> scam
  { rank: 6, reason: 'Violence or Graphic Content' }, // Violence
  { rank: 7, reason: 'Impersonation' }, // -> Impersonation
];

export const reasonsForReport = reportReasons.map((reason) => reason.reason);

export const MAX_REPORT_FETCH_LIMIT = 25;

export const SENDING_MAIL_FREQUENCY = 25;

export const NOVU_TOPIC = {
  KEY: 'tygjvbhjgjgcgfctgsre',
  NAME: 'notify-admin-on-report-content',
};
export const NOVU_WORKFLOW_IDENTIFIER = 'exam-archive-report-content';

export const SORT_FILTERS = ['MOST RECENT', 'LEAST RECENT'] as const;

export const CONTENT_TYPE = ['POST', 'COMMENT'] as const;

export const REPORT_COUNT = ['MOST COUNT', 'LEAST COUNT'] as const;
