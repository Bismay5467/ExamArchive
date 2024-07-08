import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { Input, Select, SelectItem } from '@nextui-org/react';

import { useEffect, useState } from 'react';
import { SEMESTER } from '@/constants/shared';
import { TFileUploadFormFields } from '@/types/upload';
import TagsEditor from '@/components/TagsEditor/TagsEditor';

export default function FileInfo({
  register,
  errors,
  clearErrors,
  setValue,
}: {
  register: UseFormRegister<TFileUploadFormFields>;
  errors: FieldErrors<TFileUploadFormFields>;
  clearErrors: UseFormClearErrors<TFileUploadFormFields>;
  setValue: UseFormSetValue<TFileUploadFormFields>;
}) {
  const [tags, setTags] = useState<Array<string>>([]);
  useEffect(() => {
    setValue('tags', tags.join(','));
  }, [tags]);
  return (
    <section className="py-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-8">
        <Input
          isRequired
          radius="sm"
          type="text"
          className="col-span-2 sm:col-span-4"
          label="Subject Name"
          isInvalid={errors.subjectName !== undefined}
          errorMessage={errors.subjectName?.message}
          {...register('subjectName')}
          onFocus={() => errors.subjectName && clearErrors('subjectName')}
        />
        <Input
          isRequired
          radius="sm"
          type="text"
          className="col-span-2 sm:col-span-4"
          label="Subject Code"
          isInvalid={errors.subjectCode !== undefined}
          errorMessage={errors.subjectCode?.message}
          {...register('subjectCode')}
          onFocus={() => errors.subjectCode && clearErrors('subjectCode')}
        />
        <Select
          isRequired
          label="Semester"
          radius="sm"
          className="col-span-1 sm:col-span-5"
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
          className="col-span-1 sm:col-span-3"
          radius="sm"
          label="Year"
          {...register('year')}
          isInvalid={errors.year !== undefined}
          errorMessage={errors.year && errors.year?.message}
          onFocus={() => clearErrors('year')}
        />
        <Input
          isRequired
          radius="sm"
          type="text"
          className="col-span-2 sm:col-span-3"
          label="Branch"
          {...register('branch')}
          isInvalid={errors.branch !== undefined}
          errorMessage={errors.branch?.message}
          onFocus={() => errors.branch && clearErrors('branch')}
        />
        <Select
          isRequired
          className="col-span-2 sm:col-span-5"
          radius="sm"
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
        <TagsEditor
          isDeletable
          tags={tags}
          setTags={setTags}
          className="col-span-2 sm:col-span-8"
        />
        {errors && (
          <p className="text-red-500 text-sm col-span-2 sm:col-span-8 text-center">
            {errors.tags?.message}
          </p>
        )}
        {/* <Textarea
          isRequired
          type="text"
          className="col-span-2 sm:col-span-8"
          label="Tags"
          placeholder="Comma Separated with no spaces"
          {...register('tags')}
          isInvalid={errors.tags !== undefined}
          errorMessage={errors.tags?.message}
          onFocus={() => errors.tags && clearErrors('tags')}
        /> */}
      </div>
    </section>
  );
}
