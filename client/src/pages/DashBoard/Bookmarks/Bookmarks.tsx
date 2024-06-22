import { Outlet } from 'react-router-dom';
import { Card, CardBody } from '@nextui-org/react';
import { FaRegFilePdf } from 'react-icons/fa6';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { TbPinnedFilled } from 'react-icons/tb';

export default function Bookmarks() {
  return (
    <div className="flex flex-col p-4 gap-y-4">
      <h2 className="text-2xl flex flex-row gap-x-2 font-semibold">
        <span>Pinned</span>{' '}
        <TbPinnedFilled className="self-center text-3xl rotate-45 text-blue-500" />
      </h2>
      <div className="flex flex-row gap-x-4">
        <Card className="max-w-[400px] w-1/3" radius="sm">
          <CardBody className="flex flex-row gap-x-3">
            <div className="self-center p-3 rounded-md">
              <FaRegFilePdf className="text-3xl text-[#e81a0c]" />
            </div>
            <div className="grow font-medium tracking-wide flex flex-col gap-y-1">
              <span>Test Folder 1</span>
              <span className="text-sm opacity-70">Added 69 days before</span>
            </div>
            <span className="w-fit h-fit ">
              <BsThreeDotsVertical className="text-xl" />
            </span>
          </CardBody>
        </Card>
        <Card className="max-w-[400px] w-1/3" radius="sm">
          <CardBody className="flex flex-row gap-x-3">
            <div className="self-center p-3 rounded-md">
              <FaRegFilePdf className="text-3xl text-[#e81a0c]" />
            </div>
            <div className="grow font-medium tracking-wide flex flex-col gap-y-1">
              <span>Test Folder 2</span>
              <span className="text-sm opacity-70">Added 69 days before</span>
            </div>
            <span className="w-fit h-fit ">
              <BsThreeDotsVertical className="text-xl" />
            </span>
          </CardBody>
        </Card>
        <Card className="max-w-[400px] w-1/3" radius="sm">
          <CardBody className="flex flex-row gap-x-3">
            <div className="self-center p-3 rounded-md">
              <FaRegFilePdf className="text-3xl text-[#e81a0c]" />
            </div>
            <div className="grow font-medium tracking-wide flex flex-col gap-y-1">
              <span>Test Folder 3</span>
              <span className="text-sm opacity-70">Added 69 days before</span>
            </div>
            <span className="w-fit h-fit ">
              <BsThreeDotsVertical className="text-xl" />
            </span>
          </CardBody>
        </Card>
      </div>
      <Outlet />
    </div>
  );
}
