import { Input } from '@/components/ui/input';
import { SignUpFormFields } from '@/types/auth';

import { FieldErrors, UseFormRegister } from 'react-hook-form';

export default function OTPForm({
  register,
  errors,
}: {
  register: UseFormRegister<SignUpFormFields>;
  errors: FieldErrors<SignUpFormFields>;
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
