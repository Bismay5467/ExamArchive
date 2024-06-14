import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
} from 'react-hook-form';
import { Input, Select, SelectItem, Textarea } from '@nextui-org/react';

import { SEMESTER } from '@/constants/shared';
import { TFileUploadFormFields } from '@/types/upload';

export default function FileInfo({
  register,
  errors,
  clearErrors,
}: {
  register: UseFormRegister<TFileUploadFormFields>;
  errors: FieldErrors<TFileUploadFormFields>;
  clearErrors: UseFormClearErrors<TFileUploadFormFields>;
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
          onFocus={() => errors.subjectName && clearErrors('subjectName')}
        />
        <Input
          isRequired
          type="text"
          className="row-span-1 col-span-4"
          label="Subject Code"
          isInvalid={errors.subjectCode !== undefined}
          errorMessage={errors.subjectCode?.message}
          {...register('subjectCode')}
          onFocus={() => errors.subjectCode && clearErrors('subjectCode')}
        />
        <Select
          isRequired
          label="Semester"
          className="row-span-1 col-span-5"
          {...register('semester')}
          isInvalid={errors.semester !== undefined}
          errorMessage="*Required"
          onFocus={() => errors.semester && clearErrors('semester')}
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
          errorMessage={errors.year && errors.year?.message}
          onFocus={() => clearErrors('year')}
        />
        <Input
          isRequired
          type="text"
          className="row-span-1 col-span-3"
          label="Branch"
          {...register('branch')}
          isInvalid={errors.branch !== undefined}
          errorMessage={errors.branch?.message}
          onFocus={() => errors.branch && clearErrors('branch')}
        />
        <Select
          isRequired
          className="row-span-1 col-span-5"
          label="Institution"
          {...register('institution')}
          isInvalid={errors.institution !== undefined}
          errorMessage={errors.institution?.message}
          onFocus={() => errors.institution && clearErrors('institution')}
        >
          <SelectItem key="National Institute of Technology karnataka">
            National Institute of Technology karnataka
          </SelectItem>
        </Select>
        <Textarea
          isRequired
          type="text"
          className="row-span-1 col-span-8"
          label="Tags"
          placeholder="Comma Separated with no spaces"
          {...register('tags')}
          isInvalid={errors.tags !== undefined}
          errorMessage={errors.tags?.message}
          onFocus={() => errors.tags && clearErrors('tags')}
        />
      </div>
    </section>
  );
}
