import { FaBookOpen } from 'react-icons/fa';
import { MdOutlinePerson } from 'react-icons/md';
import { IoMdTime } from 'react-icons/io';
import { BiSolidSchool } from 'react-icons/bi';
import { monthNames } from '@/constants/shared';
import { IFileData } from '@/types/file';
import { parseUTC } from '@/utils/helpers';

export default function BasicInfo({
  className,
  fileData: { semester, uploadedBy, year, institutionName, createdAt },
}: {
  className: string;
  fileData: IFileData;
}) {
  const { day, month, year: createYear } = parseUTC(createdAt || '');
  return (
    <div className={className}>
      <div className="flex flex-row gap-x-2">
        <FaBookOpen className="self-center sm:text-2xl" />
        <p>
          {semester}, {year}
        </p>
      </div>
      <div className="flex flex-row gap-x-4">
        <span className="flex flex-row gap-x-2">
          <MdOutlinePerson className="self-center sm:text-2xl" />{' '}
          <p>{uploadedBy.username ?? 'ExamArchive user'}</p>
        </span>
        <span className="flex flex-row gap-x-2">
          <IoMdTime className="self-center sm:text-2xl" />
          <p>
            {monthNames[month]} {day}, {createYear}
          </p>
        </span>
      </div>
      <div className="flex flex-row gap-x-2">
        <BiSolidSchool className="self-center sm:text-2xl" />
        <p>{institutionName}</p>
      </div>
    </div>
  );
}
