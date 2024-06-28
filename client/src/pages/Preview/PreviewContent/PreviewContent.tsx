import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { IoBookmarks } from 'react-icons/io5';
import { useDisclosure, Button } from '@nextui-org/react';
import { MdOutlinePerson } from 'react-icons/md';
import { FaEye, FaBookOpen } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { BiSolidSchool } from 'react-icons/bi';
import { IoMdTime } from 'react-icons/io';
import { FaRegComment, FaFlag } from 'react-icons/fa6';
import { getFileObj } from '@/utils/axiosReqObjects';
import { SUCCESS_CODES } from '@/constants/statusCodes';
import { IFileData } from '@/types/file';
import { PDFViewer } from './PDFViewer/PDFViewer';
import BookmarksModal from './BookmarksModal/BookmarksModal';
import ReportModal from '@/components/ReportModal/ReportModal';
import RatingSection from './RatingSection/RatingSection';
import TagsSection from './TagsSection/TagsSection';
import { WFullSekelton } from '@/components/Skeleton';
import { parseUTC } from '@/utils/helpers';
import { monthNames } from '@/constants/shared';

export default function PreviewContent() {
  const [fileData, setFileData] = useState<IFileData>();
  const { paperid } = useParams();

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

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR(paperid ? getFileObj(paperid) : null);

  const parseToJSON = async () => {
    const parsedData = await JSON.parse(response.data.data);
    setFileData(parsedData);
  };

  const { day, month, year } = parseUTC(fileData?.createdAt || '');

  useEffect(() => {
    if (response) {
      if (response.status === SUCCESS_CODES.OK) {
        parseToJSON();
      } else {
        toast.error('Something went wrong!', {
          duration: 5000,
        });
      }
    }
    if (error) {
      toast.error(`${error?.message}`, {
        description: error?.response?.data?.message,
        duration: 5000,
      });
    }
  }, [response, error]);

  return (
    <>
      <h1 className="text-xl font-medium p-4 sm:text-4xl">
        {isLoading ? (
          <WFullSekelton className="w-3/5 h-8" />
        ) : (
          <p>
            {fileData?.subjectName} ({fileData?.subjectCode})
          </p>
        )}
      </h1>
      <div className="flex flex-row px-4 justify-between">
        <div className="flex flex-row gap-x-4 text-sm sm:text-medium sm:gap-x-12">
          <div className="flex flex-row gap-x-2">
            <FaEye className="self-center" />
            <p className="self-center">{fileData?.noOfViews.count} views</p>
          </div>
          <div className="flex flex-row gap-x-2">
            <FiDownload className="self-center" />
            <p className="self-center">
              {fileData?.noOfDownloads.count} downloads
            </p>
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
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-6 sm:grid-rows-3">
        <div className="col-span-1 sm:col-span-3 sm:row-span-3 p-4">
          {fileData && <PDFViewer pdfURL={fileData.file.url} />}
        </div>
        <div className="col-span-1 row-start-1 flex flex-col gap-y-2 text-sm sm:text-lg sm:col-span-3 sm:row-span-1 p-4">
          <div className="flex flex-row gap-x-2">
            <FaBookOpen className="self-center sm:text-2xl" />
            <p>
              {fileData?.semester}, {fileData?.year}
            </p>
          </div>
          <div className="flex flex-row gap-x-4">
            <span className="flex flex-row gap-x-2">
              <MdOutlinePerson className="self-center sm:text-2xl" />{' '}
              <p>Arkojeet bera</p>
            </span>
            <span className="flex flex-row gap-x-2">
              <IoMdTime className="self-center sm:text-2xl" />
              <p>
                {monthNames[month]} {day}, {year}
              </p>
            </span>
          </div>
          <div className="flex flex-row gap-x-2">
            <BiSolidSchool className="self-center sm:text-2xl" />
            <p>{fileData?.institutionName}</p>
          </div>
        </div>
        <div className="col-span-1 sm:col-span-3 sm:row-span-1 p-4">
          {paperid && <RatingSection postId={paperid} />}
        </div>
        <div className="col-span-1 sm:col-span-3 sm:row-span-1 p-4">
          {fileData && paperid && (
            <TagsSection
              tags={fileData.tags}
              mutate={mutate}
              postId={paperid}
            />
          )}
        </div>
      </div>
      {paperid && fileData && (
        <BookmarksModal
          isOpen={isBookmarkOpen}
          onClose={onBookmarkClose}
          onOpenChange={onBookmarkOpenChange}
          paperid={paperid}
          semester={fileData.semester}
          subjectCode={fileData.subjectCode}
          subjectName={fileData.subjectName}
          year={fileData.year}
        />
      )}
      {paperid && (
        <ReportModal
          contentType="POST"
          isOpen={isReportOpen}
          onClose={onReportClose}
          onOpenChange={onReportOpenChange}
          postId={paperid}
        />
      )}
    </>
  );
}
