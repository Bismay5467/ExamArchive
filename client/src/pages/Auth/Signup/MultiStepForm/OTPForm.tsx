import { Input } from '@/components/ui/input';
import { SignUpFormFields } from '@/types/authTypes';

import { UseFormRegister } from 'react-hook-form';

export default function OTPForm({
  register,
}: {
  register: UseFormRegister<SignUpFormFields>;
}) {
  return (
    <>
      <Input
        type="text"
        className="focus-visible:ring-0"
        {...register('enteredOTP')}
      />
    </>
  );
}
