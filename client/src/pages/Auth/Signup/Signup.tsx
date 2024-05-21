import Logo from '@/assets/Logo.png';
import useMultiStepForm from './MultiStepForm/useMultiStepForm';
import AccountForm from './MultiStepForm/AccountForm';
import OTPForm from './MultiStepForm/OTPForm';
import { SignUpFormFields } from '@/types/authTypes';
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newUserInputSchema } from '@/constants/authSchema';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormFields>({
    resolver: zodResolver(newUserInputSchema),
  });
  const { next, isFirstStep, step } = useMultiStepForm([
    <AccountForm register={register} />,
    <OTPForm register={register} />,
  ]);

  const onSubmit: SubmitHandler<SignUpFormFields> = async (formData) => {
    const payload: SignUpFormFields = {
      ...formData,
      role: 'USER',
      actionType: 'GENERATE',
    };

    if (isFirstStep()) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(payload, 'OTP Generated!');
      next();
    } else {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(payload, 'OTP Verified!');
      navigate('/auth/login');
    }
  };

  return (
    <div className="p-4 h-full lg:grid lg:grid-cols-2 lg:gap-x-4">
      <div className="hidden bg-signup-banner bg-no-repeat bg-cover bg-right lg:block lg:col-span-1 lg:rounded-3xl"></div>
      <div className="h-full lg:col-span-1 py-12 ">
        <div className=" max-w-[360px] mx-auto mt-12 min-h-[100px] flex flex-col items-center gap-y-8">
          <div className="flex flex-col items-center gap-y-4">
            <img src={Logo} alt="" className="w-[180px]" />
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
              disabled={isSubmitting}
              type="submit"
              className="w-full mt-8"
            >
              {isFirstStep() ? `Next` : `Sign Up!`}
            </Button>
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
