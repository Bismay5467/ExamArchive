import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spinner,
} from '@nextui-org/react';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { KeyedMutator } from 'swr';
import { KEY_CODES } from '@/constants/shared';
import { TAction } from '@/types/folder';
import { renameFolderObj } from '@/utils/axiosReqObjects/folder';
import { useAuth } from '@/hooks/useAuth';
import fetcher from '@/utils/fetcher/fetcher';

interface IRenameFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  mutate: KeyedMutator<any>;
  folderInfo?: {
    folderId: string;
    folderName: string;
  };
  folderType: TAction;
}

export default function RenameFolderModal({
  isOpen,
  onClose,
  onOpenChange,
  folderInfo,
  mutate,
  folderType,
}: IRenameFolderModalProps) {
  const [newFolderName, setNewFolderName] = useState<string>(
    folderInfo?.folderName || ''
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    authState: { jwtToken },
  } = useAuth();
  const handleSubmit = async () => {
    if (!folderInfo) {
      toast.error('Something went wrong!', {
        duration: 5000,
      });
      return;
    }
    const { folderId, folderName } = folderInfo;
    if (newFolderName === folderName) {
      toast.error('Folder name is same!', {
        duration: 2000,
      });
      return;
    }
    const reqObject = renameFolderObj(
      {
        action: folderType,
        folderId,
        newName: newFolderName,
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
    await mutate().then(() => {
      toast.success('Folder re-named successfully.', {
        duration: 5000,
      });
    });
    setIsLoading(false);
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
      radius="sm"
      className="font-natosans"
      onKeyDown={handleKeyEvent}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-row gap-x-3">
              <MdDriveFileRenameOutline className="self-center text-2xl" />
              <span>Rename to?</span>
            </ModalHeader>
            <ModalBody className="font-sm">
              <Input
                radius="sm"
                type="text"
                variant="bordered"
                onValueChange={setNewFolderName}
                defaultValue={folderInfo?.folderName}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                color="default"
                onPress={onClose}
                radius="sm"
              >
                Close
              </Button>
              <Button
                variant="bordered"
                color="secondary"
                type="submit"
                onPress={handleSubmit}
                radius="sm"
                {...(isLoading && {
                  startContent: <Spinner color="secondary" size="sm" />,
                })}
                isDisabled={isLoading}
              >
                Rename
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
