import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  useDisclosure,
} from '@nextui-org/react';
import { IoDocument } from 'react-icons/io5';
import { FaRegNoteSticky } from 'react-icons/fa6';
import { SiGoogleclassroom } from 'react-icons/si';
import { LuFileCode2 } from 'react-icons/lu';
import { monthNames } from '@/constants/shared';
import { IReportPreview } from '@/types/report';
import { parseUTC } from '@/utils/helpers';
import ResolveModal from './resolveModal/resolveModal';

export default function ReportCard({
  reportData: {
    docModel,
    createdAt,
    updatedAt,
    reasons,
    totalReport,
    postId,
    _id,
  },
}: {
  reportData: IReportPreview;
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const {
    day: createDay,
    month: createMonth,
    year: createyear,
  } = parseUTC(createdAt);

  const {
    day: updateDay,
    month: updateMonth,
    year: updateyear,
  } = parseUTC(updatedAt);
  return (
    <>
      <Card
        className="hover:cursor-pointer font-natosans"
        radius="sm"
        isPressable
        onPress={onOpen}
        style={{
          boxShadow:
            'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
        }}
      >
        <CardHeader className="flex gap-3 text-sm px-8 text-slate-700 bg-[#f7f7f7] sm:text-lg">
          <div className="flex flex-row justify-between gap-x-2 whitespace-nowrap text-sm sm:text-medium sm:flex-row sm:justify-between">
            <IoDocument className="self-center text-2xl text-slate-600" />
            <span className="self-center text-sm sm:text-medium">
              {docModel === 'Comment' ? 'Comment' : 'Post'}
            </span>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-y-3 px-8 text-slate-600 font-normal">
          <div className="flex flex-col gap-y-2 whitespace-nowrap text-sm sm:text-sm lg:text-medium sm:flex-row sm:justify-between">
            <div className="flex flex-row gap-x-4">
              <div className="self-center flex flex-row gap-x-2">
                <LuFileCode2 className="self-center text-xl text-blue-600" />{' '}
                <p>
                  Created on :{' '}
                  <span className="py-1">{`${monthNames[createMonth]} ${createDay}, ${createyear}`}</span>
                </p>
              </div>
              <div className="self-center flex flex-row gap-x-2">
                <FaRegNoteSticky className="self-center text-xl text-blue-600" />{' '}
                <p>
                  Last Reported :{' '}
                  <span className="py-1">{`${monthNames[updateMonth]} ${updateDay}, ${updateyear}`}</span>
                </p>
              </div>
            </div>
            <div className="hidden lg:flex lg:flex-row lg:gap-x-4">
              <div className="self-center flex flex-row gap-x-2">
                <SiGoogleclassroom className="self-center text-xl text-blue-600" />{' '}
                <p className="text-blue-600">Report Count: {totalReport}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 whitespace-nowrap text-sm sm:text-sm lg:text-medium sm:flex-row sm:justify-between py-1">
            <div className="flex flex-row flex-wrap gap-2">
              {reasons.map(({ _id: reasonId, count, reason }) => (
                <Chip
                  key={reasonId}
                  classNames={{
                    base: 'bg-violet-100',
                    content: 'text-violet-700',
                  }}
                >
                  <span className="text-sm mr-2 px-2 bg-pink-300 rounded-full">
                    {count}
                  </span>
                  {reason}
                </Chip>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
      <ResolveModal
        contentType={docModel === 'Question' ? 'POST' : 'COMMENT'}
        reportId={_id}
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        postId={postId}
      />
    </>
  );
}
