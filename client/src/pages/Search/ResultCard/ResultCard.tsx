import { Card, CardBody, Divider } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { IoPersonOutline } from 'react-icons/io5';
import { FaEye } from 'react-icons/fa';
import { SiGoogleclassroom } from 'react-icons/si';
import { MdOutlineSchool } from 'react-icons/md';
import { BsFileEarmarkPdf } from 'react-icons/bs';
import { LuCalendarClock, LuDownload, LuFileCode2 } from 'react-icons/lu';
import { ISearchData } from '@/types/search';
import { parseUTC } from '@/utils/helpers';
import { monthNames } from '@/constants/shared';
import { CLIENT_ROUTES } from '@/constants/routes';
import Tag from '@/components/Tags';

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
    year: examyear,
    createdAt,
    subjectName,
    tags,
    subjectCode,
    branch,
    _id,
    uploadedBy: { username },
  },
}: {
  data: ISearchData;
}) {
  const { day, month, year } = parseUTC(createdAt);
  const navigate = useNavigate();
  return (
    <Card
      className="hover:cursor-pointer font-natosans"
      radius="sm"
      isPressable
      style={{
        boxShadow:
          'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
      }}
      onPress={() => {
        navigate(`${CLIENT_ROUTES.FILE_PREVIEW}/${_id}`);
      }}
    >
      <CardBody className="flex gap-3 text-sm px-8 text-slate-700 bg-[#f7f7f7] sm:text-lg">
        <div className="flex flex-row justify-between gap-y-2 whitespace-nowrap text-sm sm:text-medium sm:flex-row sm:justify-between">
          <div className="flex flex-row gap-x-4">
            <div className="self-center flex flex-row gap-x-2">
              <BsFileEarmarkPdf className="self-center text-2xl text-red-500" />
              <span className="self-center">
                {subjectName
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-x-4">
            <div className="self-center flex flex-row gap-x-2 text-sm text-slate-500">
              <p>{`${monthNames[month - 1]} ${day}, ${year}`}</p>
            </div>
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardBody className="flex flex-col gap-y-4 px-8 text-slate-600 font-normal">
        <div className="flex flex-col gap-y-2 whitespace-nowrap text-sm sm:text-sm lg:text-medium sm:flex-row sm:justify-between">
          <div className="flex flex-row gap-x-4">
            <div className="self-center flex flex-row gap-x-2">
              <LuFileCode2 className="self-center text-xl text-blue-600" />{' '}
              <p className="text-blue-600">{subjectCode}</p>
            </div>
            <div className="self-center flex flex-row gap-x-2">
              <IoPersonOutline className="self-center text-xl text-blue-600" />{' '}
              <p className="text-blue-600">{username ?? 'ExamArchive User'}</p>
            </div>
            <div className="self-center flex flex-row gap-x-2 text-orange-600">
              <LuCalendarClock className="self-center text-lg" />{' '}
              <p className="text-orange-600">{examyear}</p>
            </div>
          </div>
          <div className="hidden md:flex md:flex-row md:gap-x-4">
            <div className="self-center flex flex-row gap-x-2">
              <SiGoogleclassroom className="self-center text-xl text-blue-600" />{' '}
              <p className="text-blue-600">{branch}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 whitespace-nowrap text-sm sm:text-sm lg:text-medium sm:flex-row sm:justify-between py-1">
          <div className="flex flex-row gap-x-4">
            <div className="flex flex-row gap-x-2">
              <MdOutlineSchool className="self-center text-xl text-pink-600" />{' '}
              <p className="self-center text-pink-600">{institutionName}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col pb-2 gap-y-2 whitespace-nowrap text-sm sm:text-sm lg:text-medium sm:flex-row sm:justify-between">
          <div className="flex flex- row gap-x-2">
            {tags.slice(0, MAX_TAGS_TO_DISPLAY).map((val, idx) => (
              <Tag
                key={idx}
                val={val}
                classNames={{
                  base: 'bg-violet-100 border-small border-violet-700',
                  content: 'text-violet-700',
                }}
              />
            ))}
            <p className="text-sm self-center text-slate-500">
              +{tags.length - MAX_TAGS_TO_DISPLAY} more
            </p>
          </div>
          <div className="hidden lg:flex lg:flex-row lg:gap-x-4 text-md">
            <div className="self-center flex flex-row gap-x-2">
              <FaEye className="self-center text-slate-500" />{' '}
              <p className="text-slate-500 text-sm">
                {viewCount > 1 ? `${viewCount} views` : `${viewCount} view`}
              </p>
            </div>
            <div className="self-center flex flex-row gap-x-2">
              <LuDownload className="self-center text-slate-500" />{' '}
              <p className="text-slate-500 text-sm">
                {downloadCount > 1
                  ? `${downloadCount} downloads`
                  : `${downloadCount} download`}
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
