import { useState } from 'react';
import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Tooltip,
} from '@nextui-org/react';
import { toast } from 'sonner';
import { CiFolderOn } from 'react-icons/ci';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { HiOutlineFolderAdd } from 'react-icons/hi';
import { KeyedMutator } from 'swr';
import { IFolder, TAction } from '@/types/folder';
import { createFolderObj } from '@/utils/axiosReqObjects';
import { useAuth } from '@/hooks/useAuth';
import fetcher from '@/utils/fetcher/fetcher';

interface INewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  folderType: TAction;
  mutate: KeyedMutator<any>;
  folders?: Array<IFolder>;
}

export default function NewFolderModal({
  folderType,
  isOpen,
  onClose,
  onOpenChange,
  mutate,
  folders = [],
}: INewFolderModalProps) {
  const [folderName, setFolderName] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    authState: { jwtToken },
  } = useAuth();
  const handleSubmit = async () => {
    if (folderName === undefined) return;
    const folderDetails = createFolderObj(
      {
        folderName,
        action: folderType,
      },
      jwtToken
    );
    if (!folderDetails) {
      toast('Somthing went wrong!', {
        duration: 5000,
      });
      return;
    }
    setIsLoading(true);
    try {
      await fetcher(folderDetails);
    } catch (err: any) {
      toast('Somthing went wrong!', {
        description: `${err.response.data.message}`,
        duration: 5000,
      });
      setFolderName('');
      setIsLoading(false);
      return;
    }
    await mutate().then(() => {
      toast.success(`${folderName} successfully created!`, {
        duration: 5000,
      });
    });
    setFolderName('');
    setIsLoading(false);
    onClose();
  };
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      radius="sm"
      className="font-natosans"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-row gap-x-4">
              <CiFolderOn className="text-3xl self-center" />{' '}
              <div className="flex flex-row gap-x-1">
                <span className="self-center"> Create a new folder</span>
                {folderType === 'UPLOAD' && (
                  <Tooltip
                    content={
                      <div className="opacity-65">
                        <p>
                          We encourage that you adhere to the <br /> following
                          format for folder naming:
                        </p>
                        <code>Subject-Code [Subject-Name]</code>
                      </div>
                    }
                    radius="sm"
                    placement="right"
                    showArrow
                  >
                    <span className="self-center text-sm">
                      <AiOutlineQuestionCircle />
                    </span>
                  </Tooltip>
                )}
              </div>
            </ModalHeader>
            <ModalBody className="mt-4">
              <Input
                autoFocus
                radius="sm"
                label="Folder Name"
                variant="bordered"
                isInvalid={folders.some(({ name }) => name === folderName)}
                errorMessage="Folder already exists!"
                onValueChange={(e) => setFolderName(e)}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="bordered"
                onPress={onClose}
                radius="sm"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                radius="sm"
                variant="bordered"
                onClick={handleSubmit}
                {...(isLoading && {
                  startContent: <Spinner color="secondary" size="sm" />,
                })}
                isDisabled={isLoading}
                endContent={<HiOutlineFolderAdd className="text-xl" />}
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
