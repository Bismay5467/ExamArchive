import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { TFileUploadFormFields } from '@/types/upload';
import { EXAM_TYPES } from '@/constants/shared';
import { Select, SelectItem } from '@nextui-org/react';
import { FileInput } from '@/components/ui/file-input';

export default function Upload({
  register,
  errors,
  fileName,
  setFileName,
}: {
  register: UseFormRegister<TFileUploadFormFields>;
  errors: FieldErrors<TFileUploadFormFields>;
  fileName: string | undefined;
  setFileName: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  return (
    <section className="px-[205px] flex flex-col gap-y-4 items-center">
      <FileInput
        filename={fileName}
        className="w-full"
        {...register('file')}
        onChange={(e) => e.target.files && setFileName(e.target.files[0].name)}
      />
      {errors && <p className="text-red-500 text-sm">{errors.file?.message}</p>}
      <div className="w-full flex flex-row gap-x-4">
        <Select
          label="Exam Type"
          className="w-[50%]"
          {...register('examType')}
          isRequired
          isInvalid={errors.examType !== undefined}
          errorMessage={'*Required'}
        >
          {Object.entries(EXAM_TYPES.INSTITUTIONAL).map(([_, value]) => (
            <SelectItem key={value}>{value}</SelectItem>
          ))}
        </Select>
        <Select
          label="Collection"
          className="w-[50%]"
          {...register('examType')}
          isDisabled
        >
          <SelectItem key="Saved">Saved</SelectItem>
          <SelectItem key="Midsem">Midsem</SelectItem>
          <SelectItem key="EndSem">EndSem</SelectItem>
        </Select>
      </div>
    </section>
  );
}
