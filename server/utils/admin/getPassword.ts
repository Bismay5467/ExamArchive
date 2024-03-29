/* eslint-disable no-magic-numbers */
const getRandomPassword = () => {
  const PASSWORD_LENGTH = 8;
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const digitset = '0123456789';
  const symbolset = '!@#$%^&*()-_=+';
  const noOfCharacters = Math.floor(Math.random() * 5) + 1;
  const noOfDigits = Math.floor(Math.random() * 2) + 1;
  const noOfSymbols = PASSWORD_LENGTH - noOfCharacters - noOfDigits;
  const randomPassword = [
    ...Array.from(
      { length: noOfCharacters },
      () => charset[Math.floor(Math.random() * charset.length)]
    ),
    ...Array.from(
      { length: noOfSymbols },
      () => symbolset[Math.floor(Math.random() * symbolset.length)]
    ),
    ...Array.from(
      { length: noOfDigits },
      () => digitset[Math.floor(Math.random() * digitset.length)]
    ),
  ].join('');
  return randomPassword;
};

export default getRandomPassword;
