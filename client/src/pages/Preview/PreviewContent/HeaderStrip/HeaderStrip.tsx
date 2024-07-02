import { FaEye } from 'react-icons/fa';
import { IoBookmarks } from 'react-icons/io5';
import { FiDownload } from 'react-icons/fi';
import { FaRegComment, FaFlag } from 'react-icons/fa6';
import { Button, useDisclosure } from '@nextui-org/react';
import { IFileData } from '@/types/file';
import ReportModal from '@/components/ReportModal/ReportModal';
import BookmarksModal from '../BookmarksModal/BookmarksModal';

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
  return (
    <div className={className}>
      <div className="flex flex-row gap-x-4 text-sm sm:text-medium sm:gap-x-12">
        <div className="flex flex-row gap-x-2">
          <FaEye className="self-center" />
          <p className="self-center">{noOfViews.count} views</p>
        </div>
        <div className="flex flex-row gap-x-2">
          <FiDownload className="self-center" />
          <p className="self-center">{noOfDownloads.count} downloads</p>
        </div>
        <button
          type="button"
          className="hidden sm:flex sm:flex-row sm:gap-x-2"
          onClick={() => {
            const element = document.querySelector('#disscussion-forum');
            element?.scrollIntoView({
              behavior: 'smooth',
            });
          }}
        >
          <FaRegComment className="self-center" />
          <p className="self-center">Disscussion Forum</p>
        </button>
      </div>
      <div className="flex flex-row gap-x-2">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onClick={() => onBookmarkOpen()}
        >
          <IoBookmarks className="self-center text-2xl text-red-600" />
        </Button>
        <Button isIconOnly size="sm" variant="light">
          <FaFlag
            className="self-center text-2xl"
            onClick={() => onReportOpen()}
          />
        </Button>
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
