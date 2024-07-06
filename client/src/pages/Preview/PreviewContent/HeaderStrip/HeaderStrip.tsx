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
  fileData: { semester, subjectCode, subjectName, year },
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
