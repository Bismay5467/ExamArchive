import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { IoBookmarks } from 'react-icons/io5';
import { Chip, useDisclosure, Tooltip, Button } from '@nextui-org/react';
import { MdReport } from 'react-icons/md';
import { getFileObj } from '@/utils/axiosReqObjects';
import { SUCCESS_CODES } from '@/constants/statusCodes';
import { IFileData } from '@/types/file';
import { PDFViewer } from './PDFViewer/PDFViewer';
import BookmarksModal from './BookmarksModal/BookmarksModal';
import RatingPopover from './RatingPopover/RatingPopover';
import ReportModal from '@/components/ReportModal/ReportModal';

const PING_TIME_OUT_TIME = 10000;
const MAX_TAGS_DISPLAY = 4;

export default function PreviewContent() {
  const [fileData, setFileData] = useState<IFileData>();
  const [setshowPing, setSetshowPing] = useState<boolean>(true);
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

  const { data: response, error } = useSWR(
    paperid ? getFileObj(paperid) : null
  );

  const parseToJSON = async () => {
    const parsedData = await JSON.parse(response.data.data);
    setFileData(parsedData);
  };

  useEffect(() => {
    setTimeout(() => {
      setSetshowPing(false);
    }, PING_TIME_OUT_TIME);
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
    <div className=" grid grid-cols-12">
      <div className="col-span-6 p-4">
        {fileData && <PDFViewer pdfURL={fileData.file.url} />}
      </div>
      <div className="min-h-[500px] flex flex-col gap-y-4 p-4 col-span-6 rounded-lg">
        <div>
          <h1 className="text-4xl font-medium flex flex-row gap-x-2">
            <span className="max-w-[70%] text-wrap">
              {fileData?.subjectName} ({fileData?.subjectCode})
            </span>
            <span className="relative">
              <IoBookmarks
                className="self-center ml-2 text-red-500 cursor-pointer"
                onClick={() => onBookmarkOpen()}
              />
              {setshowPing && (
                <span className="animate-ping absolute inline-flex left-[10px] top-[0px] h-3 w-3 rounded-full bg-blue-600" />
              )}
            </span>
          </h1>
          <h3 className="px-1 mt-2 font-semibold opacity-60">
            {fileData?.semester} ({fileData?.year})
          </h3>
        </div>
        <div className="flex flex-row flex-wrap gap-2">
          {fileData?.tags.slice(0, MAX_TAGS_DISPLAY).map((val) => (
            <Chip
              key={val}
              size="md"
              radius="md"
              color="primary"
              variant="shadow"
            >
              {val}
            </Chip>
          ))}
          {fileData && fileData?.tags.length > MAX_TAGS_DISPLAY && (
            <Tooltip
              className="self-center bg-slate-200/80"
              showArrow
              placement="bottom"
              content={
                <div className="flex flex-row flex-wrap gap-2 max-w-[500px] p-4">
                  {fileData?.tags.map((val) => (
                    <Chip
                      key={val}
                      size="md"
                      radius="md"
                      color="primary"
                      variant="shadow"
                    >
                      {val}
                    </Chip>
                  ))}
                </div>
              }
            >
              <span className="my-auto text-sm opacity-55 font-semibold cursor-pointer">
                + {fileData.tags.length - MAX_TAGS_DISPLAY} more
              </span>
            </Tooltip>
          )}
        </div>
        <h2 className="text-xl">
          <span className="text-2xl font-semibold">Branch:</span>{' '}
          {fileData?.branch}{' '}
        </h2>
        <h2 className="text-xl">
          <span className="text-2xl font-semibold">Subject Code:</span>{' '}
          {fileData?.subjectCode}{' '}
        </h2>
        <h3 className="text-xl">
          <span className="text-2xl font-semibold">Institute:</span>{' '}
          {fileData?.institutionName}{' '}
        </h3>
        <span className="flex flex-row gap-x-4">
          {paperid && <RatingPopover postId={paperid} />}
          {paperid && (
            <Button onClick={onReportOpen} color="danger">
              Report <MdReport />
            </Button>
          )}
        </span>
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
    </div>
  );
}
