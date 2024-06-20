export const parseUTC = (timeStamp: string) => {
  const date = new Date(timeStamp);
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  return { day, month, year };
};
