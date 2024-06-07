import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input, Select, SelectItem, Textarea } from '@nextui-org/react';

import { SEMESTER } from '@/constants/shared';
import { TFileUploadFormFields } from '@/types/upload';

export default function FileInfo({
  register,
  errors,
}: {
  register: UseFormRegister<TFileUploadFormFields>;
  errors: FieldErrors<TFileUploadFormFields>;
}) {
  return (
    <section className="p-4 max-w-[600px] mx-auto">
      <h1 className="text-3xl mb-6 font-bold text-gray-600">Tell us More!</h1>
      <div className="grid grid-cols-8 grid-rows-4 gap-x-4">
        <Input
          isRequired
          type="text"
          className="row-span-1 col-span-4"
          label="Subject Name"
          isInvalid={errors.subjectName !== undefined}
          errorMessage={errors.subjectName?.message}
          {...register('subjectName')}
        />
        <Input
          isRequired
          type="text"
          className="row-span-1 col-span-4"
          label="Subject Code"
          isInvalid={errors.subjectCode !== undefined}
          errorMessage={errors.subjectCode?.message}
          {...register('subjectCode')}
        />
        <Select
          isRequired
          label="Semester"
          className="row-span-1 col-span-5"
          {...register('semester')}
          isInvalid={errors.semester !== undefined}
          errorMessage="*Required"
        >
          {Object.entries(SEMESTER).map(([_, value]) => (
            <SelectItem key={value}>{value}</SelectItem>
          ))}
        </Select>
        <Input
          isRequired
          type="text"
          className="row-span-1 col-span-3"
          label="Year"
          {...register('year')}
          isInvalid={errors.year !== undefined}
          errorMessage={errors.year?.message}
        />
        <Input
          isRequired
          type="text"
          className="row-span-1 col-span-3"
          label="Branch"
          {...register('branch')}
          isInvalid={errors.branch !== undefined}
          errorMessage={errors.branch?.message}
        />
        <Input
          isRequired
          type="text"
          className="row-span-1 col-span-5"
          label="Institution"
          {...register('institution')}
          isInvalid={errors.institution !== undefined}
          errorMessage={errors.institution?.message}
        />
        <Textarea
          isRequired
          type="text"
          className="row-span-1 col-span-8"
          label="Tags"
          placeholder="Comma Separated with no spaces"
          {...register('tags')}
          isInvalid={errors.tags !== undefined}
          errorMessage={errors.tags?.message}
        />
      </div>
    </section>
  );
}
