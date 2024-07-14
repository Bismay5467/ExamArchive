import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
} from 'react-hook-form';
import { Input } from '@nextui-org/react';
import { IoPersonOutline } from 'react-icons/io5';
import { CiMail } from 'react-icons/ci';
import { MdOutlineLockPerson } from 'react-icons/md';
import { TSignUpFormFields } from '@/types/auth';

export default function AccountInfo({
  register,
  errors,
  clearErrors,
}: {
  register: UseFormRegister<TSignUpFormFields>;
  errors: FieldErrors<TSignUpFormFields>;
  clearErrors: UseFormClearErrors<TSignUpFormFields>;
}) {
  return (
    <>
      <Input
        isRequired
        label="Username"
        variant="underlined"
        radius="sm"
        type="text"
        isInvalid={errors.username !== undefined}
        errorMessage={errors.username?.message}
        onFocus={() => errors.username && clearErrors('username')}
        {...register('username')}
        endContent={<IoPersonOutline className="text-2xl text-slate-500" />}
      />
      <Input
        isRequired
        variant="underlined"
        radius="sm"
        label="Email"
        type="email"
        isInvalid={errors.email !== undefined}
        errorMessage={errors.email?.message}
        onFocus={() => errors.email && clearErrors('email')}
        {...register('email')}
        endContent={<CiMail className="text-2xl text-slate-500" />}
      />
      <Input
        isRequired
        label="Password"
        variant="underlined"
        radius="sm"
        type="password"
        isInvalid={errors.password !== undefined}
        errorMessage={errors.password?.message}
        onFocus={() => errors.password && clearErrors('password')}
        {...register('password')}
        endContent={<MdOutlineLockPerson className="text-2xl text-slate-500" />}
      />
    </>
  );
}
