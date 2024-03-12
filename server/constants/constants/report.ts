export const reportReasons = [
  { rank: 1, reason: 'Inappropriate or Offensive language' },
  { rank: 2, reason: 'Harassesment or Bullying' },
  { rank: 3, reason: 'Sexually Explicit Content' },
  { rank: 4, reason: 'Misinformation or Fake news' },
  { rank: 5, reason: 'Violence or Graphic Content' },
  { rank: 6, reason: 'Impersonation' },
  { rank: 7, reason: 'Other' },
] as const;

export const reasonsForReport = reportReasons.map((reason) => reason.reason);

export const MAX_REPORT_FETCH_LIMIT = 25;

export const SENDING_MAIL_FREQUENCY = 25;

export const NOVU_TOPIC = {
  KEY: 'tygjvbhjgjgcgfctgsre',
  NAME: 'notify-admin-on-report-content',
};
export const NOVU_WORKFLOW_IDENTIFIER = 'exam-archive-report-content';
