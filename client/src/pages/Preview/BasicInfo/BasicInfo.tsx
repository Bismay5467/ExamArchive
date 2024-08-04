import { SiGoogleclassroom } from 'react-icons/si';
import { HiOutlineAcademicCap } from 'react-icons/hi2';
import { IoBookOutline, IoPersonOutline } from 'react-icons/io5';
import { PiExam } from 'react-icons/pi';
import { IFileData } from '@/types/file';

export default function BasicInfo({
  className,
  fileData: { semester, uploadedBy, year, institutionName, branch, examType },
}: {
  className: string;
  fileData: IFileData;
}) {
  return (
    <div className={className}>
      <div className="flex flex-row justify-between dark:text-blue-500 text-blue-600">
        <div className="flex flex-row gap-x-8">
          <span className="flex flex-row gap-x-3">
            <IoBookOutline className="self-center text-xl" />{' '}
            <p className="self-center">
              {semester}, {year}
            </p>
          </span>
        </div>
      </div>
      <div className="flex flex-row gap-x-8 dark:text-pink-500 text-pink-600">
        <span className="flex flex-row gap-x-3">
          <IoPersonOutline className="self-center text-xl" />{' '}
          <p>{uploadedBy.username ?? 'ExamArchive user'}</p>
        </span>
        <span className="flex flex-row gap-x-3">
          <PiExam className="self-center text-xl" />
          <p className="self-center">{examType}</p>
        </span>
      </div>
      <div className="flex flex-row gap-x-3 dark:text-slate-400 text-slate-700">
        <HiOutlineAcademicCap className="self-center text-xl" />
        <p>{institutionName}</p>
      </div>
      <div className="flex flex-row gap-x-3 dark:text-slate-400 text-slate-700">
        <SiGoogleclassroom className="self-center text-xl" />
        <p>{branch}</p>
      </div>
    </div>
  );
}
