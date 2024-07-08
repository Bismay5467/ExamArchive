/* eslint-disable function-paren-newline */
/* eslint-disable indent */
import { toast } from 'sonner';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { FaRegCircleCheck } from 'react-icons/fa6';
import { GrFormNextLink, GrFormPreviousLink } from 'react-icons/gr';
import { IoAddCircleOutline } from 'react-icons/io5';
import { Button, Spinner } from '@nextui-org/react';
import FileInfo from './Steps/FileInfo';
import { TFileUploadFormFields } from '@/types/upload';
import Upload from './Steps/Upload';
import { uploadFilesInputSchema } from '@/schemas/uploadSchema';
import { useAuth } from '@/hooks/useAuth';
import { fileUploadObj } from '@/utils/axiosReqObjects';
import fetcher from '@/utils/fetcher/fetcher';
import { UPLOAD_FILE_KEY } from '@/constants/upload';

export default function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    resetField,
    getValues,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<TFileUploadFormFields>({
    resolver: zodResolver(uploadFilesInputSchema),
  });
  const {
    authState: { jwtToken },
  } = useAuth();

  useEffect(() => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (fileLoadedEvent) => {
        const dataURI = fileLoadedEvent.target?.result as string;
        setValue('file', { dataURI, name: file.name });
      };
      fileReader.readAsDataURL(file);
    } else {
      resetField('file');
      reset({ ...getValues, file: undefined });
      clearErrors('file');
    }
  }, [file]);

  const steps = [
    {
      label: 'Upload',
      content: (
        <Upload
          setFile={setFile}
          file={file}
          register={register}
          errors={errors}
          setValue={setValue}
          clearErrors={clearErrors}
        />
      ),
    },
    {
      label: 'Tell us more',
      content: (
        <FileInfo
          setValue={setValue}
          register={register}
          errors={errors}
          clearErrors={clearErrors}
        />
      ),
    },
  ];

  const triggerValidate = async () => {
    const validationResult =
      activeStep === 0
        ? await trigger(['file']).then(
            (res) =>
              res &&
              trigger(['file.dataURI', 'file.name', 'examType', 'folderId'])
          )
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

  const onSubmit: SubmitHandler<TFileUploadFormFields> = async (formData) => {
    // TODO: Bring all data from local storage
    let fileUploadData: Array<TFileUploadFormFields> = [formData];
    const storedData = localStorage.getItem(UPLOAD_FILE_KEY);
    if (storedData) {
      fileUploadData = [...fileUploadData, ...JSON.parse(storedData)];
    }

    const reqObject = fileUploadObj(fileUploadData, jwtToken);
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
    toast.success('Thanks for your contribution(s)!', {
      duration: 5000,
    });
    setIsLoading(false);
    localStorage.removeItem('formData');
    reset();
    setFile(null);
    setActiveStep(0);
  };

  const onAddAnother: SubmitHandler<TFileUploadFormFields> = (formData) => {
    // TODO: Bring all data from local storage
    const storedData = localStorage.getItem(UPLOAD_FILE_KEY);
    if (!storedData) {
      localStorage.setItem('formData', JSON.stringify([formData]));
    } else {
      const currFormData: Array<TFileUploadFormFields> = JSON.parse(storedData);
      currFormData.push(formData);
      localStorage.setItem('formData', JSON.stringify(currFormData));
    }
  };

  const handleNext = () => {
    triggerValidate().then(
      (res) =>
        res &&
        (activeStep === steps.length - 1
          ? handleSubmit(onSubmit)()
          : setActiveStep((prev) => prev + 1))
    );
  };

  const handleBack = () => {
    if (activeStep !== 0) setActiveStep((prev) => prev - 1);
  };

  const handleAddAnother = () => {
    triggerValidate().then((res) => {
      if (res) {
        handleSubmit(onAddAnother)();
        reset();
        setFile(null);
        setActiveStep(0);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[800px] mx-auto font-natosans"
    >
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map(({ content, label }, index) => (
          <Step key={label}>
            <StepLabel>
              <span className="text-lg">{label}</span>
            </StepLabel>
            <StepContent>
              {content}
              {activeStep === 0 ? (
                <span />
              ) : (
                <Button
                  onPress={handleAddAnother}
                  color="secondary"
                  variant="bordered"
                  radius="sm"
                  className="w-[100%] mb-5"
                  startContent={<IoAddCircleOutline className="text-2xl" />}
                >
                  Add Another
                </Button>
              )}
              <div
                className={`flex flex-row ${index > 0 ? 'justify-between' : 'justify-end'}`}
              >
                {index > 0 && (
                  <Button
                    onPress={handleBack}
                    color="primary"
                    variant="bordered"
                    radius="sm"
                    startContent={<GrFormPreviousLink className="text-2xl" />}
                  >
                    Back
                  </Button>
                )}
                <Button
                  variant="bordered"
                  radius="sm"
                  color="primary"
                  onPress={handleNext}
                  isDisabled={isLoading}
                  {...(isLoading && {
                    startContent: <Spinner color="secondary" size="sm" />,
                  })}
                  {...(isLoading === false &&
                    index !== steps.length - 1 && {
                      endContent: <GrFormNextLink className="text-2xl" />,
                    })}
                  {...(isLoading === false &&
                    index === steps.length - 1 && {
                      endContent: <FaRegCircleCheck className="text-xl" />,
                    })}
                >
                  {index === steps.length - 1 ? 'Submit' : 'Continue'}
                </Button>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </form>
  );
}
