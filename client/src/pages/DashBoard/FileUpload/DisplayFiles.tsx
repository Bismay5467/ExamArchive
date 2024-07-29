/* eslint-disable no-magic-numbers */
import { Outlet } from 'react-router-dom';
import useSWR from 'swr';
import { IoIosStats } from 'react-icons/io';
import { IoCloudDownloadOutline } from 'react-icons/io5';
import { VscEye } from 'react-icons/vsc';
import { useAuth } from '@/hooks/useAuth';
import { getUploadStatsObj } from '@/utils/axiosReqObjects';

export default function DisplayAllFiles() {
  const {
    authState: { jwtToken },
  } = useAuth();
  const { data: res } = useSWR(getUploadStatsObj(jwtToken));
  const {
    totalDownloadCount,
    totalViewsCount,
  }: { totalDownloadCount: number; totalViewsCount: number } = res?.data
    ?.stats ?? { totalDownloadCount: 0, totalViewsCount: 0 };

  const getVal = (val: number) => {
    if (val > 1000) return `${val / 1000} K`;
    return `${val}`;
  };
  const getStats = () => ({
    downloadCount:
      totalDownloadCount > 1
        ? `${getVal(totalDownloadCount)} downloads`
        : `${getVal(totalDownloadCount)} download`,
    viewCount:
      totalViewsCount > 1
        ? `${getVal(totalViewsCount)} views`
        : `${getVal(totalViewsCount)} view`,
  });

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-y-4 font-natosans">
      <div className="flex flex-col sm:flex-row sm:mt-2 text-base gap-x-10 gap-y-4">
        <div className="text-slate-500 gap-x-5 hidden sm:flex">
          <IoIosStats className="text-2xl" />
          <span>Your stats : </span>
        </div>
        <div
          className="flex flex-row gap-x-3"
          style={{
            background:
              'linear-gradient(101.2deg, rgb(247, 0, 0) -21.9%, rgb(164, 50, 237) 92.2%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          <IoCloudDownloadOutline className="text-2xl text-red-700" />
          <span>{getStats().downloadCount}</span>
        </div>

        <div
          className="flex flex-row gap-x-3"
          style={{
            background:
              'linear-gradient(101.2deg, rgb(247, 0, 0) -21.9%, rgb(164, 50, 237) 92.2%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          <VscEye className="text-2xl text-red-700" />
          <span>{getStats().viewCount}</span>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
