import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Spinner,
} from '@nextui-org/react';
import { toast } from 'sonner';
import { CiFlag1 } from 'react-icons/ci';
import { useLocation, useNavigate } from 'react-router-dom';
import { KEY_CODES, reportReasons } from '@/constants/shared';
import { reportObj } from '@/utils/axiosReqObjects';
import { TContentType } from '@/types/report';
import { useAuth } from '@/hooks/useAuth';
import fetcher from '@/utils/fetcher/fetcher';
import { IsUserAuthenticated } from '@/utils/helpers';

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
  const [reportRank, setReportRank] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    authState: { jwtToken, isAuth },
  } = useAuth();

  const handleSubmit = async () => {
    if (!IsUserAuthenticated(isAuth, navigate, pathname)) {
      return;
    }
    if (!reportRank) {
      toast.error('Please select one of the provided options!', {
        duration: 5000,
      });
      return;
    }
    const reqObject = reportObj(
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
    );
    if (!reqObject) {
      toast.error('Somthing went wrong!', {
        duration: 5000,
      });
      return;
    }
    setIsLoading(true);
    try {
      await fetcher(reqObject);
    } catch (err: any) {
      toast.error('Somthing went wrong!', {
        description: `${err.response.data.message}`,
        duration: 5000,
      });
      setIsLoading(false);
      return;
    }
    toast.success('Thanks for flagging the post.', {
      description: "We'll take a look at it and take the neccsary steps",
      duration: 5000,
    });
    setIsLoading(false);
    setReportRank(undefined);
    onClose();
  };

  const handleKeyEvent = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.code === KEY_CODES.ENTER) handleSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      className="font-natosans"
      radius="sm"
      onKeyDown={handleKeyEvent}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-row gap-x-3">
              <CiFlag1 className="self-center text-2xl" />
              <span>Report this {contentType.toLowerCase()}</span>
            </ModalHeader>
            <ModalBody>
              <div className="font-medium text-medium flex flex-row text-slate-700 dark:text-slate-300">
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
                id="sexy"
                radius="sm"
                color="primary"
                variant="bordered"
                onPress={handleSubmit}
                {...(isLoading && {
                  startContent: <Spinner color="secondary" size="sm" />,
                })}
                isDisabled={isLoading}
                type="submit"
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
