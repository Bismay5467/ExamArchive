import { LuCalendarClock } from 'react-icons/lu';
import { SiGoogleclassroom } from 'react-icons/si';
import { HiOutlineAcademicCap } from 'react-icons/hi2';
import { IoBookOutline, IoPersonOutline } from 'react-icons/io5';
import { PiExam } from 'react-icons/pi';
import { monthNames } from '@/constants/shared';
import { IFileData } from '@/types/file';
import { parseUTC } from '@/utils/helpers';

export default function BasicInfo({
  className,
  fileData: {
    semester,
    uploadedBy,
    year,
    institutionName,
    createdAt,
    branch,
    examType,
  },
}: {
  className: string;
  fileData: IFileData;
}) {
  const { day, month, year: createYear } = parseUTC(createdAt || '');
  return (
    <div className={className}>
      <div className="flex flex-row gap-x-8 text-blue-600">
        <span className="flex flex-row gap-x-3">
          <IoBookOutline className="self-center text-xl" />{' '}
          <p>
            {semester}, {year}
          </p>
        </span>
        <span className="flex flex-row gap-x-3">
          <PiExam className="self-center sm:text-xl" />
          <p>{examType}</p>
        </span>
      </div>
      <div className="flex flex-row gap-x-8 text-pink-600">
        <span className="flex flex-row gap-x-3">
          <IoPersonOutline className="self-center text-xl" />{' '}
          <p>{uploadedBy.username ?? 'ExamArchive user'}</p>
        </span>
        <span className="flex flex-row gap-x-3">
          <LuCalendarClock className="self-center text-xl" />
          <p>
            {monthNames[month]} {day}, {createYear}
          </p>
        </span>
      </div>
      <div className="flex flex-row gap-x-3 text-slate-700">
        <HiOutlineAcademicCap className="self-center text-xl" />
        <p>{institutionName}</p>
      </div>
      <div className="flex flex-row gap-x-3 text-slate-700">
        <SiGoogleclassroom className="self-center text-xl" />
        <p>{branch}</p>
      </div>
    </div>
  );
}
