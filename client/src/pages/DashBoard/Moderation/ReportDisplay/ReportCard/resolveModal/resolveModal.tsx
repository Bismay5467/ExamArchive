/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
import { useMemo, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from '@nextui-org/react';
import { toast } from 'sonner';
import { CiFlag1 } from 'react-icons/ci';
import useSWR from 'swr';
import { getCommentBody, resolveReportObj } from '@/utils/axiosReqObjects';
import { TContentType, TModerationAction, TReportAction } from '@/types/report';
import { useAuth } from '@/hooks/useAuth';
import fetcher from '@/utils/fetcher/fetcher';
import { CLIENT_ROUTES } from '@/constants/routes';

interface IReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  contentType: TContentType;
  postId: string;
  reportId: string;
  action: TReportAction;
}

export default function ResolveModal({
  isOpen,
  onClose,
  onOpenChange,
  contentType,
  postId,
  reportId,
  action,
}: IReportModalProps) {
  const [isResolving, setIsResolving] = useState<{
    spam: boolean;
    report: boolean;
    unresolve: boolean;
  }>({ spam: false, report: false, unresolve: false });

  const {
    authState: { jwtToken },
  } = useAuth();

  const { data } = useSWR(
    contentType === 'COMMENT' ? getCommentBody(postId, jwtToken) : null
  );

  const handleClick = async ({ event }: { event: TModerationAction }) => {
    const reqObject = resolveReportObj(
      {
        contentType,
        postId,
        reportId,
        action: event,
      },
      jwtToken
    );
    if (!reqObject) {
      toast.error('Somthing went wrong!', {
        duration: 5000,
      });
      return;
    }
    event === 'MARK AS SPAM'
      ? setIsResolving((prevState) => ({ ...prevState, spam: true }))
      : event === 'FLAG'
        ? setIsResolving((prevState) => ({ ...prevState, report: true }))
        : setIsResolving((prevState) => ({ ...prevState, unresolve: true }));
    try {
      await fetcher(reqObject);
    } catch (err: any) {
      toast.error('Somthing went wrong!', {
        description: `${err.response.data.message}`,
        duration: 5000,
      });
      event === 'MARK AS SPAM'
        ? setIsResolving((prevState) => ({ ...prevState, spam: false }))
        : event === 'FLAG'
          ? setIsResolving((prevState) => ({ ...prevState, report: false }))
          : setIsResolving((prevState) => ({ ...prevState, unresolve: false }));
      return;
    }
    const message =
      event === 'UNRESOLVE'
        ? 'Report unresolved for further srcutiny'
        : event === 'MARK AS SPAM'
          ? 'Marked as spam'
          : 'Report resolved';
    toast.success(message, {
      duration: 5000,
    });
    event === 'MARK AS SPAM'
      ? setIsResolving((prevState) => ({ ...prevState, spam: false }))
      : event === 'FLAG'
        ? setIsResolving((prevState) => ({ ...prevState, report: false }))
        : setIsResolving((prevState) => ({ ...prevState, unresolve: false }));
    onClose();
  };

  const renderContent = useMemo(() => {
    switch (contentType) {
      case 'POST':
        return (
          <Button
            radius="sm"
            color="default"
            variant="bordered"
            onPress={() =>
              window.open(`${CLIENT_ROUTES.FILE_PREVIEW}/${postId}`, '_blank')
            }
          >
            Show Post
          </Button>
        );
      case 'COMMENT':
        return <div>{data?.data?.data?.message}</div>;
      default:
        return <div>Invalid</div>;
    }
  }, [contentType]);
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
              <span>Resolve this Report</span>
            </ModalHeader>
            <ModalBody>{renderContent}</ModalBody>
            <ModalFooter>
              {action === 'RESOLVED' && (
                <Button
                  radius="sm"
                  color="primary"
                  variant="bordered"
                  onPress={() => handleClick({ event: 'UNRESOLVE' })}
                  {...(isResolving.unresolve && {
                    startContent: <Spinner color="secondary" size="sm" />,
                  })}
                  isDisabled={isResolving.unresolve}
                >
                  Mark as Unresolved
                </Button>
              )}
              {action === 'PENDING' && (
                <>
                  <Button
                    radius="sm"
                    color="default"
                    variant="bordered"
                    onPress={() => handleClick({ event: 'MARK AS SPAM' })}
                    {...(isResolving.spam && {
                      startContent: <Spinner color="secondary" size="sm" />,
                    })}
                    isDisabled={isResolving.spam}
                  >
                    Mark as spam
                  </Button>
                  <Button
                    radius="sm"
                    color="primary"
                    variant="bordered"
                    onPress={() => handleClick({ event: 'FLAG' })}
                    {...(isResolving.report && {
                      startContent: <Spinner color="secondary" size="sm" />,
                    })}
                    isDisabled={isResolving.report}
                  >
                    Flag content
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
