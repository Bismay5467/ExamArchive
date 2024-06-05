import { Input, Textarea } from '@nextui-org/react';
import { TFileUploadFormFields } from '@/types/upload';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

export default function SpecificInfo({
  register,
  errors,
}: {
  register: UseFormRegister<TFileUploadFormFields>;
  errors: FieldErrors<TFileUploadFormFields>;
}) {
  return (
    <section className="p-4 flex flex-col gap-y-6">
      <Input
        isRequired
        type="text"
        className="w-[500px]"
        label="Branch"
        {...register('branch')}
      />
      {errors && (
        <p className="text-red-500 text-sm">{errors.branch?.message}</p>
      )}
      <Input
        isRequired
        type="text"
        className="w-[500px]"
        label="Subject Code"
        {...register('subjectCode')}
      />
      {errors && (
        <p className="text-red-500 text-sm">{errors.subjectCode?.message}</p>
      )}
      <Input
        isRequired
        type="text"
        className="w-[500px]"
        label="Subject Name"
        {...register('subjectName')}
      />
      {errors && (
        <p className="text-red-500 text-sm">{errors.subjectName?.message}</p>
      )}
      <Textarea
        isRequired
        type="text"
        className="w-[500px]"
        label="Tags"
        placeholder="Comma Separated with no spaces"
        {...register('tags')}
      />
      {errors && <p className="text-red-500 text-sm">{errors.tags?.message}</p>}
    </section>
  );
}
