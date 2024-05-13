import Logo from '@/assets/Logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { useState } from 'react';

export default function Login() {
  const [eyeOff, setEyeOff] = useState(true);
  return (
    <div className="p-4 h-full lg:grid lg:grid-cols-2 lg:gap-x-4">
      <div className="h-full lg:col-span-1 py-12 ">
        <div className=" max-w-[360px] mx-auto mt-12 min-h-[100px] flex flex-col items-center gap-y-8">
          <div className="flex flex-col items-center gap-y-4">
            <img src={Logo} alt="" className="w-[180px]" />
            <div>
              <h1 className="text-3xl font-semibold text-center">
                Login to your account
              </h1>
              <h3 className="text-sm opacity-60 mt-2 text-center">
                Enter your details to proceed further
              </h3>
            </div>
          </div>
          <form className="w-full relative">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="email-input">Email</Label>
              <Input
                id="email-input"
                type="email"
                placeholder="jane.doe@domain.com"
                className="focus-visible:ring-0"
              />
              <MdOutlineEmail className="absolute text-xl opacity-60 right-2 top-[32px]" />
              <Label htmlFor="password-input">Password</Label>
              <Input
                id="password-input"
                type={`${eyeOff ? `password` : `text`}`}
                className="focus-visible:ring-0"
              />
              <span
                className="absolute text-xl opacity-60 right-2 top-[102px] cursor-pointer "
                onClick={() => setEyeOff((prev) => !prev)}
              >
                {eyeOff ? <FaEye /> : <FaEyeSlash />}
              </span>
              <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-x-1">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="self-center checked:text-red-600"
                  />
                  <Label htmlFor="remember-me" className="self-center">
                    Remember me
                  </Label>
                </div>
                <span className="text-sm opacity-60 self-center">
                  Recover Password
                </span>
              </div>
            </div>
            <Button type="submit" className="w-full mt-8">
              Log in
            </Button>
          </form>
          <div className="flex flex-row gap-x-2">
            <div className="h-0.5 w-24 self-center bg-slate-200"></div>
            <p>Or</p>
            <div className="h-0.5 w-24 self-center bg-slate-200"></div>
          </div>
        </div>
      </div>
      <div className="hidden bg-login-banner bg-no-repeat bg-cover bg-right lg:block lg:col-span-1 lg:rounded-3xl"></div>
    </div>
  );
}
