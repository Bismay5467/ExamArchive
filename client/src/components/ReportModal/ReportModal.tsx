/* eslint-disable indent */
import { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from '@nextui-org/react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { CiFlag1 } from 'react-icons/ci';
import { reportReasons } from '@/constants/shared';
import { reportObj } from '@/utils/axiosReqObjects';
import { TContentType } from '@/types/report';
import { useAuth } from '@/hooks/useAuth';
import { SUCCESS_CODES } from '@/constants/statusCodes';

interface IReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  contentType: TContentType;
  postId: string;
}

export default function ReportModal({
  isOpen,
  onClose,
  onOpenChange,
  contentType,
  postId,
}: IReportModalProps) {
  // const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
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
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      className="font-natosans"
      radius="sm"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-row gap-x-3">
              <CiFlag1 className="self-center text-2xl" />
              <span>Report this {contentType.toLowerCase()}</span>
            </ModalHeader>
            <ModalBody>
              <div className="font-medium text-medium flex flex-row text-slate-700">
                Help us understand why you are reporting this{' '}
                {contentType.toLowerCase()}
              </div>
              <Select
                label="Select your complaint"
                className="w-full"
                variant="bordered"
                isRequired
                radius="sm"
                onChange={(e) => setReportRank(Number(e.target.value))}
              >
                {reportReasons.map(({ rank, reason }) => (
                  <SelectItem key={rank}>{reason}</SelectItem>
                ))}
              </Select>
              <p className="text-sm text-red-400 text-justify">
                We take reports seriously and after a thorough review of the{' '}
                {contentType.toLowerCase()} our team will get back to you.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                radius="sm"
                color="default"
                variant="bordered"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                radius="sm"
                color="primary"
                variant="bordered"
                onPress={handleSubmit}
              >
                Report
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
