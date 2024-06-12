import { FaBookmark, FaChevronRight, FaFileUpload } from 'react-icons/fa';
import { IoAnalyticsSharp } from 'react-icons/io5';
import { TbMessageReport } from 'react-icons/tb';
import { RiDiscussFill } from 'react-icons/ri';
import { IoMdPerson } from 'react-icons/io';
import { CLIENT_ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/auth';
import ItemCounter from '@/components/Sidebar/ItemCounter/ItemCounter';

export default (role: string, userId: string) => {
  const baseRoute = `dashboard/${userId}`;
  const Profile = {
    key: 'Profile',
    endContent: <FaChevronRight className="text-xl text-default-400" />,
    iconWrapperClass: 'bg-success/10 text-success',
    startContent: <IoMdPerson className="text-lg " />,
    link: `${baseRoute}/${CLIENT_ROUTES.DASHBOARD_PROFILE}`,
  };
  const Bookmarks = {
    key: 'Bookmarks',
    endContent: <ItemCounter number={6} />,
    iconWrapperClass: 'bg-primary/10 text-primary',
    startContent: <FaBookmark className="text-lg" />,
    link: `${baseRoute}/${CLIENT_ROUTES.DASHBOARD_BOOKMARKS}`,
  };
  const Discussions = {
    key: 'Discussions',
    endContent: <ItemCounter number={293} />,
    iconWrapperClass: 'bg-secondary/10 text-secondary',
    startContent: <RiDiscussFill className="text-lg " />,
    link: `${baseRoute}`,
  };
  const Upload = {
    key: 'Upload',
    endContent: <FaChevronRight className="text-xl text-default-400" />,
    iconWrapperClass: 'bg-warning/10 text-warning',
    startContent: <FaFileUpload className="text-lg " />,
    link: `${baseRoute}/${CLIENT_ROUTES.DASHBOARD_FILEUPLOAD}`,
  };
  const Analytics = {
    key: 'Analytics',
    endContent: <FaChevronRight className="text-xl text-default-400" />,
    iconWrapperClass: 'bg-default/50 text-foreground',
    startContent: <IoAnalyticsSharp className="text-lg " />,
    link: `${baseRoute}/${CLIENT_ROUTES.DASHBOARD_ANALYTICS}`,
  };

  const Complaints = {
    key: 'Complaints',
    endContent: <ItemCounter number={79} />,
    iconWrapperClass: 'bg-warning/10 text-warning',
    startContent: <TbMessageReport className="text-lg " />,
    link: `${baseRoute}`,
  };

  const dropDownOptions = [Profile, Bookmarks, Discussions];
  if (role === ROLES.ADMIN) dropDownOptions.push(Upload);
  if (role === ROLES.SUPERADMIN) {
    dropDownOptions.push(Analytics);
    dropDownOptions.push(Complaints);
  }

  return dropDownOptions;
};
