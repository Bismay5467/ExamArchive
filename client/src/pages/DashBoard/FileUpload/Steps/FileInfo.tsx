import { Input } from '@nextui-org/react';
import { TFileUploadFormFields } from '@/types/upload';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Select, SelectItem } from '@nextui-org/react';
import { SEMESTER } from '@/constants/shared';

export default function FileInfo({
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
        label="Institution"
        {...register('institution')}
      />
      {errors && (
        <p className="text-red-500 text-sm">{errors.institution?.message}</p>
      )}
      <Input
        isRequired
        type="text"
        className="w-[500px]"
        label="Year"
        {...register('year')}
      />
      {errors && <p className="text-red-500 text-sm">{errors.year?.message}</p>}
      <Select
        isRequired
        label="Semester"
        className="max-w-xs"
        {...register('semester')}
      >
        {Object.entries(SEMESTER).map(([_, value]) => (
          <SelectItem key={value}>{value}</SelectItem>
        ))}
      </Select>
      {errors && (
        <p className="text-red-500 text-sm">{errors.semester?.message}</p>
      )}
    </section>
  );
}
