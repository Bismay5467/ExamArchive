import {
  FieldErrors,
  UseFormClearErrors,
  UseFormSetValue,
} from 'react-hook-form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { TSignUpFormFields } from '@/types/auth';

export default function OTPInput({
  setValue,
  errors,
  clearErrors,
}: {
  setValue: UseFormSetValue<TSignUpFormFields>;
  errors: FieldErrors<TSignUpFormFields>;
  clearErrors: UseFormClearErrors<TSignUpFormFields>;
}) {
  return (
    <div className="flex flex-col justify-center items-center gap-y-4">
      <h1 className="text-medium text-slate-500">Enter your OTP</h1>
      <InputOTP
        maxLength={6}
        onChange={(e) => setValue('enteredOTP', e)}
        onFocus={() => errors.enteredOTP && clearErrors('enteredOTP')}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {errors && (
        <p className="text-red-500 text-sm">{errors.enteredOTP?.message}</p>
      )}
    </div>
  );
}
