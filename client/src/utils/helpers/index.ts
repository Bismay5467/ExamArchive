/* eslint-disable function-paren-newline */
import { TYear } from '@/types/search';
import { IsUserAuthenticated } from './IsUserAuthenticated';

export const MAX_CHAR_DISPLAY = 25;

export const parseUTC = (timeStamp: string) => {
  const date = new Date(timeStamp);
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  return { day, month, year };
};

export const getPreviousYears = (yearFilter: TYear) => {
  const currentYear = new Date().getFullYear();
  const last = parseInt(yearFilter.split(' ')[1], 10);
  const years = Array.from({ length: last }, (_, i) =>
    (currentYear - i).toString()
  );
  return years;
};

export const toCamelCase = (line: string) =>
  line
    .split(' ')
    .map((word) =>
      word.charAt(0).toUpperCase().concat(word.slice(1).toLowerCase())
    )
    .join(' ');

// eslint-disable-next-line no-confusing-arrow
export const wordShortner = (word: string) =>
  word.length > MAX_CHAR_DISPLAY
    ? word.substring(0, MAX_CHAR_DISPLAY).concat('...')
    : word;

export { IsUserAuthenticated };
