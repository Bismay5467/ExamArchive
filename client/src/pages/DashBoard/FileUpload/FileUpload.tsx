import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';
import { toast } from 'sonner';
import useSWR from 'swr';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';

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

  if (response && response.status === SUCCESS_CODES.OK) {
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
  const { next, prev, isFirstStep, isLastStep, step, stepIndex } =
    useMultiStepForm([
      <Upload
        setFileName={setFileName}
        fileName={fileName}
        register={register}
        errors={errors}
        setValue={setValue}
      />,
      <FileInfo register={register} errors={errors} />,
      <FinalSubmit />,
    ]);

  const triggerValidate = () => {
    if (stepIndex === 0) {
      return trigger(['file', 'examType', 'folderId']);
    }
    return trigger([
      'branch',
      'subjectCode',
      'subjectName',
      'tags',
      'institution',
      'year',
      'semester',
    ]);
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
