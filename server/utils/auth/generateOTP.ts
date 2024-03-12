const generateOTP = () => {
  const otpCharacters = '0123456789abcdefghijklmnopqrstuvwxyz';
  const lengthOfOTP = 6;

  const OTP = Array.from({ length: lengthOfOTP }, () => {
    // eslint-disable-next-line no-magic-numbers
    const randomIndex = Math.floor(Math.random() * 10);
    return otpCharacters[randomIndex];
  }).join('');

  return OTP;
};

export default generateOTP;
