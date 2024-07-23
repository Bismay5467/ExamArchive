/* eslint-disable function-paren-newline */
import { TYear } from '@/types/search';
import { IsUserAuthenticated } from './IsUserAuthenticated';

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

export { IsUserAuthenticated };
