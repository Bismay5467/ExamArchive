import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
} from 'react-hook-form';
import { Input } from '@nextui-org/react';
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
        label="Name"
        variant="bordered"
        radius="sm"
        type="text"
        isInvalid={errors.username !== undefined}
        errorMessage={errors.username?.message}
        onFocus={() => errors.username && clearErrors('username')}
        {...register('username')}
      />
      <Input
        isRequired
        variant="bordered"
        radius="sm"
        label="Email"
        type="email"
        isInvalid={errors.email !== undefined}
        errorMessage={errors.email?.message}
        onFocus={() => errors.email && clearErrors('email')}
        {...register('email')}
      />
      <Input
        isRequired
        label="Password"
        variant="bordered"
        radius="sm"
        type="password"
        isInvalid={errors.password !== undefined}
        errorMessage={errors.password?.message}
        onFocus={() => errors.password && clearErrors('password')}
        {...register('password')}
      />
    </>
  );
}
