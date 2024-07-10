import { Tab, Tabs } from '@nextui-org/react';
import { RiAdminLine } from 'react-icons/ri';
import { GrUserAdmin } from 'react-icons/gr';
import TabularView from './TabularView/TabularView';

export default function Operations() {
  return (
    <div className="max-w-[1200px] mx-auto min-h-[1000px] px-4 font-natosans">
      <Tabs
        aria-label="Operations"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            'gap-6 w-full relative rounded-none p-0 border-b border-divider',
          cursor: 'w-full bg-pink-600',
          tab: 'max-w-fit px-0 h-12',
          tabContent: 'group-data-[selected=true]:text-pink-600',
        }}
      >
        <Tab
          key="super-admin"
          title={
            <div className="flex items-center space-x-2">
              <RiAdminLine className="text-2xl" />
              <span className="text-md font-medium">Super-Admin</span>
            </div>
          }
        >
          <TabularView varient="SUPERADMIN" />
        </Tab>
        <Tab
          key="admin"
          title={
            <div className="flex items-center space-x-2">
              <GrUserAdmin className="text-2xl" />
              <span className="text-md font-medium">Admin</span>
            </div>
          }
        >
          <TabularView varient="ADMIN" />
        </Tab>
      </Tabs>
    </div>
  );
}
