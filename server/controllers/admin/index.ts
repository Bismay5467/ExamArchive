import AddAdmin from './AddAdmin';
import GetAllAdmins from './GetAllAdmins';
import RemoveAdmin from './RemoveAdmin';

export const getRedisKey = () => 'admin';

export { AddAdmin, RemoveAdmin, GetAllAdmins };
