import { IoBookmarkOutline, IoCloudUploadOutline } from 'react-icons/io5';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { GoReport } from 'react-icons/go';
import { CLIENT_ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/auth';

const quickLinks = (role: string, userId: string) => {
  const dashboardBaseRoute = `dashboard/${userId}`;
  const userRoutes = [
    {
      key: 'Bookmarks',
      link: `${dashboardBaseRoute}/${CLIENT_ROUTES.DASHBOARD_BOOKMARKS}`,
      icon: <IoBookmarkOutline className="text-xl" />,
    },
  ];

  const adminRoutes = [
    {
      key: 'Upload',
      link: `${dashboardBaseRoute}/${CLIENT_ROUTES.DASHBOARD_FILEUPLOAD}`,
      icon: <IoCloudUploadOutline className="text-xl" />,
    },
  ];

  const superAdminRoutes = [
    {
      key: 'Operations',
      link: `${dashboardBaseRoute}/${CLIENT_ROUTES.DASHBOARD_OPERATIONS}`,
      icon: <MdOutlineAdminPanelSettings className="text-xl" />,
    },
    {
      key: 'Moderation',
      link: `${dashboardBaseRoute}/${CLIENT_ROUTES.DASHBOARD_MODERATION}`,
      icon: <GoReport className="text-xl" />,
    },
  ];

  const routeLinks = [];
  if (role === ROLES.GUEST) return [];
  if (role !== ROLES.SUPERADMIN) routeLinks.push(...userRoutes);
  else routeLinks.push(...superAdminRoutes);
  if (role === ROLES.ADMIN) routeLinks.push(...adminRoutes);

  return routeLinks;
};

export default quickLinks;
