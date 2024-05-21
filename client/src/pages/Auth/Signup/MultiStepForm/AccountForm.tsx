import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignUpFormFields } from '@/types/authTypes';
import { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';

export default function AccountForm({
  register,
}: {
  register: UseFormRegister<SignUpFormFields>;
}) {
  const [eyeOff, setEyeOff] = useState(true);

  return (
    <>
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="email-input">Email</Label>
        <Input
          id="email-input"
          type="email"
          placeholder="jane.doe@domain.com"
          className="focus-visible:ring-0"
          {...register('email')}
        />
        <Label htmlFor="username-input">Username</Label>
        <Input
          id="username-input"
          type="text"
          placeholder="jane doe"
          className="focus-visible:ring-0"
          {...register('username')}
        />
        <Label htmlFor="password-input">Password</Label>
        <Input
          id="password-input"
          type={`${eyeOff ? `password` : `text`}`}
          className="focus-visible:ring-0"
          {...register('password')}
        />
        <MdOutlineEmail className="absolute text-xl opacity-60 right-2 top-[32px]" />
        <span
          className="absolute text-xl opacity-60 right-2 top-[172px] cursor-pointer "
          onClick={() => setEyeOff((prev) => !prev)}
        >
          {eyeOff ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
    </>
  );
}
