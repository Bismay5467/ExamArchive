import React, { useState } from 'react';
import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import {
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Autocomplete,
  AutocompleteItem,
} from '@nextui-org/react';
import { toast } from 'sonner';

import useSWR from 'swr';
import { RiDeleteBin6Line, RiFolderAddLine } from 'react-icons/ri';
import { CiFolderOn } from 'react-icons/ci';
import { EXAM_TYPES } from '@/constants/shared';
import { FileInput } from '@/components/ui/file-input';
import { TFileUploadFormFields } from '@/types/upload';
import {
  createFolderObj,
  getFolderNameObj,
} from '@/utils/axiosReqObjects/folder';
import fetcher from '@/utils/fetcher/fetcher';
import { MAX_FILE_SIZE } from '@/constants/upload';
import { useAuth } from '@/hooks/useAuth';

export default function Upload({
  register,
  errors,
  setFile,
  setValue,
  clearErrors,
  file,
}: {
  register: UseFormRegister<TFileUploadFormFields>;
  setValue: UseFormSetValue<TFileUploadFormFields>;
  errors: FieldErrors<TFileUploadFormFields>;
  clearErrors: UseFormClearErrors<TFileUploadFormFields>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  file: File | null;
}) {
  const {
    authState: { jwtToken },
  } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [collectionName, setCollectionName] = useState<string>();
  const { data, mutate } = useSWR(getFolderNameObj('UPLOAD', jwtToken));
  const folderNames: Array<{ name: string; _id: string }> =
    data?.data?.data ?? undefined;

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files?.length > 0) {
      const [fileToLoad] = files;
      if (fileToLoad.size > MAX_FILE_SIZE) {
        toast.error('File size exeeded 5MB!', {
          duration: 5000,
        });
      } else setFile(fileToLoad);
    } else {
      toast.error('Please upload a file!', {
        duration: 5000,
      });
    }
  };

  const handleCreateFolder = async () => {
    if (collectionName === undefined) return;
    const folderDetails = createFolderObj(
      {
        folderName: collectionName,
        action: 'UPLOAD',
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
    } catch (err: any) {
      toast('Somthing went wrong!', {
        description: `${err.response.data.message}`,
        duration: 5000,
      });
      setCollectionName('');
      return;
    }
    mutate().then(() => {
      toast.success(`${collectionName} successfully created!`, {
        duration: 5000,
      });
    });
    setCollectionName('');
  };

  return (
    <section className="py-4 flex flex-col gap-y-6 items-center font-natosans">
      <FileInput
        file={file}
        className={`w-full ${errors.file ? 'border-red-500' : ''}`}
        onChange={handleUploadFile}
        onFocus={() => errors.file && clearErrors('file')}
      />
      {errors.file && (
        <p className="text-red-500 text-sm">
          {errors.file?.message ??
            errors.file?.dataURI?.message ??
            errors.file?.name?.message}
        </p>
      )}
      <Button
        variant="bordered"
        color="danger"
        startContent={<RiDeleteBin6Line className="text-xl" />}
        radius="sm"
        isDisabled={file === null}
        className="w-full text-medium"
        onPress={() => setFile(null)}
      >
        Delete
      </Button>
      <div className="w-full flex flex-col sm:flex-row gap-x-4">
        <Select
          label="Exam Type"
          size="sm"
          radius="sm"
          className="self-center sm:w-1/2 font-natosans"
          {...register('examType')}
          isRequired
          variant="bordered"
          isInvalid={errors.examType !== undefined}
          errorMessage="*Required"
          onFocus={() => errors.examType && clearErrors('examType')}
        >
          {Object.entries(EXAM_TYPES.INSTITUTIONAL).map(([_, value]) => (
            <SelectItem key={value}>{value}</SelectItem>
          ))}
        </Select>
        <div className="flex flex-row gap-x-4 w-full sm:w-1/2 self-center">
          <Autocomplete
            label="Select a folder"
            size="sm"
            radius="sm"
            variant="bordered"
            className="self-center"
            onSelectionChange={(e) => setValue('folderId', e as string)}
            isRequired
            isInvalid={errors.folderId !== undefined}
            errorMessage="*Required"
            onFocus={() => errors.folderId && clearErrors('folderId')}
          >
            {folderNames?.map(({ _id, name }) => (
              <AutocompleteItem key={_id} value={_id}>
                {name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Button
            onPress={onOpen}
            radius="sm"
            size="lg"
            variant="bordered"
            color="primary"
            isIconOnly
          >
            <RiFolderAddLine className="text-xl" />
          </Button>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        radius="sm"
        className="font-natosans"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row gap-4">
                <CiFolderOn className="text-2xl" />{' '}
                <span> Create a new folder</span>
              </ModalHeader>
              <ModalBody className="mt-4">
                <Input
                  autoFocus
                  radius="sm"
                  label="Folder Name"
                  variant="bordered"
                  isInvalid={folderNames.some(
                    ({ name }) => name === collectionName
                  )}
                  errorMessage="Folder already exists!"
                  onValueChange={(e) => setCollectionName(e)}
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
                  onClick={() => {
                    onClose();
                    handleCreateFolder();
                  }}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
