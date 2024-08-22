/* eslint-disable indent */
import { render } from '@react-email/render';

import { INVITATION_STATUS } from '../../constants/constants/auth';
import NotifyUserOnBeingAdminEmail from '../../emails/NotifyUserOnBeingAdmin';
import { TRole } from '../../types/auth/types';
import getRandomPassword, { getHashedPassword } from './getPassword';

const getUpdateInfo = async ({
  doesUserExists,
  role,
  instituteName,
  username,
  email,
}: {
  doesUserExists: boolean;
  role: TRole;
  instituteName: string;
  username: string;
  email: string;
}) => {
  let hashedPassword = '';
  const emailInfo = { username, email };
  if (doesUserExists === false) {
    const password = getRandomPassword();
    hashedPassword = await getHashedPassword(password);
    Object.assign(emailInfo, { password });
  }
  const updateInfo =
    role === 'ADMIN'
      ? {
          ...(doesUserExists === false && { password: hashedPassword }),
          invitationStatus: INVITATION_STATUS.PENDING,
          instituteName,
          role,
        }
      : {
          ...(doesUserExists === false && { password: hashedPassword }),
          invitationStatus: INVITATION_STATUS.PENDING,
          role,
        };
  const emailHTML = render(NotifyUserOnBeingAdminEmail(emailInfo), {
    pretty: true,
  });
  return { emailHTML, updateInfo };
};

export default getUpdateInfo;
