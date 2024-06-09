/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { MdOutlineEmail } from 'react-icons/md';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TSignUpFormFields } from '@/types/auth';

export default function AccountForm({
  register,
  errors,
}: {
  register: UseFormRegister<TSignUpFormFields>;
  errors: FieldErrors<TSignUpFormFields>;
}) {
  const [eyeOff, setEyeOff] = useState(true);

  return (
    <div className="flex flex-col gap-y-2">
      <Label htmlFor="email-input">Email</Label>
      <Input
        id="email-input"
        type="email"
        placeholder="jane.doe@domain.com"
        className="focus-visible:ring-0"
        {...register('email')}
      />
      {errors && (
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      )}
      <Label htmlFor="username-input">Username</Label>
      <Input
        id="username-input"
        type="text"
        placeholder="jane doe"
        className="focus-visible:ring-0"
        {...register('username')}
      />
      {errors && (
        <p className="text-red-500 text-sm">{errors.username?.message}</p>
      )}
      <Label htmlFor="password-input">Password</Label>
      <Input
        id="password-input"
        type={`${eyeOff ? 'password' : 'text'}`}
        className="focus-visible:ring-0"
        {...register('password')}
      />
      {errors && (
        <p className="text-red-500 text-sm">{errors.password?.message}</p>
      )}
      <MdOutlineEmail className="absolute text-xl opacity-60 right-2 top-[32px]" />
      <span
        className="absolute text-xl opacity-60 right-2 top-[187px] cursor-pointer "
        onClick={() => setEyeOff((prev) => !prev)}
      >
        {eyeOff ? <FaEye /> : <FaEyeSlash />}
      </span>
    </div>
  );
}
