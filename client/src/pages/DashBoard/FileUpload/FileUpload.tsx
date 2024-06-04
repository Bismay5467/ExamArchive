import { Button } from '@/components/ui/button';
import Upload from './Steps/Upload';
import FileInfo from './Steps/FileInfo';
import SpecificInfo from './Steps/SpecificInfo';
import useMultiStepForm from '@/hooks/useMultiStepForm';
import { TFileUploadFormFields } from '@/types/upload';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadFilesInputSchema } from '@/schemas/uploadSchema';
import { Form } from '@/components/ui/form';

export default function FileUpload() {
  const form = useForm<TFileUploadFormFields>({
    resolver: zodResolver(uploadFilesInputSchema),
  });
  const { next, prev, isFirstStep, isLastStep, step } = useMultiStepForm([
    <Upload form={form} />,
    <FileInfo form={form} />,
    <SpecificInfo form={form} />,
  ]);

  const onSubmit: SubmitHandler<TFileUploadFormFields> = async (formData) => {
    console.log(formData);
  };

  return (
    <div className="p-4 min-h-[600px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step}
          <div className="flex flex-row px-4 justify-around">
            <Button onClick={() => prev()} disabled={isFirstStep()}>
              Previous
            </Button>
            <Button
              type="submit"
              onClick={() => next()}
              disabled={isLastStep()}
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
