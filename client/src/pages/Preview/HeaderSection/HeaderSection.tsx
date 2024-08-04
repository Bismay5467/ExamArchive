/* eslint-disable no-magic-numbers */
import { Button, useDisclosure } from '@nextui-org/react';
import React, { useCallback, useMemo } from 'react';
import { IoCloudDownloadOutline, IoFlagOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import { FaRegComments } from 'react-icons/fa';
import { CiBookmarkPlus } from 'react-icons/ci';
import { IFileData } from '@/types/file';
import { parseUTC, toCamelCase } from '@/utils/helpers';
import { monthNames } from '@/constants/shared';
import ReportModal from '@/components/ReportModal/ReportModal';
import BookmarksModal from './BookmarksModal/BookmarksModal';
import { useAuth } from '@/hooks/useAuth';
import CustomDropDown from '@/components/Dropdown';
import { getUpdateDownloadCountObj } from '@/utils/axiosReqObjects/file';
import fetcher from '@/utils/fetcher/fetcher';
import { IDropDownProps } from '@/types/comments';

export default function HeaderSection({
  fileData: {
    semester,
    subjectCode,
    subjectName,
    year: examYear,
    updatedAt,
    file: { url },
  },
  paperId,
  setShowComments,
}: {
  fileData: IFileData;
  paperId: string;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { day, month, year } = parseUTC(updatedAt);
  const {
    authState: { userId, jwtToken },
  } = useAuth();
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

  const onDownload = useCallback(() => {
    fetch(url).then((response) => {
      response.blob().then((blob) => {
        const fileURL = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.setAttribute('href', fileURL);
        anchor.setAttribute('download', `${paperId}_${userId}_${Date.now()}`);
        anchor.click();
        const reqObject = getUpdateDownloadCountObj(paperId, jwtToken);
        try {
          fetcher(reqObject);
        } catch (err: any) {
          toast.error('Somthing went wrong!', {
            description: `${err.response.data.message}`,
            duration: 2000,
          });
        }
        setTimeout(() => {
          window.URL.revokeObjectURL(fileURL);
        }, 10000);
      });
    });
  }, []);

  const dropdownMenu: IDropDownProps[] = useMemo(
    () => [
      {
        icon: (
          <IoCloudDownloadOutline className="text-xl pointer-events-none flex-shrink-0" />
        ),
        value: 'Download file',
        action: onDownload,
      },
      {
        icon: <IoFlagOutline className="text-lg pointer-events-none" />,
        value: 'Report',
        action: onReportOpen,
      },
    ],
    []
  );
  return (
    <div className="flex flex-col gap-y-1 px-4 font-natosans">
      <h1 className="text-xl font-medium sm:text-4xl dark:text-slate-400 text-slate-800">
        {toCamelCase(subjectName)} [{subjectCode}]
      </h1>
      <div className="flex flex-row justify-between">
        <h3 className="self-center sm:self-end text-sm sm:text-medium text-slate-600 dark:text-slate-300">
          Last Updated: {day} {monthNames[month]}, {year}
        </h3>
        <div className="relative flex flex-row gap-x-2">
          <Button
            variant="flat"
            color="default"
            radius="sm"
            size="sm"
            className="hidden sm:inline-flex self-center text-sm"
            onClick={() => setShowComments(true)}
            startContent={<FaRegComments className="text-xl" />}
          >
            Discussion Forum
          </Button>
          <button
            type="button"
            aria-label="forum-btn"
            className="sm:hidden"
            onClick={() => setShowComments(true)}
          >
            <FaRegComments className="text-xl" />
          </button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={() => onBookmarkOpen()}
          >
            <CiBookmarkPlus className="self-center text-xl sm:text-3xl text-red-600" />
          </Button>
          <CustomDropDown menu={dropdownMenu} />
          <span className="absolute flex h-2 w-2 top-0 right-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
          </span>
        </div>
      </div>
      <div className="w-full h-[1px] bg-slate-200 mt-2" />
      <BookmarksModal
        isOpen={isBookmarkOpen}
        onClose={onBookmarkClose}
        onOpenChange={onBookmarkOpenChange}
        paperid={paperId}
        semester={semester}
        subjectCode={subjectCode}
        subjectName={subjectName}
        year={examYear}
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
