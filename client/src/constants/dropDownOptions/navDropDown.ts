import { CLIENT_ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/auth';

export default (role: string, userId: string) => {
  const baseRoute = `dashboard/${userId}`;
  const dashboard = {
    name: 'Dashboard',
    link: `${baseRoute}`,
  };
  const profile = {
    name: 'Profile',
    link: `${baseRoute}/${CLIENT_ROUTES.DASHBOARD_PROFILE}`,
  };
  const bookmarks = {
    name: 'Bookmarks',
    link: `${baseRoute}/${CLIENT_ROUTES.DASHBOARD_BOOKMARKS}`,
  };
  const fileUpload = {
    name: 'Upload Files',
    link: `${baseRoute}/${CLIENT_ROUTES.DASHBOARD_FILEUPLOAD}`,
  };

  const analytics = {
    name: 'Analytics',
    link: `${baseRoute}/${CLIENT_ROUTES.DASHBOARD_ANALYTICS}`,
  };

  const dropDownOptions = [dashboard, profile, bookmarks];
  if (role === ROLES.ADMIN) dropDownOptions.push(fileUpload);
  if (role === ROLES.SUPERADMIN) dropDownOptions.push(analytics);

  return dropDownOptions;
};
