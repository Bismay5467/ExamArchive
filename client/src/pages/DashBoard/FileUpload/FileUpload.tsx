import { Tabs, Tab } from '@nextui-org/react';
import { PiFiles } from 'react-icons/pi';
import { PieChart } from '@mui/x-charts/PieChart';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { Outlet } from 'react-router-dom';
import useSWR from 'swr';
import FileUploadForm from './FileUploadForm/FileUploadForm';
import { ITabOption } from '@/types/upload';
import { getUploadStatsObj } from '@/utils/axiosReqObjects';
import { useAuth } from '@/hooks/useAuth';

const tabOptions: ITabOption[] = [
  {
    key: 'display',
    title: { icon: <PiFiles className="text-2xl" />, title: 'All Files' },
    children: <Outlet />,
  },
  {
    key: 'upload',
    title: {
      icon: <IoCloudUploadOutline className="text-2xl" />,
      title: 'Upload',
    },
    children: <FileUploadForm />,
  },
];

export default function FileUpload() {
  const {
    authState: { jwtToken },
  } = useAuth();
  const { data: response } = useSWR(getUploadStatsObj(jwtToken));
  const {
    totalDownloadCount,
    totalViewsCount,
  }: { totalDownloadCount: number; totalViewsCount: number } = response?.data
    ?.stats ?? { totalDownloadCount: 0, totalViewsCount: 0 };

  return (
    <div className="flex max-w-[1200px] gap-y-4 px-4 mx-auto flex-col font-natosans sm:gap-y-0">
      <span className="w-fit sm:self-end relative sm:top-5">
        <p className="absolute bottom-2 left-10 opacity-60 text-medium font-semibold">
          Total activity: {totalDownloadCount + totalViewsCount}
        </p>
        <PieChart
          colors={['red', 'blue', 'green']}
          series={[
            {
              data: [
                { value: totalViewsCount, label: 'Views' },
                { value: totalDownloadCount, label: 'Downloads' },
              ],
              highlightScope: { faded: 'global', highlighted: 'item' },
              innerRadius: 100,
              outerRadius: 90,
              paddingAngle: 5,
              cornerRadius: 4,
              startAngle: -90,
              endAngle: 90,
              cx: 100,
              cy: 100,
            },
          ]}
          height={100}
          width={350}
          className="w-fit"
        />
      </span>
      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            'gap-6 w-full relative rounded-none p-0 border-b border-divider',
          cursor: 'w-full bg-pink-500',
          tab: 'max-w-fit px-0 h-12',
          tabContent: 'group-data-[selected=true]:text-pink-500',
          base: 'w-fit',
        }}
      >
        {tabOptions.map(({ key, title, children }) => (
          <Tab
            key={key}
            title={
              <div className="flex items-center space-x-2">
                {title.icon}
                <span className="text-md font-medium">{title.title}</span>
              </div>
            }
          >
            {children}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
