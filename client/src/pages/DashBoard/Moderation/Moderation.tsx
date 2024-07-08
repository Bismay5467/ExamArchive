import { Tabs, Tab } from '@nextui-org/react';
import { MdOutlinePendingActions } from 'react-icons/md';
import { IoMdCloudDone } from 'react-icons/io';
import ReportDisplay from './ReportDisplay/ReportDisplay';

export default function Moderation() {
  return (
    <div className="flex max-w-[1200px] mx-auto flex-col">
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
        <Tab
          key="pending"
          title={
            <div className="flex items-center space-x-2">
              <MdOutlinePendingActions className="text-2xl" />
              <span className="text-md font-medium">Pending</span>
            </div>
          }
        >
          <ReportDisplay action="PENDING" />
        </Tab>
        <Tab
          key="resolved"
          title={
            <div className="flex items-center space-x-2">
              <IoMdCloudDone className="text-2xl" />
              <span className="text-md font-medium">Resolved</span>
            </div>
          }
        >
          <ReportDisplay action="RESOLVED" />
        </Tab>
      </Tabs>
    </div>
  );
}
