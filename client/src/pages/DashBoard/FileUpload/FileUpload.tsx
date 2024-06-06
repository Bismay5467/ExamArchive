import { Button } from '@nextui-org/button';
import Upload from './Steps/Upload';
import FileInfo from './Steps/FileInfo';
import useMultiStepForm from '@/hooks/useMultiStepForm';
import { TFileUploadFormFields } from '@/types/upload';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadFilesInputSchema } from '@/schemas/uploadSchema';
import FinalSubmit from './Steps/FinalSubmit';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getFileFileUploadObj } from '@/utils/axiosReqObjects/fileUpload';
import { SUCCESS_CODES } from '@/constants/statusCodes';
import { toast } from 'sonner';
import { Spinner } from '@nextui-org/spinner';
import { FaChevronLeft } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa';

export default function FileUpload() {
  const [fileUploadData, setFileUploadData] =
    useState<TFileUploadFormFields[]>();
  const [fileName, setFileName] = useState<string>();

  const {
    data: response,
    error,
    isValidating,
  } = useSWR(fileUploadData ? getFileFileUploadObj(fileUploadData) : null);

  console.log(response);

  useEffect(() => {
    if (response && response.status === SUCCESS_CODES.OK) {
      toast.success(`${response?.data?.message}`, {
        description: 'Amazing Job!',
        duration: 5000,
      });
      next();
    } else if (error) {
      toast.error(`${error?.message}`, {
        description: error?.response?.data?.message,
        duration: 5000,
      });
    }
  }, [response, error]);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<TFileUploadFormFields>({
    resolver: zodResolver(uploadFilesInputSchema),
  });
  const { next, prev, isFirstStep, isLastStep, step, stepIndex } =
    useMultiStepForm([
      <Upload
        setFileName={setFileName}
        fileName={fileName}
        register={register}
        errors={errors}
      />,
      <FileInfo register={register} errors={errors} />,
      <FinalSubmit />,
    ]);

  const triggerValiadate = () => {
    if (stepIndex === 0) {
      return trigger(['file', 'examType']);
    } else {
      return trigger([
        'branch',
        'subjectCode',
        'subjectName',
        'tags',
        'institution',
        'year',
        'semester',
      ]);
    }
  };

  const onSubmit: SubmitHandler<TFileUploadFormFields> = async (formData) => {
    console.log(formData);
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
                triggerValiadate().then((res) => res && next());
              }}
              color="primary"
              variant="flat"
              endContent={<FaChevronRight />}
            >
              Next
            </Button>
          )}
          <Button
            color="success"
            type="submit"
            className={`${isLastStep() ? `block` : `hidden`}`}
          >
            Submit
            {isValidating && <Spinner />}
          </Button>
        </div>
      </form>
    </div>
  );
}
