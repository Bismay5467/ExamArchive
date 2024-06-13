import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { Spinner } from '@nextui-org/spinner';
import React, { useEffect, useState } from 'react';
import { MdCreateNewFolder } from 'react-icons/md';
import useSWR from 'swr';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  createFolderObj,
  getFolderNameObj,
} from '@/utils/axiosReqObjects/folder';
import fetcher from '@/utils/fetcher/fetcher';
import {
  addToBookmarkObj,
  removeBookmarkObj,
} from '@/utils/axiosReqObjects/bookmarks';

export default function BookmarksModal({
  isOpen,
  onOpenChange,
  onClose,
  paperid,
  subjectName,
  subjectCode,
  semester,
  year,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  paperid: string;
  subjectName: string;
  subjectCode: string;
  semester: string;
  year: string;
}) {
  const [collectionName, setCollectionName] = useState<string>();
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
  const [prevCurrentCollectionIDs, setPrevCurrentCollectionIDs] = useState<
    Array<string>
  >([]);
  const {
    authState: { jwtToken },
  } = useAuth();
  const {
    data: collection,
    mutate: mutateCollection,
    isValidating: isValidatingCollection,
  } = useSWR(getFolderNameObj('BOOKMARK', jwtToken));
  const collectionList: Array<{ _id: string; name: string }> =
    collection?.data?.data ?? undefined;

  useEffect(() => {
    if (!isOpen) setIsCreatingFolder(false);
  }, [isOpen]);

  const handleCreateNew = async () => {
    if (!isCreatingFolder) {
      setIsCreatingFolder(true);
      return;
    }

    if (collectionName === undefined) return;
    const folderDetails = createFolderObj(
      {
        folderName: collectionName,
        action: 'BOOKMARK',
      },
      jwtToken
    );
    if (!folderDetails) {
      toast('Somthing went wrong!', {
        duration: 5000,
      });
      return;
    }
    try {
      await fetcher(folderDetails);
    } catch (err) {
      toast('Somthing went wrong!', {
        description: `${err}`,
        duration: 5000,
      });
      setCollectionName('');
      return;
    }
    mutateCollection().then(() => {
      toast.success(`${collectionName} successfully created!`, {
        duration: 5000,
      });
    });
    setCollectionName('');
    onClose();
  };

  const handleBookmark = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currentCollectionIDs = e.target.value.split(',');
    const diff = currentCollectionIDs.length - prevCurrentCollectionIDs.length;

    if (diff > 0) {
      const [idToAdd] = currentCollectionIDs.filter(
        (id) => !prevCurrentCollectionIDs.includes(id)
      );
      setPrevCurrentCollectionIDs(currentCollectionIDs);
      //   console.log(idToAdd);

      const filenameForBookMark = `${subjectName},${subjectCode},${semester},${year}`;
      const bookmarkReqObj = addToBookmarkObj(
        { fileId: paperid!, folderId: idToAdd, fileName: filenameForBookMark },
        jwtToken
      );
      if (!bookmarkReqObj) {
        toast.error('Somthing went wrong!', {
          duration: 5000,
        });
        return;
      }
      try {
        await fetcher(bookmarkReqObj);
      } catch (err) {
        toast.error('Somthing went wrong!', {
          description: `${err}`,
          duration: 5000,
        });
        return;
      }
      toast.success('File bookmarked successfully!', {
        duration: 5000,
      });
    } else {
      const [idToRemove] = prevCurrentCollectionIDs.filter(
        (id) => !currentCollectionIDs.includes(id)
      );
      setPrevCurrentCollectionIDs(currentCollectionIDs);
      const bookmarkReqObj = removeBookmarkObj(
        { fileId: paperid!, folderId: idToRemove },
        jwtToken
      );
      if (!bookmarkReqObj) {
        toast.error('Somthing went wrong!', {
          duration: 5000,
        });
        return;
      }
      try {
        await fetcher(bookmarkReqObj);
      } catch (err) {
        toast.error('Somthing went wrong!', {
          description: `${err}`,
          duration: 5000,
        });
        return;
      }
      toast.success('File removed from bookmarks!', {
        duration: 5000,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add to Bookmark
            </ModalHeader>
            <ModalBody>
              <Select
                label="Select Collection(s)"
                selectionMode="multiple"
                className="w-full"
                onChange={handleBookmark}
              >
                {collectionList.map(({ _id, name }) => (
                  <SelectItem key={_id}>{name}</SelectItem>
                ))}
              </Select>
              {isCreatingFolder && (
                <Input
                  autoFocus
                  label="Enter Collection Tiile"
                  variant="bordered"
                  onValueChange={(e) => setCollectionName(e)}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                onClick={handleCreateNew}
                endContent={<MdCreateNewFolder className="text-xl" />}
              >
                Create {!isCreatingFolder && 'new'}
                {isValidatingCollection && (
                  <Spinner size="sm" className="ml-2" />
                )}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
