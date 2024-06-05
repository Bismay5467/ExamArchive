import { ROLES } from '@/constants/auth';
import { CLIENT_ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export default function DashSideBar() {
  const {
    authState: { role },
  } = useAuth();

  return (
    <aside className="bg-blue-100 min-h-screen col-span-2 p-4 flex flex-col gap-y-4 rounded-md">
      <Link to={CLIENT_ROUTES.DASHBOARD_PROFILE}>
        <div className="border border-gray-700 p-6 text-center rounded-lg cursor-pointer hover:bg-slate-100">
          Profile
        </div>
      </Link>
      <Link to={CLIENT_ROUTES.DASHBOARD_BOOKMARKS}>
        <div className="border border-gray-700 p-6 text-center rounded-lg cursor-pointer hover:bg-slate-100">
          Bookmarks
        </div>
      </Link>
      {role === ROLES.ADMIN && (
        <Link to={CLIENT_ROUTES.DASHBOARD_FILEUPLOAD}>
          <div className="border border-gray-700 p-6 text-center rounded-lg cursor-pointer hover:bg-slate-100">
            File Upload
          </div>
        </Link>
      )}
      {role === ROLES.SUPERADMIN && (
        <Link to={CLIENT_ROUTES.DASHBOARD_ANALYTICS}>
          <div className="border border-gray-700 p-6 text-center rounded-lg cursor-pointer hover:bg-slate-100">
            Analytics
          </div>
        </Link>
      )}
    </aside>
  );
}
