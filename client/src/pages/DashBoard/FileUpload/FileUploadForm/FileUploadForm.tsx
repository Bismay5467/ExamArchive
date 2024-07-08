/* eslint-disable function-paren-newline */
/* eslint-disable indent */
import { toast } from 'sonner';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';

import { Typography } from '@mui/material';
import { Button, Spinner } from '@nextui-org/react';
import FileInfo from './Steps/FileInfo';
import { TFileUploadFormFields } from '@/types/upload';
import Upload from './Steps/Upload';
import { uploadFilesInputSchema } from '@/schemas/uploadSchema';
import { useAuth } from '@/hooks/useAuth';
import { fileUploadObj } from '@/utils/axiosReqObjects';
import fetcher from '@/utils/fetcher/fetcher';

export default function FileUploadForm() {
  const [fileName, setFileName] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
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

  const steps = [
    {
      label: 'Upload',
      content: (
        <Upload
          setFileName={setFileName}
          fileName={fileName}
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
        ? await trigger(['file']).then(() =>
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
    const storedData = localStorage.getItem('formData');
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
    setFileName('');
    setActiveStep(0);
  };

  const onAddAnother: SubmitHandler<TFileUploadFormFields> = (formData) => {
    // TODO: Bring all data from local storage
    const storedData = localStorage.getItem('formData');
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
        setFileName('');
        setActiveStep(0);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[800px] mx-auto">
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map(({ content, label }, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{content}</Typography>
              <div className="flex flex-row justify-between">
                {activeStep === 0 ? (
                  <span />
                ) : (
                  <Button onPress={handleAddAnother} color="success">
                    Add Another
                  </Button>
                )}
                <div className="flex flex-row gap-x-4">
                  <Button
                    isDisabled={index === 0}
                    onPress={handleBack}
                    color="success"
                  >
                    Back
                  </Button>
                  <Button
                    variant="bordered"
                    onPress={handleNext}
                    isDisabled={isLoading}
                    {...(isLoading && {
                      startContent: <Spinner color="secondary" size="sm" />,
                    })}
                  >
                    {index === steps.length - 1 ? 'Submit' : 'Continue'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </form>
  );
}
