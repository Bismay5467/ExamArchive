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
import { MdCreateNewFolder } from 'react-icons/md';
import {
  EXAM_TYPES,
  TEMP_JWT_TOKEN_HARDCODED as jwtToken,
} from '@/constants/shared';
import { FileInput } from '@/components/ui/file-input';
import { TFileUploadFormFields } from '@/types/upload';
import {
  createFolderObj,
  getFolderNameObj,
} from '@/utils/axiosReqObjects/folder';
import fetcher from '@/utils/fetcher/fetcher';
import { MAX_FILE_SIZE } from '@/constants/upload';
// import { useAuth } from '@/hooks/useAuth';

export default function Upload({
  register,
  errors,
  fileName,
  setFileName,
  setValue,
  clearErrors,
}: {
  register: UseFormRegister<TFileUploadFormFields>;
  setValue: UseFormSetValue<TFileUploadFormFields>;
  errors: FieldErrors<TFileUploadFormFields>;
  clearErrors: UseFormClearErrors<TFileUploadFormFields>;
  fileName: string | undefined;
  setFileName: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  // const {
  //   authState: { jwtToken },
  // } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [collectionName, setCollectionName] = useState<string>();
  const { data, mutate } = useSWR(getFolderNameObj('UPLOAD', jwtToken));
  const folderNames: Array<{ name: string; _id: string }> =
    data?.data?.data ?? undefined;

  const pdfToBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files?.length > 0) {
      const [fileToLoad] = files;
      if (fileToLoad.size > MAX_FILE_SIZE) {
        toast('File size exeeded 5MB!', {
          duration: 5000,
        });
        return;
      }
      setFileName(fileToLoad.name);
      const fileReader = new FileReader();

      fileReader.onload = (fileLoadedEvent) => {
        const dataURI = fileLoadedEvent.target?.result as string;
        setValue('file', { dataURI, name: fileToLoad.name });
      };

      fileReader.readAsDataURL(fileToLoad);
    } else {
      toast('Please upload a file!', {
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
    } catch (err) {
      toast('Somthing went wrong!', {
        description: `${err}`,
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
    <section className="px-[205px] flex flex-col gap-y-4 items-center">
      <FileInput
        filename={fileName}
        className="w-full"
        onChange={(e) => pdfToBase64(e)}
        onFocus={() => errors.file?.dataURI && clearErrors('file.dataURI')}
      />
      {errors && (
        <p className="text-red-500 text-sm">{errors.file?.dataURI?.message}</p>
      )}
      <div className="w-full flex flex-col gap-y-1">
        <div className="w-full flex flex-row gap-x-4">
          <Select
            label="Exam Type"
            className="w-[50%]"
            {...register('examType')}
            isRequired
            isInvalid={errors.examType !== undefined}
            errorMessage="*Required"
            onFocus={() => errors.examType && clearErrors('examType')}
          >
            {Object.entries(EXAM_TYPES.INSTITUTIONAL).map(([_, value]) => (
              <SelectItem key={value}>{value}</SelectItem>
            ))}
          </Select>
          <Autocomplete
            label="Select a collection"
            className="w-[50%]"
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
        </div>
        <Button
          onPress={onOpen}
          color="primary"
          className="self-end"
          endContent={<MdCreateNewFolder className="text-xl" />}
        >
          Create new collection
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create a new Collection
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Collection Name"
                  variant="bordered"
                  isInvalid={folderNames.some(
                    ({ name }) => name === collectionName
                  )}
                  errorMessage="Collection already exists!"
                  onValueChange={(e) => setCollectionName(e)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
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
