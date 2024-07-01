import { Card, CardHeader, CardBody, Divider, Chip } from '@nextui-org/react';
import { IoBookOutline, IoPersonOutline } from 'react-icons/io5';
import { FaEye } from 'react-icons/fa';
import { MdOutlineSchool } from 'react-icons/md';
import { LuCalendarClock, LuDownload } from 'react-icons/lu';
import { ISearchData } from '@/types/search';

const MAX_TAGS_TO_DISPLAY = 3;

// TODO: Remove after merging preview PR
export const tagsBgColorMap: Array<string> = [
  'bg-danger/10',
  'bg-default/10',
  'bg-primary/10',
  'bg-secondary/10',
  'bg-success/10',
  'bg-warning/10',
] as const;

// TODO: Remove after merging preview PR
export const tagsTextColorMap: Array<string> = [
  'text-danger-500',
  'text-default-500',
  'text-primary-500',
  'text-secondary-500',
  'text-success-500',
  'text-warning-500',
] as const;

export default function ResultCard({
  data: {
    institutionName,
    noOfDownloads: { count: downloadCount },
    noOfViews: { count: viewCount },
    year,
    semester,
    subjectName,
    tags,
  },
}: {
  data: ISearchData;
}) {
  return (
    <Card
      className="w-[40%] hover:cursor-pointer font-natosans"
      radius="sm"
      style={{
        boxShadow:
          'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
      }}
    >
      <CardHeader className="flex gap-3 text-lg pl-8 text-slate-700 bg-[#f7f7f7]">
        {subjectName
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase())}
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-y-3 pl-8 text-slate-600 font-normal">
        <div className="flex flex-row gap-x-10">
          <div className="flex flex-row gap-x-4">
            <IoPersonOutline className="self-center text-xl text-blue-500" />{' '}
            <p className="text-blue-600">Arkojeet Bera</p>
          </div>
          <div className="flex flex-row gap-x-4">
            <IoBookOutline className="self-center text-xl text-blue-500" />{' '}
            <p className="text-blue-600">{semester}</p>
          </div>
          <div className="flex flex-row gap-x-4">
            <LuCalendarClock className="self-center text-lg text-orange-600" />{' '}
            <p className="text-orange-600">{year}</p>
          </div>
        </div>
        <div className="flex flex-row gap-x-3">
          <MdOutlineSchool className="self-center text-2xl text-pink-400" />{' '}
          <p className="text-pink-600">{institutionName}</p>
        </div>
        <div className="flex flex-row gap-x-8 my-4">
          <div className="flex flex-row gap-x-4">
            <FaEye className="self-center text-xl text-slate-500" />{' '}
            <p className="text-slate-500">
              {viewCount > 1 ? `${viewCount} views` : `${viewCount} view`}
            </p>
          </div>
          <div className="flex flex-row gap-x-4">
            <LuDownload className="self-center text-xl text-slate-500" />{' '}
            <p className="text-slate-500">
              {downloadCount > 1
                ? `${downloadCount} downloads`
                : `${downloadCount} download`}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-x-2">
          {tags.slice(0, MAX_TAGS_TO_DISPLAY).map((val) => (
            <Chip
              key={val}
              classNames={{
                base: 'bg-transparent border-small border-orange-600',
                content: 'text-orange-600',
              }}
            >
              {val.toLowerCase()}
            </Chip>
          ))}
          <p className="text-sm self-center text-slate-500">
            +{tags.length - MAX_TAGS_TO_DISPLAY} more
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
