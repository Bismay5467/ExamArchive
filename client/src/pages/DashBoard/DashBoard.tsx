import { Outlet } from 'react-router-dom';
import DashSideBar from './DashSideBar/DashSideBar';

export default function DashBoard() {
  return (
    <main className="grid grid-cols-10">
      <DashSideBar />
      <div className="col-span-8">
        <Outlet />
      </div>
    </main>
  );
}
