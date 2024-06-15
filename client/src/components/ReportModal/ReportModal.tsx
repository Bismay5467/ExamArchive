/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
} from '@nextui-org/react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { cn } from '@/lib/utils.ts';
import { reportReasons } from '@/constants/shared';
import { reportObj } from '@/utils/axiosReqObjects';
import { TContentType } from '@/types/report';
import { useAuth } from '@/hooks/useAuth';
import { SUCCESS_CODES } from '@/constants/statusCodes';

interface IReportModalProps {
  text?: string;
  contentType: TContentType;
  postId: string;
  className?: string;
  endContent?: React.JSX.Element;
}

const ReportModal = React.forwardRef<HTMLSpanElement, IReportModalProps>(
  ({ className, text, endContent, contentType, postId, ...props }, ref) => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [reportRank, setReportRank] = useState<number>();
    const [submit, setSubmit] = useState<boolean>(false);
    const {
      authState: { jwtToken },
    } = useAuth();

    const { data: response, error } = useSWR(
      submit && reportRank
        ? reportObj(
            {
              contentType,
              postId,
              reason: {
                rank: reportRank,
                reason: reportReasons.find(({ rank }) => rank === reportRank)
                  ?.reason!,
              },
            },
            jwtToken
          )
        : null
    );

    useEffect(() => {
      if (response && response.status === SUCCESS_CODES.OK) {
        toast.success('Thanks for flagging the post.', {
          description: "We'll take a look at it and take the neccsary steps",
          duration: 5000,
        });
        if (error) {
          toast.error(`${error.response.data.message}`, {
            duration: 5000,
          });
        }
      }
    }, [response, error]);

    const handleSubmit = () => {
      setSubmit(true);
      onClose();
    };

    return (
      <>
        <span
          ref={ref}
          className={cn('flex flex-row gap-x-2 cursor-pointer', className)}
          {...props}
          onClick={onOpen}
          role="presentation"
        >
          <span className="self-center">{text}</span>
          {endContent && (
            <span className="text-2xl self-center">{endContent}</span>
          )}
        </span>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Report this content
                </ModalHeader>
                <ModalBody>
                  <Select
                    label="Select your complaint"
                    className="w-full"
                    variant="bordered"
                    onChange={(e) => setReportRank(Number(e.target.value))}
                  >
                    {reportReasons.map(({ rank, reason }) => (
                      <SelectItem key={rank}>{reason}</SelectItem>
                    ))}
                  </Select>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="success"
                    onPress={handleSubmit}
                    className="font-medium text-white tracking-wide"
                  >
                    Report
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
);

ReportModal.displayName = 'ReportModal';
export { ReportModal };
