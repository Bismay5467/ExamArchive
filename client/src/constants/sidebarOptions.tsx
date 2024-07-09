import { IoBookmarkOutline, IoCloudUploadOutline } from 'react-icons/io5';
import { TbBrandGoogleAnalytics } from 'react-icons/tb';
import { MdAdminPanelSettings } from 'react-icons/md';
import { GoReport } from 'react-icons/go';
import { LuFileSearch2 } from 'react-icons/lu';
import { CLIENT_ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/auth';

const sidebarOptions = (role: string, userId: string) => {
  const dashboardBaseRoute = `dashboard/${userId}`;
  const userRoutes = [
    {
      key: 'Search',
      icon: <LuFileSearch2 className="text-xl" />,
      link: CLIENT_ROUTES.SEARCH,
      isReady: true,
    },
    {
      key: 'Bookmarks',
      icon: <IoBookmarkOutline className="text-xl" />,
      link: `${dashboardBaseRoute}/${CLIENT_ROUTES.DASHBOARD_BOOKMARKS}`,
      isReady: true,
    },
    {
      key: 'Analytics',
      icon: <TbBrandGoogleAnalytics className="text-xl" />,
      link: '',
      isReady: false,
    },
  ];

  const adminRoutes = [
    {
      key: 'Upload',
      icon: <IoCloudUploadOutline className="text-xl" />,
      link: `${dashboardBaseRoute}/${CLIENT_ROUTES.DASHBOARD_FILEUPLOAD}`,
      isReady: true,
    },
  ];

  const superAdminRoutes = [
    {
      key: 'Operations',
      icon: <MdAdminPanelSettings className="text-xl" />,
      link: `${dashboardBaseRoute}/${CLIENT_ROUTES.DASHBOARD_OPERATIONS}`,
      isReady: true,
    },
    {
      key: 'Moderation',
      icon: <GoReport className="text-xl" />,
      link: `${dashboardBaseRoute}/${CLIENT_ROUTES.DASHBOARD_MODERATION}`,
      isReady: true,
    },
  ];

  const routeLinks = [];
  if (role !== ROLES.SUPERADMIN) routeLinks.push(userRoutes);
  else routeLinks.push(superAdminRoutes);
  if (role === ROLES.ADMIN) routeLinks.push(adminRoutes);

  return routeLinks;
};

export default sidebarOptions;
