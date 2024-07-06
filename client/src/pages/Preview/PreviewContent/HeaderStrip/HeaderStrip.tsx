import { FaEye } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { CiBookmarkPlus } from 'react-icons/ci';
import { Button, useDisclosure } from '@nextui-org/react';
import { IoCloudDownloadOutline, IoFlagOutline } from 'react-icons/io5';
import { IFileData } from '@/types/file';
import ReportModal from '@/components/ReportModal/ReportModal';
import BookmarksModal from '../BookmarksModal/BookmarksModal';
import { IDropDownProps } from '@/types/comments';
import CustomDropDown from '@/components/Dropdown';

export default function HeaderStrip({
  className,
  paperId,
  fileData: {
    noOfDownloads,
    noOfViews,
    semester,
    subjectCode,
    subjectName,
    year,
  },
}: {
  className: string;
  paperId: string;
  fileData: IFileData;
}) {
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
  const iconClasses = 'text-xl pointer-events-none flex-shrink-0';
  const dropdownMenu: IDropDownProps[] = [
    {
      icon: <IoCloudDownloadOutline className={iconClasses} />,
      value: 'Download file',
    },
    {
      icon: <IoFlagOutline className="text-lg pointer-events-none" />,
      value: 'Report',
      action: onReportOpen,
    },
  ];
  return (
    <div className={className}>
      <div className="flex flex-row gap-x-4 text-sm sm:text-medium sm:gap-x-12 text-slate-700">
        <div className="flex flex-row gap-x-2">
          <FaEye className="self-center" />
          <p className="self-center">
            {noOfViews.count > 1
              ? `${noOfViews.count} views`
              : `${noOfViews.count} view`}
          </p>
        </div>
        <div className="flex flex-row gap-x-2">
          <FiDownload className="self-center" />
          <p className="self-center">
            {noOfDownloads.count > 1
              ? `${noOfDownloads.count} downloads`
              : `${noOfDownloads.count} download`}
          </p>
        </div>
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
