import LogoBanner from '@/assets/LogoBanner.png';
import useMultiStepForm from '@/hooks/useMultiStepForm';
import AccountForm from './SignUpFormElements/AccountForm';
import OTPForm from './SignUpFormElements/OTPForm';
import { TSignUpFormFields } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import { SUCCESS_CODES } from '@/constants/statusCodes';
import { getSignUpObj } from '@/utils/axiosReqObjects';
import { CLIENT_ROUTES } from '@/constants/routes';
// import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import useSWR from 'swr';
import { newUserInputSchema } from '@/schemas/authSchema';

export default function Signup() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<TSignUpFormFields>();
  // const { SET } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TSignUpFormFields>({
    resolver: zodResolver(newUserInputSchema),
  });
  const { next, isFirstStep, step } = useMultiStepForm([
    <AccountForm register={register} errors={errors} />,
    <OTPForm register={register} errors={errors} />,
  ]);

  const {
    data: user,
    error,
    isValidating,
  } = useSWR(userData ? getSignUpObj(userData) : null);

  useEffect(() => {
    if (user) {
      if (user.status === SUCCESS_CODES.OK) {
        toast(`${user?.data?.message}`, {
          description: 'Check your mail!',
          duration: 5000,
        });
        next();
      } else if (user.status === SUCCESS_CODES.CREATED) {
        // TODO: Auth-token cookie not getting set, hence redirencting to /login as of now!
        // SET();
        toast(`${user?.data?.message}`, {
          description: 'Ready to Rock!',
          duration: 5000,
        });
        console.log(user);
        navigate(CLIENT_ROUTES.AUTH_LOGIN);
      }
    } else if (error) {
      toast.error(`${error?.message}`, {
        description: error?.response?.data?.message,
        duration: 5000,
      });
    }
  }, [user, error]);

  const onSubmit: SubmitHandler<TSignUpFormFields> = async (formData) => {
    if (isFirstStep()) {
      setUserData({ ...formData, role: 'USER', actionType: 'GENERATE' });
    } else {
      setUserData({ ...formData, role: 'USER', actionType: 'VERIFY' });
    }
  };

  return (
    <div className="p-4 h-screen lg:grid lg:grid-cols-2 lg:gap-x-4">
      <div className="hidden bg-signup-banner bg-no-repeat bg-cover bg-right lg:block lg:col-span-1 lg:rounded-3xl"></div>
      <div className="h-full lg:col-span-1 py-12 ">
        <div className=" max-w-[360px] mx-auto mt-12 min-h-[100px] flex flex-col items-center gap-y-8">
          <div className="flex flex-col items-center gap-y-4">
            <Link to={CLIENT_ROUTES.HOME}>
              <img src={LogoBanner} alt="" className="w-[180px]" />
            </Link>
            <div>
              <h1 className="text-3xl font-semibold text-center">
                Create your account
              </h1>
              <h3 className="text-sm opacity-60 mt-2 text-center">
                {isFirstStep()
                  ? `Enter your details to proceed further`
                  : `Enter your OTP`}
              </h3>
            </div>
          </div>
          <form className="w-full relative" onSubmit={handleSubmit(onSubmit)}>
            {step}
            <Button
              disabled={isSubmitting || isValidating}
              type="submit"
              className="w-full mt-8"
            >
              {isFirstStep() ? `Next` : `Sign Up!`}
              {(isSubmitting || isValidating) && (
                <Spinner className={`w-4 h-4 ml-3 `} />
              )}
            </Button>
            <p className="text-sm text-center opacity-60 self-center mt-2">
              Already have an account?{' '}
              <Link
                to={CLIENT_ROUTES.AUTH_LOGIN}
                className="font-semibold hover:underline"
              >
                Log In!
              </Link>
            </p>
          </form>
          <div className="flex flex-row gap-x-2">
            <div className="h-0.5 w-24 self-center bg-slate-200"></div>
            <p>Or</p>
            <div className="h-0.5 w-24 self-center bg-slate-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
