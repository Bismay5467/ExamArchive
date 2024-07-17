/* eslint-disable react/no-unescaped-entities */
/* eslint-disable indent */
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button, Input, Spinner } from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiLoginCircleLine } from 'react-icons/ri';
import { IoPersonOutline } from 'react-icons/io5';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signInUserInputSchema } from '@/schemas/authSchema';
import { TSignInFormFields } from '@/types/auth';
import { getSignInObj } from '@/utils/axiosReqObjects';
import fetcher from '@/utils/fetcher/fetcher';
import { useAuth } from '@/hooks/useAuth';
import { CLIENT_ROUTES } from '@/constants/routes';
import { useState } from 'react';

export default function Login() {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<TSignInFormFields>({
    resolver: zodResolver(signInUserInputSchema),
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const from = state?.from || CLIENT_ROUTES.HOME;
  const { SET } = useAuth();
  const onSubmit: SubmitHandler<TSignInFormFields> = async (formData) => {
    const reqObj = getSignInObj(formData);
    try {
      await fetcher(reqObj);
    } catch (err: any) {
      toast.error('Somthing went wrong!', {
        description: `${err.response.data.message}`,
        duration: 5000,
      });
      return;
    }
    SET();
    toast.success('Welcome Back! Nice to see you 😇', {
      duration: 5000,
    });
    navigate(from, { replace: true });
  };

  return (
    <form
      className="flex flex-col gap-y-4 px-8 pt-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        isRequired
        label="Email or username"
        radius="sm"
        variant="underlined"
        isInvalid={errors.username !== undefined}
        errorMessage={errors.username?.message}
        onFocus={() => errors.username && clearErrors('username')}
        {...register('username')}
        endContent={<IoPersonOutline className="text-2xl text-slate-500" />}
      />
      <Input
        isRequired
        label="Password"
        radius="sm"
        variant="underlined"
        type={isPasswordVisible ? 'text' : 'password'}
        isInvalid={errors.password !== undefined}
        errorMessage={errors.password?.message}
        onFocus={() => errors.password && clearErrors('password')}
        {...register('password')}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
          >
            {isPasswordVisible ? (
              <FaEye className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
      />
      <button
        type="button"
        className="text-xs w-fit self-end text-slate-600 cursor-pointer hover:underline"
        onClick={() => navigate(CLIENT_ROUTES.AUTH_RESET)}
      >
        Recover Password
      </button>
      <Button
        type="submit"
        fullWidth
        color="primary"
        {...(isSubmitting
          ? {
              startContent: <Spinner color="default" size="sm" />,
            }
          : { endContent: <RiLoginCircleLine className="text-lg" /> })}
        isDisabled={isSubmitting}
        variant="bordered"
        radius="sm"
        className="mt-5 py-5"
      >
        Log in
      </Button>
    </form>
  );
}
