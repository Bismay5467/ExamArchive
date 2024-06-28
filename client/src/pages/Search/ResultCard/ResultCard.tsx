import { Card, CardHeader, CardBody, Divider, Chip } from '@nextui-org/react';
import { IoPersonOutline, IoBookOutline } from 'react-icons/io5';
import { FaCalendarAlt, FaEye } from 'react-icons/fa';
import { BiSolidSchool } from 'react-icons/bi';
import { LuDownload } from 'react-icons/lu';
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
    <Card className="w-[600px]" radius="sm">
      <CardHeader className="flex gap-3">{subjectName}</CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-y-3">
        <div className="flex flex-row gap-x-8">
          <div className="flex flex-row gap-x-2">
            <IoPersonOutline className="self-center text-xl" />{' '}
            <p>Arkojeet Bera</p>
          </div>
          <div className="flex flex-row gap-x-2">
            <IoBookOutline className="self-center text-xl" /> <p>{semester}</p>
          </div>
          <div className="flex flex-row gap-x-2">
            <FaCalendarAlt className="self-center text-lg" /> <p>{year}</p>
          </div>
        </div>
        <div className="flex flex-row gap-x-2">
          <BiSolidSchool className="self-center text-2xl" />{' '}
          <p>{institutionName}</p>
        </div>
        <div className="flex flex-row gap-x-8">
          <div className="flex flex-row gap-x-2">
            <FaEye className="self-center text-xl" /> <p>{viewCount} Views</p>
          </div>
          <div className="flex flex-row gap-x-2">
            <LuDownload className="self-center text-xl" />{' '}
            <p>{downloadCount} downloads</p>
          </div>
        </div>
        <div className="flex flex-row gap-x-2">
          {tags.slice(0, MAX_TAGS_TO_DISPLAY).map((val, idx) => (
            <Chip
              variant="flat"
              key={val}
              className={`self-center ${tagsBgColorMap[idx % tagsBgColorMap.length]} ${tagsTextColorMap[idx % tagsTextColorMap.length]}`}
            >
              {val}
            </Chip>
          ))}
          <p className="text-sm opacity-60 self-center">
            +{tags.length - MAX_TAGS_TO_DISPLAY} more
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
