import { Input } from '@/components/ui/input';
import { ResetFormFields } from '@/types/authTypes';
import { Label } from '@radix-ui/react-label';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { MdOutlineEmail } from 'react-icons/md';

export default function Email({
  register,
  errors,
}: {
  register: UseFormRegister<ResetFormFields>;
  errors: FieldErrors<ResetFormFields>;
}) {
  return (
    <>
      <Label htmlFor="username-input">Email</Label>
      <Input
        id="username-input"
        type="text"
        placeholder="jane.doe@domain.com"
        className="focus-visible:ring-0"
        {...register('email')}
      />
      {errors && (
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      )}
      <MdOutlineEmail className="absolute text-xl opacity-60 right-2 top-[42px]" />
    </>
  );
}
