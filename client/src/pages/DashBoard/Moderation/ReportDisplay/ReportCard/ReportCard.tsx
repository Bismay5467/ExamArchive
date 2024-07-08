import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { IoDocument } from 'react-icons/io5';
import { FaRegNoteSticky } from 'react-icons/fa6';
import { SiGoogleclassroom } from 'react-icons/si';
import { MdOutlineSchool } from 'react-icons/md';
import { LuCalendarClock, LuFileCode2 } from 'react-icons/lu';
import { monthNames } from '@/constants/shared';

export default function ReportCard() {
  return (
    <Card
      className="hover:cursor-pointer font-natosans"
      radius="sm"
      isPressable
      style={{
        boxShadow:
          'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
      }}
    >
      <CardHeader className="flex gap-3 text-sm px-8 text-slate-700 bg-[#f7f7f7] sm:text-lg">
        <div className="flex flex-row justify-between gap-x-2 whitespace-nowrap text-sm sm:text-medium sm:flex-row sm:justify-between">
          <IoDocument className="self-center text-2xl text-slate-600" />
          <span className="self-center text-sm sm:text-medium">Comment</span>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-y-3 px-8 text-slate-600 font-normal">
        <div className="flex flex-col gap-y-2 whitespace-nowrap text-sm sm:text-sm lg:text-medium sm:flex-row sm:justify-between">
          <div className="flex flex-row gap-x-4">
            <div className="self-center flex flex-row gap-x-2">
              <LuFileCode2 className="self-center text-xl text-blue-600" />{' '}
              <p className="text-blue-600">Mia Khalifa</p>
            </div>
            <div className="self-center flex flex-row gap-x-2">
              <FaRegNoteSticky className="self-center text-xl text-blue-600" />{' '}
              <p className="text-blue-600">Lana Rhodes</p>
            </div>
            <div className="self-center flex flex-row gap-x-2 text-pink-600">
              <LuCalendarClock className="self-center text-lg" />{' '}
              <p className="text-pink-600">Kate Aniston</p>
            </div>
          </div>
          <div className="hidden lg:flex lg:flex-row lg:gap-x-4">
            <div className="self-center flex flex-row gap-x-2">
              <SiGoogleclassroom className="self-center text-xl text-blue-600" />{' '}
              <p className="text-blue-600">Sunny Leone</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 whitespace-nowrap text-sm sm:text-sm lg:text-medium sm:flex-row sm:justify-between py-1">
          <div className="flex flex-row gap-x-2 w-fit rounded-full bg-pink-100 px-3 py-1">
            <MdOutlineSchool className="self-center text-xl text-pink-600" />{' '}
            <p className="self-center text-pink-600">Sexully explicit</p>
          </div>
          <div className="self-center hidden gap-x-2 text-sm text-slate-500 lg:flex lg:flex-row">
            <p>
              Posted on :{' '}
              <span className="py-1">{`${monthNames[1]} 24, 2024`}</span>
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
