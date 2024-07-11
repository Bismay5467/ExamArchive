import { Tabs, Tab } from '@nextui-org/react';
import { PiFiles } from 'react-icons/pi';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { Outlet } from 'react-router-dom';
import FileUploadForm from './FileUploadForm/FileUploadForm';
import { ITabOption } from '@/types/upload';

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
  return (
    <div className="flex max-w-[1200px] px-4 mx-auto flex-col">
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
