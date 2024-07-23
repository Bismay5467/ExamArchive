/* eslint-disable no-magic-numbers */
import { SiGoogleclassroom } from 'react-icons/si';
import { HiOutlineAcademicCap } from 'react-icons/hi2';
import {
  IoBookOutline,
  IoPersonOutline,
  IoCloudDownloadOutline,
  IoFlagOutline,
} from 'react-icons/io5';
import { PiExam } from 'react-icons/pi';
import { Button, useDisclosure } from '@nextui-org/react';
import { CiBookmarkPlus } from 'react-icons/ci';
import { useState } from 'react';
import useSWR from 'swr';
import ReportModal from '@/components/ReportModal/ReportModal';
import BookmarksModal from './BookmarksModal/BookmarksModal';
import { IFileData } from '@/types/file';
import CustomDropDown from '@/components/Dropdown';
import { IDropDownProps } from '@/types/comments';
import { useAuth } from '@/hooks/useAuth';
import { getUpdateDownloadCountObj } from '@/utils/axiosReqObjects/file';

export default function BasicInfo({
  className,
  fileData: {
    semester,
    subjectCode,
    subjectName,
    uploadedBy,
    year,
    institutionName,
    branch,
    examType,
    file: { url },
  },
  paperId,
}: {
  className: string;
  fileData: IFileData;
  paperId: string;
}) {
  const {
    authState: { jwtToken, userId },
  } = useAuth();
  const [isFileDownloaded, setIsFileDownloaded] = useState<boolean>(false);
  const iconClasses = 'text-xl pointer-events-none flex-shrink-0';
  const {
    onOpen: onBookmarkOpen,
    isOpen: isBookmarkOpen,
    onOpenChange: onBookmarkOpenChange,
    onClose: onBookmarkClose,
  } = useDisclosure();
  const {
    isOpen: isReportOpen,
    onOpen: onReportOpen,
    onClose: onReportClose,
    onOpenChange: onReportOpenChange,
  } = useDisclosure();
  const onDownload = () => {
    fetch(url).then((response) => {
      response.blob().then((blob) => {
        const fileURL = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.setAttribute('href', fileURL);
        anchor.setAttribute('download', `${paperId}_${userId}_${Date.now()}`);
        anchor.click();
        setIsFileDownloaded(true);
        setTimeout(() => {
          window.URL.revokeObjectURL(fileURL);
          setIsFileDownloaded(false);
        }, 10000);
      });
    });
  };
  useSWR(
    isFileDownloaded ? getUpdateDownloadCountObj(paperId, jwtToken) : null
  );
  const dropdownMenu: IDropDownProps[] = [
    {
      icon: <IoCloudDownloadOutline className={iconClasses} />,
      value: 'Download file',
      action: onDownload,
    },
    {
      icon: <IoFlagOutline className="text-lg pointer-events-none" />,
      value: 'Report',
      action: onReportOpen,
    },
  ];
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
        <div className="flex flex-row gap-x-2">
          <Button
            isIconOnly
            size="sm"
            className="bg-transparent"
            onClick={() => onBookmarkOpen()}
          >
            <CiBookmarkPlus className="self-center text-2xl text-red-600" />
          </Button>
          <CustomDropDown menu={dropdownMenu} />
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
      <div className="flex flex-row gap-x-3 dark:text-slate-500 text-slate-700">
        <HiOutlineAcademicCap className="self-center text-xl" />
        <p>{institutionName}</p>
      </div>
      <div className="flex flex-row gap-x-3 dark:text-slate-500 text-slate-700">
        <SiGoogleclassroom className="self-center text-xl" />
        <p>{branch}</p>
      </div>
      <BookmarksModal
        isOpen={isBookmarkOpen}
        onClose={onBookmarkClose}
        onOpenChange={onBookmarkOpenChange}
        paperid={paperId}
        semester={semester}
        subjectCode={subjectCode}
        subjectName={subjectName}
        year={year}
      />
      <ReportModal
        contentType="POST"
        isOpen={isReportOpen}
        onClose={onReportClose}
        onOpenChange={onReportOpenChange}
        postId={paperId}
      />
    </div>
  );
}
