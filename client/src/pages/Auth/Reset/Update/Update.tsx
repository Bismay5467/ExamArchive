/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { Label } from '@radix-ui/react-label';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { TResetFormFields } from '@/types/auth';

export default function Update({
  register,
  errors,
}: {
  register: UseFormRegister<TResetFormFields>;
  errors: FieldErrors<TResetFormFields>;
}) {
  const [eyeOff, setEyeOff] = useState<boolean>(true);
  return (
    <>
      <Label htmlFor="password-input">Enter new password</Label>
      <Input
        id="password-input"
        type={`${eyeOff ? 'password' : 'text'}`}
        className="focus-visible:ring-0"
        {...register('password')}
      />
      {errors && (
        <p className="text-red-500 text-sm">{errors.password?.message}</p>
      )}
      <span
        className="absolute text-xl opacity-60 right-2 top-[42px] cursor-pointer "
        onClick={() => setEyeOff((prev) => !prev)}
      >
        {eyeOff ? <FaEye /> : <FaEyeSlash />}
      </span>
    </>
  );
}
