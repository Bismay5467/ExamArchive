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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-row gap-x-2 text-3xl font-[10px]">
              Report
            </ModalHeader>
            <ModalBody>
              <div className="font-light text-2xl flex flex-row">
                Why are you reporting this post?
              </div>
              <div className="text-sm opacity-60">
                Your report is anonymous exexpt if you are reporting an
                intellectual property infringement. If someone is in immediate
                danger call the local emrgancy services.
              </div>
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
              <Button
                color="success"
                onPress={handleSubmit}
                className="font-medium text-white tracking-wide w-full bg-[#595EFC]"
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
