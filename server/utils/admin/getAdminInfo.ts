import { getRedisKey } from '../../controllers/admin';
import redisClient from '../../config/redisConfig';

const getAdminInfo = async () => {
  if (redisClient === null) return null;
  const redisKey = getRedisKey();
  const adminInfo = await redisClient.smembers(redisKey);
  const adminIds = new Set<string>();
  const adminEmailIds = new Set<string>();
  adminInfo.forEach((info) => {
    const { email, userId } = JSON.parse(info) as {
      userId: string;
      email: string;
    };
    adminIds.add(userId);
    adminEmailIds.add(email);
  });
  return {
    adminEmailIds: Array.from(adminEmailIds),
    adminIds: Array.from(adminIds),
  };
};

export default getAdminInfo;
