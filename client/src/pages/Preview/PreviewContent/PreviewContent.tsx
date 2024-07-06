/* eslint-disable no-underscore-dangle */
/* eslint-disable function-paren-newline */
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getFileObj } from '@/utils/axiosReqObjects';
import { SUCCESS_CODES } from '@/constants/statusCodes';
import { IFileData } from '@/types/file';
import { PDFViewer } from './PDFViewer/PDFViewer';
import RatingSection from './RatingSection/RatingSection';
import TagsSection from './TagsSection/TagsSection';
import { WFullSekelton } from '@/components/Skeleton';
import BasicInfo from './BasicInfo/BasicInfo';
import {
  BasicInfoShimmer,
  PDFViewerShimmer,
  RatingSectionShimmer,
} from '../Shimmer/Shimmer';
import { useAuth } from '@/hooks/useAuth';
import { getUpdateViewCountObj } from '@/utils/axiosReqObjects/file';

export default function PreviewContent({
  setLoading,
}: {
  setLoading: (_val: boolean) => void;
}) {
  const [fileData, setFileData] = useState<IFileData>();
  const {
    authState: { jwtToken },
  } = useAuth();
  const { paperid } = useParams();

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR(paperid ? getFileObj(paperid) : null);
  useSWR(paperid ? getUpdateViewCountObj(paperid, jwtToken) : null);

  const parseToJSON = async () => {
    const parsedData = await JSON.parse(response.data.data);
    setFileData(parsedData);
  };

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

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

  const formattedSubjectName = (fileData?.subjectName ?? '')
    .split(' ')
    .map((word) =>
      word.charAt(0).toUpperCase().concat(word.slice(1).toLowerCase())
    )
    .join(' ');

  return (
    <>
      {isLoading ? (
        <WFullSekelton className="w-3/5 h-8 rounded-lg" />
      ) : (
        <h1 className="text-xl font-medium p-4 sm:text-4xl font-natosans text-slate-800">
          <p>
            {formattedSubjectName} ({fileData?.subjectCode})
          </p>
        </h1>
      )}
      <div className="grid sm:mt-4 grid-cols-1 sm:grid-cols-6 sm:grid-rows-3 font-natosans">
        <div className="col-span-1 sm:col-span-3 sm:row-span-3 p-4">
          {isLoading ? (
            <PDFViewerShimmer />
          ) : (
            fileData && <PDFViewer pdfURL={fileData.file.url} />
          )}
        </div>
        {isLoading ? (
          <BasicInfoShimmer className="col-span-1 row-start-1 flex flex-col gap-y-2 text-sm sm:text-lg sm:col-span-3 sm:row-span-1 p-4" />
        ) : (
          fileData &&
          paperid && (
            <BasicInfo
              className="col-span-1 row-start-1 flex flex-col gap-y-2 text-sm sm:text-lg sm:col-span-3 sm:row-span-1 p-4"
              fileData={fileData}
              paperId={paperid}
            />
          )
        )}
        <div className="col-span-1 sm:col-span-3 sm:row-span-1 p-4 font-natosans">
          {isLoading ? (
            <RatingSectionShimmer />
          ) : (
            paperid &&
            fileData && (
              <RatingSection
                postId={paperid}
                rating={fileData.rating}
                ratingCount={fileData.ratingCount}
              />
            )
          )}
        </div>
        <div className="col-span-1 sm:col-span-3 sm:row-span-1 p-4 font-natosans">
          {fileData && paperid && (
            <TagsSection
              uploaderId={fileData.uploadedBy._id}
              tags={fileData.tags}
              mutate={mutate}
              postId={paperid}
            />
          )}
        </div>
      </div>
    </>
  );
}
