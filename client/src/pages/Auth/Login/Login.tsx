/* eslint-disable react/jsx-props-no-spreading */
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineEmail } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LogoBanner from '@/assets/LogoBanner.png';
import { TSignInFormFields } from '@/types/auth';
import Spinner from '@/components/ui/spinner';
import { CLIENT_ROUTES } from '@/constants/routes';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getSignInObj } from '@/utils/axiosReqObjects';
import { SUCCESS_CODES } from '@/constants/statusCodes';
import useSWR from 'swr';
import { signInUserInputSchema } from '@/schemas/authSchema';

export default function Login() {
  const [eyeOff, setEyeOff] = useState<boolean>(true);
  const [userData, setUserData] = useState<TSignInFormFields>();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || CLIENT_ROUTES.HOME;
  const { SET } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TSignInFormFields>({
    resolver: zodResolver(signInUserInputSchema),
  });
  const {
    data: user,
    error,
    isValidating,
  } = useSWR(userData ? getSignInObj(userData) : null);

  useEffect(() => {
    if (user && user.status === SUCCESS_CODES.OK) {
      toast('Login Success', {
        description: user?.data?.message,
      });
      SET();
      navigate(from, { replace: true });
    } else if (error) {
      toast.error(`${error?.message}`, {
        description: error?.response?.data?.message,
        duration: 5000,
      });
    }

    return () => {
      setUserData(undefined);
    };
  }, [user, error]);

  const onSubmit: SubmitHandler<TSignInFormFields> = async (formData) => {
    setUserData(formData);
  };

  return (
    <div className="p-4 h-screen lg:grid lg:grid-cols-2 lg:gap-x-4">
      <div className="h-full lg:col-span-1 py-12 ">
        <div className=" max-w-[360px] mx-auto mt-12 min-h-[100px] flex flex-col items-center gap-y-8">
          <div className="flex flex-col items-center gap-y-4">
            <Link to={CLIENT_ROUTES.HOME}>
              <img src={LogoBanner} alt="" className="w-[180px]" />
            </Link>
            <div>
              <h1 className="text-3xl font-semibold text-center">
                Login to your account
              </h1>
              <h3 className="text-sm opacity-60 mt-2 text-center">
                Enter your details to proceed further
              </h3>
            </div>
          </div>
          <form className="w-full relative" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="username-input">Email</Label>
              <Input
                id="username-input"
                type="text"
                placeholder="Username/Email"
                className="focus-visible:ring-0"
                {...register('username')}
              />
              <MdOutlineEmail className="absolute text-xl opacity-60 right-2 top-[32px]" />
              <Label htmlFor="password-input">Password</Label>
              <Input
                id="password-input"
                type={`${eyeOff ? 'password' : 'text'}`}
                className="focus-visible:ring-0"
                {...register('password')}
              />
              {errors && (
                <p className="text-red-500 text-sm">
                  {errors.password?.message}
                </p>
              )}
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
                <Link to={CLIENT_ROUTES.AUTH_RESET}>
                  <span className="text-sm opacity-60 self-center hover:underline">
                    Recover Password
                  </span>
                </Link>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-8"
              disabled={isSubmitting || isValidating}
            >
              Log in{' '}
              {(isSubmitting || isValidating) && (
                <Spinner className="w-4 h-4 ml-3 " />
              )}
            </Button>
            <p className="text-sm text-center opacity-60 self-center mt-2">
              Don't have an account?{' '}
              <Link
                to={CLIENT_ROUTES.AUTH_SIGNUP}
                className="font-semibold hover:underline"
              >
                Sign Up!
              </Link>
            </p>
          </form>
          <div className="flex flex-row gap-x-2">
            <div className="h-0.5 w-24 self-center bg-slate-200" />
            <p>Or</p>
            <div className="h-0.5 w-24 self-center bg-slate-200" />
          </div>
        </div>
      </div>
      <div className="hidden bg-login-banner bg-no-repeat bg-cover bg-right lg:block lg:col-span-1 lg:rounded-3xl" />
    </div>
  );
}
