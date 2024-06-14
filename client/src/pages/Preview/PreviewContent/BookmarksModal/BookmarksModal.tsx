/* eslint-disable no-underscore-dangle */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  CheckboxGroup,
  Checkbox,
} from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import { MdCreateNewFolder } from 'react-icons/md';
import useSWR from 'swr';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  createFolderObj,
  getFolderNameObj,
} from '@/utils/axiosReqObjects/folder';
import fetcher from '@/utils/fetcher/fetcher';
import { addToBookmarkObj } from '@/utils/axiosReqObjects/bookmarks';

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
  const [collectionName, setCollectionName] = useState<string>('');
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
  const [collectionIDs, setCollectionIDs] = useState<Array<string>>([]);
  const {
    authState: { jwtToken },
  } = useAuth();
  const { data: collection, mutate: mutateCollection } = useSWR(
    getFolderNameObj('BOOKMARK', jwtToken)
  );
  const collectionList: Array<{ _id: string; name: string }> | undefined =
    collection?.data?.data ?? undefined;

  useEffect(() => {
    if (!isOpen) {
      setIsCreatingFolder(false);
      setCollectionIDs([]);
      setCollectionName('');
    }
  }, [isOpen]);

  const createBookmarks = (ids: Array<string>) => {
    const filenameForBookmark = `${subjectName},${subjectCode},${semester},${year}`;
    ids.map(async (id) => {
      const bookmarkReqObj = addToBookmarkObj(
        { fileId: paperid, folderId: id, fileName: filenameForBookmark },
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
      }
      toast.success('File bookmarked successfully!', {
        description: `Added to folder: ${collectionList?.find(({ _id }) => _id === id)?.name ?? collectionName}`,
        duration: 2000,
      });
    });
  };

  const handleBookmark = useCallback(() => {
    if (collectionIDs.length === 0) {
      toast.error('No collection(s) selected!', {
        duration: 5000,
      });
      return;
    }
    onClose();
    createBookmarks(collectionIDs);
    setCollectionIDs([]);
  }, [collectionIDs]);

  const handleCreateNew = useCallback(async () => {
    if (!isCreatingFolder) {
      setIsCreatingFolder(true);
      return;
    }

    if (collectionName.length === 0) {
      toast.error('Collection name should have atlease one character!', {
        duration: 5000,
      });
      return;
    }
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
    onClose();
    try {
      const res = await fetcher(folderDetails);
      createBookmarks([res.data.data._id as string]);
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
  }, [collectionName]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add to Bookmark
            </ModalHeader>
            <ModalBody>
              <CheckboxGroup
                label="Select cities"
                color="warning"
                onValueChange={setCollectionIDs}
                orientation="horizontal"
              >
                {collectionList?.map(({ _id, name }) => (
                  <Checkbox value={_id} key={_id}>
                    {name}
                  </Checkbox>
                ))}
              </CheckboxGroup>
              {isCreatingFolder && (
                <Input
                  autoFocus
                  label="Enter Collection Tiile"
                  variant="bordered"
                  onValueChange={(e) => setCollectionName(e)}
                  isInvalid={collectionList
                    ?.map((val) => val.name)
                    .includes(collectionName)}
                  errorMessage="Collection already exists!"
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              {collectionIDs.length === 0 ? (
                <Button
                  color="primary"
                  onClick={handleCreateNew}
                  endContent={<MdCreateNewFolder className="text-xl" />}
                >
                  Create {!isCreatingFolder && 'new'}
                </Button>
              ) : (
                <Button color="primary" variant="flat" onClick={handleBookmark}>
                  Add
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
