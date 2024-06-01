import { ROLE } from '../../constants/constants/auth';
import redisClient from '../../config/redisConfig';

const getSuperAdminInfo = async () => {
  if (redisClient === null) return null;
  const info = await redisClient.smembers(ROLE.SUPERADMIN);
  const superAdminIds = new Set<string>();
  const superAdminEmailIds = new Set<string>();
  info.forEach((data) => {
    const { email, userId } = JSON.parse(data) as {
      userId: string;
      email: string;
    };
    superAdminIds.add(userId);
    superAdminEmailIds.add(email);
  });
  return {
    emailIds: Array.from(superAdminEmailIds),
    ids: Array.from(superAdminIds),
  };
};

export default getSuperAdminInfo;
