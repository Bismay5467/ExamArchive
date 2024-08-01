import React from 'react';
import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import {
  Select,
  SelectItem,
  Button,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
} from '@nextui-org/react';
import { toast } from 'sonner';

import useSWR from 'swr';
import { RiDeleteBin6Line, RiFolderAddLine } from 'react-icons/ri';
import { EXAM_TYPES } from '@/constants/shared';
import { FileInput } from '@/components/ui/file-input';
import { TFileUploadFormFields } from '@/types/upload';
import { getFolderNameObj } from '@/utils/axiosReqObjects/folder';

import { MAX_FILE_SIZE } from '@/constants/upload';
import { useAuth } from '@/hooks/useAuth';
import NewFolderModal from '@/components/NewFolderModal/NewFolderModal';
import { IFolder } from '@/types/folder';

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
  const {
    isOpen: isCreateFolderOpen,
    onOpen: onCreateFolderOpen,
    onClose: onCreateFolderClose,
    onOpenChange: onCreateFolderOpenChange,
  } = useDisclosure();
  const { data, mutate } = useSWR(getFolderNameObj('UPLOAD', jwtToken));
  // TODO: Ifolder API type needs to be consistent!
  const folders: Array<IFolder> = data?.data?.data ?? [];

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
            {folders?.map(({ _id, name }) => (
              <AutocompleteItem key={_id} value={_id}>
                {name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Button
            onPress={onCreateFolderOpen}
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
      <NewFolderModal
        folderType="UPLOAD"
        isOpen={isCreateFolderOpen}
        mutate={mutate}
        onClose={onCreateFolderClose}
        onOpenChange={onCreateFolderOpenChange}
        folders={folders}
      />
    </section>
  );
}
