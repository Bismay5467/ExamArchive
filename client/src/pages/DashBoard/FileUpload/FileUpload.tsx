/* eslint-disable indent */
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';
import { toast } from 'sonner';
import useSWR from 'swr';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import FileInfo from './Steps/FileInfo';
import FinalSubmit from './Steps/FinalSubmit';
import { SUCCESS_CODES } from '@/constants/statusCodes';
import { TFileUploadFormFields } from '@/types/upload';
import Upload from './Steps/Upload';
import getFileFileUploadObj from '@/utils/axiosReqObjects/fileUpload';
import { uploadFilesInputSchema } from '@/schemas/uploadSchema';
import useMultiStepForm from '@/hooks/useMultiStepForm';
import { useAuth } from '@/hooks/useAuth';

export default function FileUpload() {
  const [fileUploadData, setFileUploadData] =
    useState<TFileUploadFormFields[]>();
  const [fileName, setFileName] = useState<string>();
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<TFileUploadFormFields>({
    resolver: zodResolver(uploadFilesInputSchema),
  });
  const {
    authState: { jwtToken },
  } = useAuth();
  const {
    data: response,
    error,
    isValidating,
  } = useSWR(
    fileUploadData
      ? getFileFileUploadObj({ fileUploadData, jwtToken: jwtToken as string })
      : null
  );

  const { next, prev, isFirstStep, isLastStep, resetMultiStepForm, step } =
    useMultiStepForm([
      <Upload
        setFileName={setFileName}
        fileName={fileName}
        register={register}
        errors={errors}
        setValue={setValue}
        clearErrors={clearErrors}
      />,
      <FileInfo
        register={register}
        errors={errors}
        clearErrors={clearErrors}
      />,
      <FinalSubmit />,
    ]);

  useEffect(() => {
    if (response && response.status === SUCCESS_CODES.OK) {
      reset();
      setFileName('');
      resetMultiStepForm();
      toast.success(`${response?.data?.message}`, {
        description: 'Amazing Job!',
        duration: 5000,
      });
    } else if (error) {
      toast.error(`${error?.message}`, {
        description: error?.response?.data?.message,
        duration: 5000,
      });
    }
  }, [response, error]);

  const triggerValidate = async () => {
    const validationResult = isFirstStep()
      ? await trigger(['file.dataURI', 'file.name', 'examType', 'folderId'])
      : await trigger([
          'branch',
          'subjectCode',
          'subjectName',
          'tags',
          'institution',
          'year',
          'semester',
        ]);
    if (!validationResult) {
      toast.error('Please fillup the required fields Correctly!', {
        duration: 5000,
      });
    }

    return validationResult;
  };

  const onSubmit: SubmitHandler<TFileUploadFormFields> = (formData) => {
    // TODO: Bring all data from local storage
    setFileUploadData([formData]);
  };

  return (
    <div className="p-4 min-h-[600px]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="min-h-[400px] p-4">{step}</div>
        <div className="flex flex-row px-4 justify-around">
          <Button
            onClick={() => prev()}
            isDisabled={isFirstStep()}
            color="primary"
            variant="bordered"
            startContent={<FaChevronLeft />}
          >
            Previous
          </Button>
          {!isLastStep() && (
            <Button
              onClick={() => {
                triggerValidate().then((res) => res && next());
              }}
              color="primary"
              variant="flat"
              endContent={<FaChevronRight />}
            >
              Next
            </Button>
          )}
          {isLastStep() && (
            <Button color="success" type="submit" isDisabled={isValidating}>
              Submit
              {isValidating && <Spinner size="sm" className="ml-2" />}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
