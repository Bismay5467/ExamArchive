import { Outlet } from 'react-router-dom';
import { Card, CardBody } from '@nextui-org/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiPushpinLine } from 'react-icons/ri';
import { AiOutlineFilePdf } from 'react-icons/ai';

export default function Bookmarks() {
  return (
    <div className="max-w-[1200px] mx-auto flex flex-col p-4 gap-y-4 font-natosans">
      <div className="text-xl flex flex-row gap-x-2 font-semibold text-slate-700">
        <span>Pinned</span> <RiPushpinLine className="self-center text-2xl" />
      </div>
      <div className="flex gap-4 flex-col sm:flex-row">
        <Card
          className="w-full sm:w-1/3 font-natosans"
          radius="sm"
          style={{
            boxShadow:
              'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
          }}
        >
          <CardBody className="flex flex-row gap-x-3">
            <div className="self-center p-3 rounded-md">
              <AiOutlineFilePdf className="text-3xl text-[#e81a0c]" />
            </div>
            <div className="grow font-medium tracking-wide flex flex-col gap-y-1">
              <span className="text-slate-700">Test Folder 1</span>
              <span className="text-sm text-slate-500">
                Added 69 days before
              </span>
            </div>
            <span className="w-fit h-fit ">
              <BsThreeDotsVertical className="text-xl text-slate-600" />
            </span>
          </CardBody>
        </Card>
        <Card
          className="w-full sm:w-1/3 font-natosans"
          radius="sm"
          style={{
            boxShadow:
              'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
          }}
        >
          <CardBody className="flex flex-row gap-x-3">
            <div className="self-center p-3 rounded-md">
              <AiOutlineFilePdf className="text-3xl text-[#e81a0c]" />
            </div>
            <div className="grow font-medium tracking-wide flex flex-col gap-y-1">
              <span className="text-slate-700">Test Folder 1</span>
              <span className="text-sm text-slate-500">
                Added 69 days before
              </span>
            </div>
            <span className="w-fit h-fit ">
              <BsThreeDotsVertical className="text-xl text-slate-600" />
            </span>
          </CardBody>
        </Card>
        <Card
          className="w-full sm:w-1/3 font-natosans"
          radius="sm"
          style={{
            boxShadow:
              'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
          }}
        >
          <CardBody className="flex flex-row gap-x-3">
            <div className="self-center p-3 rounded-md">
              <AiOutlineFilePdf className="text-3xl text-[#e81a0c]" />
            </div>
            <div className="grow font-medium tracking-wide flex flex-col gap-y-1">
              <span className="text-slate-700">Test Folder 1</span>
              <span className="text-sm text-slate-500">
                Added 69 days before
              </span>
            </div>
            <span className="w-fit h-fit ">
              <BsThreeDotsVertical className="text-xl text-slate-600" />
            </span>
          </CardBody>
        </Card>
      </div>
      <Outlet />
    </div>
  );
}
