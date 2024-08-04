/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */

import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@nextui-org/react';
import { FaRegComments } from 'react-icons/fa';
import { getFileObj } from '@/utils/axiosReqObjects';
import { SUCCESS_CODES } from '@/constants/statusCodes';
import { IFileData } from '@/types/file';
import { PDFViewer } from './PDFViewer/PDFViewer';
import RatingSection from './RatingSection/RatingSection';
import TagsSection from './TagsSection/TagsSection';
import BasicInfo from './BasicInfo/BasicInfo';
import {
  BasicInfoShimmer,
  PDFViewerShimmer,
  RatingSectionShimmer,
  WFullShimmer,
} from './Shimmer/Shimmer';
import { useAuth } from '@/hooks/useAuth';
import { getUpdateViewCountObj } from '@/utils/axiosReqObjects/file';
import Comments from './Comments/Comments';
import HeaderSection from './HeaderSection/HeaderSection';

export default function Preview() {
  const [fileData, setFileData] = useState<IFileData>();
  const [showComments, setShowComments] = useState(false);
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

  if (error) {
    toast.error(`${error?.message}`, {
      description: error?.response?.data?.message,
      duration: 5000,
    });
  }

  useEffect(() => {
    const element = document.querySelector('#comment-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showComments]);

  return (
    <section className="min-h-[600px] max-w-[1250px] p-4 mx-auto">
      <div className="">
        {isLoading ? (
          <div className="flex flex-col gap-y-2">
            <WFullShimmer className="w-3/5 sm:w-2/5 h-8 rounded-lg" />
            <div className="flex flex-row justify-between">
              <WFullShimmer className="sm:w-1/5 sm:h-8 rounded-lg" />
              <div className="flex flex-row gap-x-1">
                <WFullShimmer className="w-8 sm:w-20 sm:h-8 rounded-lg" />
                <WFullShimmer className="sm:w-8 sm:h-8 rounded-lg" />
                <WFullShimmer className="sm:w-8 sm:h-8 rounded-lg" />
              </div>
            </div>
          </div>
        ) : (
          fileData &&
          paperid && (
            <HeaderSection
              fileData={fileData}
              paperId={paperid}
              setShowComments={setShowComments}
            />
          )
        )}
      </div>
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
                mutate={mutate}
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
      {isLoading ? (
        <WFullShimmer className="w-full h-8 mt-5 rounded-lg" />
      ) : showComments ? (
        <Comments />
      ) : (
        <Button
          variant="bordered"
          color="default"
          radius="sm"
          className="w-full font-natosans py-3 mt-5 text-medium sm:hidden"
          onClick={() => setShowComments(true)}
          startContent={<FaRegComments className="text-xl" />}
        >
          Load Discussions
        </Button>
      )}
    </section>
  );
}
