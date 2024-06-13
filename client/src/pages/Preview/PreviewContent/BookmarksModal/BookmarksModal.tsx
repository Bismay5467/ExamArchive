/* eslint-disable no-underscore-dangle */
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
  SelectedItems,
  Chip,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
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
  const [collectionName, setCollectionName] = useState<string>();
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
  const [collectionIDs, setCollectionIDs] = useState<Array<string>>();
  const {
    authState: { jwtToken },
  } = useAuth();
  const { data: collection, mutate: mutateCollection } = useSWR(
    getFolderNameObj('BOOKMARK', jwtToken)
  );
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
  };

  const handleBookmark = () => {
    if (!collectionIDs) {
      toast.error('No collection(s) selected!', {
        duration: 5000,
      });
      return;
    }
    onClose();
    const filenameForBookMark = `${subjectName},${subjectCode},${semester},${year}`;

    collectionIDs.map(async (id) => {
      const bookmarkReqObj = addToBookmarkObj(
        { fileId: paperid!, folderId: id, fileName: filenameForBookMark },
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
        description: `Added to folder: ${collectionList.find(({ _id }) => _id === id)?.name}`,
        duration: 5000,
      });
    });
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
                placeholder="Select Collection(s)"
                aria-label="Select Collection(s)"
                selectionMode="multiple"
                isMultiline
                variant="bordered"
                classNames={{ base: 'w-full', trigger: 'min-h-12 py-2' }}
                onChange={(e) => setCollectionIDs(e.target.value.split(','))}
                items={collectionList}
                renderValue={(
                  items: SelectedItems<{ _id: string; name: string }>
                ) => (
                  <div className="flex flex-wrap gap-2">
                    {items.map(({ data }) => (
                      <Chip key={data?._id}>{data?.name}</Chip>
                    ))}
                  </div>
                )}
              >
                {({ _id, name }) => (
                  <SelectItem key={_id} textValue={name}>
                    {name}
                  </SelectItem>
                )}
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
              {collectionIDs && (
                <Button color="primary" variant="flat" onClick={handleBookmark}>
                  Add
                </Button>
              )}
              {!collectionIDs && (
                <Button
                  color="primary"
                  onClick={handleCreateNew}
                  endContent={<MdCreateNewFolder className="text-xl" />}
                >
                  Create {!isCreatingFolder && 'new'}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
