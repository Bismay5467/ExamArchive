import { Input } from '@nextui-org/react';
import { Input as FileInput } from '@/components/ui/input';
import { Button } from '@nextui-org/react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { TFileUploadFormFields } from '@/types/upload';
import { EXAM_TYPES } from '@/constants/shared';
import { Select, SelectItem } from '@nextui-org/react';

export default function Upload({
  register,
  errors,
}: {
  register: UseFormRegister<TFileUploadFormFields>;
  errors: FieldErrors<TFileUploadFormFields>;
}) {
  return (
    <section className="p-4 flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4">
        <FileInput type="file" className="w-[300px]" {...register('file')} />
      </div>
      {errors && <p className="text-red-500 text-sm">{errors.file?.message}</p>}
      <div className="flex flex-row gap-x-4">
        <Select
          label="Exam Type"
          className="max-w-xs"
          {...register('examType')}
          isRequired
        >
          {Object.entries(EXAM_TYPES.INSTITUTIONAL).map(([_, value]) => (
            <SelectItem key={value}>{value}</SelectItem>
          ))}
        </Select>
      </div>
      {errors && (
        <p className="text-red-500 text-sm">{errors.examType?.message}</p>
      )}
      <div className="flex flex-row gap-x-4">
        <Input
          type="text"
          className="w-[500px]"
          placeholder="Enter collection name"
          isDisabled
        />
        <Button color="primary" isDisabled>
          Create new Collection
        </Button>
      </div>
    </section>
  );
}
