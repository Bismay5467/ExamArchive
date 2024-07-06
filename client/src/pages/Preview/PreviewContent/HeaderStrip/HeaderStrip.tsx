/* eslint-disable no-magic-numbers */
import { CiBookmarkPlus } from 'react-icons/ci';
import { useState } from 'react';
import { Button, useDisclosure } from '@nextui-org/react';
import { IoCloudDownloadOutline, IoFlagOutline } from 'react-icons/io5';
import useSWR from 'swr';
import { IFileData } from '@/types/file';
import ReportModal from '@/components/ReportModal/ReportModal';
import BookmarksModal from '../BookmarksModal/BookmarksModal';
import { IDropDownProps } from '@/types/comments';
import CustomDropDown from '@/components/Dropdown';
import { getUpdateDownloadCountObj } from '@/utils/axiosReqObjects/file';
import { useAuth } from '@/hooks/useAuth';

export default function HeaderStrip({
  className,
  paperId,
  fileData: {
    semester,
    subjectCode,
    subjectName,
    year,
    file: { url },
  },
}: {
  className: string;
  paperId: string;
  fileData: IFileData;
}) {
  const {
    authState: { jwtToken, userId },
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
  const [isFileDownloaded, setIsFileDownloaded] = useState<boolean>(false);
  const iconClasses = 'text-xl pointer-events-none flex-shrink-0';
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
    isFileDownloaded
      ? getUpdateDownloadCountObj({ postId: paperId, jwtToken })
      : null
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
