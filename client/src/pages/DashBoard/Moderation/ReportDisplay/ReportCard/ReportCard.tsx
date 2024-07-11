import { Card, CardBody, Chip, useDisclosure } from '@nextui-org/react';
import { FaRegComment, FaRegFile } from 'react-icons/fa6';
import { GoClock, GoPersonAdd } from 'react-icons/go';
import { LuFileClock } from 'react-icons/lu';
import { monthNames } from '@/constants/shared';
import { IReportPreview, TReportAction } from '@/types/report';
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
  action,
}: {
  reportData: IReportPreview;
  action: TReportAction;
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
        <CardBody className="flex flex-col gap-y-3 px-8 text-slate-600 text-sm font-natosans">
          <div className="flex mt-2 mb-1 whitespace-nowrap text-sm justify-between">
            <div className="flex flex-row gap-x-4">
              <div className="self-center flex flex-row gap-x-2 text-slate-500 font-sm">
                {docModel === 'Comment' && (
                  <FaRegComment className="self-center text-lg" />
                )}
                {docModel === 'Question' && (
                  <FaRegFile className="self-center text-lg" />
                )}

                <span className="self-center text-sm">
                  {docModel === 'Comment' ? 'Comment' : 'Post'}
                </span>
              </div>
            </div>
            <div className="self-center flex flex-row gap-x-2 text-slate-500">
              <GoClock className="self-center text-lg" />{' '}
              <p className="text-sm">
                Created on :{' '}
                <span className="py-1">{`${monthNames[createMonth]} ${createDay}, ${createyear}`}</span>
              </p>
            </div>
          </div>
          <div className="flex mb-4 whitespace-nowrap sm:flex-row sm:justify-between">
            <div className="self-center flex flex-row gap-x-2 text-blue-600">
              <LuFileClock className="self-center text-lg" />{' '}
              <p className="text-sm">
                Last Reported :{' '}
                <span className="py-1">{`${monthNames[updateMonth]} ${updateDay}, ${updateyear}`}</span>
              </p>
            </div>
            <div className="hidden lg:flex lg:flex-row lg:gap-x-4">
              <div className="self-center flex flex-row gap-x-2 text-pink-500">
                <GoPersonAdd className="self-center text-lg" />{' '}
                <p className="text-sm">Report Count: {totalReport}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col mb-2 gap-y-2 whitespace-nowrap text-sm sm:text-sm lg:text-medium sm:flex-row sm:justify-between py-1">
            <div className="flex flex-row flex-wrap gap-2">
              {reasons.map(({ _id: reasonId, count, reason }) => (
                <Chip
                  key={reasonId}
                  classNames={{
                    base: 'bg-pink-100 border border-pink-400',
                    content: 'text-pink-600',
                  }}
                  endContent={
                    <span className="text-sm mr-2 px-2 text-pink-500 rounded-full">
                      # {count}
                    </span>
                  }
                >
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
        action={action}
      />
    </>
  );
}
