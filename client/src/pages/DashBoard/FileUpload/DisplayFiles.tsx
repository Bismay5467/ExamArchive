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
      <div className="flex mt-5 mb-2 text-xl gap-x-10">
        <div className="text-lg text-slate-500 flex gap-x-5 font-bold">
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
            fontWeight: 'bold',
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
            fontWeight: 'bold',
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
