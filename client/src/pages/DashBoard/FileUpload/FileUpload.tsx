import { Tabs, Tab } from '@nextui-org/react';
import { PiFilesFill } from 'react-icons/pi';
import { IoCloudUpload } from 'react-icons/io5';
import { Outlet } from 'react-router-dom';
import FileUploadForm from './FileUploadForm/FileUploadForm';

export default function FileUpload() {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            'gap-6 w-full relative rounded-none p-0 border-b border-divider',
          cursor: 'w-full bg-[#22d3ee]',
          tab: 'max-w-fit px-0 h-12',
          tabContent: 'group-data-[selected=true]:text-[#06b6d4]',
        }}
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <PiFilesFill className="text-2xl" />
              <span className="text-md font-medium">All Files</span>
            </div>
          }
        >
          <Outlet />
        </Tab>
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <IoCloudUpload className="text-2xl" />
              <span className="text-md font-medium">Upload</span>
            </div>
          }
        >
          <FileUploadForm />
        </Tab>
      </Tabs>
    </div>
  );
}
