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
import { TContentType, TReportAction } from '@/types/report';
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
  const [isResolving, setIsResolving] = useState<boolean>(false);

  const {
    authState: { jwtToken },
  } = useAuth();

  const { data } = useSWR(
    contentType === 'COMMENT' ? getCommentBody(postId, jwtToken) : null
  );

  const handleClick = async () => {
    const reqObject = resolveReportObj(
      {
        contentType,
        postId,
        reportId,
        action: action === 'PENDING' ? 'RESOLVE' : 'UNRESOLVE',
      },
      jwtToken
    );
    if (!reqObject) {
      toast.error('Somthing went wrong!', {
        duration: 5000,
      });
      return;
    }
    setIsResolving(true);
    try {
      await fetcher(reqObject);
    } catch (err: any) {
      toast.error('Somthing went wrong!', {
        description: `${err.response.data.message}`,
        duration: 5000,
      });
      setIsResolving(false);
      return;
    }
    toast.success('Report Resolved', {
      duration: 5000,
    });
    setIsResolving(false);
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
              <Button
                radius="sm"
                color="primary"
                variant="bordered"
                onPress={handleClick}
                {...(isResolving && {
                  startContent: <Spinner color="secondary" size="sm" />,
                })}
                isDisabled={isResolving}
              >
                {action === 'PENDING'
                  ? 'Mark as Resolved'
                  : 'Mark as Unresolved'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
