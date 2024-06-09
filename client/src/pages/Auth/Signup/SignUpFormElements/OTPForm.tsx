import { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { TSignUpFormFields } from '@/types/auth';

export default function OTPForm({
  register,
  errors,
}: {
  register: UseFormRegister<TSignUpFormFields>;
  errors: FieldErrors<TSignUpFormFields>;
}) {
  return (
    <>
      <Input
        type="text"
        className="focus-visible:ring-0"
        {...register('enteredOTP')}
      />
      {errors && (
        <p className="text-red-500 text-sm">{errors.enteredOTP?.message}</p>
      )}
    </>
  );
}
