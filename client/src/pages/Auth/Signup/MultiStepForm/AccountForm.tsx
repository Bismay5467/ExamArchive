import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newUserInputSchema } from '@/constants/authSchema.ts';

export default function AccountForm() {
  const [eyeOff, setEyeOff] = useState(true);
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(newUserInputSchema),
  });
  return (
    <form className="w-full relative">
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
      <Button type="submit" className="w-full mt-8">
        Sign Up
      </Button>
    </form>
  );
}
